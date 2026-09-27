"""Keep the shipped APWorld setup summary in sync with the registry and graph."""

import argparse
import json
from pathlib import Path

from audit_access import load_access

PROJECT = Path(__file__).resolve().parents[1]
GUIDE = PROJECT / "apworld/lookoutside/docs/setup_en.md"
GUIDES = (GUIDE, GUIDE.with_name("en_Look Outside.md"))
BEGIN = "<!-- BEGIN GENERATED REGISTRY SUMMARY -->\n"
END = "<!-- END GENERATED REGISTRY SUMMARY -->"


def summary(registry, graph):
    equipment = sum(x["quantity"] for x in registry["items"] if x["kind"] in ("weapon", "armor"))
    items = sum(x["quantity"] for x in registry["items"] if x["kind"] == "item")
    unlocks = sum(x["quantity"] for x in registry["items"] if x["kind"] == "switch")
    return (f"Registry **{registry['registry_version']}** provides **{len(registry['locations'])} checks**: "
            f"{equipment} equipment copies, {items} physical items and {unlocks} access unlocks.\n"
            f"All checks have access rules across **{len(graph.regions)} regions and {len(graph.entrances)} entrances**,\n"
            f"with **{len(registry['quest_families'])} quest-resolution groups**.\n")


def synchronize(text, registry, graph, check=False):
    if text.count(BEGIN) != 1 or text.count(END) != 1:
        raise ValueError("Setup guide needs one generated registry summary")
    start = text.index(BEGIN) + len(BEGIN)
    end = text.index(END)
    if start > end:
        raise ValueError("Setup guide markers are reversed")
    expected = summary(registry, graph)
    if check and text[start:end] != expected:
        raise ValueError("Shipped setup guide is stale; run tools/sync_setup_guide.py")
    return text[:start] + expected + text[end:]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    registry = json.loads((PROJECT / "apworld/lookoutside/vertical_slice.json").read_text(encoding="utf-8"))
    graph = load_access()
    for guide in GUIDES:
        updated = synchronize(guide.read_text(encoding="utf-8"), registry, graph, args.check)
        if not args.check:
            guide.write_text(updated, encoding="utf-8")
    print(f"Both shipped guides match registry {registry['registry_version']}")


if __name__ == "__main__":
    main()
