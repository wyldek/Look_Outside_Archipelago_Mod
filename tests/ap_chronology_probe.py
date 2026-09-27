"""Run inside the real AP runtime, before item creation, using its CollectionState.

Injected into a temporary project-local test archive by run_ap_chronology_probe.
Never imported by the distributed world or game plugin.
"""

import importlib
import json

from BaseClasses import CollectionState


def run(world):
    module = importlib.import_module(type(world).__module__)
    graph, data = module.GRAPH, module.DATA
    mw, player = world.multiworld, world.player
    events = [mw.get_location(entry.location, player) for entry in graph.events]
    assert len(events) == 19
    for location in events:
        assert location.address is None and location.locked
        assert location.item.code is None and location.item.advancement
        assert location.name not in world.location_name_to_id
        assert location.item.name not in world.item_name_to_id
    assert len(world.location_name_to_id) == 273
    keys = {row["key"]: row["name"] for row in data["locations"]}

    def state_without(*missing):
        state = CollectionState(mw)
        for row in data["items"]:
            if row["name"] not in missing:
                for _ in range(row["quantity"]):
                    state.collect(world.create_item(row["name"]), prevent_sweep=True)
        return state

    def placed(placements, missing, expect_day15, fixture_day=None):
        modified = []
        try:
            for key, name in placements.items():
                location = mw.get_location(keys[key], player)
                modified.append((location, location.item, location.locked, location.access_rule))
                assert location.item is None
                location.place_locked_item(world.create_item(name))
                if fixture_day is not None:
                    location.access_rule = module.day(fixture_day).as_ap_rule(player)
            state = state_without(*missing)
            state.sweep_for_advancements()
            assert state.has("Day 15", player) == expect_day15
            assert state.has("Victory", player) == expect_day15
            return state
        finally:
            for location, item, locked, rule in modified:
                location.item, location.locked, location.access_rule = item, locked, rule

    complete = state_without()
    complete.sweep_for_advancements()
    assert all(mw.get_location(name, player).can_reach(complete) for name in keys.values())
    assert all(complete.has(entry.name, player) for entry in graph.events)
    state = placed({"map436_event008": "Rose"}, ("Rose",), False)
    assert not state.has("Charan Rose Delivered", player)
    state = placed({"map097_event009": "Rose", "map436_event008": "Painter's Key"},
                   ("Rose", "Painter's Key"), False)
    assert not state.has("Rose", player)
    for day, valid in ((5, True), (6, False), (9, False)):
        placed({"map023_event041_baseball_bat": "Rose"}, ("Rose",), valid, day)
    for day, valid in ((0, True), (10, True), (11, False)):
        state = placed({"map023_event041_baseball_bat": "Phone"}, ("Phone",), valid, day)
        assert mw.get_location(keys["leighs_call_ring"], player).can_reach(state) == valid
    print("CHRONOLOGY_AP_PROBE " + json.dumps({"scenarios": 10, "addressless_locked_events": len(events),
                                             "randomized_locations": len(keys), "all_checks_reachable": True}))
