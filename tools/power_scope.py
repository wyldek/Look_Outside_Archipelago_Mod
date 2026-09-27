"""Audited power outage, fuse-box check, and restoration effects."""


def validate_power_source(location, source, data_dir, read_json, require):
    require(location["key"] == "power_restoration" and
            (source["map_id"], source["event_id"], source["page"], source["command_index"]) == (369, 24, 0, 10) and
            source["command_code"] == 121 and location["reward_kind"] == "switch" and
            location["reward_database_id"] == 987, "Power restoration source changed")
    event = read_json(data_dir / "Map369.json")["events"][24]
    commands = event["pages"][0]["list"]
    for index, code, params in (
        (0, 101, ["", 0, 0, 2, ""]),
        (1, 401, ["The main fuse box of the building. Restore power?"]),
        (2, 102, [["Yes.", "No."], -1, 0, 2, 0]), (3, 402, [0, "Yes."]),
        (9, 250, [{"name": "RestorePower", "volume": 90, "pitch": 100, "pan": 0}]),
        (10, 121, [987, 987, 0]), (11, 121, [21, 21, 0]),
        (12, 121, [984, 984, 1]), (13, 121, [986, 986, 1]), (14, 117, [64]),
    ):
        require(commands[index]["code"] == code and commands[index]["parameters"] == params,
                f"Fuse-box command changed: {index}")
    require(event["pages"][1]["conditions"]["switch1Valid"] and
            event["pages"][1]["conditions"]["switch1Id"] == 987,
            "Fuse-box consumed page changed")
    require(source["message_index"] == 1 and source["message_text"] == commands[1]["parameters"][0],
            "Fuse-box prompt changed")
    common = read_json(data_dir / "CommonEvents.json")
    for index, code, params in (
        (25, 111, [0, 830, 0]), (26, 121, [21, 21, 1]), (27, 121, [830, 830, 1]),
        (28, 121, [181, 181, 1]),
        (32, 250, [{"name": "Blackout", "volume": 50, "pitch": 100, "pan": -60}]),
        (34, 122, [940, 940, 0, 0, 0]),
    ):
        command = common[16]["list"][index]
        require(command["code"] == code and command["parameters"] == params,
                f"Native outage sequence changed: {index}")
    start = read_json(data_dir / "Map005.json")["events"][2]["pages"][0]["list"][145]
    require(start["code"] == 121 and start["parameters"] == [21, 21, 0],
            "Vanilla starting power changed")
    # Power can return before the player sees the dark-basement intro. These
    # exact encounter pages are the narrow runtime exception to its phase gate.
    for mid, eid, troop, terminal_index, terminal_code, terminal_params in (
        (50, 11, 614, 4, 123, ["C", 0]),
        (86, 104, 615, 6, 121, [831, 831, 0]),
    ):
        pages = read_json(data_dir / f"Map{mid:03}.json")["events"][eid]["pages"]
        first = pages[0]
        require(len(pages) == 4, "Post-outage encounter gained an unreviewed page")
        for index, page in enumerate(pages):
            condition = page["conditions"]
            require(condition["variableValid"] == (mid == 86 or index == 0),
                    "Post-outage encounter phase gate changed")
            if condition["variableValid"]:
                require(condition["variableId"] == 740 and condition["variableValue"] == 1,
                        "Post-outage encounter phase threshold changed")
        require(first["conditions"]["variableValid"] and first["conditions"]["variableId"] == 740 and
                first["conditions"]["variableValue"] == 1 and first["trigger"] == 2 and
                first["list"][1]["code"] == 301 and first["list"][1]["parameters"] == [0, troop, True, False] and
                first["list"][2]["code"] == 601 and
                first["list"][terminal_index]["code"] == terminal_code and
                first["list"][terminal_index]["parameters"] == terminal_params,
                "Post-outage encounter or victory signature changed")
        consumed = pages[3]["conditions"]
        require((mid == 50 and consumed["selfSwitchValid"] and consumed["selfSwitchCh"] == "C") or
                (mid == 86 and consumed["switch1Valid"] and consumed["switch1Id"] == 831),
                "Post-outage encounter consumed page changed")
