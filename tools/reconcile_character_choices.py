"""Reconcile audited character outcomes and preserve staged quest rewards."""

import argparse
import json
from pathlib import Path

from quest_resolution_scope import resolution_families, validate_choice_resolutions, validate_joel_source
from validate_registry import REGISTRY, read_json, require
from character_form_scope import promote_form_rewards


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    data = parser.parse_args().game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    before = json.dumps(registry)
    system = read_json(data / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    knob = next(row for row in registry["locations"] if row["key"] == "joel_peaceful_door_knob")
    knob.update(name="Joel Resolution - Door Knob", quest_family="joel_resolution",
                required_variables=[{"id": 107, "values": [7, 8]}],
                ap_message="Archipelago: Joel Resolution complete (2 checks).")
    event = read_json(data / "Map032.json")["events"][7]
    knob["source_variants"] = [{"map_id": 32, "event_id": 7, "page": page,
        "command_index": 9 if page < 2 else 8, "command_code": 126,
        "message_index": 11 if page < 2 else 10,
        "message_text": event["pages"][page]["list"][11 if page < 2 else 10]["parameters"][0]}
        for page in range(4)]
    if not any(row["key"] == "joel_resolution_toothy_whip" for row in registry["locations"]):
        registry["locations"].append({"key": "joel_resolution_toothy_whip", "name": "Joel Resolution - Toothy Whip",
            "ap_id": 592000090, "map_id": 435, "event_id": 2, "page": 0, "command_index": 1,
            "command_code": 301, "battle_parameters": [0, 741, True, False],
            "reward_kind": "weapon", "reward_database_id": 215, "quest_family": "joel_resolution",
            "battle_drop": {"enemy_id": 742, "drop_index": 0, "kind": 2, "encounter_scope": "quest_resolution"},
            "source_variants": [{"map_id": 435, "event_id": 2, "page": 1, "command_index": 1,
                                 "command_code": 301, "battle_parameters": [0, 741, True, False]}]})
        item = next((row for row in registry["items"] if row["kind"] == "weapon" and row["database_id"] == 215), None)
        if item:
            item["quantity"] += 1
        else:
            registry["items"].append({"name": "Toothy Whip", "ap_id": 540100215, "kind": "weapon",
                                      "database_id": 215, "quantity": 1, "classification": "useful"})
    mail = next(row for row in registry["locations"] if row["key"] == "pierre_old_mail")
    mail.update(quest_family="pierre_mail_resolution",
                exclusion_reason="The pre-06:00 visit can expire; visit choices and Pierre's final outcomes reconcile it.")
    for key, name, ap_id, tid, page, index, notice, dbid, var, value in [
        ("frederic_paint_palette", "Frederic Resolution - Paint Palette", 592000091,
         327, 0, 230, 232, 271, 305, 5),
        ("pierre_clown_wig", "Pierre Resolution - Clown Wig and Nose", 592000092,
         19, 5, 94, 93, 52, 617, 20),
    ]:
        if any(row["key"] == key for row in registry["locations"]):
            continue
        commands = read_json(data / "Troops.json")[tid]["pages"][page]["list"]
        registry["locations"].append({"key": key, "name": name, "ap_id": ap_id,
            "map_id": 96 if tid == 327 else 356, "event_id": 12 if tid == 327 else 2,
            "troop_id": tid, "page": page, "command_index": index, "command_code": 128,
            "reward_kind": "armor", "reward_database_id": dbid,
            "message_index": notice, "message_text": commands[notice]["parameters"][0],
            "required_variables": [{"id": var, "value": value}]})
        existing = next((row for row in registry["items"] if row["kind"] == "armor" and row["database_id"] == dbid), None)
        if existing:
            existing["quantity"] += 1
        else:
            registry["items"].append({"name": read_json(data / "Armors.json")[dbid]["name"],
                "ap_id": 540200000 + dbid, "kind": "armor", "database_id": dbid,
                "quantity": 1, "classification": "useful"})
    bag = next(row for row in registry["locations"] if row["key"] == "frederic_canvas_bag")
    pages = read_json(data / "Map096.json")["events"][12]["pages"]
    bag["source_variants"] = [{"map_id": 96, "event_id": 12, "page": page,
        "command_index": 8, "command_code": 126, "message_index": 7,
        "message_text": pages[page]["list"][7]["parameters"][0],
        "deferred_switches": [{"command_index": 9 if page == 0 else 10, "switch_id": 188}]}
        for page in range(3)]
    promote_form_rewards(registry, data, read_json)
    for family in resolution_families():
        for row in registry["locations"]:
            if row["key"] in family["location_keys"]:
                row["quest_family"] = family["key"]
        registry["quest_families"] = [row for row in registry["quest_families"] if row["key"] != family["key"]]
        registry["quest_families"].append(family)
    validate_choice_resolutions(registry, data, read_json, require)
    for location in registry["locations"]:
        if location.get("quest_family") == "joel_resolution":
            for source in (location, *location.get("source_variants", [])):
                validate_joel_source(location, source, data, read_json, require)
    if json.dumps(registry) != before:
        registry["registry_version"] += 1
        REGISTRY.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Reconciled character choices; {len(registry['locations'])} checks")


if __name__ == "__main__":
    main()
