"""Register the fuse-box check and outage-aware Power Restored AP item."""

import argparse
import json
from pathlib import Path

from power_scope import validate_power_source
from validate_registry import REGISTRY, read_json, require


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    data = parser.parse_args().game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    source = {"key": "power_restoration", "name": "Electrical Room - Main Fuse Box",
              "ap_id": 592000080, "map_id": 369, "event_id": 24, "page": 0,
              "command_index": 10, "command_code": 121, "reward_kind": "switch",
              "reward_database_id": 987, "power_restoration": True,
              "message_index": 1, "message_text": "The main fuse box of the building. Restore power?",
              "ap_message": "The main fuse box. Complete its Archipelago check?"}
    validate_power_source(source, source, data, read_json, require)
    if not any(row["key"] == source["key"] for row in registry["locations"]):
        registry["locations"].append(source)
        registry["items"].append({"name": "Power Restored", "ap_id": 540300987,
            "kind": "switch", "database_id": 987, "switch_name": "BlackoutFixed",
            "quantity": 1, "classification": "progression"})
        registry["registry_version"] += 1
        REGISTRY.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Registered power restoration; {len(registry['locations'])} checks")


if __name__ == "__main__":
    main()
