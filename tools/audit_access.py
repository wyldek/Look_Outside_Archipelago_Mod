"""Report access-logic coverage without importing the installed AP runtime."""

import argparse
import importlib
import json
import sys
import types
from pathlib import Path


PROJECT = Path(__file__).resolve().parents[1]


def load_access():
    # Import the pure rule modules without executing the APWorld's __init__.
    package = types.ModuleType("lookoutside_access_audit")
    package.__path__ = [str(PROJECT / "apworld/lookoutside")]
    sys.modules.setdefault(package.__name__, package)
    return importlib.import_module(package.__name__ + ".access_data").GRAPH


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--require-complete", action="store_true")
    args = parser.parse_args()
    registry = json.loads((PROJECT / "apworld/lookoutside/vertical_slice.json").read_text(encoding="utf-8"))
    graph = load_access()
    missing = graph.validate(registry, require_complete=args.require_complete)
    inventory = {entry["name"]: entry["quantity"] for entry in registry["items"]}
    reached, checks = graph.reachable(inventory)
    unreachable = sorted(graph.checks.keys() - checks)
    if unreachable:
        raise ValueError(f"Reviewed checks unreachable with every item: {unreachable}")
    print(json.dumps({
        "combat_logic": "access_only", "active_in_generator": True,
        "reviewed_locations": len(graph.checks), "unreviewed_locations": len(missing),
        "regions": len(graph.regions), "entrances": len(graph.entrances),
        "reviewed_checks_with_no_items": len(graph.reachable({})[1]),
        "all_items_reaches_every_reviewed_check": True,
    }, indent=2))


if __name__ == "__main__":
    main()
