"""Audited choice-independent character quest resolutions."""

from character_form_scope import form_families, validate_form_encounters
from juicebox_scope import juicebox_family, validate_juicebox
from rat_freak_scope import rat_freak_family, validate_rat_freak
from sybil_scope import sybil_family, validate_sybil
from home_quest_scope import home_quest_families, validate_home_quests
from fixed_collectible_scope import high_five_family, validate_fixed_collectibles
from reusable_gift_scope import bright_frederic_family, validate_reusable_gifts
from late_resolution_scope import families as late_families, validate_resolutions as validate_late_resolutions

JOEL_KEYS = ["joel_peaceful_door_knob", "joel_resolution_toothy_whip"]
FREDERIC_KEYS = ["frederic_painters_key", "frederic_canvas_bag", "frederic_paint_palette"]
PIERRE_KEYS = ["pierre_clown_drawing", "pierre_old_mail", "pierre_clown_wig"]
JASPER_KEYS = ["jasper_apartment_key", "ritual_roof_key", "ritual_dark_robes"]
BENJAMIN_KEYS = ["benjamin_game", "benjamin_pendant"]
SHADOW_KEYS = ["shadow_tongue", "map006_event040_complex", "map006_event040_quest_item"]
RESOLUTION_KEYS = {"joel_resolution", "pierre_mail_resolution", "frederic_resolution",
                   "jasper_resolution", "benjamin_playtime", "shadow_gift", "mutt_resolution", "tickle_resolution",
                   "clint_resolution", "madison_resolution", "juicebox_card_resolution", "rat_freak_resolution", "sybil_resolution",
                   "hellen_resolution", "dan_resolution", "high_five_resolution", "bright_frederic_resolution",
                   "fungus_rescue_resolution", "darryl_resolution", "spider_husk_resolution"}


def terminal(mid, eid, page, index, code, parameters, troop=None, **extra):
    return {"map_id": mid, "event_id": eid, "page": page, "command_index": index,
            "command_code": code, "parameters": parameters,
            **({"troop_id": troop} if troop is not None else {}), **extra}


def resolution_families():
    return [
        *form_families(),
        juicebox_family(),
        rat_freak_family(),
        sybil_family(),
        *home_quest_families(),
        high_five_family(),
        bright_frederic_family(),
        *late_families(),
        {"key": "joel_resolution", "name": "Joel Resolution", "location_keys": JOEL_KEYS,
         "resolve_on_acquisition": True, "completion_message": "Archipelago: Joel Resolution complete (2 checks).",
         "terminals": [
             {"map_id": 32, "event_id": 7, "troop_id": 26, "page": 0, "command_index": 346,
              "command_code": 121, "parameters": [33, 33, 0], "required_variables": [{"id": 107, "value": 20}]},
             *[{"map_id": 435, "event_id": 2, "page": page, "command_index": 6,
                "command_code": 121, "parameters": [541, 541, 0]} for page in (0, 1)],
         ]},
        {"key": "pierre_mail_resolution", "name": "Pierre Resolution", "location_keys": PIERRE_KEYS,
         "terminals": [
             terminal(356, 2, 5, 101, 340, [], 19, required_variables=[{"id": 617, "value": 20}]),
             terminal(356, 2, 1, 5, 123, ["A", 0]),
             terminal(356, 2, 1, 13, 122, [617, 617, 0, 0, 17],
                      required_variables=[{"id": 617, "value": 16}]),
             terminal(356, 2, 1, 45, 122, [617, 617, 0, 0, 17]),
             {"map_id": 3, "event_id": 9, "troop_id": 80, "page": 0,
                        "command_index": 219, "command_code": 122, "parameters": [51, 51, 0, 0, 0],
                        "required_variables": [{"id": 617, "values": [6, 10]}],
                        "location_keys": ["pierre_old_mail"],
                        "completion_message": "Archipelago: Pierre's mail visit resolved."}]},
        {"key": "frederic_resolution", "name": "Frederic Resolution", "location_keys": FREDERIC_KEYS,
         "terminals": [
             terminal(96, 12, 0, 229, 122, [305, 305, 0, 0, 5], 327,
                      required_variables=[{"id": 305, "value": 4}]),
             *[terminal(96, 12, page, 18, 122, [305, 305, 0, 0, 99]) for page in range(3)],
             terminal(96, 12, 0, 178, 122, [305, 305, 0, 0, 3], 327,
                      required_variables=[{"id": 305, "value": 2}], location_keys=FREDERIC_KEYS[:2])]},
        {"key": "jasper_resolution", "name": "Jasper Resolution", "location_keys": JASPER_KEYS,
         "terminals": [
             terminal(65, 9, 0, 595, 121, [206, 206, 0], 124),
             terminal(65, 9, 0, 6, 121, [172, 172, 0])]},
        {"key": "benjamin_playtime", "name": "Benjamin Resolution", "location_keys": BENJAMIN_KEYS,
         "terminals": [
             terminal(33, 2, 0, 635, 122, [110, 110, 0, 0, 5], 27,
                      required_variables=[{"id": 110, "value": 4}]),
             *[terminal(33, 2, page, 8, 121, [542, 542, 0]) for page in [0, 1, 2, 4, 5]],
             terminal(435, 4, 0, 5, 121, [542, 542, 0]),
             terminal(435, 4, 0, 236, 340, [], 742)]},
        {"key": "shadow_gift", "name": "Masked Shadow Resolution", "location_keys": SHADOW_KEYS,
         "terminals": [
             *[terminal(6, 40, page, 9 if page == 7 else 8, 123, ["A", 0]) for page in range(3, 8)],
             terminal(6, 40, 0, 546, 404, [], 18, required_variables=[{"id": 150, "value": 5}],
                      location_keys=["shadow_tongue"], completion_message="Archipelago: Shadow's tongue gift resolved."),
             terminal(6, 40, 0, 739, 340, [], 18, required_variables=[{"id": 150, "values": [10, 20]}])]},
        {"key": "mutt_resolution", "name": "Mutt Resolution", "location_keys": ["mutt_vending_key"],
         "terminals": [terminal(56, 26, 2, 4, 121, [317, 317, 0])]},
        {"key": "tickle_resolution", "name": "Tickle Resolution", "location_keys": ["tickle_drawing"],
         "terminals": [terminal(189, 18, 0, index, 121, [661, 661, 0]) for index in (3, 23)]},
    ]


def validate_choice_resolutions(registry, data_dir, read_json, require):
    validate_late_resolutions(registry, data_dir, read_json, require)
    validate_reusable_gifts(registry, data_dir, read_json, require)
    validate_fixed_collectibles(registry, data_dir, read_json, require)
    validate_home_quests(registry, data_dir, read_json, require)
    validate_sybil(registry, data_dir, read_json, require)
    validate_rat_freak(registry, data_dir, read_json, require)
    validate_form_encounters(registry, data_dir, read_json, require)
    validate_juicebox(registry, data_dir, read_json, require)
    families = {row["key"]: row for row in registry["quest_families"]}
    locations = {row["key"]: row for row in registry["locations"]}
    troops = read_json(data_dir / "Troops.json")
    knob = locations[JOEL_KEYS[0]]
    whip = locations[JOEL_KEYS[1]]
    require(len(knob.get("source_variants", [])) == 4 and
            {source["page"] for source in knob["source_variants"]} == set(range(4)) and
            len(whip.get("source_variants", [])) == 1 and whip["source_variants"][0]["page"] == 1,
            "Joel resolution lost an alternate reward source")
    bag = locations["frederic_canvas_bag"]
    require(len(bag.get("source_variants", [])) == 3 and
            {source["page"] for source in bag["source_variants"]} == {0, 1, 2},
            "Frederic resolution lost an alternate bag source")
    for expected in resolution_families():
        require(families.get(expected["key"]) == expected, f"Resolution coverage changed: {expected['key']}")
        for key in expected["location_keys"]:
            require(locations[key].get("quest_family") == expected["key"], f"Unlinked resolution reward: {key}")
        for terminal in expected["terminals"]:
            require(set(terminal.get("location_keys", expected["location_keys"])) <= set(expected["location_keys"]),
                    "Partial resolution contains a reward from another quest")
            if "troop_id" in terminal:
                commands = troops[terminal["troop_id"]]["pages"][terminal["page"]]["list"]
            elif "common_event_id" in terminal:
                commands = read_json(data_dir / "CommonEvents.json")[terminal["common_event_id"]]["list"]
            else:
                event = read_json(data_dir / f"Map{terminal['map_id']:03}.json")["events"][terminal["event_id"]]
                commands = event["pages"][terminal["page"]]["list"]
            command = commands[terminal["command_index"]]
            require(command["code"] == terminal["command_code"] and command["parameters"] == terminal["parameters"],
                    f"Resolution terminal changed: {terminal}")
    def command(tid, page, index, code, params):
        value = troops[tid]["pages"][page]["list"][index]
        require(value["code"] == code and value["parameters"] == params,
                f"Resolution evidence changed: troop {tid} page {page} command {index}")
    # Hug/step-back and the native Attack fall-through all reach the same gift.
    for index, code, params in [(0, 111, [1, 107, 0, 6, 0]), (1, 111, [5, 0, 1, 8]),
                               (9, 102, [["Hug him.", "Step back.", "Attack!"], 1, 0, 2, 0]),
                               (15, 122, [107, 107, 0, 0, 8]), (35, 353, []),
                               (42, 122, [107, 107, 0, 0, 8]), (45, 122, [107, 107, 0, 0, 7]),
                               (47, 119, ["fight"]), (52, 126, [310, 0, 0, 1]),
                               (55, 340, []), (60, 118, ["Fight"])]:
        command(26, 1, index, code, params)
    for index, code, params in [(344, 122, [107, 107, 0, 0, 20]), (345, 121, [784, 784, 0]),
                               (346, 121, [33, 33, 0]), (349, 129, [4, 0, True])]:
        command(26, 0, index, code, params)
    # Accepting, refusing, and leaving all close this one-time visit.
    for index, code, params in [(6, 122, [617, 617, 0, 0, 6]), (35, 119, ["LeaveEyehole"]),
                               (42, 102, [["Yes.", "No."], -1, 0, 2, 0]),
                               (49, 119, ["LeaveEyehole"]), (61, 122, [617, 617, 0, 0, 7]),
                               (74, 126, [285, 0, 0, 1]), (214, 122, [617, 617, 0, 0, 10]),
                               (217, 118, ["LeaveEyehole"]), (218, 121, [24, 24, 1]), (220, 340, [])]:
        command(80, 0, index, code, params)
    # Frederic's final portrait reward and Jasper's irreversible departure.
    for index, code, params in [(221, 111, [1, 306, 0, 1, 2]), (222, 111, [1, 305, 0, 4, 0]),
                               (229, 122, [305, 305, 0, 0, 5]), (230, 128, [271, 0, 0, 1, False])]:
        command(327, 0, index, code, params)
    for index, code, params in [(588, 102, [["I am ready.", "Hold on..."], 1, 0, 2, 0]),
                               (595, 121, [206, 206, 0]), (597, 126, [314, 0, 0, 1]),
                               (598, 128, [23, 0, 0, 1, False]), (599, 119, ["leave"])]:
        command(124, 0, index, code, params)
    # Pierre's finale can also end by retreat or a survivable defeat. Ordinary
    # retreats before the final stage leave his quest available and are not terminals.
    command(19, 5, 2, 122, [617, 617, 0, 0, 20])
    command(19, 5, 94, 128, [52, 0, 0, 1, False])
    pierre = read_json(data_dir / "Map356.json")["events"][2]["pages"][1]["list"]
    require(pierre[3]["parameters"] == [0, 19, True, True] and
            pierre[9]["code"] == 602 and pierre[10]["parameters"] == [1, 617, 0, 16, 0] and
            pierre[29]["code"] == 603 and pierre[37]["code"] == 313 and pierre[38]["code"] == 311,
            "Pierre's survivable final retreat/defeat routes changed")
    # Benjamin's later encounter offers peaceful exits regardless of childhood
    # playtime choices. Only reaching its dialogue endpoint completes old rewards.
    command(742, 0, 20, 102, [["Yes.", "No."], -1, 0, 2, 0])
    command(742, 0, 220, 102, [["(Leave it alone.)", "(Attack!)"], 0, -1, 2, 0])
    command(742, 0, 228, 119, ["fight"])
    command(742, 0, 235, 118, ["leave"])
    command(742, 0, 237, 118, ["fight"])
    command(18, 0, 452, 102, [["Take it.", "Refuse it."], 1, 0, 2, 0])
    command(18, 0, 546, 404, [])
    command(18, 0, 710, 122, [150, 150, 0, 0, 20])
    command(18, 0, 724, 122, [150, 150, 0, 0, 10])
    command(18, 0, 730, 122, [150, 150, 0, 0, 10])
    shadow = read_json(data_dir / "Map006.json")["events"][40]
    require(shadow["pages"][8]["conditions"]["selfSwitchCh"] == "A" and
            shadow["pages"][8]["conditions"]["selfSwitchValid"], "Shadow's gift is no longer consumed")
    for page in range(3, 8):
        conditions = shadow["pages"][page]["conditions"]
        require(conditions["switch1Valid"] and conditions["switch1Id"] == 161 and
                (page == 3 or (conditions["variableValid"] and conditions["variableId"] == 155 and
                               conditions["variableValue"] == (page - 3) * 2)),
                "Shadow's alternative gift outcome changed")
    tickle = read_json(data_dir / "Map189.json")["events"][18]["pages"][0]["list"]
    require(tickle[9]["parameters"] == [0, 672, 0] and tickle[23]["indent"] == 1,
            "Tickle attachment terminal changed")
    command(415, 0, 142, 121, [672, 672, 0])
    command(415, 0, 145, 119, ["leave"])
    # These map terminals are inside victory branches, followed by a consumed
    # page or a permanent native flag. They never fire on an ordinary escape.
    for mid, eid, pages, battle, consumed, params in [
        (96, 12, range(3), 3, 23, ["D", 0]),
        (65, 9, [0], 3, 6, [172, 172, 0]),
        (33, 2, [0, 1, 2, 4, 5], 2, 8, [542, 542, 0]),
        (435, 4, [0], 2, 5, [542, 542, 0]),
        (56, 26, [2], 2, 4, [317, 317, 0]),
        (189, 18, [0], 1, 3, [661, 661, 0]),
    ]:
        event = read_json(data_dir / f"Map{mid:03}.json")["events"][eid]
        for page in pages:
            commands = event["pages"][page]["list"]
            require(commands[battle]["code"] == 301 and commands[battle + 1]["code"] == 601 and
                    commands[consumed]["parameters"] == params and
                    commands[consumed]["indent"] == commands[battle]["indent"] + 1 and
                    not any(c["code"] in (602, 603, 604) for c in commands[battle + 2:consumed]),
                    f"Character resolution left victory branch: {mid}/{eid}/{page}")
    painter = read_json(data_dir / "Map096.json")["events"][12]
    require(any(c.get("parameters") == ['this.sOff("C");']
                for c in painter["pages"][3]["moveRoute"]["list"]),
            "Frederic's escape disappearance is no longer temporary")


def validate_character_source(location, source, data_dir, read_json, require):
    """Validate the new finale gifts and the existing bag's alternate sources."""
    if location["key"] in ("frederic_paint_palette", "pierre_clown_wig"):
        tid, page, index, dbid, var, value = ((327, 0, 230, 271, 305, 5)
            if location["key"] == "frederic_paint_palette" else (19, 5, 94, 52, 617, 20))
        require((source["troop_id"], source["page"], source["command_index"]) == (tid, page, index) and
                source["required_variables"] == [{"id": var, "value": value}] and
                location["reward_kind"] == "armor" and location["reward_database_id"] == dbid,
                "Character finale reward identity changed")
        commands = read_json(data_dir / "Troops.json")[tid]["pages"][page]["list"]
        require(commands[index]["code"] == source["command_code"] == 128 and
                commands[index]["parameters"] == [dbid, 0, 0, 1, False], "Finale equipment grant changed")
    else:
        require(location["key"] == "frederic_canvas_bag" and location["reward_database_id"] == 341 and
                source["map_id"] == 96 and source["event_id"] == 12 and source["page"] in range(3) and
                source["command_index"] == 8 and source["command_code"] == 126,
                "Unaudited character reward source")
        commands = read_json(data_dir / "Map096.json")["events"][12]["pages"][source["page"]]["list"]
        effect = 9 if source["page"] == 0 else 10
        require(commands[5]["parameters"] == [0, 233, 1] and commands[8]["parameters"] == [341, 0, 0, 1] and
                source["deferred_switches"] == [{"command_index": effect, "switch_id": 188}] and
                commands[effect]["parameters"] == [188, 188, 0], "Alternate Canvas Carry Bag access changed")
    require(commands[source["message_index"]]["code"] == 401 and
            commands[source["message_index"]]["parameters"] == [source["message_text"]],
            "Character reward notification changed")


def validate_joel_source(location, source, data_dir, read_json, require):
    require(location["key"] in JOEL_KEYS and location["quest_family"] == "joel_resolution",
            "Unaudited Joel resolution member")
    if location["key"] == JOEL_KEYS[0]:
        require(location["reward_kind"] == "item" and location["reward_database_id"] == 310,
                "Joel's Door Knob changed")
        if "troop_id" in source:
            require((source["troop_id"], source["page"], source["command_index"]) == (26, 1, 52) and
                    source["required_variables"] == [{"id": 107, "values": [7, 8]}], "Joel dialogue context changed")
            commands = read_json(data_dir / "Troops.json")[26]["pages"][1]["list"]
        else:
            require(source["map_id"] == 32 and source["event_id"] == 7 and source["page"] in range(4) and
                    source["command_index"] == (9 if source["page"] < 2 else 8), "Joel alternate grant changed")
            event = read_json(data_dir / "Map032.json")["events"][7]
            commands = event["pages"][source["page"]]["list"]
            require(commands[2]["code"] == 301 and commands[2]["parameters"] ==
                    [0, 740 if source["page"] == 3 else 26, True, False] and
                    commands[3]["code"] == 601 and commands[source["command_index"]]["indent"] == 1 and
                    commands[source["command_index"] - 1]["parameters"] == [541, 541, 0],
                    "Joel alternate reward left the victory branch")
            channel = "B" if source["page"] == 3 else "A"
            require(commands[4]["code"] == 123 and commands[4]["parameters"] == [channel, 0] and
                    event["pages"][5 if channel == "B" else 4]["conditions"]["selfSwitchCh"] == channel,
                    "Joel victory no longer consumes the encounter")
        reward = commands[source["command_index"]]
        require(reward["code"] == source["command_code"] == 126 and reward["parameters"] == [310, 0, 0, 1],
                "Joel Door Knob reward changed")
        require(commands[source["message_index"]]["parameters"] == [source["message_text"]] and
                commands[source["message_index"]]["code"] == 401 and
                commands[source["message_index"] - 1]["code"] == 101, "Joel reward notice changed")
    else:
        require(location["reward_kind"] == "weapon" and location["reward_database_id"] == 215 and
                source["map_id"] == 435 and source["event_id"] == 2 and source["page"] in (0, 1) and
                source["command_index"] == 1 and source["command_code"] == 301 and
                source["battle_parameters"] == [0, 741, True, False] and
                location["battle_drop"] == {"enemy_id": 742, "drop_index": 0, "kind": 2,
                                            "encounter_scope": "quest_resolution"}, "Joel transformed reward changed")
        event = read_json(data_dir / "Map435.json")["events"][2]
        commands = event["pages"][source["page"]]["list"]
        require(commands[1]["code"] == 301 and commands[1]["parameters"] == source["battle_parameters"] and
                commands[2]["code"] == 601 and commands[3]["code"] == 123 and
                commands[3]["parameters"] == ["C", 0] and commands[6]["indent"] == 1 and
                event["pages"][4]["conditions"]["selfSwitchValid"] and
                event["pages"][4]["conditions"]["selfSwitchCh"] == "C", "Joel transformed victory changed")
        require(read_json(data_dir / "Troops.json")[741]["members"] ==
                [{"enemyId": 742, "x": 399, "y": 461, "hidden": False}] and
                read_json(data_dir / "Enemies.json")[742]["dropItems"][0] ==
                {"kind": 2, "dataId": 215, "denominator": 1}, "Joel transformed drop changed")
