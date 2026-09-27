# Current development checkpoint

Registry **74**, game build **74642914**, Normal difficulty, **273 checks/items**.
The pool contains 167 equipment copies, 103 physical items and three access unlocks.
This document supersedes numerical checkpoints in older audit batch histories.

## Implemented and verified

- APWorld access graph: **273 rules, 74 regions, 81 entrances**, active in generation.
  Missing rules fail validation. Combat equipment is never a requirement.
- **35 quest-resolution groups**, including the fungus rescues, Darryl and the
  Spider Husk. Alternate outcomes preserve native consequences.
- **30 Simple Keys** and **two Black Keys** delivered through the reviewed bundles.
- Vanilla quest dates/new-day waits, a 4 a.m. hold, and the Day15 home-door fallback.
  Any real ending on any day completes the goal and requests remaining-check release.
- **36 Python tests and 44 Node tests pass**. Registry signatures and plugin sync pass.
- Save schema7 validates registry/build compatibility before native state loads.
  Older AP schemas are rejected. Compatible queues deliver offline; first binding
  requires reliable fresh-save metadata. See `save_compatibility.md`.
- **16 native disk-save scenarios pass**, including bed/Sybil resumes, overflow
  delivery without a socket, rejected loads and interpreter provenance guards.
- Added native probes: 13 Rat Freak, 16 Sybil, 15 access-route, 25 flesh-route,
  51 Hellen/Dan, and 253 fixed-collectible scenarios. Earlier native batches
  are retained in the audit history.
- **26 reusable-gift native scenarios pass**, including early delivery, both
  cooldowns, accept/refuse/victory/escape, serialized save/reload, and replay guards.
- **19 car-trunk native scenarios pass**: original proximity/map/consumed gates,
  12 vanilla shells, early Shotgun delivery, save/reload and source guards.
- **103 further reward scenarios pass**: 22 first gifts, 65 late resolutions,
  and 16 bookshelf/household cases. See `late_reward_audit.md`.
- **38 ending-warning scenarios pass**, preserving every native branch and
  guarding against copied lists, other events, unbound saves and changed builds.
  The 12 menu scenarios also verify the expanded day warning and visible actions.

## Actual Archipelago 0.6.7 seeds

| Seed | Players | Checks reached without release | Spheres | Evidence |
| --- | --- | --- | --- | --- |
| 169 | 1 | 273 / 273 | 13 | Live exchange delivered all 273 items, 35 families and Day7 goal confirmation. |
| 171 | 2 | 546 / 546 | 17 | 266 cross-player items; 18 excluded checks contain filler. Native delayed-Rose/offline-ending release passed. |

Archives are project-local:

- `.local/ap-output/AP_83375365070562934785.zip`
- `.local/ap-output/AP_88626157643827000401.zip`

Earlier integrated seeds155–158 passed at 264 checks and seeds159–161 at 267.
Seeds162–163 passed at 269 checks before adding the car-trunk Shotgun.
Seeds164–165 passed at 270 checks; seed166 at 272 preceded the final scope changes.
Registry73 seeds167–168 passed at 273 checks. Registry74 seed170 also reached
all 546 two-player checks in 12 spheres; seed171 supplied the cross-player Rose fixture.
Earlier seed154 tests
also verified online/offline Day15 release and a room with release disabled.

Sphere verification checks real generator placements against the access graph.
It does not simulate calendar scheduling or a complete walk through the game.
Native probes simulate combat outcomes and skip presentation waits.

## Acquisition report reconciliation

| Report | Active source entries | Kept vanilla | Unreviewed in this report |
| --- | --- | --- | --- |
| Simple equipment | 80 | 8 | 0 |
| Simple items | 41 | 56 | 0 |
| Guaranteed persistent drops | 30 | 102 | 0 |
| Direct scripted gainItem calls | 0 | 60 | 0 |
| All direct map/troop grants | 291 | 1551 | 0 |
| All direct common-event grants | 1 | 443 | 0 |

These reports overlap; their totals must not be added together. They count
source entries, not unique AP locations: alternatives can share one check.
The drop report filters
gameplay consumables even when the database marks them non-consumable. Eye bait
is consumed by the Butcher; random visitor encounters retain their native loot.
Unused enemy definitions and Gauntlet-only copies add no locations.

High Five's Watch and two Plumbing Tools drops add three real filler copies.
The High Five early victory that sets switch433 also resolves the Watch. Boiler
Beast's appearances across 29 event sources share one check.

The 60 script call sites cover 46 event calls and 14 plugin calls. They are
crafting, purchases, random/ammunition rewards, item returns, consumption, or
equipment transformations. Their original behavior is retained.

The user approved the Radio and Medic-in-a-Jar as AP items and checks. Both are
useful items, with charged/tired forms and native recharge events kept vanilla.
The Radio works before meeting Scout; meeting him cannot shorten an existing
eight-hour recharge. The Medic refreshes only through the native new-day event.
Accepting or declining Bright Frederic's completed-quest offer, or defeating
him, resolves one shared check. His check's access rule uses the peaceful route
through the Stained Key room, without a combat capability requirement.

The Electronic Key's common event contains a fixed Shotgun pickup in the garage
car trunk. That grant is now an AP check/item; its 12 shells, native distance
test, trunk animation and one-time consumed flag remain unchanged.

`tools/review_common_rewards.py` inventories all **444 direct positive grants
across 34 common events**. It records 443 vanilla grants and one active car-trunk
check, with no unresolved rows in this report. The user chose to keep all Morton
Junk-donation rewards and the companion-specific rewards vanilla, including
Ernest's bat, Hellen's mask/cleaver, Juicebox's assistance gifts and Marc-Andre.
The report is `build/game_audit/common_reward_review.json`; its source hash
identifies the exact common-event data reviewed. The companion map/troop report
now inventories all 1,842 direct grants with no unreviewed rows. Marc-Andre's original gift and common-event
recharge forms stay vanilla. Fred Ring remains a vanilla friendly-kill reward.

Household valuables remain vanilla. Spirit Board and four taxidermy pickups
were removed from AP to apply that decision consistently. The six named figures
used by the dedicated Kingdoms of the Dump collection event remain randomized,
as do playable videogames. The home's Screamatorium is one check shared across
both bookshelves. Morton donations and the selected companion rewards remain vanilla.

## Remaining release gates

Play a complete randomized Normal run, including a second-player item delay,
save/reconnect, alternate quest choices, and an ending. See `playtest.md`.
This must check calendar ordering and presentation in ordinary gameplay;
automated reachability does not establish that every timed check can be visited
in one run. Nine locations remain excluded from progression/useful placement.
Tracked deadline notices, general day warnings and audited ending-choice labels
are implemented; ending release remains the fallback for expired quests.

The development package is built with `tools/build_package.py`. Its contents and
preparation workflow are documented in `package_setup.md`. The installed game
and installed Archipelago runtime remain untouched.

Package preparation was verified against the read-only installation: all 27
original plugin entries were preserved, four invalid/repeated destinations were
rejected, and a corrupt package component was rejected before creating output.
The generated plugin matched the source mod byte for byte, with no test hooks.
