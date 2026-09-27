"""Register three reviewed persistent item drops; writes project files only."""

import argparse
import json
from pathlib import Path

from fixed_collectible_scope import definitions, high_five_family, validate_fixed_collectibles
from validate_registry import REGISTRY, read_json, require, validate_drop_completion


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    data = parser.parse_args().game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    before = json.dumps(registry)
    enemies, items = read_json(data / "Enemies.json"), read_json(data / "Items.json")
    for ordinal, (enemy, slot, dbid, name, evidence) in enumerate(definitions()):
        key = f"boss_drop_{enemy}_{dbid}"
        if any(row["key"] == key for row in registry["locations"]):
            continue
        require(enemies[enemy]["dropItems"][slot] == {"kind": 1, "dataId": dbid, "denominator": 1},
                "Guaranteed item drop changed")
        sources = []
        for mid, eid, page, battle, completion, consumed in evidence:
            event = read_json(data / f"Map{mid:03}.json")["events"][eid]
            commands = event["pages"][page]["list"]
            terminal = commands[completion]
            source = {"map_id": mid, "event_id": eid, "page": page, "command_index": battle,
                      "command_code": 301, "battle_parameters": commands[battle]["parameters"],
                      "battle_completion": {"command_index": completion, "command_code": terminal["code"],
                                            "parameters": terminal["parameters"], "consumed_page": consumed}}
            validate_drop_completion({"key": key}, source, event)
            sources.append(source)
        registry["locations"].append({"key": key, "name": name, "ap_id": 591000040 + ordinal,
            **sources[0], "source_variants": sources[1:], "reward_kind": "item", "reward_database_id": dbid,
            "battle_drop": {"enemy_id": enemy, "drop_index": slot, "kind": 1, "encounter_scope": "hostile_boss"}})
        item = next((row for row in registry["items"] if row["kind"] == "item" and row["database_id"] == dbid), None)
        if item:
            item["quantity"] += 1
        else:
            registry["items"].append({"name": items[dbid]["name"], "ap_id": 540000000 + dbid,
                                      "kind": "item", "database_id": dbid, "quantity": 1,
                                      "classification": "filler"})
    family = high_five_family()
    next(row for row in registry["locations"] if row["key"] == family["location_keys"][0])["quest_family"] = family["key"]
    registry["quest_families"] = [r for r in registry["quest_families"] if r["key"] != family["key"]] + [family]
    validate_fixed_collectibles(registry, data, read_json, require)
    if json.dumps(registry) != before:
        registry["registry_version"] += 1
        REGISTRY.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Fixed collectibles registered: {len(registry['locations'])} checks, registry {registry['registry_version']}")


if __name__ == "__main__":
    main()
