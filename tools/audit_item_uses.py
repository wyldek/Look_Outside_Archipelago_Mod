"""Trace direct uses of registry items and the conservative pickup review queue.

This report is evidence for manual scope and progression review. Dynamic
JavaScript may refer to item IDs indirectly and is not fully resolved here.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
from collections import defaultdict
from pathlib import Path

from audit_game import MAP_NAME, event_lists, read_json


PROJECT_DIR = Path(__file__).resolve().parents[1]


def reference(context: dict, index: int) -> str:
    if context["source_type"] == "map_event":
        return f"Map{context['map_id']:03d} event{context['event_id']:03d} page{context['page']} cmd{index}"
    if context["source_type"] == "common_event":
        return f"CommonEvent{context['event_id']} cmd{index}"
    return f"Troop{context['troop_id']} page{context['page']} cmd{index}"


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
    data_dir = game_dir / "data"
    database = read_json(data_dir / "Items.json")
    with (audit_dir / "item_review.csv").open("r", encoding="utf-8", newline="") as source:
        candidates = list(csv.DictReader(source))
    registry = read_json(PROJECT_DIR / "apworld" / "lookoutside" / "vertical_slice.json")
    registered = {item["database_id"]: item for item in registry["items"] if item["kind"] == "item"}
    ids = {int(row["database_id"]) for row in candidates} | registered.keys()
    refs = defaultdict(lambda: defaultdict(list))
    script_patterns = {
        item_id: re.compile(rf"\$dataItems\s*\[\s*{item_id}\s*\]")
        for item_id in ids
    }
    for context, commands in event_lists(data_dir):
        for index, command in enumerate(commands):
            code = command["code"]
            params = command["parameters"]
            ref = reference(context, index)
            if code == 126 and params[0] in ids:
                refs[params[0]]["direct_gain" if params[1] == 0 else "direct_loss"].append(ref)
            elif code == 111 and params[:1] == [8] and params[1] in ids:
                refs[params[1]]["item_condition"].append(ref)
            elif code == 111 and len(params) >= 5 and params[:1] == [1] and params[2] == 0 and params[3] in ids:
                # Key-item selection writes a variable rather than testing inventory.
                # This also finds unrelated numeric comparisons, so retain the variable
                # and label it as evidence requiring review.
                refs[params[3]]["possible_selected_item_condition"].append(
                    {"source": ref, "variable_id": params[1], "comparison": params[4]})
            elif code in (355, 655, 102) or (code == 111 and params[:1] == [12]):
                script = str(params)
                for item_id, pattern in script_patterns.items():
                    if pattern.search(script):
                        refs[item_id]["literal_script_reference"].append(ref)
    for path in sorted(data_dir.glob("Map*.json")):
        if not MAP_NAME.fullmatch(path.name):
            continue
        map_id = int(path.stem[3:])
        data = read_json(path)
        for event_id, event in enumerate(data["events"]):
            if not event:
                continue
            for page_index, page in enumerate(event["pages"]):
                condition = page["conditions"]
                if condition.get("itemValid") and condition["itemId"] in ids:
                    item_id = condition["itemId"]
                    refs[item_id]["page_condition"].append(
                        f"Map{map_id:03d} event{event_id:03d} page{page_index}")
    results = []
    for item_id in sorted(ids):
        item = database[item_id]
        result = {
            "database_id": item_id,
            "name": item["name"],
            "item_type_id": item["itypeId"],
            "database_consumable": item["consumable"],
            "description": item["description"],
            "effects": item["effects"],
            "common_event_effects": [effect["dataId"] for effect in item["effects"] if effect["code"] == 44],
            "registered": item_id in registered,
            "classification": registered.get(item_id, {}).get("classification"),
            "delivery_switches": registered.get(item_id, {}).get("delivery_switches", []),
            "registered_locations": [row["key"] for row in registry["locations"]
                                     if row["reward_kind"] == "item" and row["reward_database_id"] == item_id],
            "candidate_sources": [row["source_key"] for row in candidates
                                  if int(row["database_id"]) == item_id],
            "scope_proposal": next((row["scope_proposal"] for row in candidates
                                    if int(row["database_id"]) == item_id), "registered"),
            "references": dict(refs[item_id]),
        }
        results.append(result)
    output = audit_dir / "item_uses.json"
    output.write_text(json.dumps(results, indent=2, ensure_ascii=False) + "\n",
                      encoding="utf-8")
    print(f"Traced {len(results)} candidate database items to {output}")
    print(f"Items with direct inventory tests: "
          f"{sum(bool(row['references'].get('item_condition') or row['references'].get('page_condition')) for row in results)}")


if __name__ == "__main__":
    main()
