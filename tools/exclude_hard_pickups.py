"""Remove reviewed Hard-only equipment copies from the Normal development pool."""

import argparse
import json
from collections import Counter
from pathlib import Path

from normal_mode_scope import HARD_ONLY_PICKUPS
from validate_registry import REGISTRY, read_json, require


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    args = parser.parse_args()
    data = args.game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    removed = []
    for location in registry["locations"]:
        source = tuple(location[f] for f in ("map_id", "event_id", "page", "command_index"))
        if source not in HARD_ONLY_PICKUPS:
            continue
        mid, eid, page, index = source
        event = read_json(data / f"Map{mid:03d}.json")["events"][eid]
        condition = event["pages"][page]["conditions"]
        require(condition["switch1Valid"] and condition["switch1Id"] == 8,
                f"Hard-only page changed: {location['key']}")
        removed.append(location)
    if not removed:
        print("Hard-only pickups are already excluded")
        return
    copies = Counter((r["reward_kind"], r["reward_database_id"]) for r in removed)
    for item in registry["items"]:
        item["quantity"] -= copies[item["kind"], item["database_id"]]
        require(item["quantity"] >= 0, "Item quantity underflow")
    registry["items"] = [r for r in registry["items"] if r["quantity"]]
    registry["locations"] = [r for r in registry["locations"] if r not in removed]
    registry["registry_version"] += 1
    REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Excluded {len(removed)} Hard-only copies; {len(registry['locations'])} Normal checks")


if __name__ == "__main__":
    main()
