"""Create a reproducible, read-only inventory of a Look Outside installation.

This is an acquisition *candidate* audit, not an Archipelago location list.
The game may grant items through scripts, shared common events, shops, drops,
or other paths that require manual classification and runtime verification.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from collections import Counter
from pathlib import Path


MAP_NAME = re.compile(r"Map\d{3}\.json$")
GAIN_ITEM = re.compile(r"\$gameParty\.gainItem\s*\(")
REWARD_CODES = {126: "item", 127: "weapon", 128: "armor"}
SHOP_KINDS = {0: "item", 1: "weapon", 2: "armor"}
DROP_KINDS = {1: "item", 2: "weapon", 3: "armor"}
FINGERPRINT_FILES = (
    "System.json",
    "Items.json",
    "Weapons.json",
    "Armors.json",
    "CommonEvents.json",
    "MapInfos.json",
    "Enemies.json",
    "Troops.json",
)


def read_json(path: Path):
    with path.open("r", encoding="utf-8-sig") as source:
        return json.load(source)


def file_hash(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def event_lists(data_dir: Path):
    map_infos = read_json(data_dir / "MapInfos.json")
    common_events = read_json(data_dir / "CommonEvents.json")
    for event_id, event in enumerate(common_events):
        if event:
            yield {
                "file": "CommonEvents.json",
                "source_type": "common_event",
                "map_id": None,
                "map_name": None,
                "troop_id": None,
                "event_id": event_id,
                "event_name": event.get("name", ""),
                "page": None,
                "required_switches": [],
                "required_self_switch": None,
            }, event.get("list", [])

    for path in sorted(data_dir.glob("Map*.json")):
        if not MAP_NAME.fullmatch(path.name):
            continue
        map_id = int(path.stem[3:])
        map_info = map_infos[map_id] if map_id < len(map_infos) else None
        for event_id, event in enumerate(read_json(path).get("events", [])):
            if not event:
                continue
            for page_index, page in enumerate(event.get("pages", [])):
                conditions = page.get("conditions", {})
                required_switches = [
                    conditions[f"switch{slot}Id"]
                    for slot in (1, 2)
                    if conditions.get(f"switch{slot}Valid")
                ]
                yield {
                    "file": path.name,
                    "source_type": "map_event",
                    "map_id": map_id,
                    "map_name": map_info.get("name", "") if map_info else None,
                    "troop_id": None,
                    "event_id": event_id,
                    "event_name": event.get("name", ""),
                    "page": page_index,
                    "required_switches": required_switches,
                    "required_self_switch": conditions.get("selfSwitchCh")
                    if conditions.get("selfSwitchValid") else None,
                }, page.get("list", [])

    for troop_id, troop in enumerate(read_json(data_dir / "Troops.json")):
        if not troop:
            continue
        for page_index, page in enumerate(troop.get("pages", [])):
            yield {
                "file": "Troops.json",
                "source_type": "troop_event",
                "map_id": None,
                "map_name": None,
                "troop_id": troop_id,
                "event_id": None,
                "event_name": troop.get("name", ""),
                "page": page_index,
                "required_switches": [],
                "required_self_switch": None,
            }, page.get("list", [])


def extract_candidates(data_dir: Path):
    databases = {
        kind: read_json(data_dir / f"{kind.title()}s.json")
        for kind in ("item", "weapon", "armor")
    }
    command_counts = Counter()
    grants = []
    script_calls = []
    shops = []
    common_event_calls = []
    for context, commands in event_lists(data_dir):
        for command_index, command in enumerate(commands):
            code = command["code"]
            command_counts[code] += 1
            source = {**context, "command_index": command_index}
            if code in REWARD_CODES:
                kind = REWARD_CODES[code]
                params = command["parameters"]
                item_id = params[0]
                item = databases[kind][item_id] if item_id < len(databases[kind]) else None
                grants.append(
                    {
                        **source,
                        "kind": kind,
                        "database_id": item_id,
                        "item_name": item.get("name", "") if item else None,
                        "item_type_id": item.get("itypeId") if kind == "item" and item else None,
                        "consumable": item.get("consumable") if kind == "item" and item else None,
                        "operation": "gain" if params[1] == 0 else "lose",
                        "amount": params[3] if params[2] == 0 else None,
                        "variable_amount_id": params[3] if params[2] == 1 else None,
                    }
                )
            elif code in (355, 655):
                script = str(command["parameters"][0])
                if GAIN_ITEM.search(script):
                    script_calls.append({**source, "script": script[:240]})
            elif code in (302, 605):
                params = command["parameters"]
                kind = SHOP_KINDS.get(params[0])
                if kind:
                    item_id = params[1]
                    item = databases[kind][item_id] if item_id < len(databases[kind]) else None
                    shops.append(
                        {
                            **source,
                            "kind": kind,
                            "database_id": item_id,
                            "item_name": item.get("name", "") if item else None,
                            "custom_price": params[3] if params[2] else None,
                        }
                    )
            elif code == 117:
                common_event_calls.append(
                    {**source, "called_common_event_id": command["parameters"][0]}
                )
    return command_counts, grants, script_calls, shops, common_event_calls


def enemy_drops(data_dir: Path):
    databases = {
        kind: read_json(data_dir / f"{kind.title()}s.json")
        for kind in ("item", "weapon", "armor")
    }
    results = []
    for enemy_id, enemy in enumerate(read_json(data_dir / "Enemies.json")):
        if not enemy:
            continue
        for drop_index, drop in enumerate(enemy.get("dropItems", [])):
            kind = DROP_KINDS.get(drop.get("kind"))
            if not kind:
                continue
            item_id = drop["dataId"]
            item = databases[kind][item_id] if item_id < len(databases[kind]) else None
            results.append(
                {
                    "enemy_id": enemy_id,
                    "enemy_name": enemy.get("name", ""),
                    "drop_index": drop_index,
                    "kind": kind,
                    "database_id": item_id,
                    "item_name": item.get("name", "") if item else None,
                    "denominator": drop.get("denominator"),
                }
            )
    return results


def plugin_reward_calls(game_dir: Path):
    registry = (game_dir / "js" / "plugins.js").read_text(encoding="utf-8-sig")
    entries = json.loads(registry[registry.index("[") : registry.rindex("]") + 1])
    results = []
    for entry in entries:
        if not entry.get("status"):
            continue
        path = game_dir / "js" / "plugins" / f"{entry['name']}.js"
        if not path.is_file():
            continue
        for line_number, line in enumerate(path.read_text(encoding="utf-8-sig").splitlines(), 1):
            if GAIN_ITEM.search(line):
                results.append(
                    {
                        "file": path.relative_to(game_dir).as_posix(),
                        "line": line_number,
                        "script": line.strip()[:240],
                    }
                )
    return results


def permanently_shadowed(event: dict, page_index: int) -> bool:
    """Whether a later always-active RPG Maker page hides this page forever."""
    return any(
        not any(value for key, value in later["conditions"].items()
                if key.endswith("Valid"))
        for later in event["pages"][page_index + 1:]
    )


def shadowed_map_rewards(data_dir: Path, grants: list[dict]) -> list[dict]:
    """Grant commands on pages that a later unconditional page always wins."""
    map_cache = {}
    results = []
    for row in grants:
        if row["source_type"] != "map_event" or row["operation"] != "gain":
            continue
        file_name = row["file"]
        if file_name not in map_cache:
            map_cache[file_name] = read_json(data_dir / file_name)
        event = map_cache[file_name]["events"][row["event_id"]]
        if permanently_shadowed(event, row["page"]):
            results.append(row)
    return results


def simple_one_time_candidates(data_dir: Path, grants, cheat_switch_ids, kinds):
    """Find simple fixed pickups; this does not certify AP checks."""
    by_page = {}
    for row in grants:
        if row["source_type"] == "map_event":
            key = (row["file"], row["event_id"], row["page"])
            by_page.setdefault(key, []).append(row)
    map_cache = {}
    results = []
    for (file_name, event_id, page_index), page_grants in by_page.items():
        if len(page_grants) != 1:
            continue
        row = page_grants[0]
        if (
            row["kind"] not in kinds
            or row["operation"] != "gain"
            or row["amount"] != 1
            or cheat_switch_ids.intersection(row["required_switches"])
            or (row["kind"] == "item" and
                not (row["item_type_id"] == 2 or row["consumable"] is False))
        ):
            continue
        if file_name not in map_cache:
            map_cache[file_name] = read_json(data_dir / file_name)
        event = map_cache[file_name]["events"][event_id]
        page = event["pages"][page_index]
        commands = page["list"]
        # RPG Maker MZ selects the highest-numbered page whose conditions
        # match. A later page with no conditions always wins, making this
        # apparent pickup dead data even if its own page has a self-switch.
        if permanently_shadowed(event, page_index):
            continue
        if any(command["code"] in (111, 117, 122, 355, 655) for command in commands):
            continue
        if not any(
            command["code"] == 123 and command["parameters"] == ["A", 0]
            for command in commands
        ):
            continue
        if not any(
            later["conditions"].get("selfSwitchValid")
            and later["conditions"].get("selfSwitchCh") == "A"
            for later in event["pages"][page_index + 1 :]
        ):
            continue
        results.append(row)
    return results


def fingerprint(game_dir: Path, data_dir: Path):
    system = read_json(data_dir / "System.json")
    paths = [data_dir / name for name in FINGERPRINT_FILES]
    paths += sorted(path for path in data_dir.glob("Map*.json") if MAP_NAME.fullmatch(path.name))
    paths += [game_dir / "js" / "plugins.js", game_dir / "js" / "main.js"]
    digest = hashlib.sha256()
    core_hashes = {}
    for path in paths:
        relative = path.relative_to(game_dir).as_posix()
        checksum = file_hash(path)
        digest.update(f"{relative}\0{checksum}\n".encode("utf-8"))
        if path.name in FINGERPRINT_FILES or relative.startswith("js/"):
            core_hashes[relative] = checksum
    return {
        "title": system.get("gameTitle"),
        "version_id": system.get("versionId"),
        "game_id": system.get("advanced", {}).get("gameId"),
        "fingerprinted_files": len(paths),
        "content_sha256": digest.hexdigest(),
        "core_file_sha256": core_hashes,
    }


def write_json(path: Path, value):
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def write_candidate_csv(path: Path, grants):
    fields = (
        "source_type", "map_id", "map_name", "troop_id", "event_id", "event_name",
        "page", "required_switches", "required_self_switch", "command_index",
        "kind", "item_type_id", "consumable",
        "database_id", "item_name", "amount", "file",
    )
    with path.open("w", encoding="utf-8-sig", newline="") as output:
        writer = csv.DictWriter(output, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        for row in grants:
            if (
                row["operation"] == "gain"
                and row["amount"] is not None
                and row["amount"] > 0
                and (row["kind"] != "item" or row["consumable"] is False)
            ):
                writer.writerow(row)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True, help="Read-only Look Outside installation")
    parser.add_argument(
        "--out-dir",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "build" / "game_audit",
        help="Directory for generated reports (defaults inside this project)",
    )
    args = parser.parse_args()
    game_dir = args.game_dir.resolve(strict=True)
    data_dir = game_dir / "data"
    if not (game_dir / "Game.exe").is_file() or not data_dir.is_dir():
        parser.error("--game-dir must contain Game.exe and data/")
    project_dir = Path(__file__).resolve().parents[1]
    out_dir = args.out_dir.resolve()
    if project_dir not in out_dir.parents:
        parser.error("--out-dir must be inside the project folder")

    manifest = fingerprint(game_dir, data_dir)
    counts, grants, script_calls, shops, common_event_calls = extract_candidates(data_dir)
    drops = enemy_drops(data_dir)
    plugin_calls = plugin_reward_calls(game_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    write_json(out_dir / "manifest.json", manifest)
    write_json(out_dir / "event_reward_commands.json", grants)
    shadowed_rewards = shadowed_map_rewards(data_dir, grants)
    write_json(out_dir / "shadowed_reward_commands.json", shadowed_rewards)
    write_json(out_dir / "script_gain_item_calls.json", script_calls)
    write_json(out_dir / "shop_entries.json", shops)
    write_json(out_dir / "enemy_drops.json", drops)
    write_json(out_dir / "common_event_calls.json", common_event_calls)
    write_json(out_dir / "plugin_gain_item_calls.json", plugin_calls)
    write_candidate_csv(out_dir / "persistent_fixed_gain_candidates.csv", grants)
    item_database = read_json(data_dir / "Items.json")
    switches = read_json(data_dir / "System.json")["switches"]
    cheat_switch_ids = {index for index, name in enumerate(switches) if name.upper() == "CHEATMODE"}
    simple_equipment = simple_one_time_candidates(
        data_dir, grants, cheat_switch_ids, {"weapon", "armor"})
    write_json(out_dir / "simple_one_time_equipment_candidates.json", simple_equipment)
    simple_items = simple_one_time_candidates(
        data_dir, grants, cheat_switch_ids, {"item"})
    write_json(out_dir / "simple_one_time_item_candidates.json", simple_items)
    guaranteed_key_drops = [
        row for row in drops
        if row["denominator"] == 1
        and row["kind"] == "item"
        and item_database[row["database_id"]]["itypeId"] == 2
    ]
    summary = {
        "fingerprint": manifest["content_sha256"],
        "event_reward_commands": len(grants),
        "gain_commands": sum(row["operation"] == "gain" for row in grants),
        "shadowed_map_gain_commands": len(shadowed_rewards),
        "lose_commands": sum(row["operation"] == "lose" for row in grants),
        "by_kind": dict(Counter(row["kind"] for row in grants)),
        "fixed_gain_commands": sum(
            row["operation"] == "gain" and row["amount"] is not None and row["amount"] > 0
            for row in grants
        ),
        "persistent_fixed_gain_candidates": sum(
            row["operation"] == "gain"
            and row["amount"] is not None
            and row["amount"] > 0
            and (row["kind"] != "item" or row["consumable"] is False)
            for row in grants
        ),
        "cheatmode_gated_persistent_map_commands": sum(
            row["source_type"] == "map_event"
            and row["operation"] == "gain"
            and row["amount"] is not None
            and row["amount"] > 0
            and (row["kind"] != "item" or row["consumable"] is False)
            and bool(cheat_switch_ids.intersection(row["required_switches"]))
            for row in grants
        ),
        "simple_one_time_equipment_candidates": len(simple_equipment),
        "simple_one_time_item_candidates": len(simple_items),
        "script_gain_item_lines": len(script_calls),
        "plugin_gain_item_lines": len(plugin_calls),
        "shop_entries": len(shops),
        "enemy_drop_entries": len(drops),
        "guaranteed_enemy_drop_entries": sum(row["denominator"] == 1 for row in drops),
        "guaranteed_key_item_drops": [
            {"enemy": row["enemy_name"], "item": row["item_name"]}
            for row in guaranteed_key_drops
        ],
        "common_event_calls": len(common_event_calls),
        "command_counts": {str(code): count for code, count in sorted(counts.items())},
    }
    write_json(out_dir / "summary.json", summary)
    print(json.dumps({k: v for k, v in summary.items() if k != "command_counts"}, indent=2))
    print(f"Reports written to {out_dir}")


if __name__ == "__main__":
    main()
