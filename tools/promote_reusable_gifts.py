"""Add the two approved reusable gifts without randomizing their recharge forms."""

import argparse
import json
from pathlib import Path

from reusable_gift_scope import reusable_locations, bright_frederic_family, validate_reusable_gifts
from validate_registry import REGISTRY, read_json, require


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    data = parser.parse_args().game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    before = json.dumps(registry)
    for location in reusable_locations():
        if not any(row["key"] == location["key"] for row in registry["locations"]):
            registry["locations"].append(location)
            item_id = location["reward_database_id"]
            require(not any(row["ap_id"] == 540000000 + item_id for row in registry["items"]),
                    "Reusable item already has an AP definition")
            registry["items"].append({"name": read_json(data / "Items.json")[item_id]["name"],
                "ap_id": 540000000 + item_id, "kind": "item", "database_id": item_id,
                "quantity": 1, "classification": "useful",
                **({"delivery_switches": [394]} if item_id == 156 else {})})
    family = bright_frederic_family()
    if not any(row["key"] == family["key"] for row in registry["quest_families"]):
        registry["quest_families"].append(family)
    validate_reusable_gifts(registry, data, read_json, require)
    if json.dumps(registry) != before:
        registry["registry_version"] += 1
        registry["locations"].sort(key=lambda row: row["ap_id"])
        registry["items"].sort(key=lambda row: row["ap_id"])
        REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Reusable gifts registered: {len(registry['locations'])} checks, registry {registry['registry_version']}")


if __name__ == "__main__":
    main()
