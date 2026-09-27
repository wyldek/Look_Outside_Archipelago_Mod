# Power progression

## Approved behavior

Starting electricity and the normal outage progression remain vanilla. The
main fuse box sends an Archipelago check. Its original restoration becomes
the progression item **Power Restored**.

| Item arrival | Result |
| --- | --- |
| Before the outage | Remember receipt; preserve starting electricity and the pending outage. |
| At the outage, with the item received | Execute the native loss and blackout sound, then immediately restore power. |
| After the outage | Restore power when the item arrives. |
| Fuse box checked before item arrival | Send the check and leave the blackout active until delivery. |
| Fuse box visited after early restoration | Allow the check; receiving the item does not consume it. |

For immediate restoration, the player sees:

> The building's power cuts out.
> Your Power Restored item immediately brings it back.

The native restoration sound accompanies this notice. Notices wait for existing
dialogue and map events to finish. Item ownership, outage state, pending notices,
and check completion survive saves. Replayed AP deliveries do not repeat them.

## Audited hooks

For game ID `51778622`, version `74642914`:

- Map 005 event 2 command 145 supplies vanilla starting power (switch 21).
- Common Event 225 primes the normal outage. It remains unchanged.
- Common Event 16 command 26 turns off switch 21. The AP hook records the loss
  after that command executes. Command 34 finishes the native outage effects;
  only then does a previously received item restore power.
- Map 369 event 24 page 0 command 10 sends check `592000080`,
  **Electrical Room - Main Fuse Box**. Its power/hazard writes and restoration
  sound are withheld. The consumed page follows AP check completion.
- Item `540300987`, **Power Restored**, sets switches 987/21, clears hazard
  switches 984/986 and remaining flicker variable 737, refreshes the map, and
  queues the native disc-puzzle refresh (Common Event 64).
- After AP restoration, Map050 event11 (Electropede) and Map086 event104
  (Whip Scorpion) remain available even if early restoration skipped the
  dark-basement intro that normally initializes variable740. The original
  encounter pages bypass only that phase condition. Retreat and defeated
  pages retain priority, including the scorpion's similarly gated pages.
  The native story phase is not changed. This preserves both Electropede
  checks and the garage Iris Key revealed by defeating the scorpion.

Hooks require the original event lists, command signatures, active AP session,
and audited build. Unrelated commands and inactive sessions remain vanilla.
The source validator is `tools/power_scope.py`; no installed game files change.

## Verification

`tests/native_power_probe.js` passed 28 staged NW.js scenarios, including early,
late, and mid-outage delivery; save serialization before/after the outage and
after checking; repeat delivery; refusing the fuse box; existing dialogue;
and cloned-source/build/inactive guards. These simulate native event commands,
with unrelated autoruns, achievements, and presentation waits omitted.
The additional encounter cases cover early/late restoration at phase zero,
victory and retreat, the Iris Key pickup, consumed pages after save/load,
unchanged story state, and pre-outage/no-item/inactive/build/page-copy guards.

Historically, schema6 migrated schema5 calendar holds. Current schema7 requires
matching registry/build metadata and rejects older AP schemas; see
`save_compatibility.md`. The 28 native power scenarios also pass at registry74.
Live Archipelago 0.6.7 seed 143
exchanged all 259 checks and items and exercised early receipt followed by the
outage hooks. The server confirmed goal completion on Day 15. Full interactive playthrough
remains outstanding. Current generation evidence is in `current_status.md`.
