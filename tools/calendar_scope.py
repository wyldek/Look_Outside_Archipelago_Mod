"""Reviewed deadlines in the native Normal-mode map graph."""

import json


TEETH_DEADLINE_KEYS = frozenset({
    "map031_event009_frying_pan", "map031_event030_hoodie",
    "map032_event009_mop", "map033_event007_baseball_cap",
    "map034_event019", "map034_event024_complex", "map034_event025_tank_top",
    "boss_drop_28_143",
})
TEETH_EXPIRY = {
    "day": 4, "hour": 12, "closed_switch": 1062,
    "group": "Original teeth apartment",
    "description": "The entrance closes at noon on Day 4. The apartment that opens later does not contain these pickups.",
}


def validate_calendar_sources(data_dir):
    """Check the timer, page priority, and every external entry to the old rooms."""
    def read(name):
        return json.loads((data_dir / name).read_text(encoding="utf-8"))

    def require(condition, message):
        if not condition:
            raise ValueError(message)

    floor = read("Map006.json")
    timer = floor["events"][29]["pages"][0]["list"]
    for index, code, parameters in (
        (1, 111, [1, 15, 0, 4, 0]), (2, 111, [1, 16, 0, 12, 1]),
        (3, 111, [0, 1062, 1]),
        (4, 111, [12, "$gameMap.event(this.eventId()).checkPlayerProx(4,0)"]),
        (5, 121, [1062, 1062, 0]),
    ):
        require(timer[index]["code"] == code and timer[index]["parameters"] == parameters,
                f"Teeth apartment closing timer changed at {index}")
    pages = floor["events"][7]["pages"]
    require(len(pages) == 11, "Teeth apartment entrance page count changed")
    for page, day in ((1, 1), (2, 3), (3, 4), (4, 4), (5, 4),
                      (6, 5), (7, 8), (8, 8), (9, 8), (10, 9)):
        conditions = pages[page]["conditions"]
        require(conditions["variableValid"] and conditions["variableId"] == 15 and
                conditions["variableValue"] == day, f"Teeth door day condition changed: {page}")
        if page in (4, 5):
            require(conditions["switch1Valid"] and conditions["switch1Id"] == 1062,
                    "Teeth door closed page changed")
    for page in (4, 5, 6, 7, 8):
        require(not any(c["code"] == 201 for c in pages[page]["list"]),
                "Closed teeth door gained a transfer")
    for page in (9, 10):
        command = pages[page]["list"][0]
        require(command["code"] == 201 and command["parameters"][1] == 435,
                "Late teeth apartment destination changed")
    external_entries = set()
    for path in data_dir.glob("Map[0-9][0-9][0-9].json"):
        map_id = int(path.stem[3:])
        if map_id in (31, 32, 33, 34):
            continue
        for event in read(path.name)["events"]:
            if not event:
                continue
            for page_index, page in enumerate(event["pages"]):
                for index, command in enumerate(page["list"]):
                    if command["code"] == 201 and command["parameters"][1] in (31, 32, 33, 34):
                        external_entries.add((map_id, event["id"], page_index, index))
    require(external_entries == {(6, 7, 1, 0), (6, 7, 2, 0), (6, 7, 3, 0)},
            f"Original teeth apartment has changed entry routes: {external_entries}")


def validate_calendar_registry(registry, data_dir):
    validate_calendar_sources(data_dir)
    locations = {entry["key"]: entry for entry in registry["locations"]}
    if not TEETH_DEADLINE_KEYS <= locations.keys():
        raise ValueError("An audited teeth deadline location is missing")
    for key, location in locations.items():
        if key in TEETH_DEADLINE_KEYS:
            if location.get("expiry") != TEETH_EXPIRY or location.get("missable") is not True:
                raise ValueError(f"Missing deadline / filler-only placement: {key}")
            sources = (location, *location.get("source_variants", []))
            if any(source["map_id"] not in (31, 32, 33, 34) for source in sources):
                raise ValueError(f"Deadline location has a new recovery source: {key}")
        elif "expiry" in location:
            raise ValueError(f"Unreviewed deadline metadata: {key}")
