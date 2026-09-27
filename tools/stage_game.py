"""Build a project-local Look Outside test copy without changing Steam files."""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path


PLUGIN_NAME = "LookOutsideArchipelago"
PROJECT_DIR = Path(__file__).resolve().parents[1]


def plugin_entries(path: Path):
    source = path.read_text(encoding="utf-8-sig")
    start = source.index("[")
    end = source.rindex("]")
    return json.loads(source[start : end + 1])


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    parser.add_argument(
        "--out-dir", type=Path, default=PROJECT_DIR / ".local" / "game-smoke"
    )
    parser.add_argument(
        "--refresh-plugin",
        action="store_true",
        help="Update only the plugin in an existing project-local test copy",
    )
    args = parser.parse_args()
    game_dir = args.game_dir.resolve(strict=True)
    out_dir = args.out_dir.resolve()
    if not (game_dir / "Game.exe").is_file():
        parser.error("--game-dir must contain Game.exe")
    if PROJECT_DIR not in out_dir.parents:
        parser.error("--out-dir must be inside the project folder")
    if out_dir.exists() and not args.refresh_plugin:
        parser.error("--out-dir already exists; use --refresh-plugin or a fresh staging path")
    if not out_dir.exists() and args.refresh_plugin:
        parser.error("--refresh-plugin requires an existing staged game")
    plugins = plugin_entries(game_dir / "js" / "plugins.js")
    if any(entry.get("name") == PLUGIN_NAME for entry in plugins):
        parser.error(f"{PLUGIN_NAME} is already registered in the source installation")

    def ignore(directory: str, names: list[str]) -> set[str]:
        relative = Path(directory).resolve().relative_to(game_dir)
        if relative == Path("."):
            return {name for name in names if name == "save" or name.endswith(".log")}
        return set()

    if not args.refresh_plugin:
        shutil.copytree(game_dir, out_dir, ignore=ignore)
    elif not (out_dir / "Game.exe").is_file() or not any(
        entry.get("name") == PLUGIN_NAME
        for entry in plugin_entries(out_dir / "js" / "plugins.js")
    ):
        parser.error("existing output is not a staged Archipelago test game")

    plugin_dir = out_dir / "js" / "plugins"
    plugin_source = (PROJECT_DIR / "game_plugin" / f"{PLUGIN_NAME}.js").read_text(encoding="utf-8")
    boot_marker = PROJECT_DIR / ".local" / "plugin-boot.txt"
    instrumented = (
        plugin_source
        + "\n// Test-copy runtime probe; never included in the distributable plugin.\n"
        + "globalThis.setAchievement = () => {}; globalThis.setGamestat = () => {};\n"
        + f"require('fs').writeFileSync({json.dumps(str(boot_marker))}, "
        + "JSON.stringify({booted: true, webSocket: typeof WebSocket, "
        + "sceneMap: typeof Scene_Map, menu: typeof Scene_Menu, "
        + "prompt: typeof prompt, nwVersion: process.versions.nw || null}) + '\\n');\n"
    )
    (plugin_dir / f"{PLUGIN_NAME}.js").write_text(instrumented, encoding="utf-8")
    if args.refresh_plugin:
        print(f"Refreshed plugin in {out_dir}")
        return

    registry_path = out_dir / "js" / "plugins.js"
    plugins.append(
        {
            "name": PLUGIN_NAME,
            "status": True,
            "description": "Archipelago integration bootstrap",
            "parameters": {},
        }
    )
    registry_path.write_text(
        "// Generated test registry; source installation remains untouched.\n"
        "var $plugins =\n"
        + json.dumps(plugins, ensure_ascii=False, indent=4)
        + ";\n",
        encoding="utf-8",
    )
    print(f"Staged test game at {out_dir}")
    print(f"Registered plugin: {PLUGIN_NAME}")


if __name__ == "__main__":
    main()
