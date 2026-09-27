"""Rat Freak's hostile victory and crown interaction resolve one AP check."""

RAT_CLAWS_KEY = "map106_event011_complex"


def rat_freak_family():
    return {"key": "rat_freak_resolution", "name": "Rat Freak Resolution",
            "location_keys": [RAT_CLAWS_KEY],
            "completion_message": "Archipelago: Rat Freak resolved.",
            "terminals": [
                {"map_id": 106, "event_id": 11, "page": page, "command_index": index,
                 "command_code": 123, "parameters": [switch, 0]}
                for page, index, switch in [(0, 4, "C"), (1, 4, "C"), (3, 6, "D")]]}


def validate_rat_freak(registry, data, read_json, require):
    source = next(row for row in registry["locations"] if row["key"] == RAT_CLAWS_KEY)
    family = next((row for row in registry["quest_families"] if row["key"] == "rat_freak_resolution"), None)
    require(family == rat_freak_family() and source.get("quest_family") == family["key"],
            "Rat Freak must share the hostile/peaceful resolution")
    pages = read_json(data / "Map106.json")["events"][11]["pages"]
    for page in (0, 1):
        for index, code, params in [(2, 301, [0, 110, True, False]), (3, 601, []),
                                    (4, 123, ["C", 0]), (8, 602, []), (9, 123, ["B", 0])]:
            require(pages[page]["list"][index]["code"] == code and
                    pages[page]["list"][index]["parameters"] == params,
                    f"Rat Freak victory/escape changed on page{page} command{index}")
    require(pages[3]["conditions"]["switch1Id"] == 351 and
            pages[3]["conditions"]["switch1Valid"], "Native crown interaction changed")
    require(pages[4]["conditions"]["selfSwitchValid"] and
            pages[4]["conditions"]["selfSwitchCh"] == "C", "Rat Freak death page changed")
