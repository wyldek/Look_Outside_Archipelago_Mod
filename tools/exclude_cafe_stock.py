"""Remove cafe stock from the development pool after tracing its daily unlocks.

The free pages become available after Mutt dies, but they are the same stock
that newDay unlocks from the cafe's daily schedule. Both purchase paths remain
outside the randomizer.
"""

from __future__ import annotations

import argparse
import json
from collections import Counter
from pathlib import Path

from promote_complex_pickups import REGISTRY, read_json, require


CAFE_EQUIPMENT_EVENTS = frozenset((4, 10, 11, 12, 13, 14, 15, 18, 21, 22, 23))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    args = parser.parse_args()
    game_dir = args.game_dir.resolve(strict=True)
    registry = read_json(REGISTRY)
    system = read_json(game_dir / "data" / "System.json")
    require(system["advanced"]["gameId"] == registry["audited_game_id"] and
            system["versionId"] == registry["audited_version_id"],
            "The game build differs from the active registry")
    daily = read_json(game_dir / "data" / "CommonEvents.json")[6]["list"][419]
    require(daily["code"] == 655 and daily["parameters"] ==
            ["sSw(301 + gVr(161)[gVr(15)],true);"], "Cafe daily stock scheduling changed")
    removed = [location for location in registry["locations"]
               if location["map_id"] == 56 and location["event_id"] in CAFE_EQUIPMENT_EVENTS
               and location["page"] in (0, 1)]
    if not removed:
        print("Cafe stock is already excluded from Archipelago")
        return
    copies = Counter((location["reward_kind"], location["reward_database_id"]) for location in removed)
    for item in registry["items"]:
        item["quantity"] -= copies[(item["kind"], item["database_id"])]
        require(item["quantity"] >= 0, f"Item quantity underflow: {item['name']}")
    removed_keys = {location["key"] for location in removed}
    registry["locations"] = [location for location in registry["locations"]
                             if location["key"] not in removed_keys]
    registry["items"] = [item for item in registry["items"] if item["quantity"] > 0]
    registry["registry_version"] += 1
    require(sum(item["quantity"] for item in registry["items"]) == len(registry["locations"]),
            "Item copies do not equal location count")
    REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Excluded {len(removed)} cafe stock checks; {len(registry['locations'])} active locations")


if __name__ == "__main__":
    main()
