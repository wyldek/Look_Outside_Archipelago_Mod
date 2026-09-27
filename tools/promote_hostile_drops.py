"""Add reviewed hostile boss drops with explicit victory and consumed-state proof."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from validate_registry import REGISTRY, read_json, require, validate_drop_completion


# enemy, drop slot, map, event, pages, battle, completion, consumed page, location name
SOURCES = (
    (100, 2, 92, 45, (1,), 4, 6, 2, "Rat King - Giant Rat Skull"),
    (164, 0, 269, 13, (0, 1), 2, 4, 3, "Stretchface - Dagger"),
    (267, 0, 158, 8, (1,), 0, 2, 2, "Lethargy - Sea Cucumber Loafers"),
    (421, 0, 202, 18, (0, 1), 1, 4, 3, "Enforcer - Hockey Stick"),
    (423, 0, 201, 34, (3,), 0, 4, 4, "Furnace - Furnace Edge"),
    (619, 0, 50, 11, (0, 1), 1, 4, 3, "Electropede - Electroclaw"),
    (619, 1, 50, 11, (0, 1), 1, 4, 3, "Electropede - Shockskull"),
    (824, 0, 445, 4, (0,), 1, 3, 1, "Deep Basement Creature - Slime Boots"),
    (21, 1, 35, 20, (0,), 5, 7, 2, "Vincent - Polo Shirt"),
    (226, 1, 127, 2, (1,), 1, 7, 2, "Spore Mother - Mycelium Cloak"),
    (707, 0, 353, 21, (0, 1), 1, 3, 3, "Louis' Head - Dragon Head"),
    (708, 0, 353, 19, (0, 1), 1, 3, 3, "Louis' Torso - Dragon Body"),
    (709, 0, 35, 28, (0, 1), 1, 3, 3, "Louis' Tail - Dragon Tail"),
    (710, 0, 23, 57, (0, 1), 1, 3, 3, "Louis' Leg - Dragon Feet"),
    (821, 1, 449, 4, (0,), 11, 12, 1, "gun - gun"),
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
    databases = {kind: read_json(data_dir / f"{kind.title()}s.json") for kind in ("weapon", "armor")}
    added = 0
    for ordinal, (enemy, slot, mid, eid, pages, battle, completion, consumed, name) in enumerate(SOURCES):
        drop = enemies[enemy]["dropItems"][slot]
        require(drop["kind"] in (2, 3) and drop["denominator"] == 1, f"Drop changed: {name}")
        kind = {2: "weapon", 3: "armor"}[drop["kind"]]
        dbid = drop["dataId"]
        require(name.endswith(databases[kind][dbid]["name"]), f"Drop name changed: {name}")
        key = f"boss_drop_{enemy}_{dbid}"
        if any(row["key"] == key for row in registry["locations"]):
            continue
        event = read_json(data_dir / f"Map{mid:03d}.json")["events"][eid]
        sources = []
        for page in pages:
            commands = event["pages"][page]["list"]
            terminal = commands[completion]
            source = {"map_id": mid, "event_id": eid, "page": page,
                      "command_index": battle, "command_code": 301,
                      "battle_parameters": commands[battle]["parameters"],
                      "battle_completion": {"command_index": completion,
                          "command_code": terminal["code"], "parameters": terminal["parameters"],
                          "consumed_page": consumed}}
            require(commands[battle]["code"] == 301, f"Battle moved: {name}")
            if enemy in (226, 821):
                source["battle_completion"]["no_escape_or_loss_branch"] = True
            validate_drop_completion({"key": key}, source, event)
            sources.append(source)
        location = {"key": key, "name": name, "ap_id": 591000010 + ordinal, **sources[0],
                    "reward_kind": kind, "reward_database_id": dbid,
                    "battle_drop": {"enemy_id": enemy, "drop_index": slot, "kind": drop["kind"],
                                    "encounter_scope": "hostile_boss"}}
        if len(sources) > 1:
            location["source_variants"] = sources[1:]
        registry["locations"].append(location)
        item = next((row for row in registry["items"] if row["kind"] == kind and row["database_id"] == dbid), None)
        if item:
            item["quantity"] += 1
        else:
            registry["items"].append({"name": databases[kind][dbid]["name"],
                "ap_id": (540100000 if kind == "weapon" else 540200000) + dbid,
                "kind": kind, "database_id": dbid, "quantity": 1, "classification": "useful"})
        added += 1
    if added:
        registry["registry_version"] += 1
        registry["locations"].sort(key=lambda row: row["ap_id"])
        registry["items"].sort(key=lambda row: row["ap_id"])
        REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added {added} hostile boss drops; {len(registry['locations'])} active checks")


if __name__ == "__main__":
    main()
