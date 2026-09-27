"""Regression checks for RPG Maker event-page precedence in the audit."""

import unittest

from tools.audit_game import permanently_shadowed


class CandidatePageTests(unittest.TestCase):
    def test_later_unconditional_page_hides_pickup(self):
        event = {"pages": [
            {"conditions": {"selfSwitchValid": False, "switch1Valid": False}},
            {"conditions": {"selfSwitchValid": True, "switch1Valid": False}},
            {"conditions": {"selfSwitchValid": False, "switch1Valid": False}},
        ]}
        self.assertTrue(permanently_shadowed(event, 0))
        self.assertFalse(permanently_shadowed(event, 2))

    def test_later_conditional_consumed_page_does_not_hide_pickup(self):
        event = {"pages": [
            {"conditions": {"selfSwitchValid": False, "switch1Valid": False}},
            {"conditions": {"selfSwitchValid": True, "switch1Valid": False}},
        ]}
        self.assertFalse(permanently_shadowed(event, 0))
