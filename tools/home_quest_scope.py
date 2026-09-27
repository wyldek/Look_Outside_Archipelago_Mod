"""Permanent invitation refusals for Hellen and Dan, preserving native stages."""

HELLEN_KEY = "map433_event009_quest_pickup"
DAN_KEY = "map016_event003_quest_item"


def common_terminal(cid, index, variable, before, after):
    return {"map_id": 6, "event_id": 1, "page": 0, "common_event_id": cid,
            "command_index": index, "command_code": 122,
            "parameters": [variable, variable, 0, 0, after],
            "required_variables": [{"id": variable, "value": before}]}


def home_quest_families():
    return [
        {"key": "hellen_resolution", "name": "Hellen Resolution",
         "location_keys": [HELLEN_KEY], "resolve_on_acquisition": True,
         "terminals": [common_terminal(235, index, 869, 3, -1) for index in (40, 48)] + [
             {"map_id": 433, "event_id": 9, "page": 2, "command_index": 39,
              "command_code": 122, "parameters": [869, 869, 0, 0, 100],
              "required_variables": [{"id": 869, "value": 18}]}]},
        {"key": "dan_resolution", "name": "Dan Resolution",
         "location_keys": [DAN_KEY], "resolve_on_acquisition": True,
         "terminals": [common_terminal(237, 54, 896, 0, 1),
                       common_terminal(237, 62, 896, 10, 100)]},
    ]


def validate_home_quests(registry, data, read_json, require):
    families = {row["key"]: row for row in registry["quest_families"]}
    locations = {row["key"]: row for row in registry["locations"]}
    common = read_json(data / "CommonEvents.json")
    for expected in home_quest_families():
        require(families.get(expected["key"]) == expected, "Home quest resolution changed")
        require(locations[expected["location_keys"][0]].get("quest_family") == expected["key"],
                "Home quest reward is unlinked")
    # Native return-home dispatch: Hellen stage2 and healthy plant; Dan has
    # Basement Key, level7 and untouched stage0. No clock or quest-stage edits.
    proof = {
        3: [(330, 111, [1, 869, 0, 2, 0]), (331, 111, [1, 128, 0, 80, 1]),
            (333, 117, [235]), (341, 111, [8, 303]), (343, 111, [1, 1, 0, 7, 1]),
            (344, 111, [1, 896, 0, 0, 0]), (345, 117, [237])],
        235: [(4, 122, [869, 869, 0, 0, 3]),
              (37, 402, [1, "No thanks."]), (40, 122, [869, 869, 0, 0, -1]),
              (45, 402, [2, "I'd rather not. Sorry."]), (48, 122, [869, 869, 0, 0, -1])],
        237: [(0, 111, [1, 896, 0, 0, 0]), (39, 122, [896, 896, 0, 0, 2]),
              (48, 119, ["danaccept"]), (50, 402, [1, "I really can't, Dan."]),
              (54, 122, [896, 896, 0, 0, 1]), (62, 122, [896, 896, 0, 0, 100])],
    }
    for cid, commands in proof.items():
        for index, code, params in commands:
            c = common[cid]["list"][index]
            require(c["code"] == code and c["parameters"] == params,
                    f"Home quest invitation changed: CE{cid} command{index}")
