"""The Electronic Key's common event contains one fixed shotgun pickup."""


def car_trunk_location():
    return {"key": "car_trunk_shotgun", "name": "Garage Car Trunk - Shotgun",
            "ap_id": 592000130, "map_id": 86, "event_id": 59, "page": 0,
            "common_event_id": 60, "command_index": 31, "command_code": 128,
            "reward_kind": "armor", "reward_database_id": 140,
            "required_variables": [{"id": 1, "value": 86}],
            "message_index": 36,
            "message_text": "Find \\C[3]Shotgun\\C[0] and 12x \\C[3]{Shotgun Shell}\\C[0].",
            "ap_message": "Archipelago location checked. Find 12x \\C[3]{Shotgun Shell}\\C[0]."}


def validate_car_trunk(location, source, common, data, read_json, require):
    require(location == source == car_trunk_location(), "Car trunk source changed")
    commands = common[60]["list"]
    for index, code, params in [
        (3, 122, [1, 1, 0, 3, 7, 0, 0]), (4, 111, [1, 1, 0, 86, 0]),
        (20, 111, [0, 601, 1]), (21, 111, [12, "$gameMap.event(59).checkPlayerProx(5,-1)"]),
        (28, 121, [601, 601, 0]), (31, 128, [140, 0, 0, 1, False]),
        (32, 126, [184, 0, 0, 12]), (33, 122, [124, 124, 1, 0, 1]),
        (36, 401, [location["message_text"]]),
    ]:
        command = commands[index]
        require(command["code"] == code and command["parameters"] == params,
                f"Car trunk grant/gate changed at command{index}")
    require(commands[31]["indent"] == 3 and commands[28]["indent"] == 3 and
            all(c["indent"] >= 3 for c in commands[22:38]), "Trunk gift left its guarded branch")
    key = read_json(data / "Items.json")[364]
    require(any(effect["code"] == 44 and effect["dataId"] == 60 for effect in key["effects"]),
            "Electronic Key no longer calls the trunk common event")
    car = read_json(data / "Map086.json")["events"][22]
    require(car["pages"][2]["conditions"]["selfSwitchValid"] and
            car["pages"][2]["conditions"]["selfSwitchCh"] == "B", "Open trunk visual changed")
    moves = commands[23]["parameters"][1]["list"]
    require(commands[23]["code"] == 205 and commands[23]["parameters"][0] == 22 and
            moves[0]["code"] == 45 and moves[0]["parameters"] == ['this.sOn("B");'],
            "Trunk no longer opens its native car visual")
