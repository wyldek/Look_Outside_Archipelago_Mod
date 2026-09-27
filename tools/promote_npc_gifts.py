"""Register reviewed, one-time dialogue gifts with explicit quest-state guards."""

import argparse
import json
from pathlib import Path

from validate_registry import REGISTRY, read_json, require, validate_troop_reward


# key, name, troop, map, event, grant, notice, item, guard, variable, before, write, after
GIFTS = (
    ("pierre_clown_drawing", "Pierre - Clown Drawing", 19, 356, 2, 309, 308, 347, 283, 617, 11, 315, 12),
    ("frederic_painters_key", "Frederic - Painter's Key", 327, 96, 12, 95, None, 293, 73, 305, 0, 96, 1),
    ("frederic_canvas_bag", "Frederic - Canvas Carry Bag", 327, 96, 12, 170, 172, 341, 164, 305, 2, 178, 3),
)

CHOICE_GIFTS = (
    ("jasper_apartment_key", "Jasper - Apartment Key", 124, 65, 9, 258, 260, 384,
     227, 595, 7, 262, 8, 2, 251, "(([v[595]!=7]))How can I get into Apartment 12?", []),
    ("mutt_vending_key", "Mutt - Vending Machine Key", 155, 56, 26, 106, 105, 371,
     46, 759, 1, 108, 2, 4, 96, "(([!s[318]]))Restocking a vending machine.",
     [(27, 121, [318, 318, 1]), (28, 111, [1, 759, 0, 1, 0]),
      (29, 121, [318, 318, 0]), (97, 111, [0, 8, 1])]),
)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    args = parser.parse_args()
    data = args.game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    troops = read_json(data / "Troops.json")
    items = read_json(data / "Items.json")
    added = 0
    for ordinal, definition in enumerate((*GIFTS, *CHOICE_GIFTS)):
        key, name, troop, mid, eid, grant, notice, item, guard, var, before, write, after = definition[:13]
        if any(r["key"] == key for r in registry["locations"]):
            continue
        commands = troops[troop]["pages"][0]["list"]
        location = {"key": key, "name": name, "ap_id": 592000010 + ordinal,
                    "map_id": mid, "event_id": eid, "troop_id": troop, "page": 0,
                    "command_index": grant, "command_code": 126,
                    "reward_kind": "item", "reward_database_id": item, "reviewed_item_pickup": True,
                    "required_variables": [{"id": var, "value": before}],
                    "troop_consumption": {"guard_index": guard, "variable_id": var,
                        "required_value": before, "intercept_value": before,
                        "consumed_value": after, "consumed_writes": [write], "commands": []}}
        if len(definition) > 13:
            choice, branch, text, evidence = definition[13:]
            location["troop_consumption"].update(type="choice", choice_index=choice,
                branch_index=branch, choice_text=text,
                commands=[{"command_index": i, "command_code": c, "parameters": p} for i, c, p in evidence])
        if notice is None:
            location["silent_reward"] = True
        else:
            location.update(message_index=notice, message_text=commands[notice]["parameters"][0])
        validate_troop_reward(location, location, troops)
        registry["locations"].append(location)
        existing = next((r for r in registry["items"] if r["kind"] == "item" and r["database_id"] == item), None)
        if existing:
            existing["quantity"] += 1
        else:
            registry["items"].append({"name": items[item]["name"], "ap_id": 540000000 + item,
                "kind": "item", "database_id": item, "quantity": 1, "classification": "progression"})
        added += 1
    bag = next(r for r in registry["locations"] if r["key"] == "frederic_canvas_bag")
    bag_item = next(r for r in registry["items"] if r["kind"] == "item" and r["database_id"] == 341)
    deferred = [{"command_index": 168, "switch_id": 188}]
    changed_effects = bag.get("deferred_switches") != deferred or bag_item.get("delivery_switches") != [188]
    require(troops[327]["pages"][0]["list"][168]["parameters"] == [188, 188, 0],
            "Canvas bag access switch moved")
    bag["deferred_switches"] = deferred
    bag_item["delivery_switches"] = [188]
    if added or changed_effects:
        registry["registry_version"] += 1
        registry["locations"].sort(key=lambda r: r["ap_id"])
        registry["items"].sort(key=lambda r: r["ap_id"])
        REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added {added} NPC gifts; {len(registry['locations'])} active checks")


if __name__ == "__main__":
    main()
