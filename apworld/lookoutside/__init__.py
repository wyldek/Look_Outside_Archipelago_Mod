"""Look Outside development APWorld with access and chronological placement rules."""

import json
from importlib import resources

from BaseClasses import Item, ItemClassification, Location, LocationProgressType, Region, Tutorial
from worlds.AutoWorld import WebWorld, World

from .access_data import GRAPH
from .chronology import LOGIC_VERSION, day


DATA = json.loads(resources.files(__package__).joinpath("vertical_slice.json").read_text(encoding="utf-8"))
GAME = DATA["game_name"]
LOCATIONS = {entry["name"]: entry["ap_id"] for entry in DATA["locations"]}
ITEMS = {entry["name"]: entry["ap_id"] for entry in DATA["items"]}
ITEM_CLASSIFICATIONS = {
    entry["name"]: {
        "progression": ItemClassification.progression,
        "useful": ItemClassification.useful,
        "filler": ItemClassification.filler,
    }[entry["classification"]]
    for entry in DATA["items"]
}


class LookOutsideItem(Item):
    game = GAME


class LookOutsideLocation(Location):
    game = GAME


class LookOutsideWebWorld(WebWorld):
    game = GAME
    theme = "stone"
    tutorials = [Tutorial(
        "Development Playtest Setup Guide",
        "Set up the Look Outside development randomizer.",
        "English", "setup_en.md", "setup/en", ["Look Outside Archipelago contributors"],
    )]


class LookOutsideWorld(World):
    """Normal-mode development world; native timing and combat remain local."""

    game = GAME
    web = LookOutsideWebWorld()
    hidden = True
    location_name_to_id = LOCATIONS
    item_name_to_id = ITEMS
    required_client_version = (0, 6, 7)

    def create_regions(self) -> None:
        GRAPH.validate(DATA)
        regions = {name: Region(name, self.player, self.multiworld) for name in sorted(GRAPH.regions)}
        self.multiworld.regions.extend(regions.values())
        for edge in GRAPH.entrances:
            entrance = regions[edge.source].connect(regions[edge.target], rule=edge.rule.as_ap_rule(self.player))
            # Recheck entrances whose rules depend on a third region, including
            # the room used to transform Void Disc. AP caches reachability.
            for dependency in {atom.name for atom in edge.rule.atoms() if atom.kind == "region"}:
                self.multiworld.register_indirect_condition(regions[dependency], entrance)
        for entry in DATA["locations"]:
            check = GRAPH.checks[entry["key"]]
            parent = regions[check.region]
            location = LookOutsideLocation(self.player, entry["name"], entry["ap_id"], parent)
            location.access_rule = check.rule.as_ap_rule(self.player)
            parent.locations.append(location)
            if entry.get("missable"):
                location.progress_type = LocationProgressType.EXCLUDED
        for entry in GRAPH.events:
            location = LookOutsideLocation(self.player, entry.location, None, regions[entry.region])
            location.access_rule = entry.rule.as_ap_rule(self.player)
            regions[entry.region].locations.append(location)
            location.place_locked_item(LookOutsideItem(entry.name, ItemClassification.progression,
                                                       None, self.player))
        # Prove a chronology-safe route to the native Day15 fallback. Runtime
        # goal detection still accepts every real ending on any day. Giving the
        # solver a free Victory would bypass timed reservations in minimal mode.
        regions["Apartment 33"].add_event("Any Ending", "Victory", location_type=LookOutsideLocation,
                                        item_type=LookOutsideItem, rule=day(15).as_ap_rule(self.player))

    def create_items(self) -> None:
        for entry in DATA["items"]:
            self.multiworld.itempool.extend(
                self.create_item(entry["name"]) for _ in range(entry["quantity"])
            )

    def create_item(self, name: str) -> LookOutsideItem:
        return LookOutsideItem(name, ITEM_CLASSIFICATIONS[name],
                               self.item_name_to_id[name], self.player)

    def get_filler_item_name(self) -> str:
        # Used when a generic AP option removes an item from the pool.
        return "Mop"

    def set_rules(self) -> None:
        # Client endings have no Day15 minimum; generation proves the safe fallback.
        self.multiworld.completion_condition[self.player] = (
            lambda state: state.has("Victory", self.player)
        )

    def fill_slot_data(self) -> dict:
        return {
            "development_slice": True,
            "access_logic": LOGIC_VERSION,
            "difficulty": "normal",
            "registry_version": DATA["registry_version"],
            "audited_game_id": DATA["audited_game_id"],
            "audited_version_id": DATA["audited_version_id"],
        }
