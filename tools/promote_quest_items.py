"""Register reviewed one-time keys, planet discs, and persistent collectibles."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from validate_registry import REGISTRY, read_json, require


# map, event, grant, notice, item, location, classification
SOURCES = (
    (7, 1, 2, 1, 302, "Floor 2 Hallway - Apt. 21 Key", "progression"),
    (16, 3, 2, 4, 376, "Dan's Apartment - NeoDuo", "filler"),
    (55, 39, 11, 13, 323, "Ground Floor Reception - Venus Disc", "progression"),
    (58, 4, 10, 12, 328, "Basement Apartment - Uranus Disc", "progression"),
    (72, 3, 11, 13, 327, "Mailroom Storage - Saturn Disc", "progression"),
    (106, 2, 9, 12, 325, "Floor 1 Abyss - Mars Disc", "progression"),
    (187, 35, 9, 11, 329, "Fungus Tunnels - Neptune Disc", "progression"),
    (61, 6, 11, 7, 434, "Ground Floor Janitor Closet - Ratavia Figure", "useful"),
    (69, 21, 7, 6, 438, "Laundromat - Cerulean Figure", "useful"),
    (85, 24, 12, 7, 435, "Basement Store - Musk Figure", "useful"),
    (89, 9, 12, 7, 436, "Floor 2 Side Room - Jacket Figure", "useful"),
    (90, 11, 12, 7, 437, "Floor 2 Closet - Lute Figure", "useful"),
    (98, 14, 12, 7, 433, "Floor 1 Studio Bedroom - Dustin Figure", "useful"),
    (71, 5, 5, 14, 317, "Post Office - Stationery", "progression"),
    (100, 16, 4, 13, 318, "Floor 1 Rat Apartment - Fountain Pen", "progression"),
    (359, 3, 4, 6, 385, "Apartment 12 Lower Hall - Apt. 35 Key", "progression"),
    (380, 3, 10, 12, 392, "Landlord's Side Room - Old Photograph", "progression"),
    (401, 7, 10, 12, 393, "Flesh Apartment - Wrapped Painting", "progression"),
    (406, 2, 10, 12, 390, "Landlord's Lair - Last Will", "progression"),
    (456, 1, 11, 13, 391, "Floor 4 Tunnel Room - Old Tape", "progression"),
    (87, 21, 11, 13, 306, "Shipping and Receiving - Janitor Key Ring", "progression"),
    (277, 4, 12, 11, 378, "Apartment 30 Northwest Room - Shrunken Head", "progression"),
    (122, 9, 12, 11, 411, "Frozen Room - Wake the Blood Knight", "filler"),
    (38, 4, 11, 10, 412, "Dark Room - Wizards Hell: Arcane Tears", "filler"),
    (203, 38, 12, 11, 415, "Sewers - Catafalque", "filler"),
    (97, 49, 14, 13, 416, "Painter's Studio - Honko's Grand Journey", "filler"),
    (234, 2, 11, 10, 418, "Meat World - Wraithscourge", "filler"),
    (52, 5, 12, 11, 422, "Floor 2 Bedroom - Myrmidon XII", "filler"),
    (298, 7, 12, 11, 424, "Basement Bathroom - Frogit About It", "filler"),
    (10, 16, 11, 10, 427, "Apartment 21 - Space Truckerz", "filler"),
    (126, 2, 20, 22, 430, "Fungus Lair - Unlabeled Cartridge", "filler"),
    (39, 7, 20, 23, 334, "Apartment 22 - Guinea Pig", "progression"),
    (6, 40, 7, 6, 360, "Masked Shadow - Rose", "progression"),
)


def source(data_dir, mid, eid, grant, notice, dbid, page_index=0):
    event = read_json(data_dir / f"Map{mid:03d}.json")["events"][eid]
    commands = event["pages"][page_index]["list"]
    require(commands[grant]["code"] == 126 and
            commands[grant]["parameters"] == [dbid, 0, 0, 1], "Item source changed")
    require(commands[notice]["code"] == 401 and commands[notice - 1]["code"] == 101,
            "Item notice changed")
    require(event["pages"][page_index + 1]["conditions"]["selfSwitchValid"] and
            event["pages"][page_index + 1]["conditions"]["selfSwitchCh"] == "A", "Consumed page changed")
    signature = {"map_id": mid, "event_id": eid, "page": page_index,
                 "command_index": grant, "command_code": 126,
                 "message_index": notice, "message_text": commands[notice]["parameters"][0],
                 "native_effects": [{"command_index": i, "command_code": c["code"],
                                     "parameters": c["parameters"]}
                                    for i, c in enumerate(commands) if c["code"] in (117, 121, 122, 123, 355)]}
    return event, signature


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", required=True, type=Path)
    args = parser.parse_args()
    data_dir = args.game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data_dir / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    db = read_json(data_dir / "Items.json")
    added = 0
    for mid, eid, grant, notice, dbid, name, classification in SOURCES:
        key = f"map{mid:03d}_event{eid:03d}_quest_item"
        if any(row["key"] == key for row in registry["locations"]):
            continue
        require(name.endswith(db[dbid]["name"]), f"Item name changed: {name}")
        page_index = 1 if mid == 87 else 7 if (mid, eid) == (6, 40) else 0
        event, signature = source(data_dir, mid, eid, grant, notice, dbid, page_index)
        location = {"key": key, "name": name, "ap_id": 530000000 + mid * 100000 + eid * 100 + page_index,
                    **signature, "reward_kind": "item", "reward_database_id": dbid,
                    "consumed_self_switch": "A", "reviewed_item_pickup": True}
        if mid == 58:
            alternate, variant = source(data_dir, 302, 16, grant, notice, dbid)
            normal_hidden = event["pages"][2]["conditions"]
            hard_only = alternate["pages"][0]["conditions"]
            require(normal_hidden["switch1Valid"] and normal_hidden["switch1Id"] == 8 and
                    hard_only["switch1Valid"] and hard_only["switch1Id"] == 8,
                    "Uranus difficulty alternatives changed")
            location["source_variants"] = [variant]
            location["difficulty_alternatives"] = {"switch_id": 8, "normal_hidden_page": 2}
        if mid in (71, 100):
            index = 9 if mid == 71 else 8
            location["message_variants"] = [{"message_index": index,
                "message_text": event["pages"][0]["list"][index]["parameters"][0],
                "ap_message": ("Archipelago location checked. Was the voice in the pipe asking"
                               if mid == 71 else
                               "Archipelago location checked. Wasn't the voice in the pipe asking")}]
        registry["locations"].append(location)
        item = next((r for r in registry["items"] if r["kind"] == "item" and r["database_id"] == dbid), None)
        if item:
            require(item["classification"] == classification, f"Item class changed: {name}")
            item["quantity"] += 1
        else:
            registry["items"].append({"name": db[dbid]["name"], "ap_id": 540000000 + dbid,
                "kind": "item", "database_id": dbid, "quantity": 1, "classification": classification})
        added += 1
    if added:
        registry["registry_version"] += 1
        registry["locations"].sort(key=lambda r: r["ap_id"])
        registry["items"].sort(key=lambda r: r["ap_id"])
        require(sum(r["quantity"] for r in registry["items"]) == len(registry["locations"]),
                "Item copies do not match locations")
        REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added {added} reviewed item checks; {len(registry['locations'])} active checks")


if __name__ == "__main__":
    main()
