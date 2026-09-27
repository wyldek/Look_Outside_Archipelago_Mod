"""Reconcile every direct positive map/troop grant, retaining unresolved rows.

Common events and JavaScript grants have separate complete inventories. Prior
manual map reviews are reused only for vanilla decisions; active rows always
come from the current registry. Database consumable flags alone are inadequate.
"""

import argparse
from collections import Counter
import csv
import hashlib
import json
from pathlib import Path

from audit_game import event_lists, permanently_shadowed, read_json
from encounter_scope import VANILLA_GAUNTLET_MAPS, VANILLA_FRIENDLY_LOCKED_MAPS, FRIENDLY_KILL_REWARDS
from equipment_source_exclusions import EXCLUDED_SOURCES
from normal_mode_scope import HARD_ONLY_KEY_IDS, HARD_ONLY_PICKUPS
from normal_access_scope import HARD_ONLY_MAPS
from unused_map_scope import UNUSED_SEA_MAPS
from review_equipment import VANILLA_ITEM_SCOPE

PROJECT = Path(__file__).resolve().parents[1]
LOCAL_ITEMS = {
    **{i: "Local currency" for i in (105, 107, 108, 109, 110)},
    **{i: "Ammunition remains vanilla" for i in (180, 181, 182, 183, 184, 185, 197, 202, 203, 661)},
    170: "Caught roaches are repeatable local supplies",
    173: "Soap is a shower supply", 174: "Toothpaste is a hygiene supply",
    284: "Papineau's packed lunch and its refills stay in the food economy",
    286: "Ice Melt Salt is a local access supply",
    289: "Sapper Charge is a consumable local access explosive",
    290: "Defused Mines are sold to Minesweeper; local supply/currency",
    363: "Breakable lockpicks are local access supplies",
    130: "All-Seeing 8-Ball is consumed by CE280 command75",
}
TROOPS = {
    34: "Leigh's Pistol here is a Hard-only $100 purchase",
    55: "Gamer exchanges the existing Necurai game for a katana; preserve the native unique-item trade",
    78: "Kaeley's repeatable key purchases remain vanilla",
    113: "Rathole shop exchanges local Rat Tail currency for equipment",
    117: "Eugene repairs Fuzzy and temporarily supplies Empty Handed; owned-item transformations",
    118: "Nestor's handgun upgrade and Fuzzy conversion use owned inputs",
    124: "Returns manuscripts or repairs the owned Telescope Pieces",
    145: "Photo processing and repeatable photo paper supply",
    155: "Hard-mode Vending Machine Key purchase; Normal free gift is separately registered",
    167: "Owned Ethereal Dagger transforms into Spine Dagger",
    227: "Cassette-currency shop equipment",
    255: "Alternate Gamer uses the same unique-game-for-katana trade",
    294: "Paid $80 replacement detectors; the first gift is separately registered",
    330: "Rage Armor requires eliminating the other Freds; outside the approved reusable-jar exception",
    331: "Strange Feather requires eliminating the other Freds; keep the friendly-kill-dependent survivor reward vanilla",
    332: "Cheat-menu hats or the transformation of the already-owned fake hat",
    333: "Cowardly Boots require eliminating the other Freds; keep the friendly-kill-dependent survivor reward vanilla",
    336: "All five direct equipment grants are inside CHEATMODE's test-duplication branch",
    415: "Blood-currency shop equipment",
    540: "Repeatable Chew Toy replacement when the toy is absent",
    560: "Worm Egg currency shop equipment",
    623: "Optional Hellen kill reward; companion equipment remains vanilla",
    652: "Drooling Husk returns already-owned telescope forms",
    816: "Alternate Hellen kill reward; companion equipment remains vanilla",
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", required=True, type=Path)
    data = parser.parse_args().game_dir.resolve(strict=True) / "data"
    registry = read_json(PROJECT / "apworld/lookoutside/vertical_slice.json")
    require_build = read_json(data / "System.json")
    if require_build["versionId"] != registry["audited_version_id"]:
        raise ValueError("Game build changed")
    active = {}
    for row in registry["locations"]:
        for s in (row, *row.get("source_variants", [])):
            if "common_event_id" in s:
                continue
            key = (("troop_event", s["troop_id"], s["page"], s["command_index"]) if "troop_id" in s else
                   ("map_event", s["map_id"], s["event_id"], s["page"], s["command_index"]))
            active[key] = row["key"]
    prior = {}
    for name in ("equipment_review.csv", "item_review.csv", "complex_equipment_review.csv"):
        with (PROJECT / "build/game_audit" / name).open(encoding="utf-8", newline="") as f:
            for row in csv.DictReader(f):
                if row["review_status"] == "keep_vanilla":
                    sig = tuple(int(row[k]) for k in ("map_id", "event_id", "page", "command_index"))
                    prior[sig] = row.get("review_notes") or row.get("scope_reason") or "Prior manual vanilla review"
    databases = {126: read_json(data / "Items.json"), 127: read_json(data / "Weapons.json"), 128: read_json(data / "Armors.json")}
    rows, maps, hashes = [], {}, {}
    for context, commands in event_lists(data):
        typ = context["source_type"]
        if typ not in ("map_event", "troop_event"):
            continue
        filename = context["file"]
        if filename not in hashes:
            hashes[filename] = hashlib.sha256((data / filename).read_bytes()).hexdigest()
        for index, command in enumerate(commands):
            code, params = command["code"], command["parameters"]
            if code not in databases or params[1] != 0:
                continue
            dbid, ob = params[0], databases[code][params[0]]
            key = ((typ, context["troop_id"], context["page"], index) if typ == "troop_event" else
                   (typ, context["map_id"], context["event_id"], context["page"], index))
            status, reason = "unreviewed", None
            if key in active:
                status, reason = "active", active[key]
            elif code == 126 and dbid in VANILLA_ITEM_SCOPE:
                reason = VANILLA_ITEM_SCOPE[dbid]
            elif code == 126 and dbid in LOCAL_ITEMS:
                reason = LOCAL_ITEMS[dbid]
            elif code == 126 and ob["consumable"] and ob["itypeId"] != 2:
                reason = "Native gameplay consumable"
            elif 7 in context["required_switches"]:
                reason = "CHEATMODE event page"
            elif typ == "troop_event":
                reason = TROOPS.get(context["troop_id"])
            else:
                mid, eid, page, ci = sig = key[1:]
                if filename not in maps:
                    maps[filename] = read_json(data / filename)
                if permanently_shadowed(maps[filename]["events"][eid], page):
                    reason = "Permanently hidden by a later unconditional page"
                elif mid in VANILLA_GAUNTLET_MAPS | VANILLA_FRIENDLY_LOCKED_MAPS:
                    reason = "Excluded Gauntlet or room requiring a friendly-character kill"
                elif mid in UNUSED_SEA_MAPS:
                    reason = "Disconnected unused sea map"
                elif mid in HARD_ONLY_MAPS or sig in HARD_ONLY_PICKUPS or code == 126 and dbid in HARD_ONLY_KEY_IDS:
                    reason = "Hard-only acquisition"
                elif sig in EXCLUDED_SOURCES or sig in FRIENDLY_KILL_REWARDS:
                    reason = EXCLUDED_SOURCES.get(sig, "Optional friendly-character kill reward")
                elif mid == 5:
                    reason = "Initial game configuration/test setup, not a world acquisition"
                elif mid == 56:
                    reason = "Cafe store stock and its post-Mutt pickup copies stay vanilla"
                elif code == 126 and dbid in (332, 336, 337, 338, 339, 342, 343, 386, 387):
                    reason = "Owned-object return, placement, processing or telescope transformation; original inputs are separately audited"
                elif code == 126 and dbid == 334:
                    reason = "Returns the previously placed Guinea Pig"
                elif code == 126 and dbid == 5:
                    reason = "Rat Baby Thing inventory companion; companion recruitment remains vanilla"
                elif code == 126 and dbid == 368:
                    reason = "Philippe's companion remains and native resurrection chain stay vanilla"
                else:
                    reason = prior.get(sig)
            if reason and status != "active":
                status = "keep_vanilla"
            rows.append({**context, "command_index": index, "command_code": code, "parameters": params,
                         "item_name": ob["name"], "review_status": status, "reason": reason})
    report = {"scope": "Every direct positive map/troop grant; scripts, common events and enemy drops are separate inventories",
              "registry_version": registry["registry_version"], "counts": dict(Counter(r["review_status"] for r in rows)),
              "source_sha256": hashes, "rows": rows}
    target = PROJECT / "build/game_audit/map_troop_reward_review.json"
    target.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k not in ("rows", "source_sha256")}))
    for row in rows:
        if row["review_status"] == "unreviewed":
            print(row["file"], row.get("event_id"), row.get("troop_id"), row["page"], row["command_index"], row["item_name"])


if __name__ == "__main__":
    main()
