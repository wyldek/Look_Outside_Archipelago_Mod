"""Reviewed, disconnected remnants of the original underwater apartment route."""

import re

from audit_map_routes import transfer_rows


UNUSED_SEA_MAPS = {145, 146, 148, 150, 151, 154, 156, 157, 160, 161}
UNUSED_SEA_CHECKS = {"map151_event006", "map161_event001"}


def validate_indirect_transfers(data, read_json, require, excluded_maps):
    """Check common-event and battle transfers omitted from the map-edge index."""
    common = read_json(data / "CommonEvents.json")
    troops = read_json(data / "Troops.json")
    lists = [(f"CE{row['id']}", row["list"]) for row in common if row]
    lists += [(f"Troop{row['id']} page{pi}", page["list"])
              for row in troops if row for pi, page in enumerate(row["pages"])]
    for source, commands in lists:
        for command in commands:
            if command["code"] != 201:
                continue
            params = command["parameters"]
            if params[0] == 0:
                require(params[1] not in excluded_maps, f"An indirect entry appeared: {source}")
            else:
                require(source == "CE147" and params == [1, 532, 533, 534, 0, 0],
                        f"Unreviewed variable transfer: {source}")
    # CE147's falling animation uses a variable destination. Every setter in
    # the audited event lists chooses Map043, the painter's lower landing.
    for path in data.glob("Map[0-9][0-9][0-9].json"):
        lists.extend((path.stem, page["list"]) for event in read_json(path)["events"]
                     if event for page in event["pages"])
    setters = []
    for source, commands in lists:
        for command in commands:
            if command["code"] == 122:
                params = command["parameters"]
                if params[0] <= 532 <= params[1]:
                    setters.append(source)
                    require(params == [532, 532, 0, 0, 43] and 43 not in excluded_maps,
                            "The variable fall destination changed")
    require(len(setters) == 5, "The fall destination setter set changed")


def validate_unused_sea_maps(registry, data, read_json, require):
    validate_indirect_transfers(data, read_json, require, UNUSED_SEA_MAPS | {372})
    # Include shadowed and debug pages: even this overestimate has no entrance
    # into either obsolete cluster. Outgoing exits do not make a map reachable.
    for route in transfer_rows(data):
        require(route["destination_map"] not in UNUSED_SEA_MAPS or
                route["source_map"] in UNUSED_SEA_MAPS,
                "An entrance to an excluded underwater map appeared")
    # The only scripted map changes in database events use these two helpers.
    # Both use literal destinations in this build; deep basement plugin warps
    # are restricted to its separate 313-320 room table.
    for path in data.glob("*.json"):
        text = path.read_text(encoding="utf-8-sig")
        for match in re.finditer(r"(?:smoothTeleportBetweenMaps|reserveTransfer)\s*\(\s*([^,]+),", text):
            target = match[1].strip()
            require(target.isdecimal() and int(target) not in UNUSED_SEA_MAPS,
                    f"Unaudited scripted transfer in {path.name}")
    require(all(row["map_id"] not in UNUSED_SEA_MAPS for row in registry["locations"]),
            "A registered check is on a disconnected underwater map")
