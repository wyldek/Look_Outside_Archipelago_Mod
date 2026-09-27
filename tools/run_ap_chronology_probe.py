"""Test real AP event sweeping using a temporary staged archive, then restore it."""

import argparse
import io
from pathlib import Path
import subprocess
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--runtime", type=Path, default=ROOT / ".local/archipelago-smoke")
    args = parser.parse_args()
    runtime = args.runtime.resolve(strict=True)
    if not runtime.is_relative_to(ROOT / ".local"):
        parser.error("Only a project-local .local runtime may be instrumented")
    archive = runtime / "custom_worlds/lookoutside.apworld"
    original = archive.read_bytes()
    output = io.BytesIO()
    with ZipFile(io.BytesIO(original)) as source, ZipFile(output, "w", ZIP_DEFLATED) as target:
        for name in source.namelist():
            content = source.read(name)
            if name == "lookoutside/__init__.py":
                hook = b"    def create_items(self) -> None:\n"
                content = content.replace(b"\r\n", b"\n")
                assert content.count(hook) == 1
                content = content.replace(hook, hook + b"        from ._chronology_probe import run\n        run(self)\n")
            target.writestr(name, content)
        target.writestr("lookoutside/_chronology_probe.py", (ROOT / "tests/ap_chronology_probe.py").read_bytes())
    try:
        archive.write_bytes(output.getvalue())
        result = subprocess.run([str(runtime / "ArchipelagoGenerate.exe"), "--seed", "176", "--multi", "1",
                                 "--player_files_path", str(ROOT / "tests/fixtures"),
                                 "--outputpath", str(ROOT / ".local/ap-output"), "--skip_output"],
                                cwd=runtime, input="\n", capture_output=True, text=True, timeout=60)
        log = result.stdout + result.stderr
        (ROOT / ".local/chronology-ap-probe.log").write_text(log, encoding="utf-8")
        if result.returncode or "CHRONOLOGY_AP_PROBE " not in log:
            raise RuntimeError(log[-8000:])
        print(next(line for line in log.splitlines() if line.startswith("CHRONOLOGY_AP_PROBE ")))
    finally:
        archive.write_bytes(original)
        assert archive.read_bytes() == original


if __name__ == "__main__":
    main()
