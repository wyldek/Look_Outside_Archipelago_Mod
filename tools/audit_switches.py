"""Index switch writes and gating reads for progression-state review.

This produces candidate evidence, not a list of randomized progression states.
The installed game is only read; all output stays under the project build tree.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
from pathlib import Path

from audit_game import event_lists, read_json


PROJECT_DIR = Path(__file__).resolve().parents[1]
SCRIPT_READ = re.compile(r"\$gameSwitches\.value\s*\(\s*(\d+)\s*\)")
SCRIPT_WRITE = re.compile(r"\$gameSwitches\.setValue\s*\(\s*(\d+)\s*,")


def switch_rows(game_dir: Path):
    names = read_json(game_dir / "data" / "System.json")["switches"]
    writes = []
    reads = []
    for context, commands in event_lists(game_dir / "data"):
        page_has_transfer = any(command["code"] == 201 for command in commands)
        for switch_id in context["required_switches"]:
            reads.append({**context, "command_index": None, "switch_id": switch_id,
                          "read_type": "page_transfer" if page_has_transfer
                          else "page_condition"})
        for index, command in enumerate(commands):
            code = command["code"]
            params = command["parameters"]
            source = {**context, "command_index": index}
            if code == 121 and len(params) >= 3:
                start, end, operation = params[:3]
                if isinstance(start, int) and isinstance(end, int):
                    for switch_id in range(start, min(end, len(names) - 1) + 1):
                        writes.append({**source, "switch_id": switch_id,
                                       "write_type": "on" if operation == 0 else "off"})
            elif code == 111 and len(params) >= 3 and params[0] == 0:
                branch_has_transfer = False
                for following in commands[index + 1:]:
                    if following["indent"] == command["indent"] and following["code"] in (411, 412):
                        break
                    if following["code"] == 201:
                        branch_has_transfer = True
                reads.append({**source, "switch_id": params[1],
                              "read_type": ("branch_transfer" if branch_has_transfer else
                                            "branch_on" if params[2] == 0 else "branch_off")})
            elif code in (355, 655):
                script = str(params[0]) if params else ""
                for match in SCRIPT_READ.finditer(script):
                    reads.append({**source, "switch_id": int(match.group(1)),
                                  "read_type": "script"})
                for match in SCRIPT_WRITE.finditer(script):
                    writes.append({**source, "switch_id": int(match.group(1)),
                                   "write_type": "script"})

    counts = {}
    for switch_id, name in enumerate(names):
        if switch_id and name:
            counts[switch_id] = {"switch_id": switch_id, "name": name,
                                 "on_writes": 0, "off_writes": 0,
                                 "script_writes": 0, "branch_reads": 0,
                                 "page_reads": 0, "script_reads": 0,
                                 "page_transfer_reads": 0, "branch_transfer_reads": 0,
                                 "map_on_writes": 0}
    for row in writes:
        count = counts.get(row["switch_id"])
        if not count:
            continue
        field = {"on": "on_writes", "off": "off_writes",
                 "script": "script_writes"}[row["write_type"]]
        count[field] += 1
        if row["write_type"] == "on" and row["source_type"] == "map_event":
            count["map_on_writes"] += 1
    for row in reads:
        count = counts.get(row["switch_id"])
        if not count:
            continue
        field = ("page_reads" if row["read_type"].startswith("page") else
                 "script_reads" if row["read_type"] == "script" else "branch_reads")
        count[field] += 1
        if row["read_type"] == "page_transfer":
            count["page_transfer_reads"] += 1
        elif row["read_type"] == "branch_transfer":
            count["branch_transfer_reads"] += 1
    return writes, reads, list(counts.values())


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    parser.add_argument("--out-dir", type=Path,
                        default=PROJECT_DIR / "build" / "game_audit")
    args = parser.parse_args()
    game_dir = args.game_dir.resolve(strict=True)
    out_dir = args.out_dir.resolve()
    if not (game_dir / "data" / "System.json").is_file():
        parser.error("--game-dir must contain data/System.json")
    if PROJECT_DIR not in out_dir.parents:
        parser.error("--out-dir must be inside the project folder")
    writes, reads, summary = switch_rows(game_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    for name, rows in (("switch_writes.json", writes),
                       ("switch_reads.json", reads)):
        (out_dir / name).write_text(json.dumps(rows, ensure_ascii=False, indent=2),
                                    encoding="utf-8")
    fields = list(summary[0])
    with (out_dir / "switch_summary.csv").open("w", encoding="utf-8", newline="") as target:
        writer = csv.DictWriter(target, fieldnames=fields)
        writer.writeheader()
        writer.writerows(summary)
    candidates = [row for row in summary if row["on_writes"] and
                  not row["off_writes"] and
                  (row["branch_reads"] or row["page_reads"] or row["script_reads"])]
    with (out_dir / "permanent_switch_candidates.csv").open(
        "w", encoding="utf-8", newline=""
    ) as target:
        writer = csv.DictWriter(target, fieldnames=fields)
        writer.writeheader()
        writer.writerows(candidates)
    print(f"Indexed {len(writes)} switch writes and {len(reads)} reads")
    print(f"Named switches: {len(summary)}; permanent-state candidates: {len(candidates)}")
    print(f"Output: {out_dir}")


if __name__ == "__main__":
    main()
