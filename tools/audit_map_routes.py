"""Index direct map transfers and their event-page/branch context.

The output is a review aid for Archipelago region logic, not a reachability
proof. Scripts, switches changed elsewhere, event movement, and transfer
destinations selected indirectly still require manual investigation.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
from collections import Counter
from pathlib import Path

from audit_game import permanently_shadowed, read_json


PROJECT_DIR = Path(__file__).resolve().parents[1]
MAP_FILE = re.compile(r"Map(\d{3})\.json$")
FIELDS = (
    "source_map", "source_map_name", "event_id", "event_name", "page",
    "trigger", "command_index", "destination_map", "destination_map_name",
    "destination_x", "destination_y", "page_conditions", "branch_context",
    "permanently_shadowed",
)


def page_conditions(page: dict) -> list[str]:
    value = page["conditions"]
    result = []
    for slot in (1, 2):
        if value[f"switch{slot}Valid"]:
            result.append(f"switch {value[f'switch{slot}Id']} ON")
    if value["variableValid"]:
        result.append(f"variable {value['variableId']} >= {value['variableValue']}")
    if value["selfSwitchValid"]:
        result.append(f"self-switch {value['selfSwitchCh']} ON")
    if value["itemValid"]:
        result.append(f"item {value['itemId']} held")
    if value["actorValid"]:
        result.append(f"actor {value['actorId']} in party")
    return result


def branch_label(command: dict) -> str:
    params = command["parameters"]
    if command["code"] == 102:
        return f"choice {params[0]}"
    if command["code"] != 111:
        return f"command {command['code']} {params}"
    kind = params[0]
    if kind == 0:
        return f"switch {params[1]} {'ON' if params[2] == 0 else 'OFF'}"
    if kind == 1:
        operators = ("==", ">=", "<=", ">", "<", "!=")
        operator = operators[params[4]] if params[4] < len(operators) else f"op{params[4]}"
        operand = (str(params[3]) if params[2] == 0 else f"variable {params[3]}")
        return f"variable {params[1]} {operator} {operand}"
    if kind == 2:
        return f"self-switch {params[1]} {'ON' if params[2] == 0 else 'OFF'}"
    if kind == 4:
        actor_tests = ("in party", "name", "class", "skill", "weapon equipped",
                       "armor equipped", "state")
        test = actor_tests[params[2]] if params[2] < len(actor_tests) else f"test{params[2]}"
        return f"actor {params[1]} {test}" + (f" {params[3]}" if len(params) > 3 else "")
    if kind in (8, 9, 10):
        return f"{'item' if kind == 8 else 'weapon' if kind == 9 else 'armor'} {params[1]} held"
    if kind == 12:
        return f"script {params[1]}"
    return f"condition type {kind} {params[1:]}"


def transfer_rows(data_dir: Path):
    map_infos = read_json(data_dir / "MapInfos.json")
    names = {index: info.get("name", "") for index, info in enumerate(map_infos) if info}
    for path in sorted(data_dir.glob("Map*.json")):
        match = MAP_FILE.fullmatch(path.name)
        if not match:
            continue
        map_id = int(match[1])
        data = read_json(path)
        for event_id, event in enumerate(data["events"]):
            if not event:
                continue
            for page_index, page in enumerate(event["pages"]):
                contexts: dict[int, str] = {}
                shadowed = permanently_shadowed(event, page_index)
                for index, command in enumerate(page["list"]):
                    code = command["code"]
                    indent = command["indent"]
                    if code in (111, 102):
                        contexts[indent] = branch_label(command)
                    elif code == 411:
                        contexts[indent] = f"ELSE ({contexts.get(indent, 'unknown condition')})"
                    elif code in (402, 403):
                        contexts[indent] = (
                            f"choice {command['parameters'][0]}: "
                            f"{command['parameters'][1]}" if code == 402 else "choice canceled"
                        )
                    elif code in (412, 404):
                        contexts.pop(indent, None)
                    elif code == 201:
                        params = command["parameters"]
                        if params[0] != 0:
                            raise ValueError(f"Variable transfer in {path.name} event {event_id}")
                        destination = params[1]
                        yield {
                            "source_map": map_id,
                            "source_map_name": names.get(map_id, ""),
                            "event_id": event_id,
                            "event_name": event["name"],
                            "page": page_index,
                            "trigger": page["trigger"],
                            "command_index": index,
                            "destination_map": destination,
                            "destination_map_name": names.get(destination, ""),
                            "destination_x": params[2],
                            "destination_y": params[3],
                            "page_conditions": " | ".join(page_conditions(page)),
                            "branch_context": " | ".join(
                                contexts[level] for level in sorted(contexts) if level < indent
                            ),
                            "permanently_shadowed": shadowed,
                        }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    parser.add_argument("--out-dir", type=Path,
                        default=PROJECT_DIR / "build" / "game_audit")
    args = parser.parse_args()
    game_dir = args.game_dir.resolve(strict=True)
    out_dir = args.out_dir.resolve()
    if PROJECT_DIR not in out_dir.parents:
        parser.error("--out-dir must be inside the project folder")
    if not (game_dir / "Game.exe").is_file():
        parser.error("--game-dir must contain Game.exe")
    rows = list(transfer_rows(game_dir / "data"))
    out_dir.mkdir(parents=True, exist_ok=True)
    output = out_dir / "map_routes.csv"
    with output.open("w", newline="", encoding="utf-8") as target:
        writer = csv.DictWriter(target, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    edge_count = len({(row["source_map"], row["destination_map"]) for row in rows})
    live_rows = [row for row in rows if not row["permanently_shadowed"]]
    summary = {
        "direct_transfer_commands": len(rows),
        "unique_directed_map_edges": edge_count,
        "permanently_shadowed_transfer_commands": len(rows) - len(live_rows),
        "potentially_live_direct_transfer_commands": len(live_rows),
        "potentially_live_directed_map_edges": len({
            (row["source_map"], row["destination_map"]) for row in live_rows
        }),
        "maps_with_outgoing_routes": len({row["source_map"] for row in rows}),
        "maps_with_incoming_routes": len({row["destination_map"] for row in rows}),
        "page_conditioned_routes": sum(bool(row["page_conditions"]) for row in rows),
        "branch_conditioned_routes": sum(bool(row["branch_context"]) for row in rows),
        "target_map_counts": dict(Counter(row["destination_map"] for row in rows).most_common(10)),
    }
    (out_dir / "map_route_summary.json").write_text(
        json.dumps(summary, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(summary, indent=2))
    print(f"Routes written to {output}")


if __name__ == "__main__":
    main()
