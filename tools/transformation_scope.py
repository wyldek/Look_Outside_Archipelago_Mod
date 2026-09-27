"""User-approved vanilla quest transformations for the audited game build.

The input objects are randomized. Their native conversion requirements and
outputs stay local; performing the conversion is not another AP check.
"""

VANILLA_TRANSFORMATIONS = (
    {"input_id": 331, "output_id": 332, "name": "Void Disc to Negative Disc",
     "map_id": 110, "event_id": 7, "page": 0, "consume_index": 10, "grant_index": 18},
    {"input_id": 386, "output_id": 387, "name": "Telescope repair",
     "troop_id": 124, "page": 0, "consume_index": 511, "grant_index": 512},
)


def validate_transformations(registry, map_reader, troops, require):
    for recipe in VANILLA_TRANSFORMATIONS:
        require(any(item["kind"] == "item" and item["database_id"] == recipe["input_id"] and
                    item["classification"] == "progression" and item["quantity"] >= 1
                    for item in registry["items"]), f"Transformation input missing: {recipe['name']}")
        require(not any(item["kind"] == "item" and item["database_id"] == recipe["output_id"]
                        for item in registry["items"]), f"Vanilla transformation output randomized: {recipe['name']}")
        if "troop_id" in recipe:
            commands = troops[recipe["troop_id"]]["pages"][recipe["page"]]["list"]
        else:
            commands = map_reader(recipe["map_id"])["events"][recipe["event_id"]]["pages"][recipe["page"]]["list"]
        for field, item_id, operation in (("consume_index", recipe["input_id"], 1),
                                         ("grant_index", recipe["output_id"], 0)):
            command = commands[recipe[field]]
            require(command["code"] == 126 and command["parameters"] == [item_id, operation, 0, 1],
                    f"Vanilla transformation recipe changed: {recipe['name']}")
        for location in registry["locations"]:
            for source in (location, *location.get("source_variants", [])):
                same_context = (source.get("troop_id") == recipe["troop_id"] if "troop_id" in recipe else
                                source.get("troop_id") is None and source.get("common_event_id") is None and
                                source["map_id"] == recipe["map_id"] and source["event_id"] == recipe["event_id"])
                require(not (same_context and source["page"] == recipe["page"] and
                             source["command_index"] in (recipe["consume_index"], recipe["grant_index"])),
                        f"Vanilla transformation command intercepted: {recipe['name']}")
