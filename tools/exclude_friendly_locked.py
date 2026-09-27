"""Remove checks behind optional friendly kills, preserving vanilla loot."""

import argparse
import json
from pathlib import Path

from encounter_scope import VANILLA_FRIENDLY_LOCKED_MAPS
from validate_registry import REGISTRY, read_json, require


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    args = parser.parse_args()
    data = args.game_dir.resolve(strict=True) / "data"
    registry = read_json(REGISTRY)
    system = read_json(data / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"], "Game build changed")
    shop = read_json(data / "Map132.json")
    darkroom = read_json(data / "Map009.json")["events"][13]
    require(darkroom["pages"][0]["list"][3]["parameters"] == [8, 315] and
            darkroom["pages"][0]["list"][11]["code"] == 123 and
            darkroom["pages"][0]["list"][11]["parameters"] == ["A", 0] and
            darkroom["pages"][1]["conditions"]["selfSwitchValid"] and
            darkroom["pages"][1]["conditions"]["selfSwitchCh"] == "A" and
            darkroom["pages"][1]["list"][10]["parameters"][1] == 112,
            "Lyle's Dark Room access changed")
    for eid, switch, destination in [(3, 332, 329), (66, 333, 330)]:
        commands = shop["events"][eid]["pages"][0]["list"]
        for index, code, params in [(0, 111, [0, switch, 0]), (7, 111, [8, 377]),
                                     (14, 121, [switch, switch, 0]), (24, 115, []),
                                     (25, 118, ["openit"])]:
            require(commands[index]["code"] == code and commands[index]["parameters"] == params,
                    "Eugene's locked-room access changed")
        require(commands[33]["code"] == 201 and commands[33]["parameters"][1] == destination,
                "Eugene's locked-room destination changed")
    removed = [row for row in registry["locations"] if row["map_id"] in VANILLA_FRIENDLY_LOCKED_MAPS]
    for row in removed:
        require(not row.get("quest_family") and not row.get("source_variants"),
                f"Review alternate source before excluding {row['key']}")
        item = next(i for i in registry["items"] if
                    (i["kind"], i["database_id"]) == (row["reward_kind"], row["reward_database_id"]))
        item["quantity"] -= 1
        require(item["quantity"] >= 0, "Item pool quantity underflow")
    if removed:
        registry["locations"] = [row for row in registry["locations"] if row not in removed]
        registry["items"] = [row for row in registry["items"] if row["quantity"]]
        registry["registry_version"] += 1
        require(sum(i["quantity"] for i in registry["items"]) == len(registry["locations"]), "Pool mismatch")
        REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Removed {len(removed)} checks behind optional friendly kills; {len(registry['locations'])} active checks")


if __name__ == "__main__":
    main()
