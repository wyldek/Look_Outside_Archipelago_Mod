"""Remove two valve sources stranded on obsolete, disconnected sea maps."""

import argparse
import json
from collections import Counter
from pathlib import Path

from unused_map_scope import UNUSED_SEA_CHECKS, validate_unused_sea_maps
from validate_registry import REGISTRY, read_json, require


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    data = parser.parse_args().game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    removed = [row for row in registry["locations"] if row["key"] in UNUSED_SEA_CHECKS]
    copies = Counter((row["reward_kind"], row["reward_database_id"]) for row in removed)
    for row in registry["items"]:
        row["quantity"] -= copies[row["kind"], row["database_id"]]
        require(row["quantity"] >= 0, "Item quantity underflow")
    registry["items"] = [row for row in registry["items"] if row["quantity"]]
    registry["locations"] = [row for row in registry["locations"] if row not in removed]
    validate_unused_sea_maps(registry, data, read_json, require)
    if removed:
        registry["registry_version"] += 1
        REGISTRY.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Removed {len(removed)} disconnected valve checks; {len(registry['locations'])} checks remain")


if __name__ == "__main__":
    main()
