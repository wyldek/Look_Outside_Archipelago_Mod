"""Audited native decisions that commit the player to an ending route."""

import json


# Choice indices, defaults, cancellation and native branches are retained.
ENDING_CHOICES = [
    dict(mapId=113, eventId=4, pageIndex=0, commandIndex=5,
         parameters=[["Yes. Let's go.", "No. I need more time."], -1, 0, 2, 0],
         choices=["Yes (no return).", "No. I need more time."]),
    dict(mapId=169, eventId=2, pageIndex=1, commandIndex=53,
         parameters=[["Say the Word of Power.", "What is my reward?", "I won't say it."], -1, 0, 2, 0],
         choices=["Say the Word (ending).", "What is my reward?", "I won't say it."]),
    dict(mapId=169, eventId=2, pageIndex=1, commandIndex=75,
         parameters=[["Say the Word of Power.", "No."], -1, 0, 2, 0],
         choices=["Say the Word (ending).", "No."]),
    dict(mapId=362, eventId=3, pageIndex=0, commandIndex=6,
         parameters=[["Yes.", "No."], -1, 1, 2, 0],
         choices=["Read (begin ending).", "No."]),
]


def validate_ending_warnings(data_dir):
    cache = {}

    def page(mid, eid, pg):
        if mid not in cache:
            cache[mid] = json.loads((data_dir / f"Map{mid:03}.json").read_text(encoding="utf-8"))
        return cache[mid]["events"][eid]["pages"][pg]

    for entry in ENDING_CHOICES:
        commands = page(entry["mapId"], entry["eventId"], entry["pageIndex"])["list"]
        command = commands[entry["commandIndex"]]
        assert command["code"] == 102 and command["parameters"] == entry["parameters"], entry
        assert len(entry["choices"]) == len(entry["parameters"][0]), entry
        # Every original branch still uses the same index and label.
        branches = [c["parameters"] for c in commands[entry["commandIndex"] + 1:]
                    if c["code"] == 402 and c["indent"] == command["indent"]]
        assert branches[:len(entry["choices"])] == list(map(list, enumerate(entry["parameters"][0]))), entry

    for mid, eid, pg, index, code, params in [
        (113, 4, 0, 58, 201, [0, 114, 72, 17, 0, 2]),
        (169, 2, 1, 60, 201, [0, 431, 8, 6, 0, 0]),
        (169, 2, 1, 80, 201, [0, 431, 8, 6, 0, 0]),
        (362, 3, 0, 65, 121, [1000, 1000, 0]),
        (362, 4, 0, 26, 201, [0, 171, 1, 0, 0, 0]),
    ]:
        c = page(mid, eid, pg)["list"][index]
        assert c["code"] == code and c["parameters"] == params, (mid, eid, pg, index)
    for eid, pg in [(1, 1), (4, 0)]:
        condition = page(362, eid, pg)["conditions"]
        assert condition["switch1Valid"] and condition["switch1Id"] == 1000
