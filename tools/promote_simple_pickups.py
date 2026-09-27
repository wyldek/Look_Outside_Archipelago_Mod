"""Promote manually reviewed one-time pickups into the active registry.

The selection below is explicitly reviewed. Each source has a single fixed
reward, an exact pickup notice, and a self-switch-A consumed page.
The draft report remains a review queue, not an input to bulk randomization.
"""

from __future__ import annotations

import json
from pathlib import Path

from normal_mode_scope import HARD_ONLY_PICKUPS
from encounter_scope import VANILLA_FRIENDLY_LOCKED_MAPS
from review_equipment import VANILLA_ITEM_SCOPE


PROJECT_DIR = Path(__file__).resolve().parents[1]
REGISTRY = PROJECT_DIR / "apworld" / "lookoutside" / "vertical_slice.json"
DRAFT = PROJECT_DIR / "build" / "game_audit" / "draft_registry.json"

# (draft source key, location name, item classification)
APPROVED = (
    ("map011_event004_page0_cmd4", "Floor 2 North Apartment Closet - Broom", "filler"),
    ("map030_event010_page0_cmd6", "Basement Stairs - Pool Cue", "filler"),
    ("map038_event003_page0_cmd6", "Apartment 37 Projector Room - Golf Club", "filler"),
    ("map039_event005_page0_cmd4", "Apartment 37 Bedroom - Glasses", "filler"),
    ("map042_event009_page0_cmd6", "Floor 1 Apartment Closet - Plastic Gloves", "filler"),
    ("map068_event008_page0_cmd4", "Office Desk - Claymore", "useful"),
    ("map069_event010_page0_cmd4", "Laundromat - T-Shirt", "filler"),
    ("map077_event004_page0_cmd4", "Basement Security Store - Combat Knife", "useful"),
    ("map077_event005_page0_cmd4", "Basement Security Store - Flak Jacket", "useful"),
    ("map080_event003_page0_cmd4", "Basement Storage - Claymore", "useful"),
    ("map081_event003_page0_cmd6", "Basement Storage - Lapis Band", "useful"),
    ("map090_event005_page0_cmd6", "Floor 2 Closet - Mop", "filler"),
    ("map090_event006_page0_cmd6", "Floor 2 Closet - Broom", "filler"),
    ("map090_event007_page0_cmd6", "Floor 2 Closet - Plastic Gloves", "filler"),
    ("map090_event008_page0_cmd6", "Floor 2 Closet - Gas Mask", "useful"),
    ("map097_event009_page0_cmd4", "Floor 1 Studio Apartment - Bottle", "filler"),
    ("map100_event013_page0_cmd4", "Floor 1 Rat Apartment - Chef's Knife", "filler"),
    ("map100_event014_page0_cmd4", "Floor 1 Rat Apartment - Rolling Pin", "filler"),
    ("map109_event007_page0_cmd4", "Apartment 31 Bedroom - Metal Bat", "useful"),
    ("map119_event010_page0_cmd4", "Floor 1 Long Hall Bedroom - Windbreaker Jacket", "filler"),
    ("map121_event010_page0_cmd6", "Apartment 34 Bedroom - Spade", "filler"),
    ("map124_event010_page0_cmd6", "Apartment 34 Office - Hammer", "filler"),
    ("map149_event052_page0_cmd4", "Apartment 38 South Closet - Hadal Trident", "useful"),
    ("map194_event032_page0_cmd4", "Boiler Maze - Vintage Sneakers", "filler"),
    ("map208_event018_page0_cmd4", "Landlord's East Room - Baseball Bat", "useful"),
    ("map219_event032_page0_cmd4", "Boiler Maze - Fireman's Axe", "useful"),
    ("map240_event043_page0_cmd4", "Landlord's Warzone - Spade", "filler"),
    ("map255_event003_page0_cmd4", "Boiler Maze Side Room - Mop", "filler"),
    ("map255_event005_page0_cmd4", "Boiler Maze Side Room - Rubber Boots", "filler"),
    ("map255_event006_page0_cmd4", "Boiler Maze Side Room - Hard Hat", "filler"),
    ("map255_event007_page0_cmd4", "Boiler Maze Side Room - Plastic Gloves", "filler"),
    ("map256_event017_page0_cmd4", "Boiler Maze Side Room - Indigo Hockey Mask", "useful"),
    ("map257_event012_page0_cmd4", "Boiler Maze West Side Room - Padded Jacket", "filler"),
    ("map271_event006_page0_cmd6", "Apartment 34 Hidden Room - Hockey Stick", "filler"),
    ("map273_event005_page0_cmd6", "Basement Apartment B2 - Trilby", "filler"),
    ("map275_event004_page0_cmd6", "Apartment 30 Northeast Room - Scalpel", "filler"),
    ("map276_event005_page0_cmd4", "Apartment 30 Southeast Room - Chef's Knife", "filler"),
    ("map281_event002_page0_cmd5", "Flesh Apartment 30 Southwest Room - Patchwork Club", "useful"),
    ("map282_event002_page0_cmd5", "Flesh Apartment 30 Northeast Room - Patchwork Hat", "useful"),
    ("map283_event003_page0_cmd4", "Flesh Apartment 30 Southeast Room - Needle Gloves", "useful"),
    ("map284_event004_page0_cmd5", "Flesh Apartment 30 Northwest Room - Patchwork Jacket", "useful"),
    ("map285_event010_page0_cmd6", "Apartment 20 - Cleaver", "filler"),
    ("map285_event012_page0_cmd6", "Apartment 20 - Mop", "filler"),
    ("map286_event026_page0_cmd6", "Apartment 20 East Bedroom - Vintage Sneakers", "filler"),
    ("map287_event027_page0_cmd6", "Apartment 20 West Bedroom - Motorcycle Helmet", "useful"),
    ("map290_event006_page0_cmd4", "Floor 1 Rat Lair - Cleaver", "filler"),
    ("map296_event006_page0_cmd6", "Apartment 18 East Room - Headphones", "filler"),
    ("map297_event004_page0_cmd4", "Apartment 18 Southeast Room - Old Axe", "filler"),
    ("map299_event007_page0_cmd5", "Basement Apartment B1 - Frying Pan", "filler"),
    ("map300_event004_page0_cmd6", "Basement Apartment B1 Bedroom - Winter Coat", "filler"),
    ("map329_event007_page0_cmd6", "Eugene's Shop South Room - Mop", "filler"),
    ("map329_event008_page0_cmd6", "Eugene's Shop South Room - Combat Knife", "useful"),
    ("map333_event028_page0_cmd6", "Eugene's Shop Back Room - Denim Vest", "filler"),
    ("map333_event029_page0_cmd6", "Eugene's Shop Back Room - Button-Up Shirt", "filler"),
    ("map334_event009_page0_cmd6", "Apartment 22 - Rubber Boots", "filler"),
    ("map352_event014_page0_cmd6", "Apartment 37 Locked Room - Machete", "useful"),
    ("map352_event015_page0_cmd6", "Apartment 37 Locked Room - Clogs", "filler"),
    ("map355_event035_page0_cmd5", "Apartment 38 Locks - Pitchfork", "filler"),
    ("map355_event036_page0_cmd5", "Apartment 38 Locks - Snake Whip", "useful"),
    ("map378_event003_page0_cmd4", "Apartment 12 Lower Large Room - Pitchfork", "filler"),
    ("map457_event008_page0_cmd6", "Floor 4 Station Hidden Tunnel - Fireman's Axe", "useful"),
    ("map034_event019_page0_cmd4", "Apartment 12 East Bedroom - Army Guy Figure", "useful"),
    ("map036_event005_page1_cmd6", "Floor 1 Sacrifice Room - Earth Disc", "progression"),
    ("map102_event009_page0_cmd4", "Floor 1 Rat Apartment - Child Barrier Key", "progression"),
    ("map110_event010_page0_cmd6", "Apartment 31 Observatory - Pluto Disc", "progression"),
    ("map110_event014_page0_cmd6", "Apartment 31 Observatory - Void Disc", "progression"),
    ("map115_event011_page0_cmd6", "Apartment 27 - Crumpled Manuscript", "progression"),
    ("map117_event007_page0_cmd6", "Apartment 27 Bedroom - Clean Manuscript", "progression"),
    ("map122_event010_page0_cmd4", "Apartment 34 Long Bedroom - Mercury Disc", "progression"),
    ("map140_event010_page0_cmd4", "Apartment 38 East Corridor - Rebreather", "progression"),
    ("map188_event015_page0_cmd5", "Basement Fungus Path - Store Key", "progression"),
    ("map086_event106_page3_cmd5", "Basement Garage - Iris Key", "progression"),
    ("map201_event063_page0_cmd6", "Boiler Maze Furnace - Iris Key", "progression"),
    ("map348_event005_page0_cmd6", "Apartment 12 Kitchen Closet - Iris Key", "progression"),
    ("map393_event012_page0_cmd6", "Flesh Elevator 1 - Iris Key", "progression"),
    ("map424_event008_page0_cmd6", "Flesh Ground Elevator - Iris Key", "progression"),
    ("map426_event001_page0_cmd6", "Flesh Outside - Iris Key", "progression"),
    ("map429_event001_page0_cmd6", "Flesh Grocery - Iris Key", "progression"),
    ("map277_event003_page0_cmd6", "Apartment 30 Northwest Room - Spirit Board", "useful"),
    ("map330_event011_page0_cmd6", "Eugene's Shop East Room - Elephant Statuette", "useful"),
    ("map071_event022_page0_cmd10", "Mailroom Office - Sun Disc", "progression"),
    ("map181_event003_page0_cmd10", "Landlord's Jupiter Room - Jupiter Disc", "progression"),
    ("map053_event002_page0_cmd4", "Corner Store Storage - Blank VHS Tape", "progression"),
    ("map071_event024_page0_cmd4", "Mailroom Office - Phone", "progression"),
    ("map112_event014_page0_cmd6", "Floor 2 Dark Room - Apartment 33 Key", "progression"),
    ("map136_event007_page0_cmd5", "Apartment 38 West Key Room - Midnight Valve", "progression"),
    ("map137_event006_page0_cmd5", "Apartment 38 West Closet - Twilight Valve", "progression"),
    ("map138_event006_page0_cmd5", "Apartment 38 East Closet - Abyssal Valve", "progression"),
    ("map147_event008_page0_cmd5", "Apartment 38 West Corridor Room - Hadal Valve", "progression"),
    ("map151_event006_page0_cmd5", "Apartment 38 South Corridor Key Room - Midnight Valve", "progression"),
    ("map161_event001_page0_cmd5", "Apartment 38 Third Block Key Room - Abyssal Valve", "progression"),
    ("map297_event005_page0_cmd5", "Apartment 18 Southeast Room - Electronic Key", "progression"),
    ("map360_event004_page0_cmd4", "Floor 1 Planetarium Lower Room - Telescope Pieces", "progression"),
    ("map006_event013_page0_cmd10", "Apartment 33 Planter - Spare Apartment 33 Key", "progression"),
    ("map060_event021_page0_cmd4", "Ground Floor Janitor's Room - Mackinaw Jacket", "useful"),
    ("map060_event022_page0_cmd4", "Ground Floor Janitor's Room - Arrowed Sash", "useful"),
    ("map064_event011_page0_cmd12", "Landlord's Bedroom - Old Uniform", "filler"),
    ("map069_event006_page0_cmd9", "Laundromat - Denim Vest", "filler"),
    ("map096_event007_page0_cmd4", "Floor 1 Apartment - Machete", "useful"),
    ("map098_event002_page0_cmd9", "Floor 1 Closet - Broom", "filler"),
    ("map102_event010_page0_cmd4", "Floor 1 Rat Apartment - Trench Coat", "useful"),
    ("map102_event013_page0_cmd9", "Floor 1 Rat Apartment - Denim Vest", "filler"),
    ("map102_event014_page0_cmd4", "Floor 1 Rat Apartment - Hoodie", "useful"),
    ("map280_event006_page0_cmd10", "Flesh Apartment 30 - Patchwork Boots", "useful"),
    ("map286_event023_page0_cmd6", "Apartment 20 East Bedroom - Studded Jacket", "useful"),
    ("map291_event006_page0_cmd9", "Floor 1 Rat Lair North - Cowboy Hat", "filler"),
    ("map308_event001_page0_cmd12", "Hell Car Lair - Hellsword", "useful"),
    ("map408_event010_page0_cmd5", "Flesh 3 Room - Biting Boots", "useful"),
    ("map421_event004_page0_cmd6", "Flesh Restroom - Goblin Claws", "useful"),
    ("map339_event012_page0_cmd5", "Basement Sideroom Hole - Azure Greatsword", "useful"),
    ("map415_event006_page0_cmd6", "Flesh Eye Left - Ocular Tetherblade", "useful"),
    ("map436_event008_page0_cmd5", "Teeth Tunnel - Jaw Revolver", "useful"),
    ("map436_event010_page0_cmd5", "Teeth Tunnel - Tooth Rifle", "useful"),
    ("map436_event011_page0_cmd5", "Teeth Tunnel - Tooth Scimitar", "useful"),
    ("map441_event005_page0_cmd6", "Unlit West Room - Ftblhelmt", "useful"),
    ("map443_event013_page0_cmd6", "Unlit Upper Room - Vnage ucky tieakeRs", "useful"),
    ("map448_event006_page0_cmd6", "Unlit East Room - RmyJcket", "useful"),
    ("map450_event004_page0_cmd6", "Unlit Center Room - Me[ttal Ba2t", "useful"),
    ("map465_event002_page0_cmd4", "Floor 4 Void - Voidblade", "useful"),
    ("map270_event018_page0_cmd6", "Apartment 30 - Taxidermy Dog", "filler"),
    ("map270_event019_page0_cmd6", "Apartment 30 - Taxidermy Eagle", "filler"),
    ("map275_event002_page0_cmd6", "Apartment 30 Northeast Room - Taxidermy Squirrel", "filler"),
    ("map275_event003_page0_cmd7", "Apartment 30 Northeast Room - Taxidermy Creature", "filler"),
    ("map372_event031_page0_cmd0", "Floor 2 Long Hall - Pool Cue", "filler"),
    ("map406_event016_page0_cmd0", "Unlit Main Room - black key", "progression"),
    ("map439_event009_page0_cmd0", "Unlit East Room - red key", "progression"),
    ("map439_event010_page0_cmd0", "Unlit East Room - yellow key", "progression"),
    ("map440_event012_page0_cmd0", "Unlit Center Room - blue key", "progression"),
    ("map442_event007_page0_cmd0", "Unlit West Lower Room - yellow key", "progression"),
    ("map443_event008_page0_cmd0", "Unlit West Upper Room - yellow key", "progression"),
    ("map444_event002_page0_cmd0", "Unlit West Lower Side Room - white key", "progression"),
    ("map446_event004_page0_cmd0", "Unlit East Upper Room - green key", "progression"),
)

# Exact game notices that refer to the same database item by another display
# name. The registry validator checks the text against the read-only game data.
MESSAGE_OVERRIDES = {
    "map053_event002_page0_cmd4": (7, r"Find \C[03]{Blank VHS Tape}\C[0]."),
    "map071_event024_page0_cmd4": (7, r"Receive \C[3]{Cell Phone}\C[0]!"),
    "map112_event014_page0_cmd6": (5, r"You find \C[3]{Apartment 33 Key}\C[0]."),
    "map136_event007_page0_cmd5": (7, r"You fid a \C[03]{Midnight Zone Valve}\C[0]."),
    "map137_event006_page0_cmd5": (7, r"You fid a \C[03]{Twilight Zone Valve}\C[0]."),
    "map138_event006_page0_cmd5": (7, r"You fid a \C[03]{Abyssal Zone Valve}\C[0]."),
    "map147_event008_page0_cmd5": (7, r"You fid a \C[03]{Hadal Zone Valve}\C[0]."),
    "map297_event005_page0_cmd5": (7, r"Find \C[03]{Electronic Car Key}\C[0]."),
    "map006_event013_page0_cmd10": (9, r"You find \C[3]{Apartment 33 Key}\C[0]."),
    "map102_event013_page0_cmd9": (12, r"Find \C[03]{Denim Jacket}\C[0]."),
    "map102_event014_page0_cmd4": (7, r"Find \C[03]{Button-Up Shirt}\C[0]."),
    "map286_event023_page0_cmd6": (5, r"Find \C[03]{A Studded Jacket}\C[0]."),
    "map408_event010_page0_cmd5": (7, r"Find \C[03]{Biting Boots}\C[0]."),
    "map421_event004_page0_cmd6": (5, r"You find \C[03]{Goblin Claws}\C[0]."),
}

SILENT_SOURCES = {
    "map372_event031_page0_cmd0",
    "map406_event016_page0_cmd0",
    "map439_event009_page0_cmd0",
    "map439_event010_page0_cmd0",
    "map440_event012_page0_cmd0",
    "map442_event007_page0_cmd0",
    "map443_event008_page0_cmd0",
    "map444_event002_page0_cmd0",
    "map446_event004_page0_cmd0",
}


def main() -> None:
    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))
    draft = json.loads(DRAFT.read_text(encoding="utf-8"))
    proposals = {row["key"]: row for row in draft["locations"]}
    locations = registry["locations"]
    items = registry["items"]
    existing = {row["ap_id"]: row for row in locations}
    item_by_id = {row["ap_id"]: row for row in items}
    added = 0
    updated = 0
    for source_key, location_name, classification in APPROVED:
        if int(source_key[3:6]) in VANILLA_FRIENDLY_LOCKED_MAPS:
            continue
        proposal = proposals[source_key]
        if proposal["reward_kind"] == "item" and proposal["reward_database_id"] in VANILLA_ITEM_SCOPE:
            continue
        if tuple(proposal[field] for field in ("map_id", "event_id", "page", "command_index")) in HARD_ONLY_PICKUPS:
            continue
        if proposal["reward_kind"] not in ("weapon", "armor", "item"):
            raise ValueError(f"Not a physical item source: {source_key}")
        item_name = proposal["name"].split(" - ", 1)[1]
        if source_key in SILENT_SOURCES:
            message = None
        elif source_key in MESSAGE_OVERRIDES:
            index, text = MESSAGE_OVERRIDES[source_key]
            message = {"index": index, "text": text}
        else:
            message = proposal["pickup_message"]
        if source_key not in SILENT_SOURCES and (not message or
                (source_key not in MESSAGE_OVERRIDES and
                           ("{" + item_name + "}" not in message["text"] or
                            not message["text"].startswith(("Find ", "You find ", "Found "))))):
            raise ValueError(f"Pickup notice needs review: {source_key}")
        if proposal["ap_id"] in existing:
            current = existing[proposal["ap_id"]]
            if current["map_id"] != proposal["map_id"] or \
                    current["event_id"] != proposal["event_id"]:
                raise ValueError(f"Location ID collision: {source_key}")
            if message and (current.get("message_index") != message["index"] or
                            current.get("message_text") != message["text"]):
                current["message_index"] = message["index"]
                current["message_text"] = message["text"]
                updated += 1
            continue
        location = {
            "key": source_key.removesuffix(f"_page{proposal['page']}_cmd{proposal['command_index']}"),
            "name": location_name,
            "ap_id": proposal["ap_id"],
            "map_id": proposal["map_id"],
            "event_id": proposal["event_id"],
            "page": proposal["page"],
            "command_index": proposal["command_index"],
            "command_code": proposal["command_code"],
            "reward_kind": proposal["reward_kind"],
            "reward_database_id": proposal["reward_database_id"],
        }
        if message:
            location["message_index"] = message["index"]
            location["message_text"] = message["text"]
        if source_key == "map006_event013_page0_cmd10":
            location["same_page_consumed_self_switch"] = "A"
        locations.append(location)
        existing[location["ap_id"]] = location
        item_base = {"item": 540000000, "weapon": 540100000, "armor": 540200000}[
            proposal["reward_kind"]]
        item = item_by_id.get(proposal["reward_database_id"] + item_base)
        if item:
            if item["classification"] != classification:
                raise ValueError(f"Classification conflict: {item['name']}")
            item["quantity"] += 1
        else:
            item = {
                "name": item_name,
                "ap_id": proposal["reward_database_id"] + item_base,
                "kind": proposal["reward_kind"],
                "database_id": proposal["reward_database_id"],
                "quantity": 1,
                "classification": classification,
            }
            items.append(item)
            item_by_id[item["ap_id"]] = item
        added += 1
    if not added and not updated:
        print("All approved pickups are already active")
        return
    registry["registry_version"] += 1
    if len({row["key"] for row in locations}) != len(locations):
        raise ValueError("Duplicate location key")
    if sum(item["quantity"] for item in items) != len(locations):
        raise ValueError("Item quantities differ from location count")
    locations.sort(key=lambda row: row["ap_id"])
    items.sort(key=lambda row: row["ap_id"])
    REGISTRY.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n",
                        encoding="utf-8")
    print(f"Promoted {added} fixed pickups and corrected {updated} notices; "
          f"{len(locations)} locations active")
    print("Item copies:", sum(item["quantity"] for item in items))


if __name__ == "__main__":
    main()
