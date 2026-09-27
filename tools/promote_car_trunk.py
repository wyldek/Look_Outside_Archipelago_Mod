"""Register the missed fixed trunk reward; keep its ammunition vanilla."""

import argparse
import json
from pathlib import Path

from car_trunk_scope import car_trunk_location, validate_car_trunk
from validate_registry import REGISTRY, read_json, require


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    data = parser.parse_args().game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    location = car_trunk_location()
    validate_car_trunk(location, location, read_json(data / "CommonEvents.json"), data, read_json, require)
    if not any(row["key"] == location["key"] for row in registry["locations"]):
        require(not any(row["ap_id"] == 540200140 for row in registry["items"]), "Shotgun already registered")
        registry["locations"].append(location)
        registry["items"].append({"name": "Shotgun", "ap_id": 540200140, "kind": "armor",
                                  "database_id": 140, "quantity": 1, "classification": "useful"})
        registry["registry_version"] += 1
        registry["locations"].sort(key=lambda row: row["ap_id"])
        registry["items"].sort(key=lambda row: row["ap_id"])
        REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Car trunk registered: {len(registry['locations'])} checks, registry {registry['registry_version']}")


if __name__ == "__main__":
    main()
