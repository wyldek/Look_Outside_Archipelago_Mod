"""Apply reviewed calendar deadlines and exclude them from progression placement."""

import argparse
import json
from pathlib import Path

from calendar_scope import TEETH_DEADLINE_KEYS, TEETH_EXPIRY, validate_calendar_sources


REGISTRY = Path(__file__).resolve().parents[1] / "apworld/lookoutside/vertical_slice.json"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    args = parser.parse_args()
    validate_calendar_sources(args.game_dir / "data")
    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))
    changed = 0
    for location in registry["locations"]:
        if location["key"] in TEETH_DEADLINE_KEYS:
            fields = {"missable": True, "expiry": TEETH_EXPIRY,
                      "exclusion_reason": TEETH_EXPIRY["description"],
                      # Map006's Door32 leads to these rooms. Apartment 12 is
                      # a separate, later area on Floor 1.
                      "name": location["name"].replace("Apartment 12", "Apartment 32")}
            if any(location.get(key) != value for key, value in fields.items()):
                location.update(fields)
                changed += 1
    if changed:
        registry["registry_version"] += 1
        REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {changed} deadlines; registry {registry['registry_version']}")


if __name__ == "__main__":
    main()
