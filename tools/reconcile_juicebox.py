"""Preserve the Four of Spades AP check through either card-trick choice."""

import argparse
import json
from pathlib import Path

from juicebox_scope import CARD_KEY, juicebox_family, validate_juicebox
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
    family = juicebox_family()
    row = next(row for row in registry["locations"] if row["key"] == CARD_KEY)
    row.update(name="Juicebox Card Trick - Four of Spades", quest_family=family["key"])
    registry["quest_families"] = [row for row in registry["quest_families"] if row["key"] != family["key"]]
    registry["quest_families"].append(family)
    validate_juicebox(registry, data, read_json, require)
    if json.dumps(registry) != before:
        registry["registry_version"] += 1
        REGISTRY.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Juicebox choices reconciled; registry version {registry['registry_version']}")


if __name__ == "__main__":
    main()
