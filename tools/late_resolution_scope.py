"""Fungus rescues, Darryl's victory, and the Spider Husk's resolution."""

FUNGUS_KEYS = ["jean_pierre_greatsword", "sylvain_elegant_cap", "claire_breastplate"]
RESCUES = [(347, 15, 25, 27, "weapon", 96, 5, 497),
           (348, 22, 26, 28, "armor", 245, 8, 494),
           (349, 24, 21, 23, "armor", 243, 6, 495)]


def locations():
    rows = []
    for n, (tid, eid, index, notice, kind, dbid, terminal, switch) in enumerate(RESCUES):
        item_name = ["Greatsword", "Elegant Cap", "Ornate Breastplate"][n]
        rows.append({"key": FUNGUS_KEYS[n], "name": ["Jean-Pierre", "Sylvain", "Claire"][n] + " Rescue - " + item_name,
            "ap_id": 592000150 + n, "map_id": 187, "event_id": eid, "troop_id": tid,
            "page": 1, "command_index": index, "command_code": 127 if kind == "weapon" else 128,
            "reward_kind": kind, "reward_database_id": dbid, "troop_consumption": {"type": "late_resolution"},
            "message_index": notice, "message_text": "Receive \\C[3]{" + item_name + "}\\C[0].",
            "quest_family": "fungus_rescue_resolution",
            **({"message_variants": [{"message_index": 39 if n == 0 else 42,
                 "message_text": "Receive \\C[3]{" + item_name + "}\\C[0].",
                 "ap_message": "Archipelago location checked."}]} if n < 2 else {})})
    rows.extend([
        {"key": "darryl_legs", "name": "Darryl Resolution - Antenniform Legs", "ap_id": 592000153,
         "map_id": 86, "event_id": 104, "troop_id": 615, "page": 7, "command_index": 10,
         "command_code": 127, "reward_kind": "weapon", "reward_database_id": 209,
         "troop_consumption": {"type": "late_resolution"},
         "message_index": 12, "message_text": "Receive \\C[3]{Antenniform Legs}\\C[0].",
         "quest_family": "darryl_resolution"},
        {"key": "spider_husk_heart", "name": "Spider Husk Resolution - Beating Heart", "ap_id": 592000154,
         "map_id": 56, "event_id": 41, "troop_id": 655, "page": 0, "command_index": 52,
         "command_code": 128, "reward_kind": "armor", "reward_database_id": 289,
         "required_variables": [{"id": 874, "value": 26}],
         "troop_consumption": {"type": "late_resolution"},
         "message_index": 54, "message_text": "You receive \\C[3]{Beating Heart}\\C[0].",
         "quest_family": "spider_husk_resolution"},
    ])
    return rows


def terminal(mid, eid, page, index, code, params, **extra):
    return {"map_id": mid, "event_id": eid, "page": page, "command_index": index,
            "command_code": code, "parameters": params, **extra}


def families():
    return [
        {"key": "fungus_rescue_resolution", "name": "Fungus Rescue Resolution",
         "location_keys": FUNGUS_KEYS,
         "completion_message": "Archipelago: fungus rescue rewards resolved.",
         "terminals": [
             *[terminal(187, eid, 1, index, 121, [switch, switch, 0], troop_id=tid,
                        location_keys=[FUNGUS_KEYS[n]],
                        completion_message="Archipelago: rescue checked.")
               for n, (tid, eid, _, _, _, _, index, switch) in enumerate(RESCUES)],
             terminal(127, 2, 1, 7, 121, [199, 199, 0]),
             terminal(83, 25, 0, 9, 121, [199, 199, 0]),
         ]},
        {"key": "darryl_resolution", "name": "Darryl Resolution", "location_keys": ["darryl_legs"],
         "resolve_on_acquisition": True,
         "completion_message": "Archipelago: Darryl resolved (1 check).",
         "terminals": [terminal(86, 104, page, 6, 121, [831, 831, 0]) for page in (0, 1)]},
        {"key": "spider_husk_resolution", "name": "Spider Husk Resolution", "location_keys": ["spider_husk_heart"],
         "resolve_on_acquisition": True,
         "completion_message": "Archipelago: Spider Husk resolved (1 check).",
         "terminals": [terminal(351, 7, 0, 6, 121, [1083, 1083, 0])]},
    ]


def check(commands, evidence, require, label):
    for index, code, params in evidence:
        require(commands[index]["code"] == code and commands[index]["parameters"] == params,
                f"{label} command{index} changed")


def validate_source(location, source, troops, require):
    expected = next((r for r in locations() if r["key"] == location["key"]), None)
    require(expected is not None and source == location == expected, "Late resolution source changed")
    c = troops[source["troop_id"]]["pages"][source["page"]]["list"]
    for notice in location.get("message_variants", []):
        check(c, [(notice["message_index"], 401, [notice["message_text"]])], require, "Alternate rescue notice")
    if location["key"] in FUNGUS_KEYS:
        n = FUNGUS_KEYS.index(location["key"])
        _, _, index, _, kind, dbid, terminal_index, switch = RESCUES[n]
        check(c, [(0, 111, [5, 0, 0]), (2, 411, []), (terminal_index, 121, [switch, switch, 0]),
                  (index, 127 if kind == "weapon" else 128, [dbid, 0, 0, 1, False])], require, "Rescue")
        require(all(row["indent"] >= 1 for row in c[3:index + 1]), "Rescue left defeated-fungus branch")
        if n < 2:
            check(c, [(11 if n == 0 else 12, 111, [4, 13, 0])], require, "Papineau-only native grant")
    elif location["key"] == "darryl_legs":
        check(c, [(0, 111, [0, 995, 0]), (10, 127, [209, 0, 0, 1, False]),
                  (17, 333, [0, 1, 3]), (18, 333, [0, 0, 1])], require, "Darryl")
    else:
        check(c, [(0, 111, [1, 874, 0, 25, 1]), (1, 111, [1, 874, 0, 25, 0]),
                  (2, 122, [874, 874, 0, 0, 26]), (52, 128, [289, 0, 0, 1, False]),
                  (103, 119, ["leave"])], require, "Husk gift")


def validate_resolutions(registry, data, read_json, require):
    troops = read_json(data / "Troops.json")
    for expected in locations():
        location = next(r for r in registry["locations"] if r["key"] == expected["key"])
        validate_source(location, location, troops, require)
    for family in families():
        require(next(r for r in registry["quest_families"] if r["key"] == family["key"]) == family,
                "Late quest resolution coverage changed")
        for t in family["terminals"]:
            c = (troops[t["troop_id"]]["pages"][t["page"]]["list"] if "troop_id" in t else
                 read_json(data / f"Map{t['map_id']:03d}.json")["events"][t["event_id"]]["pages"][t["page"]]["list"])
            check(c, [(t["command_index"], t["command_code"], t["parameters"])], require, family["key"])
    # Map terminals are after a successful battle, never its escape branch.
    for mid, eid, pages, tid, battle, finish in [(86, 104, [0, 1], 615, 1, 6), (351, 7, [0], 655, 4, 6)]:
        event = read_json(data / f"Map{mid:03d}.json")["events"][eid]
        for page in pages:
            c = event["pages"][page]["list"]
            check(c, [(battle, 301, [0, tid, True, False]), (battle + 1, 601, [])], require, "Victory")
            require(c[finish]["indent"] == c[battle]["indent"] + 1 and
                    not any(r["code"] in (602, 603, 604) for r in c[battle + 2:finish]), "Resolution left victory branch")
        consumed = 831 if mid == 86 else 1083
        require(any(p["conditions"]["switch1Valid"] and p["conditions"]["switch1Id"] == consumed
                    for p in event["pages"]), "Encounter lost consumed page")
    mother = read_json(data / "Map127.json")["events"][2]
    check(mother["pages"][1]["list"], [(1, 301, [0, 215, False, False])], require, "Mother")
    require(mother["pages"][2]["conditions"]["switch1Id"] == 199 and
            mother["pages"][2]["conditions"]["switch1Valid"], "Mother consumed state changed")
    # Ernest can expose the illusion earlier. This also closes the three rescues.
    reveal = read_json(data / "Map083.json")["events"][25]["pages"][0]["list"]
    check(reveal, [(2, 111, [4, 26, 0]), (3, 111, [1, 634, 0, 1, 1])], require, "Illusion reveal")
    for eid, flag in [(15, 516), (16, 516), (22, 517), (24, 518)]:
        event = read_json(data / "Map187.json")["events"][eid]
        check(event["pages"][0]["list"], [(0, 111, [0, flag, 1])], require, "Rescue encounter")
        require(event["pages"][1]["conditions"]["switch1Valid"] and
                event["pages"][1]["conditions"]["switch1Id"] == 199, "Revealed fungus no longer closes rescues")
