"""Guarantee both black-key doors can open without removing any AP item copies."""

import argparse
import json
from pathlib import Path

from key_budget_scope import validate_key_budgets
from validate_registry import REGISTRY, read_json, require


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    data = parser.parse_args().game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    before = json.dumps(registry, sort_keys=True)
    black = next(row for row in registry["items"] if row["ap_id"] == 540000656)
    black.update(name="Black Keys (2)", database_name="black key", delivery_amount=2)
    validate_key_budgets(registry, data, read_json, require)
    if json.dumps(registry, sort_keys=True) != before:
        registry["registry_version"] += 1
        REGISTRY.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Finite key supplies validated; registry version {registry['registry_version']}")


if __name__ == "__main__":
    main()
