"""Index apparently persistent guaranteed drops and encounter references for review.

This does not promote drops. A fixed drop probability does not establish a
unique encounter, an accessible enemy, or a permissible story requirement.
"""

from __future__ import annotations

import argparse
import json
from collections import Counter, defaultdict
from pathlib import Path

from audit_game import MAP_NAME, event_lists, permanently_shadowed, read_json
from review_equipment import VANILLA_ITEM_SCOPE
from encounter_scope import (FRIENDLY_KILL_ENEMIES, RANDOM_VISITOR_ENEMIES,
                             NONCOMBAT_VISITOR_ENEMIES, UNUSED_ENCOUNTER_ENEMIES,
                             VANILLA_GAUNTLET_MAPS)
from normal_mode_scope import HARD_ONLY_ENEMY_IDS


PROJECT_DIR = Path(__file__).resolve().parents[1]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    parser.add_argument("--audit-dir", type=Path, default=PROJECT_DIR / "build" / "game_audit")
    args = parser.parse_args()
    data_dir = args.game_dir.resolve(strict=True) / "data"
    audit_dir = args.audit_dir.resolve()
    if PROJECT_DIR not in audit_dir.parents:
        parser.error("--audit-dir must be inside the project folder")
    audit_dir.mkdir(parents=True, exist_ok=True)
    system = read_json(data_dir / "System.json")
    cheat_ids = {i for i, name in enumerate(system["switches"]) if name.upper() == "CHEATMODE"}
    troops = read_json(data_dir / "Troops.json")
    enemies = read_json(data_dir / "Enemies.json")
    databases = {kind: read_json(data_dir / f"{kind.title()}s.json") for kind in ("item", "weapon", "armor")}
    registry = read_json(PROJECT_DIR / "apworld" / "lookoutside" / "vertical_slice.json")
    active = {(r["battle_drop"]["enemy_id"], r["battle_drop"]["drop_index"]): r["key"]
              for r in registry["locations"] if "battle_drop" in r}
    membership = defaultdict(list)
    for troop in troops:
        if troop:
            for index, member in enumerate(troop["members"]):
                membership[member["enemyId"]].append({"troop_id": troop["id"],
                    "member_index": index, "hidden": member["hidden"]})
    direct_calls = defaultdict(list)
    transformations = defaultdict(list)
    indirect_calls = []
    script_calls = []
    maps = {}
    for context, commands in event_lists(data_dir):
        if cheat_ids.intersection(context["required_switches"]):
            continue
        if context["source_type"] == "map_event":
            mid = context["map_id"]
            if mid not in maps:
                maps[mid] = read_json(data_dir / context["file"])
            if permanently_shadowed(maps[mid]["events"][context["event_id"]], context["page"]):
                continue
        for index, command in enumerate(commands):
            code, params = command["code"], command["parameters"]
            reference = {**context, "command_index": index, "parameters": params}
            if code == 301:
                if params[0] == 0:
                    direct_calls[params[1]].append(reference)
                else:
                    indirect_calls.append(reference)
            elif code == 336:
                transformations[params[1]].append(reference)
            elif code in (355, 655) and any(text in str(params[0]) for text in
                                         ("BattleManager.setup", ".transform(")):
                script_calls.append(reference)
    random_encounters = defaultdict(list)
    for path in sorted(data_dir.glob("Map*.json")):
        if MAP_NAME.fullmatch(path.name):
            mid = int(path.stem[3:])
            game_map = maps.get(mid) or read_json(path)
            for encounter in game_map.get("encounterList", []):
                random_encounters[encounter["troopId"]].append({"map_id": mid, **encounter})
    rows = []
    for enemy in enemies:
        if not enemy:
            continue
        for index, drop in enumerate(enemy["dropItems"]):
            if drop["kind"] == 0 or drop["denominator"] != 1:
                continue
            kind = {1: "item", 2: "weapon", 3: "armor"}[drop["kind"]]
            item = databases[kind][drop["dataId"]]
            if kind == "item" and (drop["dataId"] in VANILLA_ITEM_SCOPE or
                                  (item["consumable"] and item["itypeId"] != 2)):
                continue
            troop_ids = sorted({member["troop_id"] for member in membership[enemy["id"]]})
            refs = [ref for tid in troop_ids for ref in direct_calls[tid]]
            reason = FRIENDLY_KILL_ENEMIES.get(enemy["id"], "")
            if enemy["id"] in HARD_ONLY_ENEMY_IDS:
                reason = "Hard-only encounter; outside the Normal-first pool"
            elif enemy["id"] in RANDOM_VISITOR_ENEMIES:
                reason = "Random visitor-pool encounter; random encounters and their loot remain vanilla"
            elif enemy["id"] in NONCOMBAT_VISITOR_ENEMIES:
                reason = "Visitor dialogue aborts without combat; database loot is not an acquisition"
            elif enemy["id"] in UNUSED_ENCOUNTER_ENEMIES:
                reason = "Unused test/obsolete encounter absent from fixed calls and live visitor queues"
            elif not troop_ids and not transformations[enemy["id"]] and not script_calls:
                reason = "Unused enemy definition: no troop membership or transformation reference"
            elif (refs and not any(random_encounters[tid] for tid in troop_ids) and
                  not transformations[enemy["id"]] and
                  all(ref.get("map_id") in VANILLA_GAUNTLET_MAPS for ref in refs)):
                reason = "Only direct encounters are in the excluded Gauntlet"
            rows.append({"enemy_id": enemy["id"], "enemy_name": enemy["name"],
                         "drop_index": index, "kind": kind, "database_id": drop["dataId"],
                         "item_name": item["name"], "troop_memberships": membership[enemy["id"]],
                         "direct_encounters": refs,
                         "random_encounters": [ref for tid in troop_ids for ref in random_encounters[tid]],
                         "transformations_into_enemy": transformations[enemy["id"]],
                         "review_status": ("active" if (enemy["id"], index) in active else
                                           "keep_vanilla" if reason else "unreviewed"),
                         "review_notes": reason,
                         "active_location_key": active.get((enemy["id"], index))})
    report = {"audited_game_id": system["advanced"]["gameId"],
              "audited_version_id": system["versionId"],
              "warning": "References are candidates, not one-time acquisition proof. Audit dynamic encounters and story outcomes.",
              "scope_policy": "Optional kills of friendly or recruitable characters are excluded; their drops stay vanilla.",
              "drops": rows, "indirect_battle_calls": indirect_calls,
              "scripted_battle_or_transform_calls": script_calls}
    output = audit_dir / "guaranteed_drop_review.json"
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Queued {len(rows)} apparently persistent guaranteed drop entries at {output}")
    print(f"Kinds: {dict(Counter(row['kind'] for row in rows))}")
    print(f"Review status: {dict(Counter(row['review_status'] for row in rows))}")
    print(f"Indirect battle commands requiring manual resolution: {len(indirect_calls)}")
    print(f"Scripted battle/transform references: {len(script_calls)}")


if __name__ == "__main__":
    main()
