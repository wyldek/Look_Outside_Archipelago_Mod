# Development packages

Download [LookOutsideAP-0.0.2-dev74.zip](LookOutsideAP-0.0.2-dev74.zip), extract it
into a writable folder, and follow the included `README.md`.

This is a **development playtest build**, for Normal difficulty and audited game
build `74642914`. It includes chronological generation logic and registry 74.
A complete randomized Normal playthrough remains a release requirement.

## Included files

| File | Purpose |
| --- | --- |
| `lookoutside.apworld` | Built Archipelago world, ready for `custom_worlds`. |
| `LookOutsideArchipelago.js` | Game integration plugin. |
| `prepare_mod.py` | Validates the package/game and builds replacement game files inside the extracted folder. |
| `LookOutside.yaml` | Sample player configuration for seed generation. |
| `README.md` and `docs/` | Installation, playtest, compatibility, and progression documentation. |
| `manifest.json` | Version/build metadata and component checksums. |
| `LICENSE` | Mod license. |

The ZIP contains all mod-specific installation files. You still need your own
Look Outside, Archipelago, and Python 3.10 or newer. Game assets, saves, local
profiles, and test instrumentation are not distributed. The preparation script
reads the original installation; copy its prepared files into a separate test
game as described in the packaged guide.

## Rebuilding

From the repository root:

```powershell
$gameSource = Read-Host 'Path to your Look Outside installation'
python -B tools/build_package.py --game-dir "$gameSource"
```

The builder writes the ZIP into this tracked `releases/` folder. Include the
updated archive when publishing source changes, and update the download links
when its version or registry changes. The manifest checksums distinguish builds
that share a filename. Keep matching older packages to finish existing seeds.
