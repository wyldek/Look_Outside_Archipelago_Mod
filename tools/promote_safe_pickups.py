"""Register reviewed safe equipment, preserving keys, lockpicks, and cash."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from promote_complex_pickups import REGISTRY, read_json, require
from encounter_scope import VANILLA_FRIENDLY_LOCKED_MAPS


# map, event, place, (reward command, armor ID), (notice command, cash amount)
SAFES = (
    (11, 9, "Floor 2 North Apartment Closet Safe", ((6, 94),), ((9, 200), (15, 60), (20, 120))),
    (53, 8, "Corner Store Storage Safe", ((5, 101),), ((8, 240), (14, 200), (19, 160))),
    (73, 8, "Shipping and Receiving Safe", ((5, 83), (6, 54)), ((9, 120), (15, 80), (20, 60))),
    (109, 12, "Apartment 31 Bedroom Safe", ((5, 95),), ((8, 320), (14, 160), (19, 240))),
    (119, 14, "Floor 1 Long Hall Bedroom Safe", ((6, 102),), ((9, 200), (15, 60), (20, 120))),
    (258, 17, "Boiler Maze Side Room Safe", ((5, 104),), ((8, 160), (14, 120), (19, 80))),
    (275, 7, "Apartment 30 Northeast Room Safe", ((5, 96),), ((8, 160), (14, 120), (19, 80))),
    (333, 26, "Eugene's Shop Back Room Safe", ((6, 97),), ((9, 200), (15, 60), (20, 120))),
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
    common = read_json(game_dir / "data" / "CommonEvents.json")[184]
    require(common["name"] == "simpleLocks" and
            all(common["list"][i]["code"] == 123 and
                common["list"][i]["parameters"] == ["A", 0] for i in (45, 50)),
            "Safe opening common event changed")
    locations = registry["locations"]
    items = registry["items"]
    location_by_id = {row["ap_id"]: row for row in locations}
    item_by_id = {row["ap_id"]: row for row in items}
    added = 0
    for map_id, event_id, place, rewards, notices in SAFES:
        if map_id in VANILLA_FRIENDLY_LOCKED_MAPS:
            continue
        event = read_json(game_dir / "data" / f"Map{map_id:03d}.json")["events"][event_id]
        commands = event["pages"][0]["list"]
        require(commands[2]["code"] == 117 and commands[2]["parameters"] == [184] and
                commands[3]["code"] == 111 and commands[3]["parameters"] == [2, "A", 0],
                f"Safe opening path changed: Map {map_id} Event {event_id}")
        require(event["pages"][1]["conditions"]["selfSwitchValid"] and
                event["pages"][1]["conditions"]["selfSwitchCh"] == "A",
                f"Safe consumed page changed: Map {map_id} Event {event_id}")
        messages = []
        check_text = "Archipelago location checked." if len(rewards) == 1 else "2 Archipelago locations checked."
        for index, amount in notices:
            require(commands[index - 1]["code"] == 101 and commands[index]["code"] == 401 and
                    commands[index + 1]["code"] == 125 and
                    commands[index + 1]["parameters"] == [0, 0, amount],
                    f"Safe cash/notice changed: Map {map_id} Event {event_id} Command {index}")
            messages.append({"message_index": index,
                             "message_text": commands[index]["parameters"][0],
                             "ap_message": f"{check_text} ${amount} received.",
                             "cash_amount": amount})
        for ordinal, (command_index, database_id) in enumerate(rewards):
            reward = commands[command_index]
            require(reward["code"] == 128 and reward["parameters"] == [database_id, 0, 0, 1, False],
                    f"Safe reward changed: Map {map_id} Event {event_id}")
            # The second item from a shared safe reserves offset 50. Offsets
            # below 50 continue to represent ordinary event page indices.
            location_id = 530000000 + map_id * 100000 + event_id * 100 + ordinal * 50
            if location_id in location_by_id:
                require(location_by_id[location_id]["reward_database_id"] == database_id,
                        f"Safe location ID collision: Map {map_id} Event {event_id}")
                continue
            name = armors[database_id]["name"]
            location = {
                "key": f"map{map_id:03d}_event{event_id:03d}_safe_{database_id}",
                "name": f"{place} - {name}", "ap_id": location_id,
                "map_id": map_id, "event_id": event_id, "page": 0,
                "command_index": command_index, "command_code": 128,
                "reward_kind": "armor", "reward_database_id": database_id,
                **messages[0], "message_variants": messages[1:],
                "consumed_by_common_event": 184,
            }
            locations.append(location)
            location_by_id[location_id] = location
            item_id = 540200000 + database_id
            classification = "filler" if database_id in (83, 54) else "useful"
            item = item_by_id.get(item_id)
            if item:
                require(item["classification"] == classification,
                        f"Classification conflict: {name}")
                item["quantity"] += 1
            else:
                item = {"name": name, "ap_id": item_id, "kind": "armor",
                        "database_id": database_id, "quantity": 1,
                        "classification": classification}
                items.append(item)
                item_by_id[item_id] = item
            added += 1
    if not added:
        print("Reviewed safe pickups are already active")
        return
    registry["registry_version"] += 1
    locations.sort(key=lambda row: row["ap_id"])
    items.sort(key=lambda row: row["ap_id"])
    require(sum(item["quantity"] for item in items) == len(locations),
            "Item copies do not equal location count")
    REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Promoted {added} safe equipment checks; {len(locations)} active locations")


if __name__ == "__main__":
    main()
