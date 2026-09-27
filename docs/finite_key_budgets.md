# Guaranteed key supplies

Registry version61 guarantees enough native keys for every reviewed finite
key spend. Purchases and random drops remain vanilla and are not needed for
these budgets. AP item counts and native quantities differ for the two bundles.

| Key | AP copies | Native quantity | Reviewed spends |
| --- | ---: | ---: | ---: |
| Simple Keys (3) | 10 | 30 | 26 |
| Twilight Valve | 1 | 1 | 1 |
| Midnight Valve | 1 | 1 | 1 |
| Abyssal Valve | 1 | 1 | 1 |
| Hadal Valve | 1 | 1 | 1 |
| Iris Key | 7 | 7 | 6 |
| green key | 1 | 1 | 1 |
| red key | 1 | 1 | 1 |
| yellow key | 3 | 3 | 3 |
| blue key | 1 | 1 | 1 |
| white key | 1 | 1 | 1 |
| Black Keys (2) | 1 | 2 | 2 |

The Iris budget includes the optional Eye Apartment spend, in addition to its
five passage unlocks. Black keys are consumed independently by Map440 event7
and Map445 event2; opening one does not unlock the other. The single AP item
therefore delivers two keys. No existing item copies were displaced to supply
the extra ordinary or black keys.

## Unused underwater rooms

Two older sea-map clusters have outgoing exits but no incoming route from the
playable game: Maps145/146/148/150/151 and Maps154/156/157/160/161. The direct
transfer scan includes debug and shadowed pages. Database script calls to
`smoothTeleportBetweenMaps` and `reserveTransfer` do not enter either cluster.
The separate procedural basement warp only uses Maps313-320.

Map151 event6 and Map161 event1 were removed from AP along with their Midnight
and Abyssal Valve copies. Their obsolete locks on Maps148/154 do not belong to
the playable budget. The remaining four valve pickups match four usable locks.
The registry now contains 265 checks and AP item copies, with retained IDs
unchanged. `unused_map_scope.py` guards against a new entrance to these maps;
`key_budget_scope.py` validates both live and unused spending commands.

## Logic and verification

The independent access graph requires nine Simple Key bundles for ordinary
locks, covering all 26 possible spends in any order. Each playable sea valve
has one lock. Rebreather increases oxygen time and is not an access requirement.
Remaining Iris and colored-key region rules still need review before the graph
can be connected to the generator.

- 86 native Simple Key scenarios include opening all 26 locks using AP keys.
- The finite-key probe opens the other 19 spending events in three orders
  (57 uses), saving and reloading after each. It verifies persistent unlocks,
  no repeat charges, and no refill from replaying received items.
- Live Archipelago0.6.7 seed153 delivered all 265 AP items, including 30 native
  Simple Keys and two black keys, and accepted all checks and the Day7 goal.
  Archive: `.local/ap-output/AP_09048333410636748810.zip`.

These tests verify supply and delivery. Full access logic and an interactive
randomized playthrough remain release gates.
