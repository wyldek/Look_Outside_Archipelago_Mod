"""Register two audited fixed troop rewards; keep purchases and training local."""

import argparse
import json
from pathlib import Path

from first_gift_scope import first_gift_locations, validate_first_gift
from validate_registry import REGISTRY, read_json, require


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    data = parser.parse_args().game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["versionId"] == registry["audited_version_id"] and
            system["advanced"]["gameId"] == registry["audited_game_id"], "Game build changed")
    troops = read_json(data / "Troops.json")
    weapons = read_json(data / "Weapons.json")
    changed = False
    for location in first_gift_locations():
        validate_first_gift(location, location, troops, data, read_json, require)
        if any(r["key"] == location["key"] for r in registry["locations"]):
            continue
        item_id = location["reward_database_id"]
        require(not any(r["ap_id"] == 540100000 + item_id for r in registry["items"]), "Duplicate weapon")
        registry["locations"].append(location)
        registry["items"].append({"name": weapons[item_id]["name"], "ap_id": 540100000 + item_id,
                                 "kind": "weapon", "database_id": item_id, "quantity": 1,
                                 "classification": "useful"})
        changed = True
    if changed:
        registry["registry_version"] += 1
        registry["locations"].sort(key=lambda r: r["ap_id"])
        registry["items"].sort(key=lambda r: r["ap_id"])
        REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"First gifts registered: {len(registry['locations'])} checks, registry {registry['registry_version']}")


if __name__ == "__main__":
    main()
