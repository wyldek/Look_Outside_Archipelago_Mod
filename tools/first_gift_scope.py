"""First Metal Detector and the nonlethal Comatus duel reward.

Purchased detectors and Comatus's later training remain vanilla. These sources
have no mutually exclusive reward branches: leaving postpones the encounter.
"""


def first_gift_locations():
    return [
        {"key": "minesweeper_first_detector", "name": "Minesweeper - First Metal Detector",
         "ap_id": 592000140, "map_id": 240, "event_id": 13, "troop_id": 294, "page": 0,
         "command_index": 12, "command_code": 127, "reward_kind": "weapon",
         "reward_database_id": 122, "required_variables": [{"id": 354, "value": 0}],
         "troop_consumption": {"type": "first_gift"}, "message_index": 14,
         "message_text": "Receive \\C[3]{Metal Detector}\\C[0]."},
        {"key": "comatus_whisperblade", "name": "Comatus Duel - Whisperblade",
         "ap_id": 592000141, "map_id": 438, "event_id": 3, "troop_id": 207, "page": 12,
         "command_index": 14, "command_code": 127, "reward_kind": "weapon",
         "reward_database_id": 201, "required_switches": [{"id": 1174, "value": False}],
         "troop_consumption": {"type": "first_gift"}, "message_index": 16,
         "message_text": "Receive \\C[3]{Whisperblade}\\C[0]."},
    ]


def validate_first_gift(location, source, troops, data, read_json, require):
    expected = next((r for r in first_gift_locations() if r["key"] == location["key"]), None)
    require(expected is not None and location == source == expected, "First gift source changed")

    def check(commands, evidence):
        for index, code, params in evidence:
            c = commands[index]
            require(c["code"] == code and c["parameters"] == params,
                    f"First gift evidence changed: {location['key']} command{index}")

    commands = troops[source["troop_id"]]["pages"][source["page"]]["list"]
    if source["troop_id"] == 294:
        check(commands, [(6, 111, [1, 354, 0, 0, 0]), (12, 127, [122, 0, 0, 1, False]),
                         (51, 122, [354, 354, 0, 0, 1]), (53, 411, []), (57, 412, []),
                         (140, 125, [1, 0, 80]), (141, 127, [122, 0, 0, 1, False]),
                         (157, 125, [1, 0, 80]), (158, 127, [122, 0, 0, 1, False])])
        require(all(c["indent"] >= 1 for c in commands[7:53]), "Detector escaped first-meeting guard")
        event = read_json(data / "Map240.json")["events"][13]
        check(event["pages"][0]["list"], [(3, 301, [0, 294, True, False])])
    else:
        page = troops[207]["pages"][12]
        condition = page["conditions"]
        require(condition["enemyValid"] and condition["enemyIndex"] == 0 and condition["enemyHp"] == 2,
                "Comatus surrender threshold changed")
        check(commands, [(14, 127, [201, 0, 0, 1, False]), (18, 122, [960, 960, 0, 0, 10]),
                         (20, 122, [960, 960, 0, 0, 11]), (26, 121, [1174, 1174, 0]), (45, 340, [])])
        # After surrender, every future conversation exits before the fight.
        check(troops[207]["pages"][0]["list"], [(0, 111, [0, 1174, 0]),
              (80, 119, ["leave"]), (82, 412, []),
              (123, 102, [["Yes.", "No.", "I just want to talk."], -1, 0, 2, 0]),
              (131, 119, ["fight"]), (136, 119, ["leave"]),
              (235, 118, ["leave"]), (236, 340, []), (237, 118, ["fight"])])
        require(all(c["indent"] >= 1 for c in troops[207]["pages"][0]["list"][1:82]),
                "Comatus completed conversation left its guard")
        event = read_json(data / "Map438.json")["events"][3]
        check(event["pages"][0]["list"], [(0, 301, [0, 207, True, False])])
        require(event["pages"][1]["conditions"]["switch1Valid"] and
                event["pages"][1]["conditions"]["switch1Id"] == 1174, "Comatus post-duel page changed")
