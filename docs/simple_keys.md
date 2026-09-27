# Simple Keys

Registry version 61 contains **ten checks and ten Simple Keys (3) bundles**
(native item320, AP item540000320). The pool contains **265 checks / 265 AP item
copies**. Each bundle delivers three native keys, for **30 guaranteed keys**.
The user requested enough AP keys without relying on purchases or random loot.
Keys still break when opening a lock; shop and random grants still give one.

## Guaranteed supply and spending

There are 26 ordinary locks: twelve safes, two ordinary room doors, and twelve
doors in Kaeley's maze. The count includes safes with only vanilla rewards and
every maze door, so spending keys on those cannot exhaust the guaranteed supply.
An old additional key-door page on Map048 event14 is permanently shadowed by
its unconditional exit page. The static validator checks this distinction and
the complete lock set against the installed data. Maze doors stay open;
Common Event262 handles Kaeley's lockpick warnings and does not reset them.

The independent access graph conservatively requires **nine bundles (27 keys)**
for any ordinary locked check or room. This covers all 26 locks in any order.
It uses AP's received-item history rather than pretending one consumed key can
open every door. Players can use arriving keys immediately; these requirements
govern placement logic. These rules are integrated into the APWorld.

A bundle waits in the delivery queue until all three keys fit. Pending bundles
survive save/load, and indexed replay cannot duplicate delivered or spent keys.

## Approved sources

All eight pickups are on page0, grant one key, and set self-switch A to select
a blank consumed page. Choosing Leave keeps the pickup available.

| Location | Map / event | Grant command |
| --- | --- | --- |
| Apartment 36 Bedroom | 025 / 002 | 5 |
| Corner Store | 054 / 039 | 5 |
| Ground Floor Janitor Closet | 061 / 003 | 6 |
| Floor 3 Janitor Closet | 089 / 002 | 4 |
| Eye Apartment | 099 / 017 | 4 |
| Garage Side Room | 272 / 004 | 5 |
| Rat Lair North | 291 / 019 | 5 |
| Basement Storage | 303 / 023 | 5 |
| Kaeley | 355 / 043, pages0–2 | battle1, enemy130 drop0 |
| Nestor Resolution | 094 / 011, page1 | battle7, enemy153 drop1 |

The user's approval explicitly includes the two named character drops. This is
a narrow exception to the earlier exclusion of standalone friendly-character
kill checks. It does not add other rewards from those characters or from other
friendly encounters. Nestor's body (enemy153) is distinct from his alternate
merchant encounter in Eugene's shop (enemy15).

## Nestor's later forms

The early body drops the key; the rooted body and enormous mound do not.
All three body victories complete **one Nestor Resolution check**, so waiting
for a later form cannot remove the check. Later forms retain their native loot.

- Early body: Map094 event11 page1, victory switch421 at command9.
- Rooted body: same event page3, victory switch448 at command10.
- Mound: Common Event183, victory switch448 at command10, called by Map094
  events40/41/42. The hook requires the actual common-event command list.

The introduction in troop551 aborts without a victory and is not a key check.
Escaping, losing, or leaving an encounter does not collect its drop check.
Repeated victories and save/load replay cannot add another check or item copy.

## Vanilla key sources

Kaeley's purchases (troop78 page0 commands137/147/155) still grant real keys,
including repeated purchases during the same encounter. Random loot through
Common Event107 command280 also still grants a key. Neither creates a check.
The two CHEATMODE key bundles remain outside the registry.

`tools/simple_key_scope.py` validates the exact ten-source allowlist and Nestor
resolution evidence against the read-only installation. The existing plugin
intercepts individual grant commands and matching victory drops; it does not
intercept all gains of item320.

## Verification

- Static registry validation and embedded-plugin synchronization pass.
- 40 Node tests and 21 Python tests pass at this checkpoint.
- 86 focused native NW.js scenarios pass: Take/Leave, active/inactive sessions,
  all four drop source pages, victory/escape/loss, unrelated loot, repeated
  purchases, random loot, all late body interactions, native lock consumption,
  30-key delivery, all 26 native locks opened with four keys remaining, full
  inventory queuing, and serialized save/load with indexed replay.
- Archipelago 0.6.7 seed153 generated 265 locations and exactly ten bundles.
  All nine excluded locations received filler.
  Archive: `.local/ap-output/AP_09048333410636748810.zip`.
  The live server test delivered all 30 native Simple Keys.

See `finite_key_budgets.md` for valves, Iris Keys, and colored-key supplies.

Generation still uses the development protocol layout. This verifies the pool
and interception, not the unfinished region logic or a full gameplay run.
