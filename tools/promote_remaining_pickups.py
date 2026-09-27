"""Register reviewed fixed and quest equipment rewards outside earlier batches."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from promote_complex_pickups import REGISTRY, read_json, require, source


SOURCES = (
    (6, 25, 1, 142, 144, "armor", 71, "Vending Machine - Four of Spades"),
    (92, 45, 2, 11, 13, "armor", 42, "Rat King Defeated - Rusty Crown"),
    (430, 16, 1, 4, 1, "armor", 337, "Lumpy's Room - Straitjacket"),
    (433, 9, 2, 11, 10, "weapon", 165, "Hellen's Garden - Stained Shears"),
    (442, 9, 0, 31, 14, "armor", 297, "Ambrose - Pipe"),
)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    args = parser.parse_args()
    game_dir = args.game_dir.resolve(strict=True)
    registry = read_json(REGISTRY)
    system = read_json(game_dir / "data" / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    equipment = {kind: read_json(game_dir / "data" / f"{kind.title()}s.json")
                 for kind in ("weapon", "armor")}
    added = 0
    for mid, eid, page, grant, notice, kind, dbid, name in SOURCES:
        event, signature = source(game_dir, mid, eid, page, grant, notice, kind, dbid)
        key = f"map{mid:03d}_event{eid:03d}_quest_pickup"
        if any(location["key"] == key for location in registry["locations"]):
            continue
        location = {"key": key, "name": name,
                    "ap_id": 530000000 + mid * 100000 + eid * 100 + page,
                    **signature, "reward_kind": kind, "reward_database_id": dbid}
        commands = event["pages"][page]["list"]
        terminals = []
        if mid == 6:
            # This is the magician's one-time quest card, not the snack stock.
            require(commands[138]["parameters"] == [1, 741, 0, 1, 0] and
                    commands[139]["parameters"] == [741, 741, 0, 0, 2], "Card state changed")
            location["consumed_variable"] = {"id": 741, "command_index": 139, "value": 2,
                                             "branch_index": 138, "required_value": 1}
        elif mid == 92:
            require(commands[8]["parameters"] == [0, 659, 0] and
                    commands[20]["parameters"] == [133, 133, 0], "Rat King resolution changed")
            location["consumed_switch"] = {"id": 133, "command_index": 20, "page": 3}
            terminals = [(page, 20, 121, [133, 133, 0])]
        elif mid == 430:
            alternative = event["pages"][2]
            require(alternative["conditions"]["switch1Valid"] and
                    alternative["conditions"]["switch1Id"] == 1003 and
                    alternative["list"][7]["code"] == 126 and
                    alternative["list"][7]["parameters"] == [142, 0, 0, 1],
                    "Straitjacket's Cheese Man alternative changed")
            location["ap_message"] = "An Archipelago location is on the floor."
            # Keep the alternate consumable vanilla; taking either source completes this check.
            terminals = [(1, 5, 123, ["A", 0]), (2, 8, 123, ["A", 0])]
        elif mid == 433:
            location["consumed_variable"] = {"id": 869, "command_index": 39,
                                             "value": 100, "page": 3, "threshold": 100}
        elif mid == 442:
            location["ap_message"] = "Archipelago location checked. Ambrose's other supplies received."
            require(commands[32]["parameters"] == ["A", 0], "Ambrose consumed state changed")
            location["vanilla_bundle"] = [
                {"command_index": i, "parameters": commands[i]["parameters"]}
                for i in range(15, 31)
            ]
            require(all(commands[i]["code"] == 126 for i in range(15, 31)), "Ambrose bundle changed")
        if terminals:
            location["quest_family"] = key
            for p, index, code, params in terminals:
                command = event["pages"][p]["list"][index]
                require(command["code"] == code and command["parameters"] == params,
                        f"Quest terminal changed: {key}")
            registry["quest_families"].append({
                "key": key, "name": name, "location_keys": [key],
                "completion_message": f"Archipelago: {name} checked.",
                "terminals": [{"map_id": mid, "event_id": eid, "page": p,
                               "command_index": index, "command_code": code, "parameters": params}
                              for p, index, code, params in terminals],
            })
        registry["locations"].append(location)
        item = next((item for item in registry["items"]
                     if item["kind"] == kind and item["database_id"] == dbid), None)
        if item:
            item["quantity"] += 1
        else:
            registry["items"].append({"name": equipment[kind][dbid]["name"],
                                      "ap_id": (540100000 if kind == "weapon" else 540200000) + dbid,
                                      "kind": kind, "database_id": dbid,
                                      "classification": "useful", "quantity": 1})
        added += 1
    if added:
        registry["registry_version"] += 1
        registry["locations"].sort(key=lambda row: row["ap_id"])
        registry["items"].sort(key=lambda row: row["ap_id"])
        require(sum(item["quantity"] for item in registry["items"]) == len(registry["locations"]),
                "Item copies do not match checks")
        REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added {added} reviewed equipment checks; {len(registry['locations'])} active locations")


if __name__ == "__main__":
    main()
