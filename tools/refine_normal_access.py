"""Remove the Hard-only Long Hall pickup and classify the game's cartridge gateway."""

import argparse
import json
from pathlib import Path

from normal_access_scope import validate_normal_access
from validate_registry import REGISTRY, read_json, require


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    data = parser.parse_args().game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    before = json.dumps(registry)
    removed = [row for row in registry["locations"] if row["key"] == "map372_event031"]
    for location in removed:
        row = next(row for row in registry["items"] if row["kind"] == location["reward_kind"] and
                   row["database_id"] == location["reward_database_id"])
        row["quantity"] -= 1
        require(row["quantity"] >= 0, "Item quantity underflow")
    registry["items"] = [row for row in registry["items"] if row["quantity"]]
    registry["locations"] = [row for row in registry["locations"] if row not in removed]
    next(row for row in registry["items"] if row["ap_id"] == 540000430)["classification"] = "progression"
    validate_normal_access(registry, data, read_json, require)
    if json.dumps(registry) != before:
        registry["registry_version"] += 1
        REGISTRY.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Normal route scope refined; {len(registry['locations'])} checks, version {registry['registry_version']}")


if __name__ == "__main__":
    main()
