"""Validate the development AP registry against a read-only game installation."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from audit_game import permanently_shadowed
from exclude_cafe_stock import CAFE_EQUIPMENT_EVENTS
from equipment_source_exclusions import EXCLUDED_SOURCES
from encounter_scope import FRIENDLY_KILL_ENEMIES, FRIENDLY_KILL_REWARDS, VANILLA_GAUNTLET_MAPS, VANILLA_FRIENDLY_LOCKED_MAPS
from normal_mode_scope import HARD_ONLY_PICKUPS, HARD_ONLY_KEY_IDS, HARD_ONLY_ENEMY_IDS
from review_equipment import VANILLA_ITEM_SCOPE
from transformation_scope import validate_transformations
from portrait_scope import validate_green_key
from advanced_drop_scope import validate_advanced_drop, validate_suture_transform
from power_scope import validate_power_source
from quest_resolution_scope import RESOLUTION_KEYS, validate_choice_resolutions, validate_joel_source, validate_character_source
from character_form_scope import validate_form_source
from calendar_scope import validate_calendar_registry
from ending_warning_scope import validate_ending_warnings
from simple_key_scope import NESTOR_FAMILY, validate_simple_keys
from key_budget_scope import validate_key_budgets
from unused_map_scope import validate_unused_sea_maps
from normal_access_scope import validate_normal_access
from reusable_gift_scope import validate_reusable_source
from car_trunk_scope import validate_car_trunk
from first_gift_scope import validate_first_gift
from late_resolution_scope import validate_source as validate_late_source
from bookshelf_scope import validate_bookshelf


PROJECT_DIR = Path(__file__).resolve().parents[1]
REGISTRY = PROJECT_DIR / "apworld" / "lookoutside" / "vertical_slice.json"
KIND_DB = {"item": "Items.json", "weapon": "Weapons.json", "armor": "Armors.json"}


def read_json(path: Path):
    with path.open("r", encoding="utf-8-sig") as source:
        return json.load(source)


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def validate_common_state(location, source, common_events, data_dir):
    """Validate the reviewed permanent astrolabe-door unlock, not all disc puzzles."""
    if location["key"] == "car_trunk_shotgun":
        validate_car_trunk(location, source, common_events, data_dir, read_json, require)
        return
    require(location["key"] == "planetarium_access" and source["common_event_id"] == 64 and
            source["command_index"] == 216 and source["command_code"] == 121 and
            location["reward_kind"] == "switch" and location["reward_database_id"] == 699,
            "Unreviewed common-event progression source")
    commands = common_events[64]["list"]
    require(common_events[64]["name"] == "checkDiscPuzzle", "Disc puzzle common event moved")
    expected = [{"id": 771 + i, "value": i + 1} for i in range(9)]
    require(source["required_variables"] == expected, "Planetarium ownership guard changed")
    for i, condition in enumerate(expected):
        command = commands[187 + i]
        require(command["code"] == 111 and command["indent"] == i and command["parameters"] ==
                [1, condition["id"], 0, condition["value"], 0], "Planetarium socket guard changed")
    for index, code, params in ((186, 121, [1, 1, 1]), (196, 121, [1, 1, 0]),
                                (215, 111, [0, 1, 0]), (216, 121, [699, 699, 0])):
        command = commands[index]
        require(command["code"] == code and command["parameters"] == params,
                "Planetarium success branch changed")
    change = common_events[55]["list"]
    require(change[47]["code"] == 111 and change[47]["parameters"] == [0, 21, 1] and
            change[48]["code"] == 115 and change[51]["code"] == 117 and change[51]["parameters"] == [64],
            "Powered disc-puzzle call changed")
    game_map = read_json(data_dir / "Map345.json")
    for eid in range(12, 21):
        for page in game_map["events"][eid]["pages"]:
            require(page["list"][0]["parameters"] == [250, 250, 0, 0, 509 + eid] and
                    page["list"][1]["code"] == 117 and page["list"][1]["parameters"] == [55],
                    "Planetarium socket caller changed")
    gate = game_map["events"][31]["pages"][1]
    require(gate["conditions"]["switch1Valid"] and gate["conditions"]["switch1Id"] == 699 and
            gate["list"][10]["code"] == 201 and gate["list"][10]["parameters"] == [0, 360, 8, 6, 0, 0],
            "Planetarium door access changed")


def validate_boss_salvage(location: dict, source: dict, game_map: dict) -> None:
    """Prove that the actor-independent terminal belongs only to a boss victory."""
    evidence = source["boss_salvage"]
    event = game_map["events"][source["event_id"]]
    commands = event["pages"][source["page"]]["list"]
    battle_index = evidence["battle_index"]
    actor_index = evidence["actor_branch_index"]
    terminal_index = evidence["terminal_index"]
    completion_index = evidence["completion_index"]
    battle = commands[battle_index]
    actor = commands[actor_index]
    terminal = commands[terminal_index]
    win = commands[battle_index + 1]
    label = f"{location['key']} Map {source['map_id']} event {source['event_id']} page {source['page']}"
    require(battle["code"] == 301 and
            battle["parameters"] == [0, evidence["troop_id"], True, False] and
            win["code"] == 601 and win["indent"] == battle["indent"],
            f"Boss battle changed: {label}")
    win_end = next(i for i in range(battle_index + 2, len(commands))
                   if commands[i]["indent"] <= battle["indent"])
    require(commands[win_end]["code"] == 602 and
            battle_index + 1 < actor_index < source["command_index"] < terminal_index < win_end and
            battle_index + 1 < completion_index < win_end,
            f"Salvage left the victory branch: {label}")
    require(actor["code"] == 111 and actor["parameters"] == [4, 22, 0] and
            actor["indent"] == battle["indent"] + 1 and
            terminal["code"] == 412 and terminal["parameters"] == [] and
            terminal["indent"] == actor["indent"] and
            all(command["indent"] > actor["indent"]
                for command in commands[actor_index + 1:terminal_index]),
            f"Audrey salvage branch changed: {label}")
    completion = commands[completion_index]
    require(completion["code"] == evidence["completion_code"] and
            completion["parameters"] == evidence["completion_parameters"] and
            completion["indent"] == battle["indent"] + 1,
            f"Boss completion changed: {label}")
    consumed_event = game_map["events"][evidence["consumed_event_id"]]
    condition = consumed_event["pages"][evidence["consumed_page"]]["conditions"]
    require(consumed_event is not event or evidence["consumed_page"] > source["page"],
            f"Boss consumed page has lower priority: {label}")
    params = completion["parameters"]
    if completion["code"] == 121:
        require(params == [params[0], params[0], 0] and
                any(condition[f"switch{n}Valid"] and condition[f"switch{n}Id"] == params[0]
                    for n in (1, 2)), f"Boss consumed switch changed: {label}")
    else:
        require(completion["code"] == 123 and params[1] == 0 and consumed_event is event and
                condition["selfSwitchValid"] and condition["selfSwitchCh"] == params[0],
                f"Boss consumed self-switch changed: {label}")


def validate_drop_completion(location: dict, source: dict, event: dict) -> None:
    proof = source["battle_completion"]
    commands = event["pages"][source["page"]]["list"]
    battle_index = source["command_index"]
    battle = commands[battle_index]
    index = proof["command_index"]
    command = commands[index]
    if proof.get("no_escape_or_loss_branch"):
        require(battle["parameters"][2:] == [False, False] and index > battle_index and
                command["indent"] == battle["indent"] and
                all(c["indent"] == battle["indent"] and c["code"] in (122, 355)
                    for c in commands[battle_index + 1:index]),
                f"Unconditional victory continuation changed: {location['key']}")
    else:
        win = commands[battle_index + 1]
        require(win["code"] == 601 and win["indent"] == battle["indent"],
                f"Drop victory branch changed: {location['key']}")
        end = next(i for i in range(battle_index + 2, len(commands))
                   if commands[i]["indent"] <= battle["indent"])
        require(battle_index + 1 < index < end and command["indent"] == battle["indent"] + 1,
                f"Drop completion left its victory branch: {location['key']}")
    require(command["code"] == proof["command_code"] and command["parameters"] == proof["parameters"],
            f"Drop completion left its victory branch: {location['key']}")
    require(proof["consumed_page"] > source["page"], f"Drop consumed page priority changed: {location['key']}")
    condition = event["pages"][proof["consumed_page"]]["conditions"]
    params = proof["parameters"]
    if command["code"] == 123:
        valid = params[1] == 0 and condition["selfSwitchValid"] and condition["selfSwitchCh"] == params[0]
    elif command["code"] == 121:
        valid = params == [params[0], params[0], 0] and any(
            condition[f"switch{n}Valid"] and condition[f"switch{n}Id"] == params[0] for n in (1, 2))
    elif command["code"] == 122:
        valid = (params[:4] == [params[0], params[0], 0, 0] and condition["variableValid"] and
                 condition["variableId"] == params[0] and condition["variableValue"] == params[4])
    else:
        valid = False
    require(valid, f"Drop consumed page changed: {location['key']}")


def validate_troop_reward(location, source, troops, data_dir=None):
    commands = troops[source["troop_id"]]["pages"][source["page"]]["list"]
    label = location["key"]
    reward = commands[source["command_index"]]
    code = {"item": 126, "weapon": 127, "armor": 128}[location["reward_kind"]]
    require(reward["code"] == source["command_code"] == code and
            reward["parameters"] == [location["reward_database_id"], 0, 0, 1] + ([] if code == 126 else [False]),
            f"Troop reward changed: {label}")
    if "message_index" in source:
        notice = source["message_index"]
        require(commands[notice - 1]["code"] == 101 and commands[notice]["code"] == 401 and
                commands[notice]["parameters"] == [source["message_text"]],
                f"Troop reward notice changed: {label}")
    else:
        require(source.get("silent_reward") is True, f"Unreviewed silent troop gift: {label}")
    proof = source["troop_consumption"]
    if proof.get("type") == "late_resolution":
        validate_late_source(location, source, troops, require)
        return
    if proof.get("type") == "first_gift":
        validate_first_gift(location, source, troops, data_dir, read_json, require)
        return
    if proof.get("type") == "reusable_gift":
        validate_reusable_source(location, source, troops, require)
        return
    for effect in source.get("deferred_switches", []):
        command = commands[effect["command_index"]]
        require(command["code"] == 121 and command["parameters"] == [effect["switch_id"], effect["switch_id"], 0],
                f"Deferred item access effect changed: {label}")
    if proof.get("type") == "visitor":
        require(data_dir is not None and source["troop_id"] == 80 and source["page"] == 0 and
                source["command_index"] == 74 and source["required_variables"] == [{"id": 617, "value": 7}] and
                location.get("missable") is True,
                f"Unreviewed visitor source: {label}")
        for index, code, params in (
            (6, 122, [617, 617, 0, 0, 6]), (42, 102, [["Yes.", "No."], -1, 0, 2, 0]),
            (43, 402, [0, "Yes."]), (44, 119, ["OpenDoor"]), (49, 119, ["LeaveEyehole"]),
            (50, 118, ["OpenDoor"]), (61, 122, [617, 617, 0, 0, 7]),
            (214, 122, [617, 617, 0, 0, 10]), (217, 118, ["LeaveEyehole"]),
            (218, 121, [24, 24, 1]), (219, 122, [51, 51, 0, 0, 0]), (220, 340, []),
        ):
            require(commands[index]["code"] == code and commands[index]["parameters"] == params,
                    f"Visitor resolution changed: {label}")
        time = read_json(data_dir / "CommonEvents.json")[4]["list"]
        for index, code, params in (
            (369, 111, [1, 617, 0, 5, 0]), (370, 111, [1, 16, 0, 6, 2]),
            (373, 122, [51, 51, 0, 0, 80]), (375, 121, [24, 24, 0]),
            (379, 122, [617, 617, 0, 0, 6]),
        ):
            require(time[index]["code"] == code and time[index]["parameters"] == params,
                    f"Visitor dispatch changed: {label}")
        door = read_json(data_dir / "Map003.json")["events"][9]["pages"][1]
        require(door["conditions"]["switch1Valid"] and door["conditions"]["switch1Id"] == 24 and
                door["list"][33]["code"] == 301 and door["list"][33]["parameters"] == [1, 51, True, True],
                f"Visitor home-door call changed: {label}")
        return
    if proof.get("type") == "dialogue_completion":
        require(source["required_variables"] == [{"id": proof["variable_id"], "value": proof["required_value"]}],
                f"Dialogue progress guard changed: {label}")
        guard = commands[proof["reward_guard_index"]]
        require(guard["code"] == 111 and guard["parameters"] == proof["reward_guard_parameters"] and
                proof["reward_guard_index"] < source["command_index"] and
                all(c["indent"] > guard["indent"] for c in
                    commands[proof["reward_guard_index"] + 1:source["command_index"] + 1]),
                f"Dialogue reward branch changed: {label}")
        for index in proof["consumed_writes"]:
            require(commands[index]["code"] == 122 and commands[index]["parameters"] ==
                    [proof["variable_id"], proof["variable_id"], 0, 0, proof["consumed_value"]] and
                    index > source["command_index"], f"Dialogue completion changed: {label}")
        replay = commands[proof["replay_guard_index"]]
        jump = commands[proof["replay_guard_index"] + 1]
        require(replay["code"] == 111 and replay["parameters"] ==
                [1, proof["variable_id"], 0, proof["consumed_value"], 0] and
                jump["code"] == 119 and jump["parameters"] == [proof["replay_label"]] and
                commands[proof["replay_label_index"]]["code"] == 118 and
                commands[proof["replay_label_index"]]["parameters"] == [proof["replay_label"]] and
                all(c["code"] not in (126, 127, 128) for c in
                    commands[proof["replay_label_index"]:proof["replay_end_index"]]) and
                commands[proof["replay_end_index"]]["code"] == 340,
                f"Completed dialogue no longer bypasses rewards: {label}")
        for evidence in proof["commands"]:
            command = commands[evidence["command_index"]]
            require(command["code"] == evidence["command_code"] and command["parameters"] == evidence["parameters"],
                    f"Dialogue state evidence changed: {label}")
        return
    if proof.get("type") == "map_switch":
        require(data_dir is not None, f"Missing map proof context: {label}")
        write = commands[proof["write_index"]]
        require(write["code"] == 121 and write["parameters"] == [proof["switch_id"], proof["switch_id"], 0],
                f"Troop consumed switch changed: {label}")
        event = read_json(data_dir / f"Map{source['map_id']:03d}.json")["events"][source["event_id"]]
        condition = event["pages"][proof["consumed_page"]]["conditions"]
        require(condition["switch1Valid"] and condition["switch1Id"] == proof["switch_id"] and
                all(c["code"] == 0 for c in event["pages"][proof["consumed_page"]]["list"]),
                f"Troop's map encounter is no longer consumed: {label}")
        branch = commands[proof["branch_index"]]
        require(branch["code"] == 402 and branch["parameters"] == [0, "I am ready."] and
                proof["branch_index"] < proof["write_index"] < source["command_index"] and
                all(c["indent"] > branch["indent"] for c in
                    commands[proof["branch_index"] + 1:source["command_index"] + 1]),
                f"Ritual gift left the confirmation branch: {label}")
        for evidence in proof["commands"]:
            command = commands[evidence["command_index"]]
            require(command["code"] == evidence["command_code"] and command["parameters"] == evidence["parameters"],
                    f"Ritual resolution changed: {label}")
        return
    intercept_value = proof.get("intercept_value", proof["consumed_value"])
    require(source["required_variables"] == [{"id": proof["variable_id"], "value": intercept_value}],
            f"Troop reward lost its outcome guard: {label}")
    guard = commands[proof["guard_index"]]
    branch_index = proof["guard_index"]
    if proof.get("type") == "choice":
        require(guard["code"] == 102 and
                guard["parameters"][0][proof["choice_index"]] == proof["choice_text"],
                f"Troop choice gate changed: {label}")
        branch_index = proof["branch_index"]
        branch = commands[branch_index]
        require(branch["code"] == 402 and branch["indent"] == guard["indent"] and
                branch["parameters"] == [proof["choice_index"], proof["choice_text"]] and
                branch_index > proof["guard_index"], f"Troop choice branch changed: {label}")
    else:
        require(guard["code"] == 111 and guard["parameters"] ==
                [1, proof["variable_id"], 0, proof["required_value"], 0], f"Troop guard changed: {label}")
    require(branch_index < source["command_index"] and
            all(c["indent"] > guard["indent"] for c in
                commands[branch_index + 1:source["command_index"] + 1]),
            f"Troop reward left its guard: {label}")
    for index in proof["consumed_writes"]:
        write = commands[index]
        require(write["code"] == 122 and write["parameters"] ==
                [proof["variable_id"], proof["variable_id"], 0, 0, proof["consumed_value"]] and
                proof["consumed_value"] != proof["required_value"], f"Troop consumed state changed: {label}")
    for evidence in proof["commands"]:
        command = commands[evidence["command_index"]]
        require(command["code"] == evidence["command_code"] and command["parameters"] == evidence["parameters"],
                f"Troop resolution changed: {label}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    args = parser.parse_args()
    game_dir = args.game_dir.resolve(strict=True)
    data_dir = game_dir / "data"
    registry = read_json(REGISTRY)
    require(registry.get("supported_difficulty") == "normal", "Registry difficulty scope changed")
    require(isinstance(registry.get("registry_version"), int) and
            registry["registry_version"] > 0, "Registry version is invalid")
    system = read_json(data_dir / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"],
            "Game ID differs from audited registry")
    require(system["versionId"] == registry["audited_version_id"],
            "Game version differs from audited registry")

    locations = registry["locations"]
    items = registry["items"]
    require(sum(item["quantity"] for item in items) == len(locations),
            "Item quantity does not equal location count")
    for collection, label in ((locations, "location"), (items, "item")):
        for field in ("name", "ap_id"):
            values = [row[field] for row in collection]
            require(len(values) == len(set(values)), f"Duplicate {label} {field}")
        require(all(isinstance(row["ap_id"], int) and
                    0 < row["ap_id"] <= 2**53 - 1 for row in collection),
                f"Invalid {label} AP ID")
    require(len({row["key"] for row in locations}) == len(locations),
            "Duplicate location key")

    databases = {kind: read_json(data_dir / filename)
                 for kind, filename in KIND_DB.items()}
    common_events = read_json(data_dir / "CommonEvents.json")
    enemies = read_json(data_dir / "Enemies.json")
    troops = read_json(data_dir / "Troops.json")
    validate_transformations(registry, lambda mid: read_json(data_dir / f"Map{mid:03d}.json"), troops, require)
    validate_choice_resolutions(registry, data_dir, read_json, require)
    validate_simple_keys(registry, data_dir, read_json, require)
    validate_key_budgets(registry, data_dir, read_json, require)
    validate_unused_sea_maps(registry, data_dir, read_json, require)
    validate_normal_access(registry, data_dir, read_json, require)
    location_by_key = {location["key"]: location for location in locations}
    rewards = {(row["reward_kind"], row["reward_database_id"]) for row in locations}
    for item in items:
        if "delivery_amount" in item:
            require(item["kind"] == "item" and
                    (item["database_id"], item["delivery_amount"]) in {(320, 3), (656, 2)},
                    f"Unreviewed item bundle: {item['name']}")
        if "delivery_switches" in item:
            require(item["kind"] == "item" and (item["database_id"], item["delivery_switches"]) in
                    [(341, [188]), (156, [394])],
                    f"Unreviewed inventory access state: {item['name']}")
        key = (item["kind"], item["database_id"])
        require(not (item["kind"] == "item" and
                     item["database_id"] in VANILLA_ITEM_SCOPE),
                f"Vanilla material or consumable entered AP item pool: {item['name']}")
        require(key in rewards, f"Item has no acquisition source: {item['name']}")
        if item["kind"] == "switch":
            require(system["switches"][item["database_id"]] == item["switch_name"],
                    f"Switch name changed: {item['name']}")
        else:
            require(databases[item["kind"]][item["database_id"]]["name"] ==
                    item.get("database_name", item["name"]),
                    f"Database name changed: {item['name']}")

    map_cache = {}
    for location in locations:
        require(not (location["reward_kind"] == "item" and location["reward_database_id"] in HARD_ONLY_KEY_IDS),
                f"Hard-only key entered Normal pool: {location['key']}")
        require(tuple(location[f] for f in ("map_id", "event_id", "page", "command_index")) not in HARD_ONLY_PICKUPS,
                f"Hard-only pickup entered Normal pool: {location['key']}")
        require(not (location["reward_kind"] == "item" and
                     location["reward_database_id"] in VANILLA_ITEM_SCOPE),
                f"Vanilla material or consumable became an AP check: {location['key']}")
        variants = (location, *location.get("source_variants", []))
        require(len({(source.get("troop_id"), source.get("common_event_id"),
                      source["map_id"], source["event_id"], source["page"])
                     for source in variants}) == len(variants),
                f"Duplicate physical source: {location['key']}")
        for source in variants:
            require(source["map_id"] not in VANILLA_FRIENDLY_LOCKED_MAPS,
                    f"Reward behind an optional friendly kill became a check: {location['key']}")
            require(source["map_id"] not in VANILLA_GAUNTLET_MAPS,
                    f"Vanilla Gauntlet reward became a check: {location['key']}")
            if location.get("quest_family") == "joel_resolution":
                validate_joel_source(location, source, data_dir, read_json, require)
                continue
            if location.get("character_form_drop"):
                validate_form_source(location, source, data_dir, read_json, require)
                continue
            for effect in source.get("deferred_switches", []):
                item = next(r for r in items if r["kind"] == location["reward_kind"] and
                            r["database_id"] == location["reward_database_id"])
                require(effect["switch_id"] in item.get("delivery_switches", []),
                        f"Deferred access state has no delivery: {location['key']}")
            if location["key"] in ("frederic_paint_palette", "pierre_clown_wig") or (
                    location["key"] == "frederic_canvas_bag" and "troop_id" not in source):
                validate_character_source(location, source, data_dir, read_json, require)
                continue
            if "troop_id" in source:
                validate_troop_reward(location, source, troops, data_dir)
                continue
            if "common_event_id" in source:
                validate_common_state(location, source, common_events, data_dir)
                continue
            map_id = source["map_id"]
            require((map_id, source["event_id"], source["page"], source["command_index"])
                    not in FRIENDLY_KILL_REWARDS, f"Friendly-character kill reward became a check: {location['key']}")
            require((map_id, source["event_id"], source["page"], source["command_index"])
                    not in EXCLUDED_SOURCES, f"Excluded equipment source became a check: {location['key']}")
            require(not (map_id == 56 and source["event_id"] in CAFE_EQUIPMENT_EVENTS
                         and source["page"] in (0, 1)),
                    f"Cafe stock entered the AP registry: {location['key']}")
            if map_id not in map_cache:
                map_cache[map_id] = read_json(data_dir / f"Map{map_id:03d}.json")
            event = map_cache[map_id]["events"][source["event_id"]]
            require(not permanently_shadowed(event, source["page"]),
                    f"Reward page is hidden: {location['key']} Map {map_id}")
            page = event["pages"][source["page"]]
            commands = page["list"]
            for effect in source.get("native_effects", []):
                command = commands[effect["command_index"]]
                require(command["code"] == effect["command_code"] and
                        command["parameters"] == effect["parameters"],
                        f"Native pickup effect changed: {location['key']} Map {map_id}")
            if "difficulty_alternatives" in location:
                proof = location["difficulty_alternatives"]
                require(len(variants) == 2, f"Difficulty source count changed: {location['key']}")
                condition = (event["pages"][proof["normal_hidden_page"]]["conditions"]
                             if source is location else page["conditions"])
                require(condition["switch1Valid"] and condition["switch1Id"] == proof["switch_id"],
                        f"Difficulty pickup gate changed: {location['key']}")
                if source is location:
                    require(all(c["code"] == 0 for c in event["pages"][proof["normal_hidden_page"]]["list"]),
                            f"Normal pickup is no longer hidden in hard mode: {location['key']}")
            for vanilla in location.get("vanilla_bundle", []):
                command = commands[vanilla["command_index"]]
                require(command["code"] == 126 and command["parameters"] == vanilla["parameters"],
                        f"Vanilla bundle changed: {location['key']}")
            index = source["command_index"]
            reward = commands[index]
            require(reward["code"] == source["command_code"],
                    f"Command moved: {location['key']} Map {map_id}")
            if "battle_drop" in location:
                drop = location["battle_drop"]
                approved_key = (location.get("simple_key_source") == "drop" and
                                location["reward_kind"] == "item" and location["reward_database_id"] == 320)
                require(approved_key or (drop["enemy_id"] not in FRIENDLY_KILL_ENEMIES and
                        drop["enemy_id"] not in HARD_ONLY_ENEMY_IDS and
                        drop["encounter_scope"] == "hostile_boss"),
                        f"Friendly-character kill entered the registry: {location['key']}")
                require(reward["code"] == 301 and reward["parameters"] == source["battle_parameters"] and
                        reward["parameters"][0] == 0, f"Drop battle changed: {location['key']}")
                troop_id = reward["parameters"][1]
                if drop.get("native_transform"):
                    validate_suture_transform(drop, troops[troop_id], require)
                else:
                    require(sum(member["enemyId"] == drop["enemy_id"]
                                for member in troops[troop_id]["members"]) == 1,
                            f"Drop enemy membership changed: {location['key']}")
                require(drop["kind"] == {"item": 1, "weapon": 2, "armor": 3}[location["reward_kind"]] and
                        enemies[drop["enemy_id"]]["dropItems"][drop["drop_index"]] ==
                        {"kind": drop["kind"], "dataId": location["reward_database_id"], "denominator": 1},
                        f"Guaranteed drop changed: {location['key']}")
                if "consumption_source_key" in drop:
                    parent = location_by_key[drop["consumption_source_key"]]
                    require(any(all(candidate[field] == source[field] for field in ("map_id", "event_id", "page")) and
                                candidate.get("boss_salvage", {}).get("battle_index") == index and
                                candidate["boss_salvage"]["troop_id"] == troop_id
                                for candidate in (parent, *parent.get("source_variants", []))),
                            f"Drop has no audited one-time battle: {location['key']}")
                elif source.get("cross_event_drop_completion"):
                    validate_advanced_drop(location, source, data_dir, read_json, require)
                else:
                    validate_drop_completion(location, source, event)
                continue
            if location.get("power_restoration"):
                validate_power_source(location, source, data_dir, read_json, require)
                continue
            if location["reward_kind"] == "switch":
                switch_id = location["reward_database_id"]
                require(reward["parameters"] == [switch_id, switch_id, 0] and
                        commands[index - 1]["code"] == 601,
                        f"Victory switch source changed: {location['key']}")
                require(any(p["conditions"].get("switch1Valid") and
                            p["conditions"].get("switch1Id") == switch_id
                            for p in event["pages"][source["page"] + 1:]),
                        f"Boss-consumed page changed: {location['key']}")
            else:
                require(reward["parameters"][:4] ==
                        [location["reward_database_id"], 0, 0, 1],
                        f"Reward changed: {location['key']} Map {map_id}")
                if "message_index" in source:
                    for notice in (source, *location.get("message_variants", [])):
                        message_index = notice["message_index"]
                        require(commands[message_index]["code"] == 401 and
                                commands[message_index]["parameters"] ==
                                [notice["message_text"]] and
                                commands[message_index - 1]["code"] == 101,
                                f"Pickup text source changed: {location['key']} Map {map_id}")
                        if "cash_amount" in notice:
                            cash = commands[message_index + 1]
                            require(cash["code"] == 125 and cash["parameters"] ==
                                    [0, 0, notice["cash_amount"]],
                                    f"Vanilla safe cash changed: {location['key']} Map {map_id}")
                else:
                    require(not any(command["code"] == 401 for command in commands) or
                            (source.get("silent_reward") and source.get("reviewed_source_commands")),
                            f"Unreviewed silent source: {location['key']} Map {map_id}")
                for proof in source.get("reviewed_source_commands", []):
                    command = commands[proof["command_index"]]
                    require(command["code"] == proof["command_code"] and
                            command["parameters"] == proof["parameters"],
                            f"Reviewed source command changed: {location['key']}")
                if "boss_salvage" in source:
                    validate_boss_salvage(location, source, map_cache[map_id])
                    continue
                if source.get("green_key_completion"):
                    validate_green_key(location, source, map_cache[map_id], require)
                    continue
                if location.get("bookshelf_counter"):
                    validate_bookshelf(location, source, commands, require)
                    continue
                consumed_channel = location.get("consumed_self_switch", "A")
                if "consumed_switch" in location:
                    consumed = location["consumed_switch"]
                    terminal = commands[consumed["command_index"]]
                    require(consumed["command_index"] > index and terminal["code"] == 121 and
                            terminal["parameters"] == [consumed["id"], consumed["id"], 0],
                            f"Quest consumed switch changed: {location['key']}")
                elif "consumed_variable" in location:
                    consumed = location["consumed_variable"]
                    terminal = commands[consumed["command_index"]]
                    require((consumed["command_index"] > index or "branch_index" in consumed) and
                            terminal["code"] == 122 and
                            terminal["parameters"] == [consumed["id"], consumed["id"],
                                                       0, 0, consumed["value"]],
                            f"Quest consumed variable changed: {location['key']}")
                elif "consumed_by_common_event" in location:
                    require(location["consumed_by_common_event"] == 184 and
                            commands[2]["code"] == 117 and commands[2]["parameters"] == [184] and
                            commands[3]["code"] == 111 and commands[3]["parameters"] == [2, "A", 0],
                            f"Safe opening path changed: {location['key']}")
                    lock = common_events[184]
                    require(lock["name"] == "simpleLocks" and
                            all(lock["list"][i]["code"] == 123 and
                                lock["list"][i]["parameters"] == ["A", 0] for i in (45, 50)),
                            f"Safe consumption changed: {location['key']}")
                elif "consumed_self_switch" in location:
                    if "consumed_self_switch_index" in source:
                        consumed_index = source["consumed_self_switch_index"]
                        terminal = commands[consumed_index]
                        require(consumed_index < index and terminal["code"] == 123 and
                                terminal["parameters"] == [consumed_channel, 0] and
                                all(c["indent"] == reward["indent"] and c["code"] in (122, 355)
                                    for c in commands[consumed_index + 1:index]),
                                f"Early consumed self-switch changed: {location['key']}")
                    else:
                        require(any(command["code"] == 123 and
                                    command["parameters"] == [consumed_channel, 0]
                                    for command in commands[max(0, index - 2):]),
                                f"Consumed self-switch changed: {location['key']} Map {map_id}")
                    if "free_source_switch" in location:
                        require(page["conditions"]["switch1Valid"] and
                                page["conditions"]["switch1Id"] ==
                                location["free_source_switch"] and
                                commands[0]["code"] == 111 and
                                commands[0]["parameters"] == [0, 317, 0],
                                f"Free source branch changed: {location['key']}")
                        require(any(command["code"] == source["command_code"] and
                                    command["parameters"][:4] ==
                                    [location["reward_database_id"], 0, 0, 1]
                                    for command in event["pages"][1]["list"]),
                                f"Paid stock page changed: {location['key']}")
                else:
                    require(any(command["code"] == 123 and
                                command["parameters"] == ["A", 0]
                                for command in commands[max(0, index - 2):index + 4]),
                            f"Consumed self-switch changed: {location['key']} Map {map_id}")
                if "consumed_switch" in location:
                    consumed = location["consumed_switch"]
                    page_condition = event["pages"][consumed["page"]]["conditions"]
                    require(consumed["page"] > source["page"] and
                            any(page_condition[f"switch{number}Valid"] and
                                page_condition[f"switch{number}Id"] == consumed["id"] for number in (1, 2)),
                            f"Quest consumed page changed: {location['key']}")
                elif "consumed_variable" in location:
                    consumed = location["consumed_variable"]
                    if "branch_index" in consumed:
                        branch = commands[consumed["branch_index"]]
                        require(branch["code"] == 111 and branch["parameters"] ==
                                [1, consumed["id"], 0, consumed["required_value"], 0] and
                                consumed["value"] != consumed["required_value"] and
                                consumed["branch_index"] < min(consumed["command_index"], index) and
                                all(c["indent"] > branch["indent"]
                                    for c in commands[consumed["branch_index"] + 1:
                                                      max(consumed["command_index"], index) + 1]),
                                f"Same-page consumed variable branch changed: {location['key']}")
                        continue
                    page_condition = event["pages"][consumed["page"]]["conditions"]
                    require(consumed["page"] > source["page"] and
                            page_condition["variableValid"] and
                            page_condition["variableId"] == consumed["id"] and
                            page_condition["variableValue"] == consumed["threshold"] and
                            consumed["value"] >= consumed["threshold"],
                            f"Quest consumed page changed: {location['key']}")
                elif "shared_consumed_page" in location:
                    consumed = event["pages"][location["shared_consumed_page"]]["conditions"]
                    require(consumed["itemValid"] and
                            consumed["itemId"] == location["reward_database_id"],
                            f"Shared item-consumed page changed: {location['key']} Map {map_id}")
                elif "same_page_consumed_self_switch" in location:
                    channel = location["same_page_consumed_self_switch"]
                    require(any(command["code"] == 111 and
                                command["parameters"] == [2, channel, 1]
                                for command in commands[:index]),
                            f"Same-page consumed branch changed: {location['key']}")
                else:
                    require(any(p["conditions"].get("selfSwitchValid") and
                                p["conditions"].get("selfSwitchCh") == consumed_channel
                                for p in event["pages"][source["page"] + 1:]),
                            f"Consumed page missing: {location['key']}")
    location_by_key = {location["key"]: location for location in locations}
    family_keys = set()
    terminal_sources = set()
    for family in registry.get("quest_families", []):
        require(family["key"] not in family_keys, f"Duplicate quest family: {family['key']}")
        family_keys.add(family["key"])
        members = family["location_keys"]
        require(members and len(members) == len(set(members)) and
                all(key in location_by_key and location_by_key[key].get("quest_family") == family["key"]
                    for key in members), f"Quest family members changed: {family['key']}")
        require(family["terminals"], f"Quest family has no terminal: {family['key']}")
        if family["key"] in RESOLUTION_KEYS or family["key"] == NESTOR_FAMILY:
            continue  # Exact branch coverage and source evidence validated above.
        for terminal in family["terminals"]:
            if "troop_id" in terminal:
                key = ("troop", terminal["troop_id"], terminal["page"], terminal["command_index"])
                require(key not in terminal_sources, f"Duplicate troop terminal: {key}")
                terminal_sources.add(key)
                commands = troops[terminal["troop_id"]]["pages"][terminal["page"]]["list"]
                command = commands[terminal["command_index"]]
                require(command["code"] == terminal["command_code"] and command["parameters"] == terminal["parameters"] and
                        command["code"] in (122, 404), f"Troop terminal changed: {key}")
                for member in members:
                    location = location_by_key[member]
                    require(location.get("troop_id") == terminal["troop_id"] and location["page"] == terminal["page"] and
                            location.get("required_variables") == terminal.get("required_variables"),
                            f"Troop terminal has no matching quest context: {key}")
                    proof = location["troop_consumption"]
                    if command["code"] == 122:
                        require(terminal["command_index"] in proof["consumed_writes"], f"Troop quest is not consumed: {key}")
                    else:
                        choice = commands[terminal["choice_index"]]
                        require(choice["code"] == 102 and choice["parameters"][0] == ["Take it.", "Refuse it."] and
                                choice["indent"] == command["indent"] and
                                terminal["choice_index"] < location["command_index"] < terminal["command_index"] and
                                all(c["indent"] >= command["indent"] for c in
                                    commands[terminal["choice_index"] + 1:terminal["command_index"]]) and
                                any(c["code"] == 402 and c["parameters"] == [1, "Refuse it."] for c in
                                    commands[location["command_index"]:terminal["command_index"]]),
                                f"Gift reconciliation left the offer choice: {key}")
                continue
            key = tuple(terminal[field] for field in ("map_id", "event_id", "page", "command_index"))
            require(key not in terminal_sources, f"Duplicate quest terminal: {key}")
            terminal_sources.add(key)
            map_id = terminal["map_id"]
            if map_id not in map_cache:
                map_cache[map_id] = read_json(data_dir / f"Map{map_id:03d}.json")
            event = map_cache[map_id]["events"][terminal["event_id"]]
            require(not permanently_shadowed(event, terminal["page"]),
                    f"Quest terminal page is hidden: {key}")
            command = event["pages"][terminal["page"]]["list"][terminal["command_index"]]
            require(command["code"] == terminal["command_code"] and command["code"] in (121, 122, 123, 412) and
                    command["parameters"] == terminal["parameters"],
                    f"Quest terminal changed: {key}")
            if command["code"] == 123:
                require(command["parameters"] == ["A", 0] and
                        any(p["conditions"]["selfSwitchValid"] and
                            p["conditions"]["selfSwitchCh"] == "A"
                            for p in event["pages"][terminal["page"] + 1:]),
                        f"Quest terminal consumed page changed: {key}")
            if command["code"] == 412:
                require(len(members) == 1, f"Salvage family must have one check: {key}")
                location = location_by_key[members[0]]
                require(any(source.get("boss_salvage", {}).get("terminal_index") == key[3] and
                            tuple(source[field] for field in ("map_id", "event_id", "page")) == key[:3]
                            for source in (location, *location.get("source_variants", []))),
                        f"Salvage terminal has no audited victory source: {key}")
        for member in members:
            location = location_by_key[member]
            for source in (location, *location.get("source_variants", [])):
                if "boss_salvage" in source:
                    require(any(all(terminal[field] == source[field]
                                    for field in ("map_id", "event_id", "page")) and
                                terminal["command_index"] == source["boss_salvage"]["terminal_index"] and
                                terminal["command_code"] == 412 for terminal in family["terminals"]),
                            f"Salvage source is missing its terminal: {member}")
    require(all(location.get("quest_family") in family_keys for location in locations
                if "quest_family" in location), "Location has unknown quest family")
    time_passes = common_events[4]
    require(time_passes["name"] == "TimePasses", "TimePasses common event moved")
    require(common_events[6]["name"] == "newDay", "newDay common event moved")
    for index in (59, 78):
        command = time_passes["list"][index]
        require(command["code"] == 122 and
                command["parameters"] == [15, 15, 1, 0, 1],
                f"Day rollover command changed: {index}")
    new_day_call = time_passes["list"][135]
    require(new_day_call["code"] == 117 and
            new_day_call["parameters"] == [6],
            "TimePasses newDay call changed")
    for index, code, params in ((291, 111, [1, 16, 0, 4, 0]), (292, 121, [40, 40, 0])):
        command = common_events[5]["list"][index]
        require(command["code"] == code and command["parameters"] == params,
                "HourPassed 04:00 day boundary changed")
    home = read_json(data_dir / "Map003.json")
    door = home["events"][9]["pages"]
    require(door[2]["conditions"]["variableValid"] and
            door[2]["conditions"]["variableId"] == 15 and
            door[2]["conditions"]["variableValue"] == 15 and
            door[1]["conditions"]["switch1Valid"] and door[1]["conditions"]["switch1Id"] == 24,
            "Home front-door page selection changed")
    for page, index, code, params in (
        (0, 0, 111, [1, 13, 0, 3, 0]), (0, 40, 201, [0, 6, 51, 7, 0, 0]),
        (1, 33, 301, [1, 51, True, True]),
        (2, 3, 102, [["Let's go.", "Not yet."], 1, 0, 2, 0]),
        (2, 4, 402, [0, "Let's go."]), (2, 10, 201, [0, 172, 8, 6, 0, 0]),
    ):
        command = door[page]["list"][index]
        require(command["code"] == code and command["parameters"] == params,
                f"Home front-door command changed: page {page}, command {index}")
    validate_calendar_registry(registry, data_dir)
    validate_ending_warnings(data_dir)
    print(f"Validated {len(locations)} locations and {sum(item['quantity'] for item in items)} items")


if __name__ == "__main__":
    main()
