"""Stage a project-local Archipelago runtime and development APWorld."""

from __future__ import annotations

import argparse
import json
import shutil
import zipfile
from pathlib import Path


PROJECT_DIR = Path(__file__).resolve().parents[1]
WORLD_SOURCE = PROJECT_DIR / "apworld" / "lookoutside"


def within_project(path: Path) -> bool:
    return PROJECT_DIR in path.resolve().parents


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ap-dir", type=Path, required=True,
                        help="Read-only installed Archipelago directory")
    parser.add_argument("--out-dir", type=Path,
                        default=PROJECT_DIR / ".local" / "archipelago-smoke")
    parser.add_argument("--refresh-world", action="store_true",
                        help="Replace only the staged development APWorld")
    args = parser.parse_args()
    ap_dir = args.ap_dir.resolve(strict=True)
    out_dir = args.out_dir.resolve()
    if not (ap_dir / "ArchipelagoGenerate.exe").is_file():
        parser.error("--ap-dir must contain ArchipelagoGenerate.exe")
    if not within_project(out_dir):
        parser.error("--out-dir must be inside the project folder")
    if args.refresh_world:
        if not (out_dir / "ArchipelagoGenerate.exe").is_file():
            parser.error("--refresh-world requires an existing staged runtime")
    else:
        if out_dir.exists():
            parser.error("--out-dir already exists; use --refresh-world")

        def ignore(directory: str, names: list[str]) -> set[str]:
            if Path(directory).resolve() == ap_dir:
                return set(names).intersection(
                    {"custom_worlds", "logs", "output", "Players",
                     "_persistent_storage.yaml", "host.yaml"})
            return set()

        shutil.copytree(ap_dir, out_dir, ignore=ignore)
        (out_dir / "custom_worlds").mkdir()
        (out_dir / "Players").mkdir()
        (out_dir / "output").mkdir()

    world_target = out_dir / "custom_worlds" / "lookoutside"
    if not within_project(world_target):
        parser.error("staged APWorld path escaped the project folder")
    if world_target.exists():
        shutil.rmtree(world_target)
    archive = out_dir / "custom_worlds" / "lookoutside.apworld"
    if not within_project(archive):
        parser.error("staged APWorld archive path escaped the project folder")
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as target:
        for path in sorted(WORLD_SOURCE.rglob("*")):
            if path.is_file() and "__pycache__" not in path.parts and path.suffix != ".pyc":
                archive_name = Path("lookoutside") / path.relative_to(WORLD_SOURCE)
                if path.name == "archipelago.json":
                    manifest = json.loads(path.read_text(encoding="utf-8"))
                    manifest.update(version=7, compatible_version=7)
                    target.writestr(str(archive_name).replace("\\", "/"),
                                    json.dumps(manifest, indent=2))
                else:
                    target.write(path, archive_name)
    print(f"Staged Archipelago and Look Outside test APWorld at {out_dir}")


if __name__ == "__main__":
    main()
