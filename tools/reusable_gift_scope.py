"""Scout's Radio and Bright Frederic's reusable healing gift.

Only the original gifts are checks. Charged/tired forms and native recharges
remain local inventory transformations, including the real new-day cooldown.
"""


def reusable_locations():
    return [
        {"key": "scout_radio", "name": "Scout - Radio", "ap_id": 592000120,
         "map_id": 180, "event_id": 12, "troop_id": 295, "page": 0,
         "command_index": 43, "command_code": 126, "reward_kind": "item",
         "reward_database_id": 156, "reviewed_item_pickup": True,
         "required_variables": [{"id": 355, "value": 0}],
         "troop_consumption": {"type": "reusable_gift"},
         "message_index": 45, "message_text": "Receive \\C[3]{Radio}\\C[0]."},
        {"key": "bright_frederic_jar", "name": "Bright Frederic Resolution - Medic-in-a-jar",
         "ap_id": 592000121, "map_id": 218, "event_id": 2, "troop_id": 334, "page": 0,
         "command_index": 223, "command_code": 126, "reward_kind": "item",
         "reward_database_id": 4, "reviewed_item_pickup": True,
         # Stage6 is needed for the notice after command224 completes the gift.
         "required_variables": [{"id": 320, "values": [1, 5, 6]}],
         "troop_consumption": {"type": "reusable_gift"},
         "message_index": 226, "message_text": "Receive \\C[3]{Medic-in-a-jar}\\C[0]!",
         "quest_family": "bright_frederic_resolution"},
    ]


def bright_frederic_family():
    return {"key": "bright_frederic_resolution", "name": "Bright Frederic Resolution",
            "location_keys": ["bright_frederic_jar"], "resolve_on_acquisition": True,
            "completion_message": "Archipelago: Bright Frederic resolved (1 check).",
            "terminals": [
                # Refusing the completed quest's offer may be reconsidered later.
                # The AP check is awarded for either answer, without forcing it.
                {"map_id": 218, "event_id": 2, "troop_id": 334, "page": 0,
                 "command_index": 44, "command_code": 122, "parameters": [320, 320, 0, 0, 5],
                 "required_variables": [{"id": 320, "value": 1}]},
                {"map_id": 218, "event_id": 2, "page": 0, "command_index": 3,
                 "command_code": 122, "parameters": [320, 320, 0, 0, 99]},
            ]}


def validate_reusable_source(location, source, troops, require):
    expected = next((row for row in reusable_locations() if row["key"] == location["key"]), None)
    require(expected is not None and source == location == expected, "Reusable gift source changed")
    commands = troops[source["troop_id"]]["pages"][0]["list"]
    evidence = ([(6, 111, [1, 355, 0, 0, 0]), (43, 126, [156, 0, 0, 1]),
                 (46, 122, [456, 456, 0, 0, 8]), (47, 122, [355, 355, 0, 0, 1]),
                 (48, 121, [394, 394, 0]), (55, 340, [])] if source["troop_id"] == 295 else
                [(12, 111, [1, 320, 0, 0, 0]), (13, 122, [320, 320, 0, 0, 1]),
                 (28, 111, [1, 306, 0, 1, 2]), (29, 111, [1, 320, 0, 4, 2]),
                 (36, 102, [["Sure!", "No thanks..."], -1, 0, 2, 0]),
                 (38, 119, ["giveJar"]), (44, 122, [320, 320, 0, 0, 5]),
                 (207, 402, [2, "(([v[320]!=5]))Want to come along?"]),
                 (210, 118, ["giveJar"]), (223, 126, [4, 0, 0, 1]),
                 (224, 122, [320, 320, 0, 0, 6]), (239, 119, ["fight"]),
                 (249, 119, ["start"]), (251, 340, []), (252, 118, ["fight"])])
    for index, code, params in evidence:
        require(commands[index]["code"] == code and commands[index]["parameters"] == params,
                f"Reusable gift dialogue changed: {location['key']} command{index}")


def validate_reusable_gifts(registry, data, read_json, require):
    troops = read_json(data / "Troops.json")
    for expected in reusable_locations():
        location = next(row for row in registry["locations"] if row["key"] == expected["key"])
        validate_reusable_source(location, location, troops, require)
    for item_id, switches in [(156, [394]), (4, [])]:
        item = next(row for row in registry["items"] if row["kind"] == "item" and row["database_id"] == item_id)
        require(item["classification"] == "useful" and item["quantity"] == 1 and
                item.get("delivery_switches", []) == switches, "Reusable gift delivery changed")
    common = read_json(data / "CommonEvents.json")
    for cid, evidence in [
        (175, [(3, 111, [0, 393, 0]), (4, 122, [456, 456, 0, 0, 0]),
               (5, 121, [395, 395, 0]), (6, 126, [155, 0, 0, 1]), (7, 126, [156, 1, 0, 1])]),
        (5, [(179, 111, [8, 155]), (180, 122, [456, 456, 1, 0, 1]),
             (181, 111, [1, 456, 0, 8, 1]), (182, 126, [155, 1, 0, 1]), (183, 126, [156, 0, 0, 1])]),
        (193, [(0, 111, [8, 4]), (1, 126, [4, 1, 0, 1]), (2, 126, [372, 0, 0, 1])]),
        (6, [(142, 111, [8, 372]), (143, 126, [372, 1, 0, 1]), (144, 126, [4, 0, 0, 1])]),
        (11, [(2, 121, [393, 393, 1]), (3, 121, [394, 394, 1]),
              (9, 111, [8, 156]), (10, 121, [394, 394, 0])]),
    ]:
        for index, code, params in evidence:
            command = common[cid]["list"][index]
            require(command["code"] == code and command["parameters"] == params,
                    f"Reusable gift cooldown changed: CE{cid} command{index}")
    encounter = read_json(data / "Map218.json")["events"][2]
    for index, code, params in [(1, 301, [0, 334, True, False]), (2, 601, []),
                                (3, 122, [320, 320, 0, 0, 99]), (5, 123, ["C", 0]), (10, 602, [])]:
        command = encounter["pages"][0]["list"][index]
        require(command["code"] == code and command["parameters"] == params,
                "Bright Frederic victory/escape branch changed")
    require(encounter["pages"][1]["conditions"]["selfSwitchValid"] and
            encounter["pages"][1]["conditions"]["selfSwitchCh"] == "C", "Frederic consumed page changed")
