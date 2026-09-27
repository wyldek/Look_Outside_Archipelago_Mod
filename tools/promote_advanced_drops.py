"""Register Baby Teeth, Suture Wire, and First Head fixed weapon rewards."""

import argparse
import json
from pathlib import Path

from advanced_drop_scope import validate_advanced_drop, validate_suture_transform
from validate_registry import REGISTRY, read_json, require, validate_drop_completion


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    data = parser.parse_args().game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    enemies, weapons, troops = (read_json(data / name) for name in ("Enemies.json", "Weapons.json", "Troops.json"))
    added = 0
    for ordinal, (enemy, slot, mid, eid, pages, battle, name) in enumerate((
        (28, 0, 34, 13, (0,), 6, "Baby Teeth - Jawbone Club"),
        (450, 1, 270, 6, (1, 2), 3, "Suture Wire - Great Needle"),
        (889, 0, 463, 5, (0,), 1, "First Head - Slime Spear"),
    )):
        drop = enemies[enemy]["dropItems"][slot]
        dbid = drop["dataId"]
        require(drop["kind"] == 2 and drop["denominator"] == 1 and
                name.endswith(weapons[dbid]["name"]), "Advanced drop changed")
        key = f"boss_drop_{enemy}_{dbid}"
        if any(row["key"] == key for row in registry["locations"]):
            continue
        event = read_json(data / f"Map{mid:03d}.json")["events"][eid]
        sources = []
        for page in pages:
            commands = event["pages"][page]["list"]
            source = {"map_id": mid, "event_id": eid, "page": page, "command_index": battle,
                      "command_code": 301, "battle_parameters": commands[battle]["parameters"]}
            if enemy == 450:
                source["battle_completion"] = {"command_index": 9, "command_code": 123,
                                               "parameters": ["C", 0], "consumed_page": 4}
                validate_drop_completion({"key": key}, source, event)
            else:
                source["cross_event_drop_completion"] = True
            sources.append(source)
        location = {"key": key, "name": name, "ap_id": 591000030 + ordinal, **sources[0],
                    "reward_kind": "weapon", "reward_database_id": dbid, "advanced_drop": True,
                    "battle_drop": {"enemy_id": enemy, "drop_index": slot, "kind": 2,
                                    "encounter_scope": "hostile_boss"}}
        if enemy == 450:
            location["battle_drop"]["native_transform"] = True
            validate_suture_transform(location["battle_drop"], troops[441], require)
        else:
            validate_advanced_drop(location, sources[0], data, read_json, require)
        if len(sources) > 1:
            location["source_variants"] = sources[1:]
        registry["locations"].append(location)
        item = next((row for row in registry["items"] if row["kind"] == "weapon" and row["database_id"] == dbid), None)
        if item:
            item["quantity"] += 1
        else:
            registry["items"].append({"name": weapons[dbid]["name"], "ap_id": 540100000 + dbid,
                "kind": "weapon", "database_id": dbid, "quantity": 1, "classification": "useful"})
        added += 1
    if added:
        registry["registry_version"] += 1
        REGISTRY.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Added {added} advanced hostile drops; {len(registry['locations'])} checks")


if __name__ == "__main__":
    main()
