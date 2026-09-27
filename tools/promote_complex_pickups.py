"""Add manually reviewed one-time equipment from branching event pages."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from encounter_scope import VANILLA_FRIENDLY_LOCKED_MAPS


PROJECT_DIR = Path(__file__).resolve().parents[1]
REGISTRY = PROJECT_DIR / "apworld" / "lookoutside" / "vertical_slice.json"
ITEM_BASE = {"weapon": 540100000, "armor": 540200000}
COMMAND_CODE = {"weapon": 127, "armor": 128}

# map, event, page, command, notice, kind, database ID, display name, class
APPROVED = (
    (6, 40, 3, 6, 5, "weapon", 85, "Apartment 33 Door - Shadow Gift Kitchen Knife", "useful"),
    (7, 30, 0, 4, 7, "armor", 115, "Floor 2 Hallway - Pistol", "useful"),
    (24, 3, 1, 11, 10, "weapon", 85, "Wounded Man - Kitchen Knife", "useful"),
    (34, 24, 0, 27, 6, "armor", 132, "Apartment 12 Safe - Old Rifle", "useful"),
    (60, 11, 0, 5, 8, "armor", 157, "Ground Floor Janitor's Room - Acid Sprayer", "useful"),
    (72, 5, 0, 4, 7, "armor", 199, "Mailroom Storage - Silver Magnum", "useful"),
    (77, 7, 0, 4, 6, "armor", 204, "Basement Security Store - SMG Special", "useful"),
    (86, 60, 0, 4, 8, "armor", 153, "Basement Garage - Flamethrower", "useful"),
    (106, 11, 3, 5, 8, "weapon", 112, "Floor 1 Abyss Rat Freak Offering - Rat Claws", "useful"),
    (107, 1, 0, 10, 14, "armor", 100, "Floor 1 Abyss Side Room - Odd Necklace", "useful"),
    (209, 4, 0, 23, 22, "armor", 273, "Landlord's Office - War Medal", "filler"),
    (230, 3, 0, 4, 7, "armor", 208, "Landlord's Bedroom Path Side Room - War Rifle", "useful"),
    (237, 9, 3, 9, 11, "armor", 186, "Floor 1 Long Hall Storeroom - Cowboy Hat", "filler"),
    (238, 6, 0, 4, 7, "armor", 136, "Floor 1 Long Hall Old Room - Hunting Shotgun", "useful"),
    (333, 30, 0, 6, 5, "armor", 26, "Eugene's Shop Back Room - Elegant Suit", "filler"),
)


def read_json(path: Path):
    with path.open("r", encoding="utf-8-sig") as source:
        return json.load(source)


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def source(game_dir: Path, map_id: int, event_id: int, page_index: int,
           reward_index: int, message_index: int, kind: str, database_id: int):
    event = read_json(game_dir / "data" / f"Map{map_id:03d}.json")["events"][event_id]
    page = event["pages"][page_index]
    commands = page["list"]
    reward = commands[reward_index]
    notice = commands[message_index]
    require(reward["code"] == COMMAND_CODE[kind] and
            reward["parameters"][:4] == [database_id, 0, 0, 1],
            f"Reward changed: Map {map_id} Event {event_id} Page {page_index}")
    require(notice["code"] == 401 and commands[message_index - 1]["code"] == 101,
            f"Notice changed: Map {map_id} Event {event_id} Page {page_index}")
    return event, {
        "map_id": map_id,
        "event_id": event_id,
        "page": page_index,
        "command_index": reward_index,
        "command_code": COMMAND_CODE[kind],
        "message_index": message_index,
        "message_text": notice["parameters"][0],
    }


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
    equipment = {kind: read_json(game_dir / "data" / f"{kind.title()}s.json")
                 for kind in ITEM_BASE}
    locations = registry["locations"]
    items = registry["items"]
    location_by_id = {row["ap_id"]: row for row in locations}
    item_by_id = {row["ap_id"]: row for row in items}
    added = 0
    for (map_id, event_id, page_index, reward_index, message_index,
         kind, database_id, location_name, classification) in APPROVED:
        if map_id in VANILLA_FRIENDLY_LOCKED_MAPS:
            continue
        event, signature = source(game_dir, map_id, event_id, page_index,
                                  reward_index, message_index, kind, database_id)
        require(location_name.endswith(equipment[kind][database_id]["name"]),
                f"Equipment name changed: {location_name}")
        if map_id == 7:
            other_event, variant = source(game_dir, 7, 30, 3, 4, 7, kind, database_id)
            require(other_event == event and
                    event["pages"][0]["list"] == event["pages"][3]["list"],
                    "Pistol alternate page changed")
        location_id = 530000000 + map_id * 100000 + event_id * 100 + page_index
        if location_id in location_by_id:
            require(location_by_id[location_id]["reward_kind"] == kind and
                    location_by_id[location_id]["reward_database_id"] == database_id,
                    f"Location ID collision: {location_name}")
            continue
        location = {
            "key": f"map{map_id:03d}_event{event_id:03d}_complex",
            "name": location_name,
            "ap_id": location_id,
            **signature,
            "reward_kind": kind,
            "reward_database_id": database_id,
        }
        if map_id == 7:
            location["source_variants"] = [variant]
        elif map_id == 24:
            location["consumed_self_switch"] = "B"
        elif map_id == 34:
            location["ap_message"] = "Archipelago location checked. Rifle Bullets received."
        elif map_id == 106:
            location["consumed_self_switch"] = "D"
            location["same_page_consumed_self_switch"] = "D"
        elif map_id == 237:
            location["consumed_self_switch"] = "C"
        locations.append(location)
        location_by_id[location_id] = location
        item_id = ITEM_BASE[kind] + database_id
        item = item_by_id.get(item_id)
        if item:
            require(item["classification"] == classification,
                    f"Classification changed: {item['name']}")
            item["quantity"] += 1
        else:
            item = {"name": equipment[kind][database_id]["name"],
                    "ap_id": item_id, "kind": kind, "database_id": database_id,
                    "quantity": 1, "classification": classification}
            if kind == "armor" and database_id == 186:
                item["database_name"] = item["name"]
                item["name"] = "Cowboy Hat (Lucky)"
            items.append(item)
            item_by_id[item_id] = item
        added += 1
    if not added:
        print("Reviewed complex pickups are already active")
        return
    registry["registry_version"] += 1
    locations.sort(key=lambda row: row["ap_id"])
    items.sort(key=lambda row: row["ap_id"])
    require(sum(item["quantity"] for item in items) == len(locations),
            "Item copies do not equal location count")
    REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n",
                        encoding="utf-8")
    print(f"Promoted {added} reviewed equipment checks; {len(locations)} active locations")


if __name__ == "__main__":
    main()
