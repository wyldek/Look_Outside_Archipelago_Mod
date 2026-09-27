"""Register guaranteed weapon drops from three audited hostile salvage bosses."""

from __future__ import annotations

import argparse
import json
from copy import deepcopy
from pathlib import Path

from validate_registry import REGISTRY, read_json, require


# Source salvage check, enemy, weapon, location ID, public name.
DROPS = (
    ("boss_salvage_352", 184, 10, 591000001, "SWAT Truck - Nightstick"),
    ("boss_salvage_351", 189, 10, 591000002, "Cop Car - Nightstick"),
    ("boss_salvage_354", 228, 56, 591000003, "Spore Guardian - Spear"),
)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    args = parser.parse_args()
    data_dir = args.game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data_dir / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    enemies = read_json(data_dir / "Enemies.json")
    weapons = read_json(data_dir / "Weapons.json")
    added = 0
    for parent_key, enemy_id, weapon_id, location_id, name in DROPS:
        key = f"boss_drop_{enemy_id}_{weapon_id}"
        if any(location["key"] == key for location in registry["locations"]):
            continue
        require(enemies[enemy_id]["dropItems"][0] ==
                {"kind": 2, "dataId": weapon_id, "denominator": 1}, "Boss drop changed")
        parent = next(location for location in registry["locations"] if location["key"] == parent_key)
        sources = []
        for source in (parent, *parent.get("source_variants", [])):
            signature = {field: source[field] for field in ("map_id", "event_id", "page")}
            index = source["boss_salvage"]["battle_index"]
            game_map = read_json(data_dir / f"Map{source['map_id']:03d}.json")
            command = game_map["events"][source["event_id"]]["pages"][source["page"]]["list"][index]
            require(command["code"] == 301, "Battle moved")
            sources.append({**signature, "command_index": index, "command_code": 301,
                            "battle_parameters": deepcopy(command["parameters"])})
        location = {"key": key, "name": name, "ap_id": location_id, **sources[0],
                    "reward_kind": "weapon", "reward_database_id": weapon_id,
                    "battle_drop": {"enemy_id": enemy_id, "drop_index": 0, "kind": 2,
                                    "encounter_scope": "hostile_boss", "consumption_source_key": parent_key}}
        if len(sources) > 1:
            location["source_variants"] = sources[1:]
        registry["locations"].append(location)
        item = next((item for item in registry["items"]
                     if item["kind"] == "weapon" and item["database_id"] == weapon_id), None)
        if item:
            item["quantity"] += 1
        else:
            registry["items"].append({"name": weapons[weapon_id]["name"], "ap_id": 540100000 + weapon_id,
                                      "kind": "weapon", "database_id": weapon_id,
                                      "quantity": 1, "classification": "useful"})
        added += 1
    if added:
        registry["registry_version"] += 1
        registry["locations"].sort(key=lambda row: row["ap_id"])
        registry["items"].sort(key=lambda row: row["ap_id"])
        REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added {added} hostile boss drops; {len(registry['locations'])} active checks")


if __name__ == "__main__":
    main()
