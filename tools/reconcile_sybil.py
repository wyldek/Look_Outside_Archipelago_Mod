"""Reconcile peaceful Sybil and hostile Oracle outcomes; writes project only."""

import argparse
import json
from pathlib import Path

from sybil_scope import SYBIL_KEYS, sybil_family, validate_sybil
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
    family = sybil_family()
    for key, name in zip(SYBIL_KEYS, ["Small Red Key", "Iris Key"]):
        row = next(row for row in registry["locations"] if row["key"] == key)
        row.update(name="Sybil Resolution - " + name, quest_family=family["key"])
    registry["quest_families"] = [row for row in registry["quest_families"]
                                  if row["key"] != family["key"]] + [family]
    validate_sybil(registry, data, read_json, require)
    if json.dumps(registry) != before:
        registry["registry_version"] += 1
        REGISTRY.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Sybil outcomes reconciled; registry version {registry['registry_version']}")


if __name__ == "__main__":
    main()
