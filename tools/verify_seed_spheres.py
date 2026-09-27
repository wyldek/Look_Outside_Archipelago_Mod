"""Independently verify every location in generated Look Outside test seeds.

The no-item ending is intentionally insufficient for this check. Starting with
an empty inventory, collect only reachable locations, then deliver their items.
This uses the actual generator's spoiler placements and rejects deadlock or
progression or useful items on explicitly excluded locations. Each sweep includes
generation-only calendar reservations. It does not simulate the runtime clock,
choices, movement, or combat.
"""

import argparse
from collections import Counter
import json
import re
from pathlib import Path
from zipfile import ZipFile

from audit_access import PROJECT, load_access


def verify(path):
    registry = json.loads((PROJECT / "apworld/lookoutside/vertical_slice.json").read_text(encoding="utf-8"))
    graph = load_access()
    graph.validate(registry)
    definitions = {row["name"]: row for row in registry["items"]}
    locations = {row["name"]: row for row in registry["locations"]}
    with ZipFile(path) as archive:
        spoiler = next(name for name in archive.namelist() if name.endswith("_Spoiler.txt"))
        lines = archive.read(spoiler).decode("utf-8-sig").splitlines()
    players = [match.group(1) for line in lines if (match := re.fullmatch(r"Player \d+: (.+)", line))]
    if not players and any(re.fullmatch(r"Players:\s+1", line) for line in lines):
        players = ["Player 1"]  # Single-player spoilers omit the slot name.
    if not players or len(set(players)) != len(players):
        raise ValueError("Missing or duplicate player names")
    if sum(line.startswith("Game:") and line.split(":", 1)[1].strip() == "Look Outside" for line in lines) != len(players):
        raise ValueError("This verifier supports Look Outside-only test worlds")
    multiple = len(players) > 1
    source_names = {name + (f" ({player})" if multiple else ""): (player, location)
                    for player in players for name, location in locations.items()}
    reward_names = {name + (f" ({player})" if multiple else ""): (player, name)
                    for player in players for name in definitions}
    placements = {}
    in_locations = False
    for line in lines:
        if line == "Locations:":
            in_locations = True
            continue
        if line == "Playthrough:":
            break
        if not in_locations:
            continue
        for name, (owner, location) in source_names.items():
            prefix = name + ": "
            if line.startswith(prefix):
                reward = reward_names.get(line[len(prefix):])
                if reward is None:
                    raise ValueError(f"Unknown reward: {line}")
                source = (owner, location["key"])
                if source in placements:
                    raise ValueError(f"Duplicate placement: {name}")
                if location.get("missable") and definitions[reward[1]]["classification"] != "filler":
                    raise ValueError(f"Non-filler item on excluded location: {line}")
                placements[source] = reward
                break
    total = len(locations) * len(players)
    if len(placements) != total:
        raise ValueError(f"Expected {total} placements, got {len(placements)}")
    expected = Counter({(player, row["name"]): row["quantity"]
                        for player in players for row in registry["items"]})
    if Counter(placements.values()) != expected:
        raise ValueError("Generated item quantities differ from the registry")
    inventory, checked, spheres = {player: Counter() for player in players}, set(), []
    while len(checked) < total:
        reachable = {(player, key) for player in players for key in graph.reachable(inventory[player])[1]}
        sphere = sorted(reachable - checked)
        if not sphere:
            missing = sorted(placements.keys() - checked)
            raise ValueError(f"Seed deadlocked with {len(missing)} inaccessible checks: {missing}")
        for key in sphere:
            recipient, reward = placements[key]
            inventory[recipient][reward] += 1
        checked.update(sphere)
        spheres.append(len(sphere))
    for player in players:
        _, _, events = graph.sweep(inventory[player])
        if events != {entry.name for entry in graph.events}:
            raise ValueError(f"Seed fails calendar reservations for {player}")
    return {"archive": str(path), "players": len(players), "checked": len(checked), "sphere_sizes": spheres,
            "generation_events_per_player": len(graph.events),
            "excluded_locations": len(players) * sum(bool(row.get("missable")) for row in locations.values()),
            "cross_player_items": sum(owner != recipient for (owner, _), (recipient, _) in placements.items()),
            "goal_release_used": False}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path, nargs="+")
    args = parser.parse_args()
    for path in args.archive:
        print(json.dumps(verify(path)))


if __name__ == "__main__":
    main()
