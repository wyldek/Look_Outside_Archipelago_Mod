"""Normal-only route exclusions and the playable Unlabeled Cartridge gateway."""

from audit_map_routes import transfer_rows


HARD_ONLY_MAPS = {372}


def validate_normal_access(registry, data, read_json, require):
    entries = [row for row in transfer_rows(data) if row["destination_map"] == 372]
    require(len(entries) == 2 and all(
        row["source_map"] == 8 and row["event_id"] == 49 and row["page"] in (0, 1) and
        "switch 8 ON" in row["page_conditions"] for row in entries),
        "Long Hall's Hard-only entrance changed")
    require(all(row["map_id"] not in HARD_ONLY_MAPS for row in registry["locations"]),
            "Normal pool contains a check inside the Hard-only Long Hall")
    cartridge = next(row for row in registry["items"] if row["ap_id"] == 540000430)
    require(cartridge["classification"] == "progression", "Unlabeled Cartridge opens an AP region")
    common = read_json(data / "CommonEvents.json")
    for cid, index, code, params in (
        (12, 97, 111, [1, 42, 0, 430, 0]), (12, 98, 117, [40]),
        (40, 0, 111, [0, 660, 0]), (40, 14, 201, [0, 406, 23, 40, 0, 0]),
    ):
        command = common[cid]["list"][index]
        require(command["code"] == code and command["parameters"] == params,
                "Unlabeled Cartridge's region entrance changed")
    tv = read_json(data / "Map267.json")["events"][24]["pages"][0]["list"]
    for index, code, params in (
        (93, 121, [660, 660, 0]), (94, 117, [12]), (95, 121, [660, 660, 1]),
    ):
        require(tv[index]["code"] == code and tv[index]["parameters"] == params,
                f"Flesh TV's cartridge context changed at command {index}")
