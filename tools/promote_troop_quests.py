"""Register peaceful dialogue rewards and reconcile their valid terminal choices."""

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
    definitions = [
        ("shadow_tongue", "Masked Shadow - Tongue Gift", 18, 6, 40, 458, 460, "item", 350, "shadow_gift"),
        ("benjamin_game", "Benjamin - Kill to Shoot", 27, 33, 2, 610, 613, "item", 420, "benjamin_playtime"),
        ("benjamin_pendant", "Benjamin - Teeth Pendant", 27, 33, 2, 620, 622, "armor", 103, "benjamin_playtime"),
    ]
    added = 0
    for ordinal, (key, name, troop, mid, eid, grant, notice, kind, dbid, family) in enumerate(definitions):
        if any(r["key"] == key for r in registry["locations"]):
            continue
        commands = troops[troop]["pages"][0]["list"]
        location = {"key": key, "name": name, "ap_id": 592000030 + ordinal,
                    "map_id": mid, "event_id": eid, "troop_id": troop, "page": 0,
                    "command_index": grant, "command_code": 126 if kind == "item" else 128,
                    "message_index": notice, "message_text": commands[notice]["parameters"][0],
                    "reward_kind": kind, "reward_database_id": dbid, "quest_family": family}
        if troop == 18:
            location["required_variables"] = [{"id": 150, "value": 5}]
            location["troop_consumption"] = {"guard_index": 426, "variable_id": 150, "required_value": 4,
                "consumed_value": 5, "consumed_writes": [427], "commands": [
                    {"command_index": 452, "command_code": 102, "parameters": [["Take it.", "Refuse it."], 1, 0, 2, 0]}]}
        else:
            location["required_variables"] = [{"id": 110, "value": 4}]
            location["troop_consumption"] = {"type": "dialogue_completion", "variable_id": 110,
                "required_value": 4, "consumed_value": 5, "consumed_writes": [635],
                "reward_guard_index": 604 if kind == "item" else 616,
                "reward_guard_parameters": [1, 111, 0, 5 if kind == "item" else 3, 1],
                "replay_guard_index": 40, "replay_label": "doneplaying", "replay_label_index": 648,
                "replay_end_index": 664, "commands": [
                    {"command_index": 392, "command_code": 122, "parameters": [110, 110, 0, 0, 4]},
                    {"command_index": 647, "command_code": 119, "parameters": ["leave"]}]}
        validate_troop_reward(location, location, troops)
        registry["locations"].append(location)
        item = read_json(data / ("Items.json" if kind == "item" else "Armors.json"))[dbid]
        existing = next((r for r in registry["items"] if r["kind"] == kind and r["database_id"] == dbid), None)
        if existing:
            existing["quantity"] += 1
        else:
            registry["items"].append({"name": item["name"], "ap_id": (540000000 if kind == "item" else 540200000) + dbid,
                "kind": kind, "database_id": dbid, "quantity": 1,
                "classification": "useful" if kind == "armor" else "filler"})
        added += 1
    for family, name, troop, mid, eid, index, code, params, conditions in [
        ("shadow_gift", "Masked Shadow's Gift", 18, 6, 40, 546, 404, [], [{"id": 150, "value": 5}]),
        ("benjamin_playtime", "Benjamin's Playtime", 27, 33, 2, 635, 122, [110, 110, 0, 0, 5], [{"id": 110, "value": 4}]),
    ]:
        if any(r["key"] == family for r in registry["quest_families"]):
            continue
        terminal = {"map_id": mid, "event_id": eid, "troop_id": troop, "page": 0,
                    "command_index": index, "command_code": code, "parameters": params, "required_variables": conditions}
        if troop == 18:
            terminal["choice_index"] = 452
        registry["quest_families"].append({"key": family, "name": name,
            "location_keys": [r["key"] for r in registry["locations"] if r.get("quest_family") == family],
            "terminals": [terminal]})
    if added:
        registry["registry_version"] += 1
        registry["locations"].sort(key=lambda r: r["ap_id"])
        registry["items"].sort(key=lambda r: r["ap_id"])
        REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added {added} peaceful quest rewards; {len(registry['locations'])} active checks")


if __name__ == "__main__":
    main()
