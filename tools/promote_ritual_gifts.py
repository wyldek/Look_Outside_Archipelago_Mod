"""Register the confirmed ritual-preparation gifts without changing the ending path."""

import argparse
import json
from pathlib import Path

from validate_registry import REGISTRY, read_json, require, validate_troop_reward


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    args = parser.parse_args()
    data = args.game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    troops = read_json(data / "Troops.json")
    commands = troops[124]["pages"][0]["list"]
    added = 0
    for ordinal, (key, kind, dbid, grant) in enumerate((
            ("ritual_roof_key", "item", 314, 597), ("ritual_dark_robes", "armor", 23, 598))):
        if any(r["key"] == key for r in registry["locations"]):
            continue
        item = read_json(data / ("Items.json" if kind == "item" else "Armors.json"))[dbid]
        location = {"key": key, "name": "Ritual Preparations - " + item["name"],
                    "ap_id": 592000020 + ordinal, "map_id": 65, "event_id": 9,
                    "troop_id": 124, "page": 0, "command_index": grant,
                    "command_code": 126 if kind == "item" else 128,
                    "reward_kind": kind, "reward_database_id": dbid, "reviewed_item_pickup": True,
                    "message_index": 594, "message_text": commands[594]["parameters"][0],
                    "ap_message": "2 Archipelago locations checked.",
                    "troop_consumption": {"type": "map_switch", "write_index": 595,
                        "switch_id": 206, "consumed_page": 2, "branch_index": 589,
                        "commands": [{"command_index": i, "command_code": code, "parameters": params}
                            for i, code, params in [(588, 102, [["I am ready.", "Hold on..."], 1, 0, 2, 0]),
                                                    (599, 119, ["leave"]), (665, 340, [])]]}}
        validate_troop_reward(location, location, troops, data)
        registry["locations"].append(location)
        existing = next((r for r in registry["items"] if r["kind"] == kind and r["database_id"] == dbid), None)
        if existing:
            existing["quantity"] += 1
        else:
            registry["items"].append({"name": item["name"], "ap_id": (540000000 if kind == "item" else 540200000) + dbid,
                "kind": kind, "database_id": dbid, "quantity": 1,
                "classification": "progression" if kind == "item" else "useful"})
        added += 1
    if added:
        registry["registry_version"] += 1
        registry["locations"].sort(key=lambda r: r["ap_id"])
        registry["items"].sort(key=lambda r: r["ap_id"])
        REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added {added} ritual gifts; {len(registry['locations'])} active checks")


if __name__ == "__main__":
    main()
