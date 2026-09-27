"""Read native event logic for manual route audits; never writes game data."""

import argparse
import json
from pathlib import Path


LOGIC_CODES = {102, 103, 104, 111, 112, 113, 115, 117, 118, 119, 121, 122, 123,
               126, 127, 128, 129, 134, 135, 136, 137, 201, 203, 206, 211,
               214, 301, 302, 303, 313, 314, 315, 317, 318, 319, 320, 321, 322,
               323, 325, 326, 335, 336, 337, 339, 340, 351, 352, 353, 354, 355,
               356, 357, 402, 403, 404, 411, 412, 413, 601, 602, 603, 604, 655}


def read(data, name):
    return json.loads((data / (name + ".json")).read_text(encoding="utf-8"))


def pages(data):
    for path in sorted(data.glob("Map[0-9][0-9][0-9].json")):
        for event in read(data, path.stem)["events"]:
            if event:
                for index, page in enumerate(event["pages"]):
                    yield f"{path.stem} e{event['id']} p{index}", page
    for event in read(data, "CommonEvents"):
        if event:
            yield f"CE{event['id']} {event['name']}", event
    for troop in read(data, "Troops"):
        if troop:
            for index, page in enumerate(troop["pages"]):
                yield f"Troop{troop['id']} p{index}", page


def show(label, page, indices=None):
    conditions = page.get("conditions", {})
    active = {key[:-5]: {k: v for k, v in conditions.items() if k.startswith(key[:-5]) and k != key}
              for key, value in conditions.items() if key.endswith("Valid") and value}
    print(label, "conditions", active, "trigger", page.get("trigger"),
          "priority", page.get("priorityType"))
    for index, command in enumerate(page["list"]):
        if (indices is None and command["code"] in LOGIC_CODES) or (indices is not None and index in indices):
            print(index, " " * command["indent"], command["code"], json.dumps(command["parameters"], ensure_ascii=True))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, default=Path(r"C:\Games\Steam\steamapps\common\Look Outside"))
    parser.add_argument("--map", type=int)
    parser.add_argument("--events", help="Comma-separated event IDs; default all")
    parser.add_argument("--page", type=int)
    parser.add_argument("--writes-in", default="", help="Only scan labels starting with this prefix")
    parser.add_argument("--common", type=int, action="append", default=[])
    parser.add_argument("--troop", type=int, action="append", default=[])
    parser.add_argument("--variable-writes", type=int, action="append", default=[])
    parser.add_argument("--switch-writes", type=int, action="append", default=[])
    args = parser.parse_args()
    data = args.game_dir / "data"
    if args.map is not None:
        wanted = set(map(int, args.events.split(","))) if args.events else None
        for event in read(data, f"Map{args.map:03}")["events"]:
            if event and (wanted is None or event["id"] in wanted):
                for index, page in enumerate(event["pages"]):
                    if args.page is None or args.page == index:
                        show(f"Map{args.map:03} e{event['id']} {event['name']} p{index}", page)
    for cid in args.common:
        show(f"CE{cid}", read(data, "CommonEvents")[cid])
    for tid in args.troop:
        for index, page in enumerate(read(data, "Troops")[tid]["pages"]):
            if args.page is None or args.page == index:
                show(f"Troop{tid} p{index}", page)
    if args.variable_writes or args.switch_writes:
        for label, page in pages(data):
            if not label.startswith(args.writes_in):
                continue
            indices = set()
            for index, command in enumerate(page["list"]):
                params = command["parameters"]
                ids = args.variable_writes if command["code"] == 122 else args.switch_writes if command["code"] == 121 else []
                if any(params[0] <= value <= params[1] for value in ids):
                    indices.update(range(max(0, index - 2), min(len(page["list"]), index + 3)))
            if indices:
                show(label, page, indices)


if __name__ == "__main__":
    main()
