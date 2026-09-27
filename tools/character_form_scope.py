"""Shared rewards for Clint's and Madison's mutually exclusive hostile forms."""

FORM_REWARDS = [
    ("clint_rags", "Clint Resolution - Rags", 592000100, "clint_resolution", 6, 27, 25, 29, "armor", 2),
    ("clint_tooth_knife", "Clint Resolution - Tooth Knife", 592000101, "clint_resolution", 435, 1, 737, 737, "weapon", 217),
    ("madison_tooth_hammer", "Madison Resolution - Tooth Hammer", 592000102, "madison_resolution", 435, 3, 739, 739, "weapon", 221),
]
FORM_ENCOUNTERS = [
    # family, map, event, pages, troop(s), shared defeated switch, terminal index
    ("clint_resolution", 6, 27, [0, 1], [25, 25], 545, 7),
    ("clint_resolution", 31, 35, [0, 1], [736, 736], 545, 7),
    ("clint_resolution", 435, 1, [0, 1], [737, 737], 545, 7),
    ("madison_resolution", 34, 20, [0, 1, 3], [28, 28, 738], 543, 7),
    ("madison_resolution", 435, 3, [0, 1], [739, 739], 543, 6),
]


def form_families():
    return [{"key": family, "name": name, "resolve_on_acquisition": True,
             "location_keys": [row[0] for row in FORM_REWARDS if row[3] == family],
             "terminals": [{"map_id": mid, "event_id": eid, "page": page,
                            "command_index": index, "command_code": 121, "parameters": [switch, switch, 0]}
                           for group, mid, eid, pages, troops, switch, index in FORM_ENCOUNTERS
                           if group == family for page in pages]}
            for family, name in [("clint_resolution", "Clint Resolution"), ("madison_resolution", "Madison Resolution")]]


def promote_form_rewards(registry, data, read_json):
    for key, name, ap_id, family, mid, eid, tid, enemy, kind, dbid in FORM_REWARDS:
        if any(row["key"] == key for row in registry["locations"]):
            continue
        registry["locations"].append({"key": key, "name": name, "ap_id": ap_id,
            "quest_family": family, "map_id": mid, "event_id": eid, "page": 0,
            "command_index": 1, "command_code": 301, "battle_parameters": [0, tid, True, False],
            "reward_kind": kind, "reward_database_id": dbid, "character_form_drop": True,
            "battle_drop": {"enemy_id": enemy, "drop_index": 0, "kind": 3 if kind == "armor" else 2,
                            "encounter_scope": "quest_resolution"},
            "source_variants": [{"map_id": mid, "event_id": eid, "page": 1,
                                 "command_index": 1, "command_code": 301, "battle_parameters": [0, tid, True, False]}]})
        item = next((row for row in registry["items"] if row["kind"] == kind and row["database_id"] == dbid), None)
        if item:
            item["quantity"] += 1
        else:
            database = read_json(data / ("Armors.json" if kind == "armor" else "Weapons.json"))
            registry["items"].append({"name": database[dbid]["name"], "kind": kind, "database_id": dbid,
                "ap_id": (540200000 if kind == "armor" else 540100000) + dbid, "quantity": 1,
                "classification": "filler" if kind == "armor" else "useful"})


def validate_form_source(location, source, data, read_json, require):
    definition = next(row for row in FORM_REWARDS if row[0] == location["key"])
    key, name, ap_id, family, mid, eid, tid, enemy, kind, dbid = definition
    require(location["quest_family"] == family and location["reward_kind"] == kind and
            location["reward_database_id"] == dbid and location["ap_id"] == ap_id and
            source["map_id"] == mid and source["event_id"] == eid and source["page"] in (0, 1) and
            source["command_index"] == 1 and source["command_code"] == 301 and
            source["battle_parameters"] == [0, tid, True, False] and
            location["battle_drop"] == {"enemy_id": enemy, "drop_index": 0,
                "kind": 3 if kind == "armor" else 2, "encounter_scope": "quest_resolution"},
            f"Character form reward changed: {key}")
    drop = read_json(data / "Enemies.json")[enemy]["dropItems"][0]
    require(drop == {"kind": 3 if kind == "armor" else 2, "dataId": dbid, "denominator": 1},
            f"Guaranteed character drop changed: {key}")
    members = read_json(data / "Troops.json")[tid]["members"]
    require(len(members) == 1 and members[0]["enemyId"] == enemy and not members[0]["hidden"],
            f"Character form troop changed: {key}")


def validate_form_encounters(registry, data, read_json, require):
    for key, *_ in FORM_REWARDS:
        location = next(row for row in registry["locations"] if row["key"] == key)
        require(len(location["source_variants"]) == 1 and location["source_variants"][0]["page"] == 1,
                f"Alternate form drop missing: {key}")
    for family, mid, eid, pages, tids, switch, index in FORM_ENCOUNTERS:
        event = read_json(data / f"Map{mid:03}.json")["events"][eid]
        for page, tid in zip(pages, tids):
            p = event["pages"][page]
            c = p["list"]
            require(p["trigger"] == 2 and c[1]["code"] == 301 and c[1]["parameters"] == [0, tid, True, False] and
                    c[2]["code"] == 601 and c[3]["code"] == 123 and
                    c[index]["code"] == 121 and c[index]["parameters"] == [switch, switch, 0] and
                    c[index]["indent"] == 1 and not any(row["code"] in (602, 603, 604) for row in c[3:index]),
                    f"Character form victory path changed: {mid}/{eid}/{page}")
            channel = c[3]["parameters"][0]
            require(any(q["conditions"]["selfSwitchValid"] and q["conditions"]["selfSwitchCh"] == channel
                        for q in event["pages"][page + 1:]), "Form encounter has no consumed page")
        if mid == 435 or mid == 31:
            require(event["pages"][3]["conditions"]["switch1Valid"] and
                    event["pages"][3]["conditions"]["switch1Id"] == switch,
                    "Earlier victory no longer hides the later form")
