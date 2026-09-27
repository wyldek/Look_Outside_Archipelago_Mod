"""Register reviewed Laundry, Love Letter, Typewrither, and Oracle rewards."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from validate_registry import REGISTRY, read_json, require


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    args = parser.parse_args()
    data = args.game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    items = read_json(data / "Items.json")
    definitions = [
        (69, 56, 0, 15, None, 373, "Laundromat - Jeanne's Laundry"),
        (94, 9, 0, 333, 332, 316, "Rafta - Love Letter"),
        (115, 2, 0, 9, 11, 346, "Typewrither - Loose Manuscript"),
        (367, 1, 1, 7, 9, 388, "Oracle's End - Small Red Key"),
    ]
    added = 0
    for ordinal, (mid, eid, page, grant, notice, dbid, name) in enumerate(definitions):
        key = f"map{mid:03d}_event{eid:03d}_quest_reward"
        if any(row["key"] == key for row in registry["locations"]):
            continue
        event = read_json(data / f"Map{mid:03d}.json")["events"][eid]
        def source(page_index):
            commands = event["pages"][page_index]["list"]
            require(commands[grant]["code"] == 126 and
                    commands[grant]["parameters"] == [dbid, 0, 0, 1], "Reward changed")
            row = {"map_id": mid, "event_id": eid, "page": page_index,
                   "command_index": grant, "command_code": 126}
            if notice is not None:
                require(commands[notice]["code"] == 401, "Notice changed")
                row.update(message_index=notice, message_text=commands[notice]["parameters"][0])
            else:
                row["silent_reward"] = True
            indices = {69: [2, 13, 14, 16], 94: [267, 274, 275, 290, 307, 319, 320, 334],
                       115: [1, 2, 5, 13], 367: [1, 2, 10, 14]}[mid]
            row["reviewed_source_commands"] = [
                {"command_index": i, "command_code": commands[i]["code"], "parameters": commands[i]["parameters"]}
                for i in indices]
            if mid == 115:
                row["consumed_self_switch_index"] = 5
            return row
        row = {"key": key, "name": name, "ap_id": 592000040 + ordinal, **source(page),
               "reward_kind": "item", "reward_database_id": dbid, "reviewed_quest_reward": True}
        if mid == 69:
            row["consumed_self_switch"] = "C"
        elif mid == 94:
            row["consumed_variable"] = {"id": 282, "command_index": 334, "value": 3,
                                        "branch_index": 267, "required_value": 2}
        elif mid == 115:
            row["consumed_self_switch"] = "C"
            row["source_variants"] = [source(1)]
        else:
            row["consumed_switch"] = {"id": 975, "command_index": 10, "page": 2}
        registry["locations"].append(row)
        existing = next((item for item in registry["items"] if item["kind"] == "item" and
                         item["database_id"] == dbid), None)
        if existing:
            existing["quantity"] += 1
        else:
            registry["items"].append({"name": items[dbid]["name"], "ap_id": 540000000 + dbid,
                "kind": "item", "database_id": dbid, "quantity": 1, "classification": "progression"})
        added += 1
    if added:
        registry["registry_version"] += 1
        REGISTRY.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Added {added} reviewed quest rewards; {len(registry['locations'])} locations")


if __name__ == "__main__":
    main()
