"""The packaged current guide must not silently ship an older registry summary."""

import json
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from audit_access import load_access
from sync_setup_guide import GUIDES, synchronize


class SetupGuideTests(unittest.TestCase):
    def test_current_guide_and_stale_registry_rejection(self):
        registry = json.loads((ROOT / "apworld/lookoutside/vertical_slice.json").read_text(encoding="utf-8"))
        graph = load_access()
        for guide in GUIDES:
            with self.subTest(guide=guide.name):
                text = guide.read_text(encoding="utf-8")
                self.assertEqual(synchronize(text, registry, graph, check=True), text)
                stale = dict(registry, registry_version=registry["registry_version"] + 1)
                with self.assertRaisesRegex(ValueError, "stale"):
                    synchronize(text, stale,graph, check=True)


if __name__ == "__main__":
    unittest.main()
