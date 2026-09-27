"""Build a distributable ZIP in releases, without game assets or test instrumentation."""

import argparse
import hashlib
import io
import json
from pathlib import Path
import subprocess
import sys
from zipfile import ZipFile, ZIP_DEFLATED

from audit_access import load_access


PROJECT = Path(__file__).resolve().parents[1]
WORLD = PROJECT / "apworld" / "lookoutside"


def zip_bytes(files):
    output = io.BytesIO()
    with ZipFile(output, "w", ZIP_DEFLATED) as archive:
        for name, data in sorted(files.items()):
            from zipfile import ZipInfo
            info = ZipInfo(name, date_time=(2020, 1, 1, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            archive.writestr(info, data)
    return output.getvalue()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", required=True, type=Path, help="Read-only game used for signature validation")
    args = parser.parse_args()
    for command in [["tools/validate_registry.py", "--game-dir", str(args.game_dir)],
                    ["tools/audit_chronology.py", "--game-dir", str(args.game_dir)],
                    ["tools/sync_plugin_registry.py", "--check"],
                    ["tools/sync_setup_guide.py", "--check"]]:
        subprocess.run([sys.executable, "-B", *command], cwd=PROJECT, check=True)
    registry = json.loads((WORLD / "vertical_slice.json").read_text(encoding="utf-8"))
    graph = load_access()
    graph.validate(registry)
    world_files = {"lookoutside/" + path.relative_to(WORLD).as_posix(): path.read_bytes()
                   for path in WORLD.rglob("*") if path.is_file() and
                   "__pycache__" not in path.parts and path.suffix in (".py", ".json", ".md")}
    plugin = (PROJECT / "game_plugin" / "LookOutsideArchipelago.js").read_bytes()
    if b"Test-copy runtime probe" in plugin or b"globalThis.setAchievement = () => {}" in plugin:
        raise ValueError("Test instrumentation entered the distributable plugin")
    files = {"lookoutside.apworld": zip_bytes(world_files), "LookOutsideArchipelago.js": plugin,
             "prepare_mod.py": (PROJECT / "tools" / "prepare_mod.py").read_bytes(),
             "README.md": (PROJECT / "docs" / "package_setup.md").read_bytes(),
             "LICENSE": (PROJECT / "LICENSE").read_bytes(),
             "LookOutside.yaml": (PROJECT / "tests" / "fixtures" / "lookoutside.yaml").read_bytes()}
    for name in ("access_logic.md", "calendar_deadlines.md", "quest_resolution_policy.md",
                 "ending_release.md", "playtest.md", "current_status.md", "late_reward_audit.md",
                 "save_compatibility.md"):
        files["docs/" + name] = (PROJECT / "docs" / name).read_bytes()
    world_manifest = json.loads((WORLD / "archipelago.json").read_text(encoding="utf-8"))
    version = f"{world_manifest['world_version']}-dev{registry['registry_version']}"
    manifest = {"package_version": version, "development": True,
                "world_version": world_manifest["world_version"],
                "registry_version": registry["registry_version"],
                "audited_game_id": registry["audited_game_id"],
                "audited_version_id": registry["audited_version_id"],
                "checks": len(registry["locations"]), "regions": len(graph.regions),
                "quest_families": len(registry["quest_families"]),
                "sha256": {name: hashlib.sha256(data).hexdigest() for name, data in files.items()}}
    files["manifest.json"] = (json.dumps(manifest, indent=2) + "\n").encode()
    target = PROJECT / "releases" / f"LookOutsideAP-{version}.zip"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(zip_bytes(files))
    print(json.dumps({"package": str(target), "bytes": target.stat().st_size,
                      "sha256": hashlib.sha256(target.read_bytes()).hexdigest()}))


if __name__ == "__main__":
    main()
