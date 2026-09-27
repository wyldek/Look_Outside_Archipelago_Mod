"""Regression cases for access requirements, not combat strength."""

import importlib
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from audit_access import load_access

GRAPH = load_access()
rules = importlib.import_module("lookoutside_access_audit.access")
REGISTRY = json.loads((ROOT / "apworld/lookoutside/vertical_slice.json").read_text(encoding="utf-8"))


class AccessTests(unittest.TestCase):
    def test_missing_rules_do_not_become_free_access(self):
        self.assertEqual(GRAPH.validate(REGISTRY), [])
        key = next(iter(GRAPH.checks))
        incomplete = rules.AccessGraph(GRAPH.entrances,
                                       {k: v for k, v in GRAPH.checks.items() if k != key}, events=GRAPH.events)
        self.assertEqual(incomplete.validate(REGISTRY, require_complete=False), [key])
        with self.assertRaisesRegex(ValueError, "Access audit incomplete"):
            incomplete.validate(REGISTRY)
        self.assertNotIn(key, incomplete.reachable({})[1])

    def test_combat_gear_does_not_unlock_routes_or_boss_checks(self):
        equipment = {entry["name"]: 99 for entry in REGISTRY["items"]
                     if entry["kind"] in ("weapon", "armor")}
        self.assertEqual(GRAPH.reachable({}), GRAPH.reachable(equipment))
        self.assertIn("boss_drop_21_3", GRAPH.reachable({})[1])
        self.assertIn("map024_event007_padlock_key", GRAPH.reachable({})[1])

    def test_stairwell_floor_one_door_does_not_unlock_from_outside(self):
        reached, checks = GRAPH.reachable({"Padlock Key": 1})
        self.assertIn("Floor 2", reached)
        self.assertNotIn("Floor 1", reached)
        self.assertIn("map007_event001_quest_item", checks)
        reached, _ = GRAPH.reachable({"Padlock Key": 1, "Apt. 21 Key": 1})
        self.assertIn("Floor 1", reached)

    def test_elevator_provides_an_alternative_to_the_stairwell_keys(self):
        reached, _ = GRAPH.reachable({"Elevator Access": 1, "Power Restored": 1})
        self.assertTrue({"Floor 1", "Floor 2", "Basement West", "Ground Floor"} <= reached)
        self.assertNotIn("Elevator", GRAPH.reachable({"Elevator Access": 1})[0])

    def test_fuse_box_and_elevator_boss_do_not_require_their_own_unlocks(self):
        _, checks = GRAPH.reachable({"Padlock Key": 1, "Basement Key": 1})
        self.assertIn("power_restoration", checks)
        self.assertIn("map074_event003_elevator_freak", checks)

    def test_painter_interior_requires_key_but_front_pickup_does_not(self):
        before = {"Padlock Key": 1, "Apt. 21 Key": 1}
        self.assertIn("map096_event007", GRAPH.reachable(before)[1])
        self.assertNotIn("map097_event009", GRAPH.reachable(before)[1])
        self.assertIn("map097_event009", GRAPH.reachable({**before, "Painter's Key": 1})[1])

    def test_rafta_requires_both_original_quest_inputs(self):
        access = {"Padlock Key": 1, "Apt. 21 Key": 1}
        key = "map094_event009_quest_reward"
        for inputs in ({}, {"Stationery": 1}, {"Fountain Pen": 1}):
            self.assertNotIn(key, GRAPH.reachable({**access, **inputs})[1])
        self.assertIn(key, GRAPH.reachable({**access, "Stationery": 1, "Fountain Pen": 1})[1])

    def test_validator_rejects_combat_equipment_even_if_misclassified(self):
        graph = rules.AccessGraph((rules.Entrance("Menu", "Fight", rules.item("Baseball Bat"), "test"),), {})
        changed = {**REGISTRY, "items": [{**entry, "classification": "progression"}
                                       for entry in REGISTRY["items"]]}
        with self.assertRaisesRegex(ValueError, "Combat equipment requirement"):
            graph.validate(changed, require_complete=False)

    def test_counted_items_and_alternative_access(self):
        rule = rules.any_of(rules.item("Iris Key", 3), rules.item("Roof Access Key"))
        for inventory, expected in (({}, False), ({"Iris Key": 2}, False),
                                    ({"Iris Key": 3}, True), ({"Roof Access Key": 1}, True)):
            self.assertEqual(rule.evaluate(lambda name, count: inventory.get(name, 0) >= count,
                                           lambda _: False), expected)
        with self.assertRaises(ValueError):
            rules.item("Iris Key", 0)

    def test_all_reviewed_checks_reachable_with_all_items(self):
        inventory = {entry["name"]: entry["quantity"] for entry in REGISTRY["items"]}
        self.assertEqual(set(GRAPH.checks), GRAPH.reachable(inventory)[1])

    def test_ordinary_locks_require_a_global_budget_not_one_reused_key(self):
        locked = {"map352_event014", "map352_event015", "map011_event009_safe_94",
                  "map073_event008_safe_83", "map073_event008_safe_54", "map081_event003"}
        inventory = {entry["name"]: entry["quantity"] for entry in REGISTRY["items"]}
        inventory["Simple Keys (3)"] = 8
        self.assertTrue(locked.isdisjoint(GRAPH.reachable(inventory)[1]))
        inventory["Simple Keys (3)"] = 9
        self.assertTrue(locked <= GRAPH.reachable(inventory)[1])
        from simple_key_scope import ORDINARY_LOCKS
        definition = next(entry for entry in REGISTRY["items"] if entry["ap_id"] == 540000320)
        amount = definition["delivery_amount"]
        self.assertLess(8 * amount, len(ORDINARY_LOCKS))
        self.assertGreaterEqual(9 * amount, len(ORDINARY_LOCKS))
        self.assertGreaterEqual(definition["quantity"] * amount, len(ORDINARY_LOCKS))

    def test_janitor_ring_requires_both_halves_of_the_encounter_route(self):
        basement = {"Padlock Key": 1, "Basement Key": 1}
        key = "map087_event021_quest_item"
        self.assertNotIn(key, GRAPH.reachable(basement)[1])
        self.assertIn(key, GRAPH.reachable({**basement, "Earth Disc": 1, "Mars Disc": 1, "Power Restored": 1})[1])

    def test_fixed_key_sources_do_not_require_the_keys_they_replace(self):
        self.assertIn("simple_key_map025_event002", GRAPH.reachable({})[1])
        inventory = {entry["name"]: entry["quantity"] for entry in REGISTRY["items"]
                     if entry["ap_id"] != 540000320}
        checks = GRAPH.reachable(inventory)[1]
        self.assertTrue({entry["key"] for entry in REGISTRY["locations"]
                         if entry.get("simple_key_source") == "pickup"} <= checks)

    def test_disc_routes_do_not_use_one_disc_at_two_doors(self):
        inventory = {"Padlock Key": 1, "Power Restored": 1, "Earth Disc": 1,
                     "Mars Disc": 1, "Uranus Disc": 1, "Sun Disc": 1}
        reached, _ = GRAPH.reachable(inventory)
        self.assertIn("Ground Floor", reached)
        self.assertNotIn("Office Front", reached)  # Earth occupies the stair door.
        inventory["Void Disc"] = 1  # Sun + Negative can instead hold that door.
        reached, _ = GRAPH.reachable(inventory)
        self.assertIn("Office Front", reached)
        self.assertNotIn("Office Inner", reached)  # Sun cannot also hold inner15.
        inventory["Elevator Access"] = 1
        self.assertIn("Office Inner", GRAPH.reachable(inventory)[0])

    def test_mailroom_budget_keeps_the_ground_floor_door_open(self):
        inventory = {"Padlock Key": 1, "Power Restored": 1, "Earth Disc": 1,
                     "Mars Disc": 1, "Jupiter Disc": 1, "Uranus Disc": 1,
                     "Neptune Disc": 1, "Pluto Disc": 1}
        self.assertNotIn("Mailroom Storage", GRAPH.reachable(inventory)[0])
        self.assertIn("Mailroom Storage", GRAPH.reachable({**inventory, "Sun Disc": 1, "Void Disc": 1})[0])
        self.assertIn("Mailroom Storage", GRAPH.reachable({**inventory, "Elevator Access": 1})[0])

    def test_disc_logic_does_not_require_preserving_void_before_conversion(self):
        # Converting Void permanently removes its -1 form. A seed must not
        # later assume that Neptune16 + original Void-1 can open inner15.
        inventory = {"Power Restored": 1, "Elevator Access": 1, "Earth Disc": 1,
                     "Uranus Disc": 1, "Neptune Disc": 1, "Void Disc": 1}
        self.assertNotIn("Office Inner", GRAPH.reachable(inventory)[0])
        self.assertIn("Office Inner", GRAPH.reachable({**inventory, "Sun Disc": 1, "Mars Disc": 1})[0])

    def test_shrunken_head_opens_the_flesh_passage_and_returned_northeast_room(self):
        key = "map277_event004_quest_item"
        self.assertIn(key, GRAPH.reachable({})[1])
        self.assertNotIn("map275_event004", GRAPH.reachable({})[1])
        self.assertIn("map275_event004", GRAPH.reachable({"Shrunken Head": 1})[1])

    def test_security_storage_requires_distinct_outer_and_inner_discs(self):
        inventory = {"Padlock Key": 1, "Basement Key": 1, "Power Restored": 1,
                     "Sun Disc": 1, "Pluto Disc": 1, "Neptune Disc": 1, "Mars Disc": 1}
        self.assertIn("Security Lobby", GRAPH.reachable(inventory)[0])
        self.assertNotIn("Security Storage", GRAPH.reachable(inventory)[0])
        self.assertIn("Security Storage", GRAPH.reachable({**inventory, "Uranus Disc": 1, "Void Disc": 1})[0])

    def test_sea_route_uses_only_the_four_playable_valve_locks(self):
        access = {"Padlock Key": 1}
        self.assertIn("map137_event006", GRAPH.reachable(access)[1])
        self.assertIn("map140_event010", GRAPH.reachable(access)[1])
        for valve, check in (("Twilight Valve", "map136_event007"),
                             ("Midnight Valve", "map138_event006"),
                             ("Abyssal Valve", "map147_event008")):
            self.assertNotIn(check, GRAPH.reachable(access)[1])
            self.assertIn(check, GRAPH.reachable({**access, valve: 1})[1])
        lower = {**access, "Abyssal Valve": 1}
        self.assertIn("boss_salvage_364", GRAPH.reachable(lower)[1])
        self.assertNotIn("boss_drop_267_347", GRAPH.reachable(lower)[1])
        self.assertIn("boss_drop_267_347", GRAPH.reachable({**lower, "Hadal Valve": 1})[1])

    def test_local_supplies_do_not_add_ap_gates_to_herbicide_and_ice(self):
        self.assertTrue({"map121_event010", "map122_event010", "map271_event006"} <= GRAPH.reachable({})[1])
        self.assertNotIn("map010_event016_quest_item", GRAPH.reachable({"Padlock Key": 1})[1])
        self.assertIn("map010_event016_quest_item", GRAPH.reachable({"Padlock Key": 1, "Apt. 21 Key": 1})[1])
        basement = {"Padlock Key": 1, "Basement Key": 1}
        self.assertTrue({"map085_event024_quest_item", "map188_event015", "map187_event035_quest_item"}
                        <= GRAPH.reachable(basement)[1])

    def test_unlabeled_game_requires_cartridge_and_any_order_key_budget(self):
        inventory = {entry["name"]: entry["quantity"] for entry in REGISTRY["items"]}
        self.assertIn("map406_event002_quest_item", GRAPH.reachable(inventory)[1])
        for key, count in (("Unlabeled Cartridge", 0), ("green key", 0), ("red key", 0),
                           ("yellow key", 2), ("blue key", 0), ("white key", 0), ("Black Keys (2)", 0)):
            self.assertNotIn("Unlabeled Game", GRAPH.reachable({**inventory, key: count})[0])
        self.assertIn("Flesh Home", GRAPH.reachable({})[0])

    def test_ritual_cannot_offer_the_same_guinea_pig_to_two_astronomers(self):
        routes = {"Elevator Access": 1, "Power Restored": 1}
        # Without the Apartment21 paper route, Aster needs a separate photo.
        supplies = {"Old Photograph": 1, "Blank VHS tape": 1,
                    "Canvas Carry Bag": 1, "Clean Manuscript": 1}
        self.assertIn("jasper_apartment_key", GRAPH.reachable(routes)[1])
        self.assertNotIn("ritual_roof_key", GRAPH.reachable(routes)[1])
        self.assertIn("ritual_roof_key", GRAPH.reachable({**routes, **supplies})[1])
        for missing in supplies:
            one_missing = {name: count for name, count in supplies.items() if name != missing}
            self.assertNotIn("ritual_roof_key", GRAPH.reachable({**routes, **one_missing})[1])
            self.assertIn("ritual_roof_key", GRAPH.reachable({**routes, **one_missing, "Guinea Pig": 1})[1])
        self.assertNotIn("ritual_roof_key", GRAPH.reachable({**routes, "Guinea Pig": 1,
                         "Canvas Carry Bag": 1, "Clean Manuscript": 1})[1])
        self.assertIn("ritual_roof_key", GRAPH.reachable({**routes, "Apt. 21 Key": 1,
                      "Blank VHS tape": 1, "Canvas Carry Bag": 1, "Clean Manuscript": 1})[1])

    def test_planetarium_check_and_its_remote_door_are_independent(self):
        routes = {"Padlock Key": 1, "Apt. 21 Key": 1, "Jasper's Key": 1}
        discs = {name + " Disc": 1 for name in (
            "Sun", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune")}
        self.assertIn("map359_event003_quest_item", GRAPH.reachable(routes)[1])
        self.assertNotIn("planetarium_access", GRAPH.reachable({**routes, **discs})[1])
        solved = {**routes, **discs, "Power Restored": 1}
        self.assertIn("planetarium_access", GRAPH.reachable(solved)[1])
        for name in discs:
            self.assertNotIn("planetarium_access", GRAPH.reachable({**solved, name: 0})[1])
        self.assertNotIn("map360_event004", GRAPH.reachable(solved)[1])
        self.assertIn("map360_event004", GRAPH.reachable({**routes, "Planetarium Door Access": 1})[1])

    def test_native_quest_inputs_are_separate_from_checks_and_combat_strength(self):
        routes = {"Padlock Key": 1}
        self.assertNotIn("leighs_call_ring", GRAPH.reachable(routes)[1])
        calendar = {"Simple Keys (3)": 9, "Rose": 1, "Basement Key": 1}
        self.assertIn("leighs_call_ring", GRAPH.reachable({**routes, **calendar, "Phone": 1})[1])
        self.assertNotIn("map016_event003_quest_item", GRAPH.reachable(routes)[1])
        self.assertIn("map016_event003_quest_item", GRAPH.reachable({**routes, "Basement Key": 1})[1])
        floor_one = {**routes, "Apt. 21 Key": 1}
        abyss = {**floor_one, "Earth Disc": 1, "Power Restored": 1}
        self.assertIn("map106_event011_complex", GRAPH.reachable(abyss)[1])
        self.assertNotIn("Rusty Crown", abyss)
        self.assertIn("map433_event009_quest_pickup", GRAPH.reachable(floor_one)[1])
        self.assertNotIn("map433_event009_quest_pickup", GRAPH.reachable(routes)[1])

    def test_jeanne_transformation_requires_stair_door_even_with_elevator(self):
        elevator = {"Elevator Access": 1, "Power Restored": 1}
        self.assertIn("Ground Floor", GRAPH.reachable(elevator)[0])
        self.assertIn("map285_event010", GRAPH.reachable(elevator)[1])
        self.assertIn("map069_event056_quest_reward", GRAPH.reachable(elevator)[1])
        late = {"map286_event023", "map287_event027", "map334_event009"}
        self.assertTrue(late.isdisjoint(GRAPH.reachable(elevator)[1]))
        self.assertTrue(late <= GRAPH.reachable({**elevator, "Earth Disc": 1, "Mars Disc": 1})[1])
        self.assertNotIn("Laundry", elevator)

    def test_home_conversation_check_does_not_require_the_later_vending_purchase(self):
        calendar = {"Simple Keys (3)": 9, "Padlock Key": 1, "Basement Key": 1, "Rose": 1,
                    "Phone": 1, "Apt. 21 Key": 1}
        self.assertTrue({"map006_event025_quest_pickup", "roach_leadership_crown",
                         "roach_leadership_sash", "pierre_clown_wig", "boss_drop_707_366"}
                        <= GRAPH.reachable(calendar)[1])

    def test_tomb_needs_crossword_access_and_charan_needs_rose(self):
        routes = {"Elevator Access": 1, "Power Restored": 1, "Pluto Disc": 1}
        self.assertNotIn("wilhelmina_reward_sword", GRAPH.reachable(routes)[1])
        self.assertIn("wilhelmina_reward_sword", GRAPH.reachable({**routes, "Apt. 21 Key": 1})[1])
        for key in ("map339_event012", "map401_event007_quest_item"):
            self.assertNotIn(key, GRAPH.reachable(routes)[1])
            self.assertIn(key, GRAPH.reachable({**routes, "Rose": 1, "Simple Keys (3)": 9})[1])

    def test_fourth_floor_and_landlord_use_local_ticket_coins_and_herbicide(self):
        checks = GRAPH.reachable({"Elevator Access": 1, "Power Restored": 1})[1]
        self.assertTrue({"map456_event001_quest_item", "map457_event008", "map465_event002",
                         "map230_event003_complex", "map380_event003_quest_item"} <= checks)

    def test_iris_routes_require_a_spend_budget_and_keep_their_components_separate(self):
        base = {"Padlock Key": 1, "Apt. 21 Key": 1}
        central = {"map393_event012", "map415_event006", "map424_event008", "map429_event001"}
        self.assertTrue(central.isdisjoint(GRAPH.reachable({**base, "Iris Key": 5})[1]))
        checks = GRAPH.reachable({**base, "Iris Key": 6})[1]
        self.assertTrue(central <= checks)
        self.assertNotIn("map426_event001", checks)  # Reception/sea is a different component.
        checks = GRAPH.reachable({"Elevator Access": 1, "Power Restored": 1, "Iris Key": 6})[1]
        self.assertTrue({"map421_event004", "map426_event001"} <= checks)
        self.assertNotIn("map367_event001_quest_reward", checks)

    def test_sybil_has_a_peaceful_route_without_iris_or_friendly_attack(self):
        supplies = {"Apt. 35 Key": 1, "Telescope Pieces": 1}
        keys = {"map367_event001_quest_reward", "map348_event005"}
        self.assertTrue(keys.isdisjoint(GRAPH.reachable(supplies)[1]))  # Jasper repairs it.
        inventory = {**supplies, "Elevator Access": 1, "Power Restored": 1}
        self.assertTrue(keys <= GRAPH.reachable(inventory)[1])
        for missing in supplies:
            self.assertTrue(keys.isdisjoint(GRAPH.reachable({**inventory, missing: 0})[1]))

    def test_painter_milestones_and_kaeley_foyer_precede_their_locks(self):
        routes = {"Padlock Key": 1, "Apt. 21 Key": 1}
        self.assertIn("frederic_painters_key", GRAPH.reachable(routes)[1])
        self.assertNotIn("frederic_canvas_bag", GRAPH.reachable(routes)[1])
        routes["Painter's Key"] = 1
        self.assertIn("frederic_canvas_bag", GRAPH.reachable(routes)[1])
        self.assertNotIn("frederic_paint_palette", GRAPH.reachable(routes)[1])
        self.assertNotIn("green_portrait_stained_key", GRAPH.reachable(routes)[1])
        self.assertIn("green_portrait_stained_key", GRAPH.reachable({**routes, "Cowboy Hat (Lucky)": 1})[1])
        self.assertIn("frederic_paint_palette", GRAPH.reachable({**routes, "Stained Key": 1})[1])
        self.assertIn("simple_key_drop_130", GRAPH.reachable({})[1])
        self.assertNotIn("map355_event035", GRAPH.reachable({})[1])

    def test_reusable_gifts_need_their_routes_without_own_item_or_combat_gates(self):
        elevator = {"Elevator Access": 1, "Power Restored": 1}
        self.assertNotIn("scout_radio", GRAPH.reachable({})[1])
        self.assertIn("scout_radio", GRAPH.reachable(elevator)[1])
        self.assertNotIn("bright_frederic_jar", GRAPH.reachable(elevator)[1])
        painter = {**elevator, "Painter's Key": 1}
        self.assertNotIn("bright_frederic_jar", GRAPH.reachable(painter)[1])
        self.assertIn("bright_frederic_jar", GRAPH.reachable({**painter, "Stained Key": 1})[1])

    def test_car_trunk_requires_garage_and_electronic_key(self):
        route = {"Elevator Access": 1, "Power Restored": 1}
        self.assertNotIn("car_trunk_shotgun", GRAPH.reachable(route)[1])
        self.assertNotIn("car_trunk_shotgun", GRAPH.reachable({"Electronic Key": 1})[1])
        self.assertIn("car_trunk_shotgun", GRAPH.reachable({**route, "Electronic Key": 1})[1])


if __name__ == "__main__":
    unittest.main()
