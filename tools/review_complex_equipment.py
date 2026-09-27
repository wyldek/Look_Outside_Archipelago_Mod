"""Create a review queue for fixed equipment grants outside the simple pattern.

This report is intentionally broad. A grant command can repeat, be in a
mutually exclusive branch, or belong to a multi-item reward. It is not an AP
location until its physical acquisition and completion behavior are reviewed.
"""

from __future__ import annotations

import argparse
import csv
from collections import Counter, defaultdict
from pathlib import Path

from audit_game import permanently_shadowed, read_json
from exclude_cafe_stock import CAFE_EQUIPMENT_EVENTS
from equipment_source_exclusions import EXCLUDED_SOURCES
from encounter_scope import VANILLA_FRIENDLY_LOCKED_MAPS


PROJECT_DIR = Path(__file__).resolve().parents[1]
FIELDS = (
    "source_key", "map_id", "map_name", "event_id", "event_name", "page",
    "command_index", "kind", "database_id", "item_name", "trigger",
    "page_grants", "page_conditions", "has_self_switch_A", "consumed_by_A",
    "has_branch", "has_common_event", "has_script", "has_variable_write",
    "has_loop", "command_codes", "text", "active_location_key", "review_status", "review_notes",
)


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
    grants = read_json(audit_dir / "event_reward_commands.json")
    simple = read_json(audit_dir / "simple_one_time_equipment_candidates.json")
    simple_keys = {(row["file"], row["event_id"], row["page"], row["command_index"])
                   for row in simple}
    registry = read_json(PROJECT_DIR / "apworld" / "lookoutside" / "vertical_slice.json")
    active = {
        (f"Map{source['map_id']:03d}.json", source["event_id"], source["page"], source["command_index"]):
        location["key"]
        for location in registry["locations"]
        for source in (location, *location.get("source_variants", []))
    }
    system = read_json(game_dir / "data" / "System.json")
    cheat_ids = {index for index, name in enumerate(system["switches"])
                 if name.upper() == "CHEATMODE"}
    page_grants = defaultdict(list)
    for row in grants:
        if row["source_type"] == "map_event":
            page_grants[(row["file"], row["event_id"], row["page"])].append(row)
    output = audit_dir / "complex_equipment_review.csv"
    prior = {}
    if output.is_file():
        with output.open("r", encoding="utf-8", newline="") as source:
            prior = {row["source_key"]: row for row in csv.DictReader(source)}
    map_cache = {}
    rows = []
    for row in grants:
        if row["source_type"] != "map_event" or row["kind"] not in ("weapon", "armor") \
                or row["operation"] != "gain" or row["amount"] != 1 \
                or cheat_ids.intersection(row["required_switches"]):
            continue
        key = (row["file"], row["event_id"], row["page"], row["command_index"])
        if key in simple_keys:
            continue
        if row["file"] not in map_cache:
            map_cache[row["file"]] = read_json(game_dir / "data" / row["file"])
        event = map_cache[row["file"]]["events"][row["event_id"]]
        if permanently_shadowed(event, row["page"]):
            continue
        page = event["pages"][row["page"]]
        commands = page["list"]
        codes = [command["code"] for command in commands]
        source_key = (f"map{row['map_id']:03d}_event{row['event_id']:03d}"
                      f"_page{row['page']}_cmd{row['command_index']}")
        saved = prior.get(source_key, {})
        active_key = active.get(key, "")
        status = "active" if active_key else saved.get("review_status", "unreviewed")
        notes = saved.get("review_notes", "")
        if row["map_id"] == 56 and row["event_id"] in CAFE_EQUIPMENT_EVENTS:
            status = "keep_vanilla"
            notes = "Daily cafe stock: free after Mutt dies or paid while alive; both stay vanilla."
        excluded = EXCLUDED_SOURCES.get((row["map_id"], row["event_id"], row["page"], row["command_index"]))
        if excluded:
            status = "keep_vanilla"
            notes = excluded
        if row["map_id"] in VANILLA_FRIENDLY_LOCKED_MAPS:
            status = "keep_vanilla"
            notes = "Room access requires an optional friendly-character kill; contents stay vanilla"
        conditions = page["conditions"]
        active_conditions = [key for key, value in conditions.items()
                             if key.endswith("Valid") and value]
        rows.append({
            "source_key": source_key,
            "map_id": row["map_id"],
            "map_name": row["map_name"],
            "event_id": row["event_id"],
            "event_name": row["event_name"],
            "page": row["page"],
            "command_index": row["command_index"],
            "kind": row["kind"],
            "database_id": row["database_id"],
            "item_name": row["item_name"],
            "trigger": page["trigger"],
            "page_grants": len(page_grants[(row["file"], row["event_id"], row["page"])]),
            "page_conditions": ",".join(active_conditions),
            "has_self_switch_A": any(c["code"] == 123 and c["parameters"] == ["A", 0]
                                     for c in commands),
            "consumed_by_A": any(p["conditions"].get("selfSwitchValid") and
                                 p["conditions"].get("selfSwitchCh") == "A"
                                 for p in event["pages"][row["page"] + 1:]),
            "has_branch": any(code in (111, 102) for code in codes),
            "has_common_event": 117 in codes,
            "has_script": any(code in (355, 655) for code in codes),
            "has_variable_write": 122 in codes,
            "has_loop": 112 in codes,
            "command_codes": ",".join(map(str, codes)),
            "text": " | ".join(command["parameters"][0] for command in commands
                               if command["code"] == 401),
            "active_location_key": active_key,
            "review_status": status,
            "review_notes": notes,
        })
    with output.open("w", encoding="utf-8", newline="") as target:
        writer = csv.DictWriter(target, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    print(f"Queued {len(rows)} complex equipment grants at {output}")
    print(f"Single-reward-command pages: {sum(int(row['page_grants']) == 1 for row in rows)}")
    print(f"Self-switch A consumed pages: {sum(row['consumed_by_A'] for row in rows)}")
    print(f"With branches: {sum(row['has_branch'] for row in rows)}")
    print(f"Kinds: {dict(Counter(row['kind'] for row in rows))}")
    print(f"Review status: {dict(Counter(row['review_status'] for row in rows))}")


if __name__ == "__main__":
    main()
