"""Fixed persistent item drops and High Five's early consumed-state alternative."""

WATCH_KEY = "boss_drop_293_280"
BOILER_MAPS = (189, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203,
              219, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254)


def high_five_family():
    return {"key": "high_five_resolution", "name": "High Five Resolution",
            "location_keys": [WATCH_KEY], "resolve_on_acquisition": True,
            "terminals": [{"map_id": 70, "event_id": 57, "page": 1,
                           "command_index": 51, "command_code": 121,
                           "parameters": [433, 433, 0]}]}


def definitions():
    # enemy, drop slot, item, name, map/event/page/battle/consumed-write/page
    watch = [(70, eid, page, battle, completion, 3)
             for eid, battle, completion in ((57, 61, 65), (58, 41, 46),
                                             (59, 24, 30), (60, 23, 30), (71, 4, 12))
             for page in (0, 1)]
    watch[1] = (70, 57, 1, 62, 66, 3)
    return [
        (293, 0, 280, "High Five Resolution - Watch", watch),
        (415, 0, 379, "Pipe Man Misery - Plumbing Tools",
         [(197, 17, page, 1, 3, 3) for page in (0, 1)]),
        (424, 1, 379, "Boiler Beast - Plumbing Tools",
         [(mid, 3, 1, 0, 2, 4) for mid in BOILER_MAPS] + [(256, 10, 2, 1, 3, 4)]),
    ]


def validate_fixed_collectibles(registry, data, read_json, require):
    rows = {r["key"]: r for r in registry["locations"]}
    for enemy, slot, item, name, evidence in definitions():
        key = f"boss_drop_{enemy}_{item}"
        row = rows.get(key, {})
        require(row.get("reward_kind") == "item" and row.get("reward_database_id") == item and
                row.get("battle_drop") == {"enemy_id": enemy, "drop_index": slot, "kind": 1,
                                          "encounter_scope": "hostile_boss"},
                f"Fixed collectible drop changed: {key}")
        sources = [row, *row.get("source_variants", [])]
        require([(s["map_id"], s["event_id"], s["page"], s["command_index"],
                  s["battle_completion"]["command_index"], s["battle_completion"]["consumed_page"])
                 for s in sources] == evidence, f"Fixed collectible alternatives changed: {key}")
    family = next((r for r in registry["quest_families"] if r["key"] == "high_five_resolution"), None)
    require(family == high_five_family() and rows[WATCH_KEY].get("quest_family") == family["key"],
            "High Five early-resolution coverage changed")
    commands = read_json(data / "Map070.json")["events"][57]["pages"][1]["list"]
    for index, code, params in [(42, 301, [0, 219, True, False]), (43, 601, []),
                                (51, 121, [433, 433, 0]), (55, 602, [])]:
        require(commands[index]["code"] == code and commands[index]["parameters"] == params,
                f"High Five early defeat branch changed: {index}")
    troop = read_json(data / "Troops.json")[225]
    require(troop["members"][4]["enemyId"] == 293 and troop["members"][4]["hidden"],
            "High Five hidden enemy moved")
    for index, code, params in [(17, 111, [0, 433, 1]), (18, 335, [4])]:
        c = troop["pages"][0]["list"][index]
        require(c["code"] == code and c["parameters"] == params, "High Five appearance guard changed")
