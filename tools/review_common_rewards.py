"""Inventory common-event grants, separating native returns from pending gifts.

Companion rewards and Morton donations stay vanilla by explicit user decision.
A scripted inventory grant is not by itself an independent fixed acquisition.
"""

import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
VANILLA_EVENTS = {
    5: "Native Radio/Marc-Andre recharge forms",
    6: "Native new-day consumables, ammunition, cooldowns and Mossy Hammer repair",
    9: "Rotting leftovers and the owned toxic hat transformation",
    61: "Food preparation and leftovers",
    62: "Returns the empty container after consuming a lunch",
    91: "Random gift contents or ammunition containers",
    104: "Container supplies (Junk/metro ticket), not a persistent fixed object",
    107: "Random container loot, including random Simple Keys",
    108: "Transforms an already-owned Cowboy Hat when equipped",
    110: "User decision: all Morton Junk-donation rewards, including fixed milestones, stay vanilla",
    162: "User decision: Hellen's companion Cleaver reward stays vanilla",
    164: "Fred Ring follows the Wriggly Fred route requiring the other Freds' deaths; no standalone friendly-kill reward",
    175: "Radio use transforms the received charged item into its low-power form",
    177: "Battle Brew produces local consumables",
    181: "Returns inserted vending currency",
    185: "Clears Morton's temporary fidget and restores his default lower arms",
    186: "Morton's random fidget roll; CE186 command6 selects a random value",
    193: "Transforms the received Medic into its tired form",
    196: "Transforms owned illusory items and equipment using their existing counts",
    204: "Native save correction returns previously offered objects",
    214: "Local Junk trading/returns",
    216: "Audrey's local drinks",
    217: "Energy drinks remain consumables",
    219: "Candy supplies",
    259: "Owned ethereal/spine dagger transformation entering flesh",
    260: "Owned spine/ethereal dagger transformation leaving flesh",
    278: "Marc-Andre talking/exhaustion form",
    279: "Marc-Andre summon/exhaustion form",
    280: "One-use all-seeing orb wish output; CE280 command75 consumes the orb",
    298: "Consumable combat rewards",
}


def classification(cid, index, code):
    if cid in VANILLA_EVENTS:
        return "keep_vanilla", VANILLA_EVENTS[cid]
    if cid == 60:
        return ("active", "Garage car-trunk Shotgun check") if index == 31 else (
            "keep_vanilla", "The trunk's 12 ammunition rounds stay local")
    if cid == 96:
        return ("keep_vanilla", "User decision: Hellen's companion Paper Mask gift and automatic equip stay vanilla") if index == 554 else (
            "keep_vanilla", "Joel's existing Fuzzy transforms into Fluff Ball/Fuzzy's Remains")
    if cid == 161:
        if index == 243:
            return "keep_vanilla", "User decision: Ernest's companion Metal Bat gift stays vanilla"
        if index in (436, 499):
            return "keep_vanilla", "Fuzzy repair chain temporarily equips Empty Handed, then returns Renegade Fuzzy"
        return "keep_vanilla", "Conversation snacks remain consumables"
    if cid == 269:
        if code != 126:
            return "keep_vanilla", "User decision: Juicebox battle-assistance gifts stay vanilla, including shuffled activities and shopping"
        return "keep_vanilla", "Juicebox assistance consumables, ammunition and food"
    return "unreviewed", "Unclassified common event"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--game-dir", type=Path, required=True)
    data = parser.parse_args().game_dir.resolve(strict=True) / "data"
    registry = json.loads((PROJECT / "apworld/lookoutside/vertical_slice.json").read_text(encoding="utf-8"))
    system = json.loads((data / "System.json").read_text(encoding="utf-8"))
    if system["versionId"] != registry["audited_version_id"]:
        raise ValueError("Game build changed")
    raw = (data / "CommonEvents.json").read_bytes()
    events = json.loads(raw)
    databases = {126: json.loads((data / "Items.json").read_text(encoding="utf-8")),
                 127: json.loads((data / "Weapons.json").read_text(encoding="utf-8")),
                 128: json.loads((data / "Armors.json").read_text(encoding="utf-8"))}
    rows = []
    for event in events:
        if not event:
            continue
        for index, command in enumerate(event["list"]):
            code, params = command["code"], command["parameters"]
            if code not in databases or params[1] != 0:
                continue
            status, reason = classification(event["id"], index, code)
            if status == "active" and not any(row.get("common_event_id") == event["id"] and
                                              row["command_index"] == index for row in registry["locations"]):
                raise ValueError("Reported active common reward is missing from registry")
            rows.append({"common_event_id": event["id"], "event_name": event["name"],
                         "command_index": index, "command_code": code, "parameters": params,
                         "item_name": databases[code][params[0]]["name"],
                         "review_status": status, "reason": reason})
    report = {"scope": "All direct positive common-event item/weapon/armor commands; map/troop rewards and scripts are separate",
              "registry_version": registry["registry_version"],
              "common_events_sha256": hashlib.sha256(raw).hexdigest(),
              "grants": len(rows), "common_events": len({row["common_event_id"] for row in rows}),
              "counts": dict(Counter(row["review_status"] for row in rows)), "rows": rows}
    target = PROJECT / "build/game_audit/common_reward_review.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: value for key, value in report.items() if key != "rows"}))


if __name__ == "__main__":
    main()
