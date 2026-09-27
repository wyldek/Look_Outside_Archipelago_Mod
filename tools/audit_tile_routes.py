"""Read-only tile connectivity aid for reviewing map transfers.

This reports potential routes, not generation rules. Event-page conditions,
NPCs, event tiles, scripted movement, and common-event transfers still need
manual review. In particular, two doors on one map can be on separate islands.
"""

import argparse
from collections import deque
import json
from pathlib import Path


DIRECTIONS = ((0, 1, 1, 8), (-1, 0, 2, 4), (1, 0, 4, 2), (0, -1, 8, 1))


class TileRoutes:
    def __init__(self, data_dir, map_ids):
        self.maps = {mid: json.loads((data_dir / f"Map{mid:03}.json").read_text(encoding="utf-8"))
                     for mid in map_ids}
        self.tilesets = json.loads((data_dir / "Tilesets.json").read_text(encoding="utf-8"))
        self.components = {}

    def normalize(self, mid, x, y):
        game_map = self.maps[mid]
        if game_map["scrollType"] in (2, 3):
            x %= game_map["width"]
        if game_map["scrollType"] in (1, 3):
            y %= game_map["height"]
        return x, y

    def component(self, mid, start):
        if (mid, start) in self.components:
            return self.components[mid, start]
        game_map = self.maps[mid]
        width, height = game_map["width"], game_map["height"]
        flags = self.tilesets[game_map["tilesetId"]]["flags"]

        def passage(x, y, bit):
            if not (0 <= x < width and 0 <= y < height):
                return False
            # Native Game_Map.checkPassage examines the four visual layers
            # from top to bottom and ignores tiles with the star flag.
            for layer in (3, 2, 1, 0):
                flag = flags[game_map["data"][(layer * height + y) * width + x]]
                if flag & 0x10:
                    continue
                return not flag & bit
            return False

        reached = {start}
        queue = deque([start])
        while queue:
            x, y = queue.popleft()
            for dx, dy, bit, reverse in DIRECTIONS:
                target = self.normalize(mid, x + dx, y + dy)
                if target not in reached and passage(x, y, bit) and passage(*target, reverse):
                    reached.add(target)
                    queue.append(target)
        # Passage is symmetric; store the component for all of its entry tiles.
        for position in reached:
            self.components[mid, position] = reached
        return reached

    def potential_routes(self, start, *, blocked_transfers=frozenset()):
        queue = deque([start])
        visited, events, exits = set(), set(), set()
        while queue:
            mid, position = queue.popleft()
            reached = self.component(mid, position)
            signature = (mid, min(reached))
            if signature in visited:
                continue
            visited.add(signature)
            for event in self.maps[mid]["events"]:
                if not event:
                    continue
                # Action-button doors or normal-priority touch events can be
                # triggered from adjacent tiles. Review trigger type afterward.
                near = (event["x"], event["y"]) in reached or any(
                    self.normalize(mid, event["x"] + dx, event["y"] + dy) in reached
                    for dx, dy, _, _ in DIRECTIONS)
                if not near:
                    continue
                events.add((mid, event["id"]))
                if (mid, event["id"]) in blocked_transfers:
                    continue
                for page in event["pages"]:
                    conditions = page["conditions"]
                    if any(conditions[f"switch{n}Valid"] and conditions[f"switch{n}Id"] == 7
                           for n in (1, 2)):
                        continue
                    for command in page["list"]:
                        parameters = command["parameters"]
                        if command["code"] != 201 or parameters[0] != 0:
                            continue
                        _, target, x, y, *_ = parameters
                        if target in self.maps:
                            queue.append((target, (x, y)))
                        else:
                            exits.add((mid, event["id"], target, x, y))
        return visited, events, exits


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", required=True, type=Path)
    parser.add_argument("--maps", required=True, help="Comma-separated map IDs")
    parser.add_argument("--start", required=True, help="Map ID,x,y")
    args = parser.parse_args()
    mid, x, y = map(int, args.start.split(","))
    routes = TileRoutes(args.game_dir / "data", map(int, args.maps.split(",")))
    visited, events, exits = routes.potential_routes((mid, (x, y)))
    print(json.dumps({"potential_components": sorted(visited),
                      "nearby_events": sorted(events), "external_transfers": sorted(exits)}, indent=2))


if __name__ == "__main__":
    main()
