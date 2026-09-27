"""Finite key/valve spending budgets outside the ordinary Simple Key locks."""

KEY_LOCKS = {
    296: {(125, 7)},
    297: {(140, 6)},
    298: {(125, 13)},
    299: {(152, 1)},
    395: {(10, 21), (23, 1), (55, 18), (99, 18), (158, 10), (308, 6)},
    651: {(440, 14)},
    652: {(440, 5)},
    653: {(440, 1), (440, 9), (440, 11)},
    654: {(440, 8)},
    655: {(439, 6)},
    656: {(440, 7), (445, 2)},
}

# Old versions of the sea route remain in the database but have no entrance.
UNUSED_KEY_LOCKS = {297: {(148, 1)}, 298: {(154, 6)}}


def validate_key_budgets(registry, data, read_json, require):
    found = {key: set() for key in KEY_LOCKS}
    for path in data.glob("Map[0-9][0-9][0-9].json"):
        mid = int(path.stem[3:])
        for event in read_json(path)["events"]:
            if event is None:
                continue
            for page in event["pages"]:
                for command in page["list"]:
                    if command["code"] != 126:
                        continue
                    params = command["parameters"]
                    if params[0] in KEY_LOCKS and params[1] == 1:
                        require(params[2:] == [0, 1], "A key/valve lock changed its cost")
                        found[params[0]].add((mid, event["id"]))
    require(found == {key: locks | UNUSED_KEY_LOCKS.get(key, set())
                      for key, locks in KEY_LOCKS.items()},
            "Finite key/valve lock set changed")
    definitions = {row["database_id"]: row for row in registry["items"] if row["kind"] == "item"}
    for key, locks in KEY_LOCKS.items():
        row = definitions.get(key)
        require(row is not None, f"AP key supply is missing: {key}")
        total = row["quantity"] * row.get("delivery_amount", 1)
        require(total >= len(locks), f"AP supply is insufficient for every {row['name']} lock")
    black = next(row for row in registry["items"] if row["ap_id"] == 540000656)
    require(black["name"] == "Black Keys (2)" and black["quantity"] == 1 and
            black.get("delivery_amount") == 2 and black["classification"] == "progression",
            "Black key bundle must cover both independent doors")
