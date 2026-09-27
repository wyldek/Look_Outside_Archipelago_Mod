"""Register reviewed quest rewards and exact terminal reconciliation commands."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from promote_complex_pickups import REGISTRY, read_json, require


QUESTS = (
    {
        "key": "roach_leadership", "name": "Roach Leadership",
        "map_id": 3, "event_id": 121, "page": 2,
        "variable_id": 899, "consumed_page": 3, "threshold": 100,
        # key, location ID, armor ID, grant, notice, terminal command, terminal value
        "rewards": (("roach_leadership_crown", 530312102, 330, 51, 50, 59, 101),
                    ("roach_leadership_sash", 530312152, 331, 69, 68, 79, 102)),
        "terminals": ((59, 101), (79, 102), (91, 100)),
    },
    {
        "key": "leighs_call", "name": "Leigh's Call",
        "map_id": 434, "event_id": 1, "page": 0,
        "variable_id": 900, "consumed_page": 1, "threshold": 90,
        "rewards": (("leighs_call_ring", 573400100, 283, 61, 63, 64, 102),),
        "terminals": ((64, 102), (83, 101)),
    },
)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    args = parser.parse_args()
    game_dir = args.game_dir.resolve(strict=True)
    registry = read_json(REGISTRY)
    system = read_json(game_dir / "data" / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"],
            "The game build differs from the active registry")
    armors = read_json(game_dir / "data" / "Armors.json")
    locations = registry["locations"]
    items = registry["items"]
    existing_keys = {row["key"] for row in locations}
    families = registry.setdefault("quest_families", [])
    added = 0
    for quest in QUESTS:
        family_key = quest["key"]
        keys = [reward[0] for reward in quest["rewards"]]
        event = read_json(game_dir / "data" / f"Map{quest['map_id']:03d}.json")["events"][quest["event_id"]]
        commands = event["pages"][quest["page"]]["list"]
        terminals = []
        for index, value in quest["terminals"]:
            params = [quest["variable_id"], quest["variable_id"], 0, 0, value]
            require(commands[index]["code"] == 122 and commands[index]["parameters"] == params,
                    f"Quest terminal changed: {family_key} command {index}")
            terminals.append({"map_id": quest["map_id"], "event_id": quest["event_id"],
                              "page": quest["page"], "command_index": index,
                              "command_code": 122, "parameters": params})
        if any(family["key"] == family_key for family in families):
            require(all(key in existing_keys for key in keys), "Quest family has missing locations")
            continue
        require(not any(key in existing_keys for key in keys), "Partial quest family is already active")
        for (key, location_id, database_id, reward_index, notice_index,
             terminal_index, terminal_value) in quest["rewards"]:
            require(commands[reward_index]["code"] == 128 and
                    commands[reward_index]["parameters"] == [database_id, 0, 0, 1, False] and
                    commands[notice_index]["code"] == 401 and
                    commands[notice_index - 1]["code"] == 101,
                    f"Quest reward changed: {family_key} armor {database_id}")
            name = armors[database_id]["name"]
            locations.append({
                "key": key, "name": f"{quest['name']} - {name}", "ap_id": location_id,
                "map_id": quest["map_id"], "event_id": quest["event_id"], "page": quest["page"],
                "command_index": reward_index, "command_code": 128,
                "reward_kind": "armor", "reward_database_id": database_id,
                "message_index": notice_index,
                "message_text": commands[notice_index]["parameters"][0],
                "quest_family": family_key,
                "consumed_variable": {"id": quest["variable_id"], "threshold": quest["threshold"],
                                      "page": quest["consumed_page"],
                                      "command_index": terminal_index, "value": terminal_value},
            })
            require(not any(item["kind"] == "armor" and item["database_id"] == database_id for item in items),
                    f"Quest item already exists: {name}")
            items.append({"name": name, "ap_id": 540200000 + database_id,
                          "kind": "armor", "database_id": database_id,
                          "quantity": 1, "classification": "useful"})
            added += 1
        families.append({"key": family_key, "name": quest["name"],
                         "location_keys": keys, "terminals": terminals})
    if not added:
        print("Reviewed quest families are already active")
        return
    registry["registry_version"] += 1
    locations.sort(key=lambda row: row["ap_id"])
    items.sort(key=lambda row: row["ap_id"])
    require(sum(item["quantity"] for item in items) == len(locations),
            "Item copies do not equal location count")
    REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added {added} reconciled quest checks; {len(locations)} active locations")


if __name__ == "__main__":
    main()
