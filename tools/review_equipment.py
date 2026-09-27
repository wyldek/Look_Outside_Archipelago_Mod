"""Expand simple equipment or item candidates into local review sheets."""

from __future__ import annotations

import argparse
import csv
import json
from collections import Counter
from pathlib import Path

from audit_game import read_json
from encounter_scope import VANILLA_FRIENDLY_LOCKED_MAPS, VANILLA_GAUNTLET_MAPS
from normal_mode_scope import HARD_ONLY_PICKUPS, HARD_ONLY_KEY_IDS
from normal_access_scope import HARD_ONLY_MAPS
from unused_map_scope import UNUSED_SEA_MAPS
from equipment_source_exclusions import EXCLUDED_SOURCES


PROJECT_DIR = Path(__file__).resolve().parents[1]
FIELDS = (
    "source_key", "map_id", "map_name", "event_id", "event_name", "page",
    "command_index", "kind", "database_id", "item_name", "item_type_id",
    "consumable", "trigger",
    "required_switches", "required_self_switch", "page_count", "command_codes",
    "text_before", "text_after", "nearby_message_indexes", "scope_proposal",
    "scope_reason", "review_status", "review_notes",
)

# These items are repeatable resources or consumable containers, even when the
# RPG Maker database calls them non-consumable or classifies them as key items.
# This is an exclusion from the AP item/location pool, not a list of every
# material or consumable in the game. New candidate IDs require review.
VANILLA_ITEM_SCOPE = {
    **{i: "User decision: household valuables sold/appraised or given as gifts stay in the local economy"
       for i in range(234, 278)},
    3: "Suturing Kit is a medical consumable with charges tracked by Common Event 171",
    76: "Opens a random gift through Common Event 91",
    77: "Opens an ammo crate through Common Event 91",
    106: "Dollar Coin is vending currency, not a persistent collectible",
    151: "Detonator component used to craft sapper charges",
    158: "Chemical crafting reagent",
    159: "Fuel used as a crafting resource",
    160: "Chemical catalyst used in formulae",
    176: "Repair resource usable through Common Event 98",
    177: "Junk resource spent by common events",
    186: "Ammo Belt is ammunition for a belt-fed gun",
    291: "Dog Tags are sold in bulk for money in troop 296",
    319: "Batteries are spent by the native weapon-repair script in bunchastuff.js",
    354: "Eye is one-use Butcher bait: troop240 consumes it when revealing the enemy",
    359: "Cassette Tapes are spent as shop currency in troop 227",
    375: "Rat Tails are spent as shop currency in troop 113",
    381: "Potting soil spent in the plant system",
    382: "Worm Eggs are spent as shop currency in troop 560",
}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    parser.add_argument("--category", choices=("equipment", "item"),
                        default="equipment")
    parser.add_argument("--audit-dir", type=Path,
                        default=PROJECT_DIR / "build" / "game_audit")
    args = parser.parse_args()
    game_dir = args.game_dir.resolve(strict=True)
    audit_dir = args.audit_dir.resolve()
    if PROJECT_DIR not in audit_dir.parents:
        parser.error("--audit-dir must be inside the project folder")
    candidates = read_json(audit_dir / f"simple_one_time_{args.category}_candidates.json")
    output = audit_dir / f"{args.category}_review.csv"
    prior_review = {}
    registry = read_json(PROJECT_DIR / "apworld" / "lookoutside" / "vertical_slice.json")
    active = {(source["map_id"], source["event_id"], source["page"], source["command_index"]): row["key"]
              for row in registry["locations"] for source in [row, *row.get("source_variants", [])]
              if "troop_id" not in source and "common_event_id" not in source}
    if output.is_file():
        with output.open("r", encoding="utf-8", newline="") as source:
            prior_review = {row["source_key"]: row for row in csv.DictReader(source)}
    map_cache = {}
    rows = []
    for candidate in candidates:
        file_name = candidate["file"]
        if file_name not in map_cache:
            map_cache[file_name] = read_json(game_dir / "data" / file_name)
        event = map_cache[file_name]["events"][candidate["event_id"]]
        page = event["pages"][candidate["page"]]
        commands = page["list"]
        reward_index = candidate["command_index"]
        before = [command["parameters"][0] for command in commands[:reward_index]
                  if command["code"] == 401]
        after = [command["parameters"][0] for command in commands[reward_index + 1:]
                 if command["code"] == 401]
        # Pickup text can appear before the gain command on a Take branch, or
        # after it and the consumed self-switch. Record nearby text commands
        # for review without assuming which line is the pickup notification.
        nearby_message_indexes = [
            index for index in range(max(0, reward_index - 3),
                                     min(len(commands), reward_index + 4))
            if commands[index]["code"] == 401
        ]
        if args.category == "item":
            scope_reason = VANILLA_ITEM_SCOPE.get(candidate["database_id"])
            scope_proposal = "keep_vanilla" if scope_reason else "review_for_ap"
            scope_reason = scope_reason or "One-time item candidate; inspect actual use and alternate sources"
        else:
            scope_proposal = "review_for_ap"
            scope_reason = "One-time equipment candidate; inspect acquisition and display text"
        if candidate["map_id"] in VANILLA_FRIENDLY_LOCKED_MAPS:
            scope_proposal = "keep_vanilla"
            scope_reason = "Room access requires an optional friendly-character kill; contents stay vanilla"
        source_key = (f"map{candidate['map_id']:03d}_event{candidate['event_id']:03d}"
                      f"_page{candidate['page']}_cmd{reward_index}")
        prior = prior_review.get(source_key, {})
        signature = (candidate["map_id"], candidate["event_id"], candidate["page"], reward_index)
        reason = EXCLUDED_SOURCES.get(signature)
        if signature in HARD_ONLY_PICKUPS or candidate["map_id"] in HARD_ONLY_MAPS or (
                args.category == "item" and candidate["database_id"] in HARD_ONLY_KEY_IDS):
            reason = "Hard-only source; outside the Normal-first pool"
        elif candidate["map_id"] in UNUSED_SEA_MAPS:
            reason = "Disconnected unused sea map; no playable entrance"
        elif candidate["map_id"] in VANILLA_GAUNTLET_MAPS:
            reason = "Entire Gauntlet stays vanilla"
        if reason:
            scope_proposal, scope_reason = "keep_vanilla", reason
        status = "active" if signature in active else (
            "keep_vanilla" if scope_proposal == "keep_vanilla" else prior.get("review_status", "unreviewed"))
        rows.append({
            "source_key": source_key,
            "map_id": candidate["map_id"],
            "map_name": candidate["map_name"],
            "event_id": candidate["event_id"],
            "event_name": candidate["event_name"],
            "page": candidate["page"],
            "command_index": reward_index,
            "kind": candidate["kind"],
            "database_id": candidate["database_id"],
            "item_name": candidate["item_name"],
            "item_type_id": candidate["item_type_id"],
            "consumable": candidate["consumable"],
            "trigger": page["trigger"],
            "required_switches": ",".join(map(str, candidate["required_switches"])),
            "required_self_switch": candidate["required_self_switch"] or "",
            "page_count": len(event["pages"]),
            "command_codes": ",".join(str(command["code"]) for command in commands),
            "text_before": " | ".join(before),
            "text_after": " | ".join(after),
            "nearby_message_indexes": ",".join(map(str, nearby_message_indexes)),
            "scope_proposal": scope_proposal,
            "scope_reason": scope_reason,
            "review_status": status,
            "review_notes": active.get(signature, scope_reason if status == "keep_vanilla" else prior.get("review_notes", "")),
        })
    with output.open("w", encoding="utf-8", newline="") as target:
        writer = csv.DictWriter(target, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    print(f"Expanded {len(rows)} candidates to {output}")
    print(f"Triggers: {dict(Counter(row['trigger'] for row in rows))}")
    print(f"Review status: {dict(Counter(row['review_status'] for row in rows))}")


if __name__ == "__main__":
    main()
