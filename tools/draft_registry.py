"""Draft AP IDs and exact source signatures from conservative review sheets.

The output is not loaded by the plugin or APWorld. Every row remains a review
candidate until its physical acquisition, availability, and game effects are
confirmed. Resources and consumables proposed as vanilla are omitted.
"""

from __future__ import annotations

import argparse
import csv
import json
from collections import Counter
from pathlib import Path

from audit_game import permanently_shadowed, read_json


PROJECT_DIR = Path(__file__).resolve().parents[1]
COMMAND_CODE = {"item": 126, "weapon": 127, "armor": 128}
ITEM_ID_BASE = {"item": 540000000, "weapon": 540100000, "armor": 540200000}


def proposed_message(commands: list[dict], row: dict) -> dict | None:
    reward_index = int(row["command_index"])
    name = row["item_name"]
    candidates = []
    for index in range(max(0, reward_index - 3), min(len(commands), reward_index + 4)):
        command = commands[index]
        if command["code"] != 401:
            continue
        value = command["parameters"][0]
        if name.casefold() not in value.casefold():
            continue
        # A braced item name is the game's usual explicit pickup notice.
        # The proposal remains subject to manual review even with this match.
        braced = "{" + name.casefold() + "}" in value.casefold()
        pickup_words = value.casefold().lstrip().startswith(("find ", "find a ", "you find "))
        candidates.append((braced, pickup_words, -abs(index - reward_index), index, value))
    if not candidates:
        return None
    selected = max(candidates)
    return {"index": selected[3], "text": selected[4],
            "candidate_count": len(candidates)}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    parser.add_argument("--audit-dir", type=Path,
                        default=PROJECT_DIR / "build" / "game_audit")
    args = parser.parse_args()
    game_dir = args.game_dir.resolve(strict=True)
    audit_dir = args.audit_dir.resolve()
    if PROJECT_DIR not in audit_dir.parents:
        parser.error("--audit-dir must be inside the project folder")
    system = read_json(game_dir / "data" / "System.json")
    approved = read_json(PROJECT_DIR / "apworld" / "lookoutside" / "vertical_slice.json")
    if system["versionId"] != approved["audited_version_id"] or \
            system["advanced"]["gameId"] != approved["audited_game_id"]:
        parser.error("The installed game differs from the audited build")
    map_cache = {}
    databases = {
        kind: read_json(game_dir / "data" / f"{kind.title()}s.json")
        for kind in COMMAND_CODE
    }
    locations = []
    items = {}
    for category in ("equipment", "item", "manual"):
        if category == "manual":
            rows = read_json(PROJECT_DIR / "tools" / "manual_source_candidates.json")
        else:
            with (audit_dir / f"{category}_review.csv").open(
                    "r", encoding="utf-8", newline="") as source:
                rows = list(csv.DictReader(source))
        for row in rows:
            if row["scope_proposal"] == "keep_vanilla":
                continue
            if row["scope_proposal"] != "review_for_ap":
                raise ValueError(f"Unexpected scope proposal: {row['source_key']}")
            map_id = int(row["map_id"])
            event_id = int(row["event_id"])
            page_index = int(row["page"])
            command_index = int(row["command_index"])
            kind = row["kind"]
            database_id = int(row["database_id"])
            if not 0 < map_id < 1000 or not 0 < event_id < 1000 or not 0 <= page_index < 100:
                raise ValueError(f"Source exceeds the draft ID range: {row['source_key']}")
            location_id = 530000000 + map_id * 100000 + event_id * 100 + page_index
            item_id = ITEM_ID_BASE[kind] + database_id
            if databases[kind][database_id]["name"] != row["item_name"]:
                raise ValueError(f"Database item name changed: {row['source_key']}")
            if map_id not in map_cache:
                map_cache[map_id] = read_json(game_dir / "data" / f"Map{map_id:03d}.json")
            event = map_cache[map_id]["events"][event_id]
            if permanently_shadowed(event, page_index):
                raise ValueError(f"Pickup is on a hidden page: {row['source_key']}")
            commands = event["pages"][page_index]["list"]
            command = commands[command_index]
            if command["code"] != COMMAND_CODE[kind] or \
                    command["parameters"][:4] != [database_id, 0, 0, 1]:
                raise ValueError(f"Reward changed: {row['source_key']}")
            message = proposed_message(commands, row)
            item_key = (kind, database_id)
            items.setdefault(item_key, {
                "name": row["item_name"], "ap_id": item_id,
                "kind": kind, "database_id": database_id, "quantity": 0,
                "classification": "unreviewed",
            })["quantity"] += 1
            locations.append({
                "key": row["source_key"],
                "name": f"Map {map_id:03d} Event {event_id:03d} - {row['item_name']}",
                "ap_id": location_id,
                "map_id": map_id,
                "event_id": event_id,
                "page": page_index,
                "command_index": command_index,
                "command_code": command["code"],
                "command_parameters": command["parameters"],
                "reward_kind": kind,
                "reward_database_id": database_id,
                "pickup_message": message,
                "review_status": row["review_status"],
                "review_notes": row["review_notes"],
                "source_origin": category,
            })
    for field in ("ap_id", "name", "key"):
        duplicates = [value for value, count in Counter(
            entry[field] for entry in locations).items() if count > 1]
        if duplicates:
            raise ValueError(f"Duplicate proposed location {field}: {duplicates}")
    approved_ids = {entry["ap_id"]: entry for entry in approved["locations"]}
    for draft in locations:
        active = approved_ids.get(draft["ap_id"])
        if active and any(active[field] != draft[field] for field in
                          ("map_id", "event_id", "page", "command_index",
                           "reward_kind", "reward_database_id")):
            raise ValueError(f"Draft ID conflicts with approved source: {draft['key']}")
        if active:
            draft["review_status"] = "active"
    for entry in approved["locations"]:
        if entry["reward_kind"] == "switch" or "source_variants" in entry or \
                "free_source_switch" in entry or entry["key"].endswith("_complex") or \
                entry["key"].endswith("_quest_pickup") or \
                "battle_drop" in entry or \
                "reviewed_item_pickup" in entry or \
                "consumed_by_common_event" in entry or "quest_family" in entry:
            continue
        draft = next((row for row in locations if row["map_id"] == entry["map_id"]
                      and row["event_id"] == entry["event_id"]
                      and row["page"] == entry["page"]
                      and row["command_index"] == entry["command_index"]), None)
        if draft is None or draft["ap_id"] != entry["ap_id"]:
            raise ValueError(f"Approved location ID conflicts with draft: {entry['key']}")
    output = {
        "status": "review_candidates_only",
        "audited_game_id": approved["audited_game_id"],
        "audited_version_id": approved["audited_version_id"],
        "locations": locations,
        "items": sorted(items.values(), key=lambda entry: (entry["kind"], entry["database_id"])),
    }
    path = audit_dir / "draft_registry.json"
    path.write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Drafted {len(locations)} candidate locations and "
          f"{sum(item['quantity'] for item in items.values())} item copies at {path}")
    print(f"Candidates without exact nearby item-name text: "
          f"{sum(entry['pickup_message'] is None for entry in locations)}")


if __name__ == "__main__":
    main()
