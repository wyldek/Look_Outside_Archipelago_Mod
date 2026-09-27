"""Calendar dependencies are swept transitively, never static placement bans."""

from collections import Counter
from dataclasses import replace
import importlib
import json
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from audit_access import load_access

GRAPH = load_access()
r = importlib.import_module("lookoutside_access_audit.access")
c = importlib.import_module("lookoutside_access_audit.chronology")
DATA = json.loads((ROOT / "apworld/lookoutside/vertical_slice.json").read_text(encoding="utf-8"))
ALL = {entry["name"]: entry["quantity"] for entry in DATA["items"]}


def collect_placements(graph, placements, inventory, through_day=15):
    inventory = Counter(inventory)
    checked = set()
    while True:
        reached, checks, events = graph.sweep(inventory, through_day=through_day)
        newly = checks & placements.keys() - checked
        if not newly:
            return reached, checks, events
        for key in newly:
            inventory[placements[key]] += 1
        checked |= newly


def source_on_day(day):
    return replace(GRAPH, checks={**GRAPH.checks,
                                 "fixture": r.Check("Apartment 33", c.day(day), "test fixture")})


class ChronologyTests(unittest.TestCase):
    def test_milestones_form_a_monotonic_chain(self):
        for number in range(16):
            _, _, events = GRAPH.sweep(ALL, through_day=number)
            self.assertEqual({f"Day {n}" for n in range(1, number + 1)},
                             {name for name in events if name.startswith("Day ")})
        for milestone in c.DAY_EVENTS[1:]:
            self.assertIn(c.day(milestone.day - 1), tuple(milestone.rule.atoms()))

    def test_fixed_date_regions_use_verified_earliest_routes(self):
        for name, opening in {"Original Teeth Apartment": 1, "Apartment 31": 2,
                              "Apartment 32": 3, "Taxidermy Apartment": 4,
                              "Late Teeth Apartment": 8}.items():
            with self.subTest(region=name):
                self.assertNotIn(name, GRAPH.reachable(ALL, through_day=opening - 1)[0])
                self.assertIn(name, GRAPH.reachable(ALL, through_day=opening)[0])

    def test_real_late_teeth_pickup_cannot_hold_rose(self):
        inventory = {**ALL, "Rose": 0}
        reached, checks, events = collect_placements(GRAPH, {"map436_event008": "Rose"}, inventory)
        self.assertNotIn("Late Teeth Apartment", reached)
        self.assertNotIn("Charan Rose Delivered", events)
        self.assertNotIn("map339_event012", checks)
        self.assertNotIn("map401_event007_quest_item", checks)
        self.assertNotIn("Day 6", events)

    def test_day_nine_fixture_is_also_rejected(self):
        _, checks, events = collect_placements(source_on_day(9), {"fixture": "Rose"}, {**ALL, "Rose": 0})
        self.assertNotIn("fixture", checks)
        self.assertNotIn("Day 9", events)

    def test_transitive_early_rose_behind_late_key_is_rejected(self):
        # Painter Interior has no date gate, but its key is in the late teeth room.
        placements = {"map097_event009": "Rose", "map436_event008": "Painter's Key"}
        reached, checks, events = collect_placements(GRAPH, placements,
                                                    {**ALL, "Rose": 0, "Painter's Key": 0})
        self.assertNotIn("Painter Interior", reached)
        self.assertNotIn("map097_event009", checks)
        self.assertNotIn("Charan Rose Delivered", events)

    def test_charan_exact_boundary_and_real_new_day_reservation(self):
        for receipt_day, valid in ((0, True), (5, True), (6, False)):
            _, checks, events = collect_placements(source_on_day(receipt_day), {"fixture": "Rose"},
                                                   {**ALL, "Rose": 0})
            self.assertEqual("map401_event007_quest_item" in checks, valid)
            self.assertEqual("Day 15" in events, valid)
        self.assertIn("map339_event012", GRAPH.reachable(ALL, through_day=5)[1])
        self.assertNotIn("map401_event007_quest_item", GRAPH.reachable(ALL, through_day=5)[1])
        self.assertIn("map401_event007_quest_item", GRAPH.reachable(ALL, through_day=6)[1])

    def test_leigh_early_exact_latest_and_one_day_late(self):
        self.assertEqual((c.LEIGH_LAST_START, c.LEIGH_TRANSITIONS), (10, 4))
        for receipt_day, valid in ((0, True), (3, True), (10, True), (11, False)):
            with self.subTest(day=receipt_day):
                _, checks, events = collect_placements(source_on_day(receipt_day), {"fixture": "Phone"},
                                                       {**ALL, "Phone": 0})
                self.assertEqual("Leigh Quest Started" in events, valid)
                self.assertEqual("leighs_call_ring" in checks, valid)
                self.assertEqual("Day 15" in events, valid)

    def test_leigh_result_cannot_feed_charan_before_four_transitions(self):
        # Even an early Phone does not give immediate logical credit for the
        # ring. Conservative reservation avoids reward -> Rose timing leaks.
        _, checks, events = collect_placements(GRAPH, {"leighs_call_ring": "Rose"}, {**ALL, "Rose": 0})
        self.assertNotIn("Charan Rose Delivered", events)
        self.assertNotIn("map401_event007_quest_item", checks)

    def test_availability_not_player_behavior(self):
        # No quest stages, native days, or confirmation packets are supplied.
        _, _, events = GRAPH.sweep(ALL, through_day=3)
        self.assertIn("Leigh Quest Started", events)
        self.assertIn("Charan Rose Delivered", events)
        self.assertNotIn("leighs_call_ring", GRAPH.reachable(ALL, through_day=13)[1])
        self.assertIn("leighs_call_ring", GRAPH.reachable(ALL, through_day=14)[1])

    def test_original_safe_budget_must_exist_during_original_window(self):
        for receipt_day, valid in ((4, True), (5, False)):
            _, checks, events = collect_placements(source_on_day(receipt_day), {"fixture": "Simple Keys (3)"},
                                                   {**ALL, "Simple Keys (3)": 8})
            self.assertEqual("Original Teeth Safe Accessible" in events, valid)
            self.assertEqual("map034_event024_complex" in checks, valid)

    def test_crossword_access_must_precede_day_fifteen(self):
        for receipt_day, valid in ((14, True), (15, False)):
            _, _, events = collect_placements(source_on_day(receipt_day), {"fixture": "Apt. 21 Key"},
                                              {**ALL, "Apt. 21 Key": 0})
            self.assertEqual("Wilhelmina Crossword Solved" in events, valid)
            self.assertEqual("Day 15" in events, valid)

    def test_all_273_checks_and_events_reachable(self):
        _, checks, events = GRAPH.sweep(ALL)
        self.assertEqual(len(checks), 273)
        self.assertEqual(events, {entry.name for entry in GRAPH.events})

    def test_early_teeth_resolutions_remain_valid_alternatives(self):
        keys = {"clint_rags", "clint_tooth_knife", "joel_peaceful_door_knob", "joel_resolution_toothy_whip",
                "benjamin_game", "benjamin_pendant", "madison_tooth_hammer"}
        self.assertTrue(keys <= GRAPH.reachable({}, through_day=1)[1])
        self.assertNotIn("map436_event008", GRAPH.reachable({}, through_day=1)[1])

    def test_waited_rewards_cannot_feed_an_earlier_deadline(self):
        for key in ("map006_event025_quest_pickup", "map006_event040_quest_item", "shadow_tongue"):
            _, _, events = collect_placements(GRAPH, {key: "Rose"}, {**ALL, "Rose": 0})
            self.assertNotIn("Charan Rose Delivered", events, key)
        louis = {"boss_drop_707_366", "boss_drop_708_367", "boss_drop_709_369", "boss_drop_710_368"}
        self.assertTrue(louis.isdisjoint(GRAPH.reachable(ALL, through_day=4)[1]))
        self.assertTrue(louis <= GRAPH.reachable(ALL, through_day=5)[1])

    def test_caller_cannot_inject_unearned_calendar_milestones(self):
        self.assertEqual(GRAPH.sweep({}), GRAPH.sweep({"Day 15": 1, "Day 8": 1}))

    def test_variable_visitor_reward_cannot_supply_late_phone(self):
        _, checks, events = collect_placements(GRAPH, {"map006_event025_quest_pickup": "Phone"},
                                               {**ALL, "Phone": 0})
        self.assertNotIn("Leigh Quest Started", events)
        self.assertNotIn("leighs_call_ring", checks)

    def test_early_building_and_power_are_timeless(self):
        reached, checks = GRAPH.reachable({"Padlock Key": 1, "Basement Key": 1}, through_day=0)
        self.assertIn("Floor 2", reached)
        self.assertNotIn("Floor 1", reached)
        self.assertIn("power_restoration", checks)
        self.assertIn("map074_event003_elevator_freak", checks)

    def test_event_validation_does_not_weaken_registry_validation(self):
        for rule, message in (
            (r.event("Imaginary Event"), "event dependency"),
            (r.item("Day 8"), "non-progression"),
            (r.item("Imaginary Item"), "non-progression"),
            (r.item("Phone", 2), "item count"),
            (r.region("Imaginary Room"), "region dependency"),
            (r.item("Mop"), "non-progression"),
        ):
            changed = replace(GRAPH, events=GRAPH.events +
                              (r.Event("Fixture", "Fixture Event", "Apartment 33", rule, "test"),))
            with self.subTest(rule=rule), self.assertRaisesRegex(ValueError, message):
                changed.validate(DATA)
        with self.assertRaisesRegex(ValueError, "colliding"):
            replace(GRAPH, events=GRAPH.events + (GRAPH.events[0],)).validate(DATA)

    def test_ap_event_adapter_checks_the_correct_player(self):
        class State:
            def has(self, name, player, count):
                return (name, player, count) == ("Day 8", 2, 1)
            def can_reach(self, *args):
                return False
        self.assertTrue(c.day(8).as_ap_rule(2)(State()))
        self.assertFalse(c.day(8).as_ap_rule(1)(State()))


if __name__ == "__main__":
    unittest.main()
