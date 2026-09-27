"""Register peaceful, one-time gifts made by a battle-dialogue interpreter."""

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
    key = "joel_peaceful_door_knob"
    troops = read_json(data / "Troops.json")
    commands = troops[26]["pages"][1]["list"]
    # Both peaceful choices set state 8 before giving the knob. Attacking sets
    # state 7, but the vanilla jump's lowercase label does not match "Fight".
    # Require state 8 at interception so that fallthrough also remains vanilla.
    evidence = [(9, 102, [["Hug him.", "Step back.", "Attack!"], 1, 0, 2, 0]),
                (45, 122, [107, 107, 0, 0, 7]), (47, 119, ["fight"]),
                (55, 340, []), (60, 118, ["Fight"])]
    for index, code, params in evidence:
        require(commands[index]["code"] == code and commands[index]["parameters"] == params,
                "Joel's peaceful reward path changed")
    location = {"key": key, "name": "Joel - Door Knob Gift", "ap_id": 592000001,
                "map_id": 32, "event_id": 7, "troop_id": 26, "page": 1,
                "command_index": 52, "command_code": 126,
                "message_index": 54, "message_text": commands[54]["parameters"][0],
                "reward_kind": "item", "reward_database_id": 310, "reviewed_item_pickup": True,
                "required_variables": [{"id": 107, "value": 8}],
                "troop_consumption": {"guard_index": 0, "variable_id": 107, "required_value": 6,
                    "consumed_value": 8, "consumed_writes": [15, 42],
                    "commands": [{"command_index": i, "command_code": c, "parameters": p}
                                 for i, c, p in evidence]}}
    validate_troop_reward(location, location, troops)
    existing = next((r for r in registry["locations"] if r["key"] == key), None)
    if existing == location:
        print("Joel's peaceful gift is already active")
        return
    if existing:
        registry["locations"].remove(existing)
    else:
        registry["items"].append({"name": "Door Knob", "ap_id": 540000310, "kind": "item",
                                 "database_id": 310, "quantity": 1, "classification": "progression"})
    registry["locations"].append(location)
    registry["registry_version"] += 1
    registry["locations"].sort(key=lambda r: r["ap_id"])
    registry["items"].sort(key=lambda r: r["ap_id"])
    REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added Joel's peaceful gift; {len(registry['locations'])} active checks")


if __name__ == "__main__":
    main()
