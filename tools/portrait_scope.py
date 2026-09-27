"""Evidence for one Stained Key check with peaceful and hostile alternatives."""

# The six green parts share variable 318. These pages are alternative encounters
# with those parts, not independent key copies. The hat agreement also gives the
# key; attacking after that agreement stays vanilla under the friendly-kill rule.
GREEN_KEY_SOURCES = (
    (42, 6, (1,), 341),
    (96, 3, (0, 1, 2), 338),
    (119, 13, (0, 1, 2, 4, 5), 332),
    (119, 15, (0, 1), 332),
    (119, 16, (0, 1), 332),
    (217, 7, (0, 1, 2), 338),
    (217, 8, (0, 1, 2), 342),
    (236, 16, (0, 1, 2), 338),
    (236, 18, (0, 1), 338),
    (236, 19, (0, 1, 2), 339),
    (237, 14, (0, 1, 2), 340),
)


def validate_green_key(location, source, game_map, require):
    signature = (source["map_id"], source["event_id"], source["page"])
    troop = next((troop for mid, eid, pages, troop in GREEN_KEY_SOURCES
                  if signature[:2] == (mid, eid) and signature[2] in pages), None)
    require(location["key"] == "green_portrait_stained_key" and troop is not None,
            "Unreviewed green portrait source")
    event = game_map["events"][source["event_id"]]
    commands = event["pages"][source["page"]]["list"]
    grant = 13 if source["map_id"] == 119 else 10
    self_index = 7 if source["map_id"] == 119 else 4
    require(source["command_index"] == grant and source["command_code"] == 126 and
            source["required_variables"] == [{"id": 313, "value": 99}] and
            source["required_switches"] == [{"id": 186, "value": False}],
            "Green portrait source lost its hostile outcome guard")
    for index, code, params in (
        (1, 301, [0, troop, True, False]), (2, 601, []),
        (3, 122, [318, 318, 1, 0, 1]), (self_index, 123, ["C", 0]),
        (grant - 3, 111, [1, 318, 0, 6, 1]),
        (grant - 2, 122, [306, 306, 2, 0, 1]),
        (grant - 1, 122, [313, 313, 0, 0, 99]),
        (grant, 126, [294, 0, 0, 1]),
    ):
        command = commands[index]
        require(command["code"] == code and command["parameters"] == params,
                f"Green portrait shared reward changed: {signature} command {index}: {command}")
    require(commands[1]["indent"] == commands[2]["indent"] == 0 and
            all(c["indent"] > 0 for c in commands[3:grant + 1]) and
            commands[grant - 3]["indent"] == 1 and commands[grant]["indent"] == 2,
            "Green portrait key left the final-part victory branch")
    # Every physical part has a higher-priority death page. Some use its global
    # part-death switch instead of the local C flag.
    require(any((pg["conditions"]["selfSwitchValid"] and
                 pg["conditions"]["selfSwitchCh"] == "C") or
                (pg["conditions"]["switch1Valid"] and
                 pg["conditions"]["switch1Id"] in (523, 524, 525))
                for pg in event["pages"][source["page"] + 1:]),
            "Green part no longer has a consumed page")
