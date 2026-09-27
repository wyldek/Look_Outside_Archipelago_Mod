"""Register Pierre's missable mail visit and Tickle's final donation gift."""

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
    items = read_json(data / "Items.json")
    definitions = [
        ("pierre_old_mail", "Pierre - Old Mail Visit", 592000060, 80, 3, 9, 74, 76, 285),
        ("tickle_drawing", "Tickle - Friendship Drawing", 592000061, 415, 189, 18, 424, 428, 367),
    ]
    added = 0
    for key, name, ap_id, tid, mid, eid, grant, notice, dbid in definitions:
        if any(row["key"] == key for row in registry["locations"]):
            continue
        commands = troops[tid]["pages"][0]["list"]
        row = {"key": key, "name": name, "ap_id": ap_id, "map_id": mid, "event_id": eid,
               "troop_id": tid, "page": 0, "command_index": grant, "command_code": 126,
               "reward_kind": "item", "reward_database_id": dbid, "late_npc_gift": True,
               "message_index": notice, "message_text": commands[notice]["parameters"][0]}
        if tid == 80:
            row.update(required_variables=[{"id": 617, "value": 7}],
                       troop_consumption={"type": "visitor"}, missable=True,
                       exclusion_reason="A unique pre-06:00 visitor; refusal or leaving can end the visit.")
        else:
            row["required_variables"] = [{"id": 524, "value": 6}]
            row["troop_consumption"] = {"guard_index": 383, "variable_id": 524, "required_value": 6,
                "intercept_value": 6, "consumed_value": 7, "consumed_writes": [429], "commands": [
                    {"command_index": 384, "command_code": 111, "parameters": [1, 837, 0, 80, 1]}]}
        validate_troop_reward(row, row, troops, data)
        registry["locations"].append(row)
        registry["items"].append({"name": items[dbid]["name"], "ap_id": 540000000 + dbid,
            "kind": "item", "database_id": dbid, "quantity": 1, "classification": "filler"})
        added += 1
    if added:
        registry["registry_version"] += 1
        REGISTRY.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Added {added} NPC gifts; {len(registry['locations'])} locations")


if __name__ == "__main__":
    main()
