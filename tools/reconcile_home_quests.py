"""Link existing Hellen and Dan checks to their permanent quest refusals."""

import argparse
import json
from pathlib import Path

from home_quest_scope import home_quest_families, validate_home_quests
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
    for family, reward in zip(home_quest_families(), ["Stained Shears", "NeoDuo"]):
        row = next(row for row in registry["locations"] if row["key"] == family["location_keys"][0])
        row.update(name=family["name"] + " - " + reward, quest_family=family["key"])
        registry["quest_families"] = [row for row in registry["quest_families"]
                                      if row["key"] != family["key"]] + [family]
    validate_home_quests(registry, data, read_json, require)
    if json.dumps(registry) != before:
        registry["registry_version"] += 1
        REGISTRY.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Home quest refusals reconciled; registry version {registry['registry_version']}")


if __name__ == "__main__":
    main()
