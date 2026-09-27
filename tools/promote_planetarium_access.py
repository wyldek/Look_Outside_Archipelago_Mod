"""Separate solving the astrolabe from receiving its permanent door access."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from validate_registry import REGISTRY, read_json, require, validate_common_state


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    args = parser.parse_args()
    data = args.game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    key = "planetarium_access"
    location = {"key": key, "name": "Planetarium - Astrolabe Solved", "ap_id": 592000050,
        "map_id": 345, "event_id": 12, "page": 0, "common_event_id": 64,
        "command_index": 216, "command_code": 121, "reward_kind": "switch", "reward_database_id": 699,
        "required_variables": [{"id": 771 + i, "value": i + 1} for i in range(9)]}
    validate_common_state(location, location, read_json(data / "CommonEvents.json"), data)
    if not any(row["key"] == key for row in registry["locations"]):
        registry["locations"].append(location)
        registry["items"].append({"name": "Planetarium Door Access", "ap_id": 540300699,
            "kind": "switch", "database_id": 699, "switch_name": "planetariumSolved",
            "quantity": 1, "classification": "progression"})
        registry["registry_version"] += 1
        REGISTRY.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Registered planetarium access; {len(registry['locations'])} locations")


if __name__ == "__main__":
    main()
