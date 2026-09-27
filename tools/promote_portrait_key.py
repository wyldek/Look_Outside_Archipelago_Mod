"""Register the green portrait's shared Stained Key, preserving friendly kills."""

import argparse
import json
from pathlib import Path

from portrait_scope import GREEN_KEY_SOURCES, validate_green_key
from validate_registry import REGISTRY, read_json, require, validate_troop_reward


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    data = parser.parse_args().game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    key = "green_portrait_stained_key"
    if any(row["key"] == key for row in registry["locations"]):
        print("Stained Key already registered")
        return
    troops = read_json(data / "Troops.json")
    commands = troops[332]["pages"][0]["list"]
    location = {"key": key, "name": "Green Portrait - Stained Key", "ap_id": 592000070,
        "map_id": 119, "event_id": 13, "page": 0, "troop_id": 332,
        "command_index": 126, "command_code": 126, "reward_kind": "item", "reward_database_id": 294,
        "portrait_key": True, "message_index": 128, "message_text": commands[128]["parameters"][0],
        "required_variables": [{"id": 313, "value": 0}],
        "troop_consumption": {"guard_index": 79, "variable_id": 313, "required_value": 0,
            "intercept_value": 0, "consumed_value": 1, "consumed_writes": [158], "commands": [
                {"command_index": 80, "command_code": 111, "parameters": [10, 187, True]},
                {"command_index": 84, "command_code": 121, "parameters": [186, 186, 0]},
                {"command_index": 157, "command_code": 121, "parameters": [535, 535, 0]}]},
        "source_variants": []}
    validate_troop_reward(location, location, troops)
    for mid, eid, pages, _troop in GREEN_KEY_SOURCES:
        game_map = read_json(data / f"Map{mid:03d}.json")
        for page in pages:
            grant = 13 if mid == 119 else 10
            commands = game_map["events"][eid]["pages"][page]["list"]
            source = {"map_id": mid, "event_id": eid, "page": page,
                "command_index": grant, "command_code": 126, "green_key_completion": True,
                "message_index": grant + 2, "message_text": commands[grant + 2]["parameters"][0],
                "required_variables": [{"id": 313, "value": 99}],
                "required_switches": [{"id": 186, "value": False}]}
            validate_green_key(location, source, game_map, require)
            location["source_variants"].append(source)
    registry["locations"].append(location)
    registry["items"].append({"name": "Stained Key", "ap_id": 540000294, "kind": "item",
        "database_id": 294, "quantity": 1, "classification": "progression"})
    # Equipping the Lucky hat triggers its native conversion to the green hat,
    # which provides the peaceful key route. That input belongs in logic.
    next(row for row in registry["items"] if row["kind"] == "armor" and
         row["database_id"] == 186)["classification"] = "progression"
    registry["registry_version"] += 1
    REGISTRY.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Added Stained Key with {len(location['source_variants'])} combat alternatives; {len(registry['locations'])} checks")


if __name__ == "__main__":
    main()
