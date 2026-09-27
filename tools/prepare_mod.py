"""Prepare replacement mod files beside an extracted package; never edit the game."""

import argparse
import hashlib
import json
from pathlib import Path


PLUGIN = "LookOutsideArchipelago"


def prepare(package: Path, game: Path, output: Path | None = None) -> Path:
    package = package.resolve(strict=True)
    game = game.resolve(strict=True)
    output = (output or package / "prepared").resolve()
    if package not in output.parents:
        raise ValueError("Output must be a new directory inside the extracted package")
    if output == game or game in output.parents or output in game.parents:
        raise ValueError("Output must not overlap the source game directory")
    if output.exists():
        raise ValueError("Output already exists; choose a new directory inside the package")
    manifest = json.loads((package / "manifest.json").read_text(encoding="utf-8"))
    # Verify every distributed component before preparing files.
    for name, expected in manifest["sha256"].items():
        source = (package / name).resolve(strict=True)
        if package not in source.parents:
            raise ValueError("Package manifest contains a path outside the package")
        if hashlib.sha256(source.read_bytes()).hexdigest() != expected:
            raise ValueError(f"Package checksum mismatch: {name}")
    system = json.loads((game / "data" / "System.json").read_text(encoding="utf-8-sig"))
    if (system.get("versionId") != manifest["audited_version_id"] or
            system.get("advanced", {}).get("gameId") != manifest["audited_game_id"]):
        raise ValueError("Game build differs from the audited package; no files were prepared")
    text = (game / "js" / "plugins.js").read_text(encoding="utf-8-sig")
    entries = json.loads(text[text.index("["):text.rindex("]") + 1])
    if not isinstance(entries, list) or not all(isinstance(entry, dict) and "name" in entry for entry in entries):
        raise ValueError("Game plugin list has an unsupported format")
    if any(entry["name"] == PLUGIN for entry in entries):
        raise ValueError("Source already contains this mod; prepare from your original plugin-list backup")
    entries.append({"name": PLUGIN, "status": True,
                    "description": "Look Outside Archipelago integration", "parameters": {}})
    replacement = ("// Prepared Look Outside Archipelago plugin list.\nvar $plugins =\n" +
                   json.dumps(entries, ensure_ascii=False, indent=4) + ";\n").encode("utf-8")
    plugin = (package / "LookOutsideArchipelago.js").read_bytes()
    (output / "js" / "plugins").mkdir(parents=True)
    (output / "js" / "plugins.js").write_bytes(replacement)
    (output / "js" / "plugins" / f"{PLUGIN}.js").write_bytes(plugin)
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", required=True, type=Path, help="Read-only source game directory")
    parser.add_argument("--out-dir", type=Path, help="New directory inside this extracted package (default: prepared)")
    args = parser.parse_args()
    try:
        output = prepare(Path(__file__).resolve().parent, args.game_dir, args.out_dir)
    except (ValueError, OSError, KeyError) as error:
        parser.exit(1, f"Preparation failed: {error}\n")
    print(f"Prepared replacement files: {output}")
    print("The source game was only read. Follow README.md to install into a separate test copy.")


if __name__ == "__main__":
    main()
