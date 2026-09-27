"""Sybil's peaceful reveal reconciles the checks unique to her Oracle route."""

SYBIL_KEYS = ["map367_event001_quest_reward", "map348_event005"]


def sybil_family():
    return {"key": "sybil_resolution", "name": "Sybil Resolution",
            "location_keys": SYBIL_KEYS,
            "completion_message": "Archipelago: Sybil resolved (2 checks).",
            "terminals": [
                # Runs only after the native repaired-telescope branch's CE226
                # finishes. Ordinary conversation/first combat reveal is not final.
                {"map_id": 364, "event_id": 10, "troop_id": 16, "page": 0,
                 "command_index": 215, "command_code": 121, "parameters": [5, 5, 0]},
                {"map_id": 367, "event_id": 1, "page": 1,
                 "command_index": 10, "command_code": 121, "parameters": [975, 975, 0]},
            ]}


def validate_sybil(registry, data, read_json, require):
    family = next((row for row in registry["quest_families"] if row["key"] == "sybil_resolution"), None)
    require(family == sybil_family(), "Sybil resolution coverage changed")
    for key in SYBIL_KEYS:
        row = next(row for row in registry["locations"] if row["key"] == key)
        require(row.get("quest_family") == family["key"], "Unlinked Sybil resolution check")
    troop = read_json(data / "Troops.json")[16]["pages"][0]["list"]
    for index, code, params in [(213, 111, [1, 6, 0, 387, 0]), (214, 117, [226]),
                                (215, 121, [5, 5, 0]), (216, 119, ["leave"])]:
        require(troop[index]["code"] == code and troop[index]["parameters"] == params,
                f"Sybil telescope branch changed at {index}")
    common = read_json(data / "CommonEvents.json")[226]["list"]
    for index, code, params in [(2, 126, [387, 1, 0, 1]), (3, 121, [970, 970, 0])]:
        require(common[index]["code"] == code and common[index]["parameters"] == params,
                "Sybil's native telescope consumption/reveal changed")
    oracle = read_json(data / "Map367.json")["events"][1]["pages"][1]["list"]
    for index, code, params in [(1, 301, [0, 682, True, False]), (2, 601, []),
                                (7, 126, [388, 0, 0, 1]), (10, 121, [975, 975, 0]), (14, 602, [])]:
        require(oracle[index]["code"] == code and oracle[index]["parameters"] == params,
                "Oracle's native victory/escape branch changed")
