"""Apply the household-valuables decision and register the shared home videogame."""

import argparse
import json
from pathlib import Path

from bookshelf_scope import location, validate_bookshelf
from validate_registry import REGISTRY, read_json, require


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    data = parser.parse_args().game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["versionId"] == registry["audited_version_id"], "Game build changed")
    before = json.dumps(registry)
    removed = [r for r in registry["locations"] if r["reward_kind"] == "item" and 234 <= r["reward_database_id"] <= 277]
    require(all(not r.get("quest_family") for r in removed), "Household removal needs a quest-family review")
    registry["locations"] = [r for r in registry["locations"] if r not in removed]
    registry["items"] = [r for r in registry["items"] if not (r["kind"] == "item" and 234 <= r["database_id"] <= 277)]
    row = location()
    home = read_json(data / "Map003.json")
    for s in (row, *row["source_variants"]):
        validate_bookshelf(row, s, home["events"][s["event_id"]]["pages"][0]["list"], require)
    if not any(r["key"] == row["key"] for r in registry["locations"]):
        registry["locations"].append(row)
        registry["items"].append({"name": "Screamatorium", "ap_id": 540000423, "kind": "item",
            "database_id": 423, "quantity": 1, "classification": "filler"})
    if json.dumps(registry) != before:
        registry["registry_version"] += 1
        registry["locations"].sort(key=lambda r: r["ap_id"])
        registry["items"].sort(key=lambda r: r["ap_id"])
        REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Removed {len(removed)} household checks; {len(registry['locations'])} checks, registry {registry['registry_version']}")


if __name__ == "__main__":
    main()
