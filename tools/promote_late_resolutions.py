"""Register audited fixed gifts with their choice-independent resolution groups."""

import argparse
import json
from pathlib import Path

from late_resolution_scope import locations, families, validate_resolutions
from validate_registry import REGISTRY, read_json, require


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    data = parser.parse_args().game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["versionId"] == registry["audited_version_id"] and
            system["advanced"]["gameId"] == registry["audited_game_id"], "Game build changed")
    before = json.dumps(registry)
    for location in locations():
        existing = next((i for i, r in enumerate(registry["locations"]) if r["key"] == location["key"]), None)
        if existing is not None:
            registry["locations"][existing] = location
            continue
        registry["locations"].append(location)
        kind, dbid = location["reward_kind"], location["reward_database_id"]
        require(not any(r["kind"] == kind and r["database_id"] == dbid for r in registry["items"]), "Duplicate reward")
        database = read_json(data / ("Weapons.json" if kind == "weapon" else "Armors.json"))
        registry["items"].append({"name": database[dbid]["name"], "kind": kind, "database_id": dbid,
            "quantity": 1, "ap_id": (540100000 if kind == "weapon" else 540200000) + dbid,
            "classification": "useful"})
    for family in families():
        if not any(r["key"] == family["key"] for r in registry["quest_families"]):
            registry["quest_families"].append(family)
    validate_resolutions(registry, data, read_json, require)
    if json.dumps(registry) != before:
        registry["registry_version"] += 1
        registry["locations"].sort(key=lambda r: r["ap_id"])
        registry["items"].sort(key=lambda r: r["ap_id"])
        REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Late resolutions registered: {len(registry['locations'])} checks, registry {registry['registry_version']}")


if __name__ == "__main__":
    main()
