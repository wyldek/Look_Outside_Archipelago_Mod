"""Register nine reviewed boss salvage checks, independent of Audrey's presence."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from validate_registry import REGISTRY, read_json, require, validate_boss_salvage


# armor, map, event, pages, battle, troop, Audrey condition, reward, terminal,
# defeated-state command, command code, parameters, consumed event, consumed page
SOURCES = (
    (353, 86, 14, (3,), 2, 189, 12, 17, 19, 9, 123, ["B", 0], 14, 4),
    (351, 86, 58, (3,), 1, 188, 12, 17, 19, 3, 121, [381, 381, 0], 58, 5),
    (352, 86, 101, (1,), 2, 184, 8, 13, 15, 7, 121, [418, 418, 0], 42, 3),
    (354, 127, 3, (0, 1), 1, 208, 13, 18, 20, 6, 121, [520, 520, 0], 3, 3),
    (354, 127, 24, (0, 1), 1, 208, 12, 17, 19, 5, 121, [520, 520, 0], 24, 3),
    (354, 127, 26, (0, 1), 1, 208, 12, 17, 19, 5, 121, [520, 520, 0], 26, 3),
    (357, 130, 9, (1,), 6, 281, 13, 18, 20, 21, 121, [388, 388, 0], 9, 2),
    (364, 152, 6, (0, 1), 1, 313, 8, 13, 15, 3, 123, ["C", 0], 6, 3),
    (356, 207, 22, (3,), 1, 298, 6, 11, 13, 3, 121, [707, 707, 0], 22, 5),
    (365, 233, 11, (2,), 1, 299, 6, 11, 13, 3, 121, [1140, 1140, 0], 11, 4),
    (355, 270, 6, (1, 2), 3, 441, 21, 26, 28, 9, 123, ["C", 0], 6, 4),
)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    args = parser.parse_args()
    data_dir = args.game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data_dir / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    armors = read_json(data_dir / "Armors.json")
    grouped = {}
    for (armor, map_id, event_id, pages, battle, troop, actor, grant, terminal,
         completion, code, params, consumed_event, consumed_page) in SOURCES:
        game_map = read_json(data_dir / f"Map{map_id:03d}.json")
        for page in pages:
            commands = game_map["events"][event_id]["pages"][page]["list"]
            require(commands[grant]["code"] == 128 and
                    commands[grant]["parameters"] == [armor, 0, 0, 1, False] and
                    commands[grant - 1]["code"] == 401 and commands[grant - 2]["code"] == 101,
                    f"Salvage reward changed: {map_id}/{event_id}/{page}")
            source = {
                "map_id": map_id, "event_id": event_id, "page": page,
                "command_index": grant, "command_code": 128,
                "message_index": grant - 1, "message_text": commands[grant - 1]["parameters"][0],
                "boss_salvage": {
                    "battle_index": battle, "troop_id": troop, "actor_branch_index": actor,
                    "terminal_index": terminal, "completion_index": completion,
                    "completion_code": code, "completion_parameters": params,
                    "consumed_event_id": consumed_event, "consumed_page": consumed_page,
                },
            }
            validate_boss_salvage({"key": f"boss_salvage_{armor}"}, source, game_map)
            grouped.setdefault(armor, []).append(source)
    added = 0
    for armor, sources in grouped.items():
        key = f"boss_salvage_{armor}"
        if any(location["key"] == key for location in registry["locations"]):
            continue
        require(not any(item["kind"] == "armor" and item["database_id"] == armor
                        for item in registry["items"]), f"Salvage already in item pool: {armor}")
        name = armors[armor]["name"]
        first = sources[0]
        location = {
            "key": key, "name": f"Boss Salvage - {name}",
            "ap_id": 530000000 + first["map_id"] * 100000 + first["event_id"] * 100 + first["page"],
            **first, "reward_kind": "armor", "reward_database_id": armor,
            "quest_family": key,
        }
        if len(sources) > 1:
            location["source_variants"] = sources[1:]
        registry["locations"].append(location)
        registry["items"].append({"name": name, "ap_id": 540200000 + armor,
                                  "kind": "armor", "database_id": armor,
                                  "quantity": 1, "classification": "useful"})
        registry["quest_families"].append({
            "key": key, "name": f"{name} boss salvage", "location_keys": [key],
            "completion_message": "Archipelago: boss salvage checked.",
            "terminals": [{
                "map_id": source["map_id"], "event_id": source["event_id"], "page": source["page"],
                "command_index": source["boss_salvage"]["terminal_index"],
                "command_code": 412, "parameters": [],
            } for source in sources],
        })
        added += 1
    if added:
        registry["registry_version"] += 1
        registry["locations"].sort(key=lambda row: row["ap_id"])
        registry["items"].sort(key=lambda row: row["ap_id"])
        require(sum(item["quantity"] for item in registry["items"]) == len(registry["locations"]),
                "Item copies do not match checks")
        REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added {added} boss salvage checks; {len(registry['locations'])} active locations")


if __name__ == "__main__":
    main()
