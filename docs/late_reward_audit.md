# Final reward scope audit

Registry 73 has 273 checks/items. These changes follow the user's scope decisions;
the initial workplan is design intent rather than a command-level specification.

## Retained vanilla

- Morton donations, Ernest's bat, Hellen's mask/cleaver, Juicebox assistance
  gifts, Marc-Andre's recruitment item and its cooldown forms.
- Household valuables, including Spirit Board and all four taxidermy pickups
  previously in AP. Their original grants, messages and consumed flags run normally.
- Purchases, random loot, consumables, crafting, unique-input transformations,
  and the entire Gauntlet. Fred survivor gifts that require other friendly Freds'
  deaths remain outside AP; the approved Medic-in-a-jar is the existing exception.
- The six named Kingdoms of the Dump figures still feed a dedicated collection
  story (CE297). They and playable videogames remain in the pool.

## Added acquisitions and choice handling

| Reward | Native source | AP handling |
| --- | --- | --- |
| Metal Detector | Troop294 page0 command12; variable354 = 0 | First gift only. Both $80 replacement purchases stay vanilla. |
| Whisperblade | Troop207 page12 command14 | Nonlethal Comatus duel. Declining postpones the duel; victory prevents repeat gifts. |
| Jean-Pierre's Greatsword | Troop347 page1 command25 | Rescue checks even without Papineau. |
| Sylvain's Elegant Cap | Troop348 page1 command26 | Rescue checks even without Papineau. |
| Claire's Breastplate | Troop349 page1 command21 | Rescue checks on the original completion flag. |
| Darryl's Legs | Troop615 page7 command10 | Victory resolves the check even when the fight ends before the native gift branch. Escaping does not. |
| Spider Husk's Beating Heart | Troop655 page0 command52 | Final cafe gift or the audited hostile victory resolves one check. Native elapsed-hour waiting remains. |
| Screamatorium | Map003 events88/89, command24 | One shared fourth-inspection reward using variable496 across both bookshelves. |

The fungus rescue family has individual rescue terminals that check only the
rescued person's reward. Closing the illusion through Mother or Ernest resolves
all three remaining checks. Native CE196 equipment transformations remain in place,
including equipped items and items received after the illusion ends.

The Spider Husk is the walking NPC reached through Jasper's Apartment12 bathroom;
it is separate from Sybil's body route and is not a recruited companion.

Access rules use the original routes and assume local supplies. No combat strength,
level, party member or equipment threshold is imposed on these checks.

## Inventory reconciliation

`review_remaining_rewards.py` inventories all 1,842 direct positive map/troop
grants: 291 active source entries and 1,551 kept vanilla, with no unreviewed rows.
`review_common_rewards.py` covers 444 grants across 34 common events: one active
and 443 vanilla. `review_script_rewards.py` covers 60 direct script call sites,
all vanilla. Guaranteed drops have a separate reviewed report. Reports retain
source hashes in `build/game_audit`; overlapping reports are not additive.

This is an acquisition inventory, not proof of a complete playable calendar route.

## Native verification

On the isolated game copy, 22 first-gift, 65 late-resolution and 16 bookshelf/
household scenarios passed. They cover native reward branches, choice alternatives,
early delivery, actual save serialization, transformations, repeat guards and
inactive behavior. Battles use synthetic outcomes and presentation waits are skipped.

```powershell
node tools/probe_staged_game.js <debug-port> first-gifts
node tools/probe_staged_game.js <debug-port> late-resolutions
node tools/probe_staged_game.js <debug-port> bookshelf
```
