"""Juicebox's card trick advances permanently even when the player declines."""

CARD_KEY = "map006_event025_quest_pickup"


def juicebox_family():
    return {"key": "juicebox_card_resolution", "name": "Juicebox Card Trick",
            "location_keys": [CARD_KEY],
            "completion_message": "Archipelago: Juicebox's card trick resolved.",
            "terminals": [{"map_id": 2, "event_id": 48, "page": 0,
                           "command_index": 638, "command_code": 122,
                           "parameters": [287, 287, 1, 0, 1],
                           "required_variables": [{"id": 287, "value": 6}]}]}


def validate_juicebox(registry, data, read_json, require):
    commands = read_json(data / "Map002.json")["events"][48]["pages"][0]["list"]
    for index, code, params in (
        (545, 111, [1, 287, 0, 6, 0]),
        (551, 102, [["Yes? What is it?", "Maybe some other time?"], -1, 0, 2, 0]),
        (629, 122, [741, 741, 0, 0, 1]),
        (630, 122, [745, 745, 1, 0, 1]),
        (632, 402, [1, "Maybe some other time?"]),
        (634, 404, []), (637, 121, [400, 400, 0]),
        (638, 122, [287, 287, 1, 0, 1]), (639, 115, []),
    ):
        require(commands[index]["code"] == code and commands[index]["parameters"] == params,
                f"Juicebox card-trick branch changed at command {index}")
    require(commands[638]["indent"] == 1 and commands[634]["indent"] == 1,
            "Juicebox's irreversible advancement left the shared choice endpoint")
    family = next((row for row in registry["quest_families"] if row["key"] == "juicebox_card_resolution"), None)
    require(family == juicebox_family(), "Juicebox card resolution changed")
