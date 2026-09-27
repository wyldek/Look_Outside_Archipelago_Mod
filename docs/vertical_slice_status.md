# Development vertical slice

## Audited game build

The source signatures below are valid for `System.versionId` `74642914` and
`System.advanced.gameId` `51778622`. The plugin declines development activation
on a different build. The full data fingerprint is recorded in
`docs/audit_status.md`.

## Checked locations

The first ten locations below established the vertical slice. The registry now
contains 167 equipment checks, 103 item checks, and three access unlocks: 273 total.
All pass static validation and the unit tests. Live seed167 covered every check,
all item deliveries, and 35 resolution families. Simple and finite-key supplies
also have focused native probes. See `simple_keys.md` and `finite_key_budgets.md`.
Their exact map, event, command, item, and message signatures are in
`apworld/lookoutside/vertical_slice.json`. The additional sources passed
static validation and the Node interception tests. The staged NW.js probe
also checked the basement apartment pickup whose event page changes before its
reward command, plus a silent Pool Cue pickup. A full interactive playthrough
remains outstanding.

| Source | Event command | Vanilla reward | Completion |
| --- | --- | --- | --- |
| Map 023, event 041, page 0 | command 7, code 127 | Baseball Bat, weapon 15 | self-switch A |
| Map 024, event 007, page 0 | command 6, code 126 | Padlock Key, item 301 | self-switch A |
| Map 031, event 030, page 0 | command 4, code 128 | Hoodie, armor 7 | self-switch A |
| Map 031, event 009, page 0 | command 4, code 127 | Frying Pan, weapon 17 | self-switch A |
| Map 032, event 009, page 0 | command 4, code 127 | Mop, weapon 25 | self-switch A |
| Map 033, event 007, page 0 | command 4, code 128 | Baseball Cap, armor 48 | self-switch A |
| Map 034, event 025, page 0 | command 4, code 128 | Tank Top, armor 6 | self-switch A |
| Map 035, event 011, page 0 | command 6, code 127 | Carving Fork, weapon 42 | self-switch A |
| Maps 130/184/204/205/206 | one shared Basement Key check, code 126 | Basement Key, item 303 | AP checked flag across variants |
| Map 074, event 003, page 0 | command 3, code 121 | Elevator unlock switch 115 | AP boss-defeated save flag |

Only the exact event page, command index, command parameters, and audited game
build are intercepted. When the development session is inactive, the original
commands execute. When active, the reward command becomes a check and the event
continues to its vanilla consumed state. Pickup messages are replaced at Show
Text (`command101`) time, and silent sources receive an AP notice, so the UI
does not claim that the original item was granted. Provisional IDs for these
273 locations live in
`apworld/lookoutside/vertical_slice.json`; `tools/sync_plugin_registry.py`
embeds them into the game plugin. They are reserved for the development slice.
Ordinary equipment is classified as AP filler or useful according to its
gameplay value. Padlock Key, Basement Key, and Elevator Access are progression.

For the Elevator Freak, the victory command becomes a check and records a
separate boss-defeated flag. The event's post-victory page reads that flag in AP
mode. Receiving Elevator Access turns on the vanilla elevator switch, which the
door and control-panel events already use. This lets the item arrive before or
after the fight without removing the boss or repeating a defeated fight.
The Padlock Key is marked consumable in the database, but it is a key item
used by the locked-door events on Map 006. Its Map 024 pickup is the only
direct gain command found in the audited build; the two door events remove it.
Map 023's doorway to Map 024 accepts either an equipped Baseball Bat or the
self-switch set when the Bat pickup is taken. The AP check retains that
self-switch, so the doorway does not require the randomized Bat item to arrive.
Using the Padlock Key on either Map 006 stairwell padlock consumes it and sets
shared switch 101; the two stairwell doors then use that unlocked state.
The Basement Key is also marked consumable in the database but unlocks the
Map 030 basement door through switch 102. Its five Landlord hub pickups are
alternate versions of one source: vanilla hides each pickup when item 303 is
held. In AP mode, their blank consumed pages instead require the shared AP
check. Receiving the key early leaves the check visible, and checking any
version hides the others. The staged NW.js probe verified this with a key
already in inventory and confirmed the AP pickup message still appears after
the event page refreshes.

The complex equipment registry now includes fifteen branching equipment sources,
nine safe rewards, and eight rewards in reconciled quest families. Both free and
paid stock at Mutt's cafe remain vanilla: the free pages use the same daily
shop-stock schedule. Both Pistol pages share one check. The Rat Claws offering uses
self-switch D within its own page; the Long Hall Cowboy Hat uses self-switch C.
Eight locked safes preserve the vanilla `simpleLocks` common event and cash
amounts. Their difficulty-dependent messages replace equipment claims with AP
check notices while retaining the amount of cash received. The Shipping and
Receiving safe sends two checks, one per equipment item. A staged-engine probe
confirmed both checks and the cash reward still work after the common event
has changed the safe to its consumed page.

Roach Leadership has two checks for its crown and sash. Each of the three valid
terminal choices completes both checks; refusing to choose completes neither.
Leigh's Call completes the ring check whether Leigh keeps or throws away the
ring. Only the listed family checks are reconciled, and the original variable
writes, character changes, dialogue, and skill changes still run. Reconciliation
uses saved check state to prevent duplicate reports and leaves unrelated
exploration checks alone. The real-engine probe exercised all three Roach
Leadership outcomes and their transition to the consumed event page.
Wilhelmina's five mutually exclusive equipment rewards form a third family.
Her post-battle switch 1135 still changes the event to its defeated page; that
exact command also completes the five AP checks. Merely visiting the room or
refusing to open the sarcophagus does not complete them. The five reward choices
passed the unit tests, and the staged engine confirmed the switch and consumed
page while suppressing the chosen vanilla equipment grant.

Nine boss salvage rewards complete on victory even without Audrey. The exact
End Branch command after her party condition reconciles each check, while
escape and loss skip it. Six Fungus Fibers source pages share one check; the
two Jousting Lance and Rhinoceros Hide pages likewise share their checks.
Vanilla defeated states still run. A real-interpreter probe covered 96 source,
party, battle-result, and activation combinations; it simulated the battle
result and exercised native branching without playing the fights.

Five further checks cover Four of Spades, Rusty Crown, Straitjacket, Stained
Shears, and Ambrose's Pipe. Both Rat King crown outcomes complete his check.
Taking either the normal Straitjacket or its Lumpy-mode Cheese Man replacement
completes one check; the Cheese Man remains a vanilla consumable. The card's
same-page quest variable still prevents a repeat reward. The real interpreter
verified these branches, the shears' consumed quest state, the paid snack, and
all sixteen consumables bundled with Ambrose's pipe.

Eighteen guaranteed hostile-boss equipment drops use exact encounter and enemy
signatures. The native loot roll runs first; only the audited guaranteed drop
is removed, and its check is recorded during victory rewards. Escape, defeat,
unrelated encounters, chance loot, and optional friendly-character kills stay
vanilla. The staged engine passed 185 drop scenarios, including both item checks
from Electropede and the Spore Guardian's unchanged chance armor drop.

Thirty-three additional fixed item checks include the remaining five planet discs,
two apartment keys, six Kingdoms of the Dump figures, NeoDuo, Stationery, Fountain
Pen, four Henderson-family quest objects, the Janitor Key Ring, Shrunken Head,
nine game cartridges, Guinea Pig, and Rose. Uranus shares one check across its
normal/hard-mode source signatures; only Normal sessions are supported.
Story variables remain local to the original pickup.
Sixty-eight native interpreter scenarios verified state writes, consumed pages,
message substitutions, and unchanged source lists in active and inactive modes.

Joel Resolution now completes Door Knob and Toothy Whip together through any
audited terminal outcome: peaceful gift, native Attack fall-through, recruitment,
the four bathroom victory pages, or transformed victory. The native choices
and story states remain intact. Escapes, defeats, and the fatal hug do not
complete the group. Fifty-one native scenarios cover dialogue, recruitment,
battle results, source guards, saved completion, and later alternate outcomes.
See [quest resolution policy](quest_resolution_policy.md).

Five further NPC gifts cover Pierre's Clown Drawing, Frederic's Painter's Key
and Canvas Carry Bag, Jasper's apartment key, and Mutt's free Normal-mode Vending
Machine Key. Ten native scenarios verify consumed quest guards and conditional
dialogue choices. Mutt's Hard-mode purchase stays vanilla. The Canvas Carry Bag's
switch 188 is withheld at the gift source and granted when the AP item arrives;
story switch 233 remains local. Receiving the bag early preserves access.

Jasper's ritual preparation reconciles his Apartment Key, Roof Access Key, and
Dark Robes checks. Defeating him resolves the same group. Four native scenarios
cover accepting/postponing and active/inactive sessions, with further combat
coverage in the character probe. Switch 206 still consumes the map encounter.
Three Hard-only equipment pickups were removed from the registry.

The masked shadow's Tongue check reconciles on acceptance or refusal. Benjamin's
game and pendant checks reconcile after playtime at any reward-score threshold;
native candy and relationship effects remain intact. Twelve native scenarios
cover both families.
The expanded character audit covers their later outcomes and the Shadow's
relationship-dependent gifts, plus Frederic, Pierre, Mutt, Tickle, Clint, and
Madison. It adds 223 native scenarios; see `character_resolution_audit.md`.

Four further checks cover Jeanne's Laundry, Rafta's Love Letter, the Typewrither's
Loose Manuscript, and the Small Red Key from Oracle's End. The Oracle is a hostile
encounter even if the player chooses the hug dialogue; it is not an optional
attack on a peaceful NPC. Forty-four native scenarios cover readiness, companion
dialogue, accepting/refusing, partial material hand-ins, both Typewrither pages,
victory/escape, and unchanged source data.

## Save and protocol behavior

The latest acquisition batch adds Pierre's mail visit, Tickle's drawing, the
green portrait's shared Stained Key, and three fixed hostile weapon drops.
Pierre's unique visit can expire; AP excludes it from progression and useful
placement. Accepting, refusing, or leaving the visit completes the same check.
The Stained Key has 30 hostile map-page alternatives plus
the hat agreement, while kills after befriending the portrait stay vanilla.
Native probes cover 20 unchanged quest transformations, 22 late gifts, six
visitor-dispatch cases, 490 portrait/friendly-kill cases, and 36 advanced-drop
cases. The entire Gauntlet stays vanilla by user choice.

Solving all nine astrolabe sockets now checks Planetarium - Astrolabe Solved.
The hook requires the original common-event 64 list, command 216, and all nine
correct socket variables. Its door switch 699 is granted only on AP delivery.
The puzzle can still be adjusted and its discs recovered. Early delivery does
not complete the check; repeated solutions neither duplicate it nor remove
received access. Twelve native scenarios verify the actual puzzle and door.
The static validator also checks the socket callers and powered puzzle path.

- Passive installation leaves vanilla save contents unchanged. Activating an
  AP development session writes a separate `lookOutsideArchipelago` save field.
- The field records check keys, seed name, team, slot, next received-item index,
  and items waiting for delivery. Unsupported future save fields are preserved
  and activation is blocked.
- The first successful `Connected` packet binds the save to the seed and slot.
  The development APWorld must provide matching `slot_data` build identifiers.
  A later seed or slot mismatch stops the connection before checks or items are
  processed. An unbound development save with checks cannot silently join a
  seed.
- Reconnection resends saved checks. Server `checked_locations` are merged into
  local check state. `ReceivedItems` replay uses its index to avoid duplicate
  grants; a gap requests `Sync`. Ordinary socket drops retry with bounded
  backoff; a new game or save load cancels the old retry.
- Recognized items, equipment, and progression switches are granted from a
  queue during map updates. A full
  inventory, unknown ID, or failed grant leaves the item pending in the save.
- Victory is recorded when a bound AP save enters Credits (Map 168) on any day
  with `CHEATMODE` off. The client sends `StatusUpdate` goal status 30
  when connected, or on the next successful reconnect if the ending happened
  offline. All real ending routes qualify, including early endings. When the
  server still has unchecked locations, the client follows the goal with
  `!release` and merges the server's acknowledgement. Disabled release is shown
  in Status. See `ending_release.md` for online and offline tests from zero checks.
- A bound AP save suppresses the two Day increment commands in `TimePasses`,
  then holds its `newDay` call at the normal 4 a.m. boundary. While held,
  further `TimePasses` common-event calls are suppressed and pending action/battle
  minutes are cleared. Long actions are capped at 4 a.m. before native processing
  so later hourly timers cannot run past the hold. The development API
  `advanceDayForDevelopment()` increments Day once and queues the vanilla
  `newDay` common event. Day hold and pending rollover persist in saves.
  The menu shows "Go to Next Day" during a hold. This path still needs an
  interactive staged-game check before it is considered stable. On Day 15 the
  hold remains in place and the menu omits the advance action, so the player
  can pursue a normal ending without entering unsupported Day 16 content.
  Quest dates, new-day waits, and dialogue cutoffs remain vanilla. There are no
  extra Day15 new-day cycles or synthetic quest advancement. The generic Day15
  ending completes the AP goal and releases unfinished checks if the room allows
  release, including when other quest endings are unavailable.
  The Day 15 front door now offers "Keep exploring" alongside the native ending
  and cancel branches. It executes the original building exit or waiting-visitor
  event; the original lists are never rewritten. Native tests cover ten door
  outcomes, three source guards, and four clock-loop scenarios, including the
  minute-carry rollover, save/load, and no elapsed-time spill after advancing.
- WebSocket transport is exercised with both a fake server in Node and a live
  Archipelago 0.6.7 server staged inside the project. The live test generated
  a 264-item seed (seed154), connected the plugin in a Node RPG Maker harness, checked
  all 264 locations, delivered all 264 items, and the server confirmed goal
  completion on Day 7. The copied game also booted under NW.js `0.94.0` with
  `WebSocket`, `Scene_Map`, `Scene_Menu`, and browser prompts available.
- A DevTools probe against that staged NW.js process exercised the real
  `Game_Interpreter` and map data. The Baseball Bat, Padlock Key, and newly
  added Carving Fork reward commands became checks without adding vanilla
  items, their Show Text lines
  displayed AP text, and the Day variable stayed at 7 when the real
  `TimePasses` rollover and `newDay` call were intercepted. A follow-up staged
  probe held Day 15 and rejected an attempt to advance to Day 16. This was a runtime
  event probe, not a full playthrough.
- Further staged probes exercised Mutt's free and paid Stun Baton pages,
  the alternate Pistol page, vanilla bullets from the Old Rifle safe, and
  both equipment checks plus vanilla cash from the Shipping and Receiving safe.
  The Node suite has 38 passing tests; the audit extractor has two passing tests.
- In development mode, the game menu offers Archipelago Connect and Status.
  Both open a single dialog with server/slot fields, a masked password,
  connection state, errors, check totals, and recent deliveries. Only server,
  slot, and client UUID are kept in local storage. A bound AP save also shows
  these commands after loading. Disconnect preserves offline checks. Delivery
  notices and day confirmation have eleven passing native scenarios. See
  `connection_ui.md`.

The packet behavior follows the [Archipelago network protocol](https://github.com/ArchipelagoMW/Archipelago/blob/main/docs/network%20protocol.md).

## Power restoration

The main fuse box supplies the third permanent-state check and item. Vanilla
starting power and the original outage run normally. An early **Power Restored**
item waits for the native loss and blackout sound, then immediately restores
electricity with a message confirming both events. Receiving the item does not
consume the fuse-box check. A late item restores power on delivery.

Twelve native scenarios cover delivery order, serialized saves, replay, dialogue
queuing, and source guards. Save schema 6 also preserves schema 5 calendar holds.
See [power progression](power_progression.md) for hook signatures and verification.

## Current development package and remaining release work

Registry 73 has a complete integrated access graph (273 checks, 74 regions,
81 entrances). New native probes verify Rat Freak/Sybil/Hellen/Dan alternatives,
the metro and later quest routes, fixed collectibles, reusable gifts and the car trunk. All 35
Python and 41 Node tests pass. Independent sphere tests reach every location in
single-player seed167 and two-player seed168 without ending release.

`tools/build_package.py` produces a development bundle with no game assets.
Its preparation script writes replacement files beside the extracted package;
the installed game is read-only. See `package_setup.md`.

The direct map/troop/common-event/script acquisition reports have no unreviewed
rows. General expiry warnings and audited ending-choice labels are implemented.
A complete interactive seed playthrough, including calendar ordering, remains.
New AP sessions remain gated by `LOA_DEV_MODE=1`.
