"""Cross-event consumption and transformation evidence for three hostile drops."""


def validate_advanced_drop(location, source, data_dir, read_json, require):
    mid, eid, page = (source[k] for k in ("map_id", "event_id", "page"))
    game_map = read_json(data_dir / f"Map{mid:03d}.json")
    commands = game_map["events"][eid]["pages"][page]["list"]
    if location["battle_drop"]["enemy_id"] == 28:
        require((mid, eid, page, source["command_index"]) == (34, 13, 0, 6), "Baby Teeth moved")
        for i, code, params in ((2, 111, [0, 108, 0]), (3, 111, [0, 107, 0]),
                               (6, 301, [0, 24, True, True]), (7, 601, []),
                               (9, 121, [107, 107, 1]), (13, 121, [544, 544, 0])):
            require(commands[i]["code"] == code and commands[i]["parameters"] == params,
                    "Baby Teeth completion guard changed")
        trigger = game_map["events"][3]["pages"]
        require(trigger[0]["list"][36] == {"code": 121, "indent": 0, "parameters": [107, 107, 0]} and
                trigger[0]["list"][37] == {"code": 123, "indent": 0, "parameters": ["A", 0]} and
                trigger[1]["conditions"]["selfSwitchValid"] and
                trigger[1]["conditions"]["selfSwitchCh"] == "A",
                "Baby Teeth one-time activation changed")
    elif location["battle_drop"]["enemy_id"] == 889:
        require((mid, eid, page, source["command_index"]) == (463, 5, 0, 1), "First Head moved")
        for i, code, params in ((1, 301, [0, 746, True, False]), (2, 601, []),
                               (3, 121, [1206, 1206, 0]), (4, 201, [0, 462, 8, 15, 0, 0])):
            require(commands[i]["code"] == code and commands[i]["parameters"] == params,
                    "First Head exit changed")
        entrance = read_json(data_dir / "Map462.json")["events"][1]["pages"][0]["list"]
        for i, code, params in ((0, 111, [0, 1206, 0]), (1, 201, [0, 406, 34, 34, 0, 0]),
                               (3, 411, []), (4, 201, [0, 463, 28, 11, 0, 0])):
            require(entrance[i]["code"] == code and entrance[i]["parameters"] == params,
                    "First Head consumed access changed")
    else:
        require(False, "Unreviewed cross-event drop completion")


def validate_suture_transform(drop, troop, require):
    require(drop["enemy_id"] == 450 and troop["id"] == 441 and
            troop["members"][0]["enemyId"] == 445 and not troop["members"][0]["hidden"],
            "Suture Wire initial enemy changed")
    phase = troop["pages"][2]
    require(phase["conditions"]["enemyValid"] and phase["conditions"]["enemyIndex"] == 0 and
            phase["conditions"]["enemyHp"] == 10 and phase["list"][2]["code"] == 336 and
            phase["list"][2]["parameters"] == [0, 450], "Suture Wire transformation changed")
    require(troop["pages"][0]["list"][13]["parameters"] == [0, 0, 3] and
            troop["pages"][3]["list"][33]["parameters"] == [0, 1, 3] and
            troop["pages"][3]["list"][34]["parameters"] == [0, 0, 1],
            "Suture Wire native phase death changed")
