"""Validate generation calendar boundaries against read-only native event data."""

import argparse
import hashlib
import json
from pathlib import Path

from calendar_scope import validate_calendar_sources


def validate_chronology(data):
    cache = {}
    signatures = 0

    def read(name):
        if name not in cache:
            cache[name] = json.loads((data / (name + ".json")).read_text(encoding="utf-8"))
        return cache[name]

    def commands(name, eid, page=0):
        entry = read(name)["events"][eid] if name.startswith("Map") else read(name)[eid]
        return entry["list"] if name == "CommonEvents" else entry["pages"][page]["list"]

    def check(name, eid, page, index, code, params):
        nonlocal signatures
        command = commands(name, eid, page)[index]
        if command["code"] != code or command["parameters"] != params:
            raise ValueError(f"Chronology source changed: {name}/{eid}/{page}/{index}")
        signatures += 1

    def gate(mid, eid, page, variable, threshold):
        nonlocal signatures
        cond = read(f"Map{mid:03}")["events"][eid]["pages"][page]["conditions"]
        if not (cond["variableValid"] and cond["variableId"] == variable and cond["variableValue"] == threshold):
            raise ValueError(f"Chronology page gate changed: {mid}/{eid}/{page}")
        signatures += 1

    validate_calendar_sources(data)
    for eid, page, threshold in ((7, 1, 1), (2, 1, 2), (8, 1, 4), (7, 7, 8), (7, 9, 8), (7, 10, 9)):
        gate(6, eid, page, 15, threshold)
    for index, code, params in (
        (40, 111, [1, 15, 0, 8, 0]), (41, 111, [1, 16, 0, 6, 1]),
        (42, 111, [0, 1062, 0]), (44, 121, [1062, 1062, 1]),
    ):
        check("Map006", 29, 0, index, code, params)
    check("Map006", 7, 7, 10, 123, ["B", 0])
    check("Map006", 7, 9, 0, 201, [0, 435, 38, 1, 0, 0])
    gate(6, 83, 0, 15, 3)
    check("Map006", 83, 0, 43, 122, [904, 904, 0, 0, 1])
    gate(6, 33, 1, 904, 1)
    check("Map006", 33, 1, 8, 122, [904, 904, 0, 0, 2])
    gate(6, 33, 2, 904, 2)
    check("Map006", 33, 2, 7, 201, [0, 353, 16, 3, 0, 0])
    for name, eid in (("Map006", 87), ("Map086", 105)):
        check(name, eid, 0, 1, 111, [1, 15, 0, 7, 1])
        check(name, eid, 0, 3, 121, [1097, 1097, 0])
    check("Map272", 7, 0, 0, 111, [0, 1097, 0])
    check("Map272", 7, 0, 1, 201, [0, 399, 23, 7, 0, 0])
    check("Map272", 7, 0, 4, 201, [0, 339, 23, 7, 0, 0])
    check("Troops", 590, 0, 233, 111, [1, 15, 0, 5, 2])
    check("Troops", 590, 0, 309, 126, [360, 1, 0, 1])
    check("Troops", 590, 0, 310, 121, [680, 680, 0])
    check("CommonEvents", 6, 0, 616, 111, [0, 680, 0])
    check("CommonEvents", 6, 0, 617, 121, [677, 677, 0])
    check("CommonEvents", 213, 0, 11, 111, [0, 677, 0])
    check("CommonEvents", 213, 0, 60, 201, [0, 400, 13, 22, 0, 0])
    check("CommonEvents", 3, 0, 356, 111, [8, 389])
    check("CommonEvents", 3, 0, 359, 122, [900, 900, 0, 0, 1])
    check("CommonEvents", 3, 0, 360, 126, [389, 1, 0, 1])
    for test_index, write_index, stage in ((629, 630, 1), (635, 636, 3), (641, 642, 5), (647, 649, 7)):
        check("CommonEvents", 6, 0, test_index, 111, [1, 900, 0, stage, 0])
        check("CommonEvents", 6, 0, write_index, 122, [900, 900, 0, 0, stage + 1])
    check("CommonEvents", 6, 0, 648, 111, [0, 34, 0])
    for index, stage in ((137, 3), (157, 5), (176, 7), (197, 9)):
        check("CommonEvents", 233, 0, index, 122, [900, 900, 0, 0, stage])
    check("CommonEvents", 125, 0, 0, 111, [1, 15, 0, 15, 1])
    check("CommonEvents", 125, 0, 1, 115, [])
    check("CommonEvents", 125, 0, 4, 111, [1, 900, 0, 9, 0])
    check("CommonEvents", 125, 0, 47, 122, [900, 900, 0, 0, 20])
    gate(7, 4, 3, 900, 20)
    check("Map007", 4, 3, 10, 201, [0, 434, 9, 12, 0, 0])
    check("Map003", 20, 0, 0, 111, [1, 15, 0, 15, 1])
    check("Map003", 20, 0, 1, 115, [])
    for index, var, value in ((584, 904, 5), (585, 905, 1), (586, 906, 1),
                              (591, 907, 1), (592, 908, 1), (597, 909, 1), (598, 910, 1)):
        check("CommonEvents", 6, 0, index, 122, [var, var, 0, 0, value])
    for index, stage in ((321, 2), (325, 4), (329, 6)):
        check("CommonEvents", 6, 0, index, 122, [150, 150, 0, 0, stage])
    for index, stage in ((8, 1), (328, 3), (427, 5)):
        check("Troops", 18, 0, index, 122, [150, 150, 0, 0, stage])
    gate(6, 40, 1, 150, 6)
    gate(2, 48, 0, 213, 2)
    check("CommonEvents", 6, 0, 87, 121, [400, 400, 1])
    check("CommonEvents", 6, 0, 269, 122, [213, 213, 1, 0, 1])
    for index, code, params in ((24, 111, [0, 400, 0]), (545, 111, [1, 287, 0, 6, 0]),
                                 (637, 121, [400, 400, 0]), (638, 122, [287, 287, 1, 0, 1])):
        check("Map002", 48, 0, index, code, params)
    return {"validated_signatures": signatures, "charan_last_start": 5,
            "leigh_last_start": 10, "leigh_new_days": 4,
            "source_sha256": {name: hashlib.sha256((data / (name + ".json")).read_bytes()).hexdigest()
                              for name in sorted(cache)}}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(validate_chronology(args.game_dir / "data"), indent=2))
