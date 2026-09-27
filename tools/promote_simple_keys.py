"""Register the approved eight fixed Simple Keys and two guaranteed drops."""

import argparse
import json
from pathlib import Path

from simple_key_scope import PICKUPS, DROP_SOURCES, NESTOR_KEY, nestor_family, validate_simple_keys
from validate_registry import REGISTRY, read_json, require, validate_drop_completion


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    data = parser.parse_args().game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    before = json.dumps(registry, sort_keys=True)
    for ordinal, (mid, eid, grant, notice, consumed, area) in enumerate(PICKUPS):
        key = f"simple_key_map{mid:03}_event{eid:03}"
        if any(r["key"] == key for r in registry["locations"]):
            continue
        commands = read_json(data / f"Map{mid:03}.json")["events"][eid]["pages"][0]["list"]
        registry["locations"].append({"key": key, "name": f"{area} - Simple Key", "ap_id": 592000110 + ordinal,
            "map_id": mid, "event_id": eid, "page": 0, "command_index": grant, "command_code": 126,
            "reward_kind": "item", "reward_database_id": 320, "simple_key_source": "pickup",
            "message_index": notice, "message_text": commands[notice]["parameters"][0]})
    for ordinal, (enemy, slot, mid, eid, pages, battle, completion, consumed, name) in enumerate(DROP_SOURCES):
        key = f"simple_key_drop_{enemy}"
        if any(r["key"] == key for r in registry["locations"]):
            continue
        event = read_json(data / f"Map{mid:03}.json")["events"][eid]
        sources = []
        for page in pages:
            commands = event["pages"][page]["list"]
            source = {"map_id": mid, "event_id": eid, "page": page, "command_index": battle,
                      "command_code": 301, "battle_parameters": commands[battle]["parameters"],
                      "battle_completion": {"command_index": completion,
                          "command_code": commands[completion]["code"],
                          "parameters": commands[completion]["parameters"], "consumed_page": consumed}}
            validate_drop_completion({"key": key}, source, event)
            sources.append(source)
        location = {"key": key, "name": name, "ap_id": 592000118 + ordinal, **sources[0],
                    "reward_kind": "item", "reward_database_id": 320, "simple_key_source": "drop",
                    "battle_drop": {"enemy_id": enemy, "drop_index": slot, "kind": 1,
                                    "encounter_scope": "approved_simple_key_drop"}}
        if len(sources) > 1:
            location["source_variants"] = sources[1:]
        if key == NESTOR_KEY:
            location["quest_family"] = nestor_family()["key"]
        registry["locations"].append(location)
    if not any(r["kind"] == "item" and r["database_id"] == 320 for r in registry["items"]):
        registry["items"].append({"name": "Simple Key", "ap_id": 540000320, "kind": "item",
            "database_id": 320, "quantity": 10, "classification": "progression"})
    key_item = next(r for r in registry["items"] if r["ap_id"] == 540000320)
    key_item.update(name="Simple Keys (3)", database_name="Simple Key", delivery_amount=3)
    if not any(f["key"] == nestor_family()["key"] for f in registry["quest_families"]):
        registry["quest_families"].append(nestor_family())
    validate_simple_keys(registry, data, read_json, require)
    if json.dumps(registry, sort_keys=True) != before:
        registry["registry_version"] += 1
        registry["locations"].sort(key=lambda r: r["ap_id"])
        registry["items"].sort(key=lambda r: r["ap_id"])
        REGISTRY.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Registered 10 Simple Key sources; {len(registry['locations'])} checks, version {registry['registry_version']}")


if __name__ == "__main__":
    main()
