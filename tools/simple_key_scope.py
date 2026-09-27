"""Approved fixed Simple Key sources; repeatable grants remain vanilla."""

PICKUPS = (
    # map, event, grant, notice, consumed command, public area
    (25, 2, 5, 7, 4, "Apartment 36 Bedroom"),
    (54, 39, 5, 7, 4, "Corner Store"),
    (61, 3, 6, 5, 7, "Ground Floor Janitor Closet"),
    (89, 2, 4, 7, 5, "Floor 3 Janitor Closet"),
    (99, 17, 4, 7, 5, "Eye Apartment"),
    (272, 4, 5, 7, 4, "Garage Side Room"),
    (291, 19, 5, 7, 4, "Rat Lair North"),
    (303, 23, 5, 7, 4, "Basement Storage"),
)
DROP_SOURCES = (
    # enemy, drop slot, map, event, pages, battle, consumed command/page, name
    (130, 0, 355, 43, (0, 1, 2), 1, 3, 3, "Kaeley - Simple Key"),
    (153, 1, 94, 11, (1,), 7, 9, 2, "Nestor Resolution - Simple Key"),
)
NESTOR_KEY = "simple_key_drop_153"
NESTOR_FAMILY = "nestor_key_resolution"
ORDINARY_LOCKS = {
    (11, 9), (25, 3), (34, 24), (35, 24), (53, 8), (64, 8), (73, 8),
    (79, 3), (109, 12), (119, 14), (258, 17), (275, 7), (296, 5), (333, 26),
    *((355, eid) for eid in (1, 2, 3, 6, 7, 8, 11, 12, 13, 15, 16, 17)),
}


def nestor_family():
    # Later bodies have no native key drop. All three body victories share the
    # early body's check so waiting does not remove it or create extra copies.
    return {"key": NESTOR_FAMILY, "name": "Nestor Resolution",
            "location_keys": [NESTOR_KEY], "resolve_on_acquisition": True,
            "terminals": [
                {"map_id": 94, "event_id": 11, "page": page, "command_index": index,
                 "command_code": 121, "parameters": [switch, switch, 0]}
                for page, index, switch in ((1, 9, 421), (3, 10, 448))
            ] + [{"map_id": 94, "event_id": 40, "page": 0, "common_event_id": 183,
                  "command_index": 10, "command_code": 121, "parameters": [448, 448, 0]}]}


def validate_simple_keys(registry, data, read_json, require):
    found = set()
    direct_losses = set()
    for path in data.glob("Map[0-9][0-9][0-9].json"):
        mid = int(path.stem[3:])
        for event in read_json(path)["events"]:
            if event is None:
                continue
            for index, page in enumerate(event["pages"]):
                for ci, command in enumerate(page["list"]):
                    if command["code"] == 117 and command["parameters"] == [184]:
                        found.add((mid, event["id"]))
                        opened = event["pages"][1]["conditions"]
                        require(index == 0 and len(event["pages"]) == 2 and
                                opened["selfSwitchValid"] and
                                opened["selfSwitchCh"] == ("B" if mid == 355 else "A"),
                                "Ordinary lock no longer stays open")
                    if command["code"] == 126 and command["parameters"][:2] == [320, 1]:
                        direct_losses.add((mid, event["id"], index, ci))
    require(found == ORDINARY_LOCKS and len(found) == 26, "Ordinary lock budget changed")
    require(direct_losses == {(48, 14, 0, 16)}, "Additional direct Simple Key consumption")
    # This older door page is permanently shadowed by its unconditional exit.
    shadow = read_json(data / "Map048.json")["events"][14]["pages"][1]
    require(not any(v for k, v in shadow["conditions"].items() if k.endswith("Valid")),
            "Formerly shadowed Simple Key door became active")
    locations = [r for r in registry["locations"]
                 if r["reward_kind"] == "item" and r["reward_database_id"] == 320]
    keys = {f"simple_key_map{mid:03}_event{eid:03}" for mid, eid, *_ in PICKUPS}
    keys |= {f"simple_key_drop_{row[0]}" for row in DROP_SOURCES}
    require({r["key"] for r in locations} == keys and len(locations) == 10,
            "Simple Key scope must be eight fixed pickups and two drops")
    items = [r for r in registry["items"] if r["kind"] == "item" and r["database_id"] == 320]
    require(len(items) == 1 and items[0]["quantity"] == 10 and
            items[0]["name"] == "Simple Keys (3)" and items[0].get("delivery_amount") == 3 and
            items[0]["classification"] == "progression" and items[0]["ap_id"] == 540000320,
            "Simple Key item pool changed")
    by_key = {r["key"]: r for r in locations}
    for mid, eid, grant, notice, consumed, _ in PICKUPS:
        location = by_key[f"simple_key_map{mid:03}_event{eid:03}"]
        require(location.get("simple_key_source") == "pickup" and
                (location["map_id"], location["event_id"], location["page"], location["command_index"]) ==
                (mid, eid, 0, grant) and location["message_index"] == notice and
                not location.get("source_variants"), "Simple Key pickup moved")
        event = read_json(data / f"Map{mid:03}.json")["events"][eid]
        page = event["pages"][0]
        require(len(event["pages"]) == 2 and
                not any(value for key, value in page["conditions"].items() if key.endswith("Valid")),
                "Fixed Simple Key pickup gained an unreviewed condition")
        require(page["list"][grant]["parameters"] == [320, 0, 0, 1] and
                page["list"][consumed] == {"code": 123, "indent": 1, "parameters": ["A", 0]} and
                event["pages"][1]["conditions"]["selfSwitchValid"] and
                event["pages"][1]["conditions"]["selfSwitchCh"] == "A",
                "Simple Key pickup consumption changed")
    for enemy, slot, mid, eid, pages, battle, completion, consumed, _ in DROP_SOURCES:
        location = by_key[f"simple_key_drop_{enemy}"]
        require(location.get("simple_key_source") == "drop" and location["battle_drop"] == {
            "enemy_id": enemy, "drop_index": slot, "kind": 1,
            "encounter_scope": "approved_simple_key_drop"}, "Unapproved Simple Key drop")
        sources = [location, *location.get("source_variants", [])]
        require(len(sources) == len(pages), "Simple Key drop alternatives changed")
        for source, page in zip(sources, pages):
            require((source["map_id"], source["event_id"], source["page"], source["command_index"]) ==
                    (mid, eid, page, battle) and source["battle_completion"]["command_index"] == completion and
                    source["battle_completion"]["consumed_page"] == consumed,
                    "Simple Key drop source changed")
    require(next((f for f in registry["quest_families"] if f["key"] == NESTOR_FAMILY), None) == nestor_family()
            and by_key[NESTOR_KEY].get("quest_family") == NESTOR_FAMILY,
            "Nestor must share one key check across body forms")
    event = read_json(data / "Map094.json")["events"][11]
    for page, index, tid, terminal, consumed in ((1, 7, 555, 9, 2), (3, 8, 556, 10, 4)):
        commands = event["pages"][page]["list"]
        switch = 421 if page == 1 else 448
        require(commands[index] == {"code": 301, "indent": 1, "parameters": [0, tid, True, False]} and
                commands[index + 1] == {"code": 601, "indent": 1, "parameters": []} and
                commands[terminal] == {"code": 121, "indent": 2, "parameters": [switch, switch, 0]} and
                event["pages"][consumed]["conditions"]["switch1Valid"] and
                event["pages"][consumed]["conditions"]["switch1Id"] == switch,
                "Nestor body victory/consumption changed")
    common = read_json(data / "CommonEvents.json")
    require(common[184]["list"][50] == {"code": 123, "indent": 1, "parameters": ["A", 0]} and
            common[184]["list"][51] == {"code": 126, "indent": 1, "parameters": [320, 1, 0, 1]},
            "Ordinary lock key consumption changed")
    require(items[0]["quantity"] * items[0]["delivery_amount"] >= len(ORDINARY_LOCKS),
            "AP pool cannot guarantee enough keys for every ordinary lock")
    commands = common[183]["list"]
    require(commands[7] == {"code": 301, "indent": 1, "parameters": [0, 557, True, False]} and
            commands[8] == {"code": 601, "indent": 1, "parameters": []} and
            commands[10] == {"code": 121, "indent": 2, "parameters": [448, 448, 0]},
            "Nestor mound victory changed")
    game_map = read_json(data / "Map094.json")
    for eid in (40, 41, 42):
        pages = game_map["events"][eid]["pages"]
        require(pages[0]["list"][0] == {"code": 117, "indent": 0, "parameters": [183]} and
                pages[1]["conditions"]["switch1Valid"] and pages[1]["conditions"]["switch1Id"] == 448,
                "Nestor mound interaction/consumption changed")
    # These grant sites share item320 but must never be registered as checks.
    require(common[107]["list"][280] == {"code": 126, "indent": 2, "parameters": [320, 0, 0, 1]},
            "Random Simple Key grant moved")
    shop = read_json(data / "Troops.json")[78]["pages"][0]["list"]
    for index in (137, 147, 155):
        require(shop[index]["code"] == 126 and shop[index]["parameters"] == [320, 0, 0, 1],
                "Purchased Simple Key grant moved")
