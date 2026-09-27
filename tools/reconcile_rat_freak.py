"""Reconcile Rat Claws after either native Rat Freak outcome; writes project only."""

import argparse
import json
from pathlib import Path

from rat_freak_scope import RAT_CLAWS_KEY, rat_freak_family, validate_rat_freak
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
    family = rat_freak_family()
    row = next(row for row in registry["locations"] if row["key"] == RAT_CLAWS_KEY)
    row.update(name="Rat Freak Resolution - Rat Claws", quest_family=family["key"])
    families = registry["quest_families"]
    if family["key"] in {row["key"] for row in families}:
        families[families.index(next(row for row in families if row["key"] == family["key"]))] = family
    else:
        families.append(family)
    validate_rat_freak(registry, data, read_json, require)
    if json.dumps(registry) != before:
        registry["registry_version"] += 1
        REGISTRY.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Rat Freak outcomes reconciled; registry version {registry['registry_version']}")


if __name__ == "__main__":
    main()
