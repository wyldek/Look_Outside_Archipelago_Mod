"""Reconcile audited gainItem script calls with native economy/return behavior."""

import argparse
import json
from pathlib import Path

from audit_game import read_json

PROJECT = Path(__file__).resolve().parents[1]
COMMON = {
    42: "Recipe crafting output; crafting stays vanilla",
    44: "Cooking ingredients are removed; no new acquisition",
    45: "Cooking/crafting inputs and output; repeatable local economy",
    46: "BuyItemTable: repeatable purchases stay vanilla",
    55: "Insert/remove an already-owned planetary disc; not a new item copy",
    147: "Spends chosen local supplies while burning the vines",
    216: "Spends chosen local supplies at the barrier",
    265: "Aster returns the player's previous offering",
    296: "Pentacle slots remove/return already-owned game tokens",
}
MAPS = {
    (3, 132): "Trade/consume the selected item or equipped object; negative grant",
    (6, 25): "Vending transaction consumes the selected currency",
    (38, 8): "Camera exposes purchased photo paper; native transformation output",
    (47, 43): "Consumes the selected local supply; negative grant",
}
TROOPS = {
    18: "Shadow consumes an offering; negative grant",
    49: "Pizza order supplies paid food; repeatable local purchase",
    57: "Hobbs consumes donated food; negative grant",
    61: "Consumes selected treatment supplies; negative grants",
    116: "Consumes the chosen local offering; negative grant",
    122: "Beryl returns the player's previous offering",
    123: "Estelle returns the player's previous offering",
    124: "Jasper returns the player's previous offering",
    294: "Sells the held Defused Mines to Minesweeper for local money",
    336: "Returns two copies of the player's chosen armor through the native painting service",
}
PLUGIN_LINES = {
    1961: "Selected item consumption",
    4773: "Random special-marble roll",
    4810: "Random special-marble roll",
    4815: "Steel-marble ammunition payout",
    5734: "Gasoline consumed by weapon use",
    5739: "Gasoline consumed by weapon use",
    5749: "Herbicide consumed by weapon use",
    5770: "Commented-out weapon repair grant",
    5773: "Battery consumed by weapon repair",
    5779: "Marble ammunition consumed",
    5824: "Returns ammunition already loaded in the weapon",
    5835: "Loads existing ammunition into the weapon",
    6069: "Weapon repair/conversion preserves the native transformation",
    6273: "Broken equipment produces local crafting junk",
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    args = parser.parse_args()
    game = args.game_dir.resolve(strict=True)
    audit = PROJECT / "build" / "game_audit"
    events = read_json(audit / "script_gain_item_calls.json")
    plugins = read_json(audit / "plugin_gain_item_calls.json")
    rows = []
    for row in events:
        data = read_json(game / "data" / row["file"])
        if row["source_type"] == "common_event":
            commands = data[row["event_id"]]["list"]
            reason = COMMON.get(row["event_id"])
        elif row["source_type"] == "troop_event":
            commands = data[row["troop_id"]]["pages"][row["page"]]["list"]
            reason = TROOPS.get(row["troop_id"])
        else:
            commands = data["events"][row["event_id"]]["pages"][row["page"]]["list"]
            reason = MAPS.get((row["map_id"], row["event_id"]))
        assert commands[row["command_index"]]["parameters"][0] == row["script"], "Stale script audit"
        rows.append({**row, "review_status": "keep_vanilla" if reason else "unreviewed", "reason": reason})
    for row in plugins:
        text = (game / row["file"]).read_text(encoding="utf-8-sig").splitlines()[row["line"] - 1].strip()
        assert text == row["script"], "Stale plugin audit"
        reason = PLUGIN_LINES.get(row["line"]) if row["file"] == "js/plugins/bunchastuff.js" else None
        rows.append({**row, "review_status": "keep_vanilla" if reason else "unreviewed", "reason": reason})
    report = {"scope": "Direct gainItem script call sites; does not replace the full event-command acquisition audit",
              "event_calls": len(events), "plugin_calls": len(plugins),
              "unreviewed": sum(row["review_status"] == "unreviewed" for row in rows), "calls": rows}
    (audit / "script_reward_review.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k != "calls"}))


if __name__ == "__main__":
    main()
