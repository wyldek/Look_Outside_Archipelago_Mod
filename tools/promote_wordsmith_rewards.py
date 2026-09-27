"""Register Wilhelmina's five mutually exclusive post-battle equipment rewards."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from promote_complex_pickups import REGISTRY, read_json, require


# key suffix, kind, database ID, grant command, notice command
REWARDS = (
    ("sword", "weapon", 158, 107, 109),
    ("spear", "weapon", 156, 118, 120),
    ("hammer", "weapon", 154, 129, 131),
    ("gun", "armor", 213, 137, 139),
    ("book", "armor", 290, 145, 147),
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
    event = read_json(game_dir / "data" / "Map169.json")["events"][2]
    commands = event["pages"][1]["list"]
    require(commands[85]["code"] == 301 and commands[85]["parameters"] == [0, 598, False, False],
            "Wilhelmina battle changed")
    require(commands[156]["code"] == 121 and commands[156]["parameters"] == [1135, 1135, 0],
            "Wilhelmina terminal switch changed")
    require(event["pages"][2]["conditions"]["switch1Valid"] and
            event["pages"][2]["conditions"]["switch1Id"] == 1135,
            "Wilhelmina consumed page changed")
    families = registry.setdefault("quest_families", [])
    family_key = "wilhelmina_reward"
    if any(family["key"] == family_key for family in families):
        print("Wilhelmina reward family is already active")
        return
    equipment = {kind: read_json(game_dir / "data" / f"{kind.title()}s.json")
                 for kind in ("weapon", "armor")}
    keys = []
    for ordinal, (suffix, kind, database_id, grant_index, notice_index) in enumerate(REWARDS):
        code = 127 if kind == "weapon" else 128
        require(commands[grant_index]["code"] == code and
                commands[grant_index]["parameters"] == [database_id, 0, 0, 1, False] and
                commands[notice_index]["code"] == 401 and commands[notice_index - 1]["code"] == 101,
                f"Wilhelmina reward changed: {suffix}")
        key = f"wilhelmina_reward_{suffix}"
        name = equipment[kind][database_id]["name"]
        keys.append(key)
        registry["locations"].append({
            "key": key, "name": f"Wilhelmina Defeated - {name}",
            "ap_id": 590000100 + ordinal,
            "map_id": 169, "event_id": 2, "page": 1,
            "command_index": grant_index, "command_code": code,
            "reward_kind": kind, "reward_database_id": database_id,
            "message_index": notice_index, "message_text": commands[notice_index]["parameters"][0],
            "quest_family": family_key,
            "consumed_switch": {"id": 1135, "command_index": 156, "page": 2},
        })
        require(not any(item["kind"] == kind and item["database_id"] == database_id
                        for item in registry["items"]), f"Quest item already exists: {name}")
        registry["items"].append({
            "name": name, "ap_id": (540100000 if kind == "weapon" else 540200000) + database_id,
            "kind": kind, "database_id": database_id, "quantity": 1, "classification": "useful",
        })
    families.append({"key": family_key, "name": "Wilhelmina",
                     "location_keys": keys, "terminals": [{
                         "map_id": 169, "event_id": 2, "page": 1,
                         "command_index": 156, "command_code": 121, "parameters": [1135, 1135, 0],
                     }]})
    registry["registry_version"] += 1
    registry["locations"].sort(key=lambda row: row["ap_id"])
    registry["items"].sort(key=lambda row: row["ap_id"])
    require(sum(item["quantity"] for item in registry["items"]) == len(registry["locations"]),
            "Item copies do not equal location count")
    REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added five reconciled boss rewards; {len(registry['locations'])} active locations")


if __name__ == "__main__":
    main()
