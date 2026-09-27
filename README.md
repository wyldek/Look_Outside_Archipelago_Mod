# Look Outside Archipelago Mod

Archipelago integration for Look Outside, currently in development.

## Status

The development registry contains **273 checks and real item copies**: 167
equipment, 103 keys or collectibles, and three permanent access unlocks. **Normal difficulty is
the first supported target.** Hard and Easy saves cannot activate this APWorld.
The goal is any real ending on any day; cheat-mode Credits do not count.
Generation uses access requirements only; combat preparation is up to the
player. All 273 location rules are integrated into the APWorld, across 74
regions and 81 entrances. See [access logic](docs/access_logic.md).

This is a **development playtest build**. The direct acquisition inventory is
reviewed. A complete interactive playthrough, including calendar ordering,
remains the release gate.
New AP sessions require `LOA_DEV_MODE=1`. See [package setup](docs/package_setup.md)
and the [playtest guide](docs/playtest.md).

Implemented behavior includes exact event interception, saved seed/slot binding,
reconnection, indexed item delivery, inventory overflow queues, intentional day
advancement, and quest reconciliation. Boss salvage checks work without Audrey.
Shop stock, household valuables, companion rewards, crafting materials, and consumables remain vanilla, with the approved
exception of eight fixed Simple Key pickups and two guaranteed key drops.
Ten three-key bundles guarantee 30 keys for the 26 ordinary locks. One two-key
black-key bundle covers both independent black-key doors. Two unreachable
valve rooms were removed. See [key budgets](docs/finite_key_budgets.md). Purchases
and random key loot remain vanilla. See [Simple Keys](docs/simple_keys.md). Quest resolutions
collect their branch rewards regardless of the chosen outcome; optional friendly
kills have no separate checks except the explicitly approved Simple Key drops.
Nestor's body forms share one key check. Item access is separated from source
completion: painting collection unlocks when the Canvas Carry Bag arrives
through AP.

Quest transformations keep their vanilla recipes and outputs. Their original
input items are randomized; Telescope repair and Void Disc conversion add no
extra AP checks. The entire Gauntlet stays vanilla, including its entrance key.
Eugene's locked rooms and Lyle's Dark Room also stay vanilla because their keys
require optional friendly kills; eight interior pickups were removed from AP.
Pierre's missable mail visit is restricted to filler placement.
Eight pickups in the original teeth apartment now have the same restriction
and a Day 4 deadline warning. See [calendar deadlines](docs/calendar_deadlines.md).
Its accept/refuse/leave choices now complete the same check. **Joel Resolution**
completes both Door Knob and Toothy Whip checks through peaceful or hostile
outcomes. See [quest resolution policy](docs/quest_resolution_policy.md).
Frederic, Jasper, Pierre, Benjamin, the Masked Shadow, Mutt, Tickle, Juicebox,
Rat Freak, Sybil, Hellen, and Dan now have
audited terminal reconciliation. Clint and Madison share rewards across their
different forms. See [character audit](docs/character_resolution_audit.md).
There are 32 resolution groups in total. High Five's Watch and two fixed
Plumbing Tools drops are also randomized; High Five's early consumed branch
resolves the same Watch check.

Scout's Radio and Bright Frederic's Medic-in-a-jar are useful AP items. Their
native eight-hour and real-new-day recharge cycles remain vanilla. Frederic's
completed-quest offer checks on acceptance or refusal; his defeat resolves the
same check. Delivery works before meeting either giver and preserves cooldowns.
The electronic-key car trunk adds its fixed Shotgun to AP; its 12 shells stay vanilla.

Power starts on and fails through the vanilla outage event. The fuse box sends
an AP check; receiving **Power Restored** restores electricity. An early item
waits for the outage, then immediately restores power with an explicit message
and the native loss/restoration sounds. The fuse-box check remains available.

Day 15's front door offers continued exploration or the original ending route.
Long actions stop at the native 4 a.m. day boundary, and held time cannot spill
into the next day. Quest dates, new-day waits, and dialogue cutoffs stay vanilla.
The generic Day 15 ending is available with unfinished quests; completing any
real ending requests release of all remaining AP checks. The room must allow
release (`auto`, `goal`, `enabled`, or `auto-enabled`). Offline completion is
saved and reported on reconnect. See [ending release](docs/ending_release.md).

The in-game connection dialog shows connection state, errors, check totals, and
recent item deliveries. Passwords are masked and not saved. Received items show
nonblocking notices; advancing the day asks for confirmation. See
[connection UI](docs/connection_ui.md).

See [development details](docs/vertical_slice_status.md),
[audit evidence](docs/audit_status.md), and
[remaining review queue](docs/acquisition_review_queue.md).
The initial workplan records design intentions, not implementation requirements.

## Development safety

The installed game is read-only. All generated data, copied runtimes, profiles,
and test outputs belong inside this project. `build/` and `.local/` are ignored;
game assets are not distributed in the repository.

```powershell
python -B tools/audit_game.py --game-dir 'C:/Games/Steam/steamapps/common/Look Outside'
python -B tools/validate_registry.py --game-dir 'C:/Games/Steam/steamapps/common/Look Outside'
python -B tools/sync_plugin_registry.py --check
python -B tools/stage_game.py --game-dir 'C:/Games/Steam/steamapps/common/Look Outside'
python -B tools/stage_archipelago.py --ap-dir 'C:/ProgramData/Archipelago'
```

Use `--refresh-plugin` or `--refresh-world` to update an existing staged runtime.
Always launch the copied game with
`--user-data-dir=<project>/.local/nw-profile` so its Chromium profile stays local.
Test-copy instrumentation suppresses Steam achievement/stat writes during probes;
it is not part of the distributable plugin.

## Verification

```powershell
node --test --test-isolation=none tests/plugin_interception.test.js
python -B -m unittest discover -s tests -p 'test_*.py'
```

Current checkpoint: registry 73, with 41 Node tests and 35 Python tests passing.
Native NW.js probes
pass 96 salvage, 185 drop, 68 fixed-item, 10 NPC-gift, four ritual, 12 peaceful
quest, 44 additional quest-item, and six Joel dialogue scenarios. They also cover
four alternate Joel reward sources, ten final-door outcomes, three door source
guards, four full clock-loop scenarios, 12 planetarium scenarios, and earlier safe and quest probes.
The latest batch adds 20 transformation, 22 late-gift, six visitor-dispatch,
490 portrait/friendly-kill, 36 advanced-drop, 28 power, and 51 Joel resolution scenarios.
These simulate events and battle outcomes.
The character audit adds 223 native scenarios, including intermediate rewards,
permanent endings, all Clint/Madison forms, and serialized save/load.
Twelve native menu/delivery/deadline scenarios and sixteen locked-room scenarios pass.
The Simple Key addition passes 86 native scenarios, including all 26 locks
opened using AP keys only. Three finite-key spending orders (57 uses), 24
Juicebox scenarios, six disc-allocation scenarios, and 25 flesh geometry/door
scenarios pass. Further native tests cover 13 Rat Freak, 16 Sybil, 15 access-route,
51 Hellen/Dan, and 253 fixed-collectible scenarios across 41 encounter sources.
The reusable gifts add 26 native outcome, cooldown, replay, and source-guard scenarios.
The car trunk adds 19 native gate, ammunition, replay, and source-guard scenarios.
The final reward audit adds 22 first-gift, 65 late-resolution and 16 bookshelf/
household scenarios. Another 38 native scenarios verify ending-choice warnings.
See [the reward audit](docs/late_reward_audit.md).

Archipelago 0.6.7 seed167 passed all 273 checks and deliveries and 35 quest
families. The server confirmed goal completion on Day 7. Independent sphere
verification reached all 273 checks in seed167 and all 546 checks in the
two-player seed168, without using ending release. Earlier integrated seeds
155–158 passed at the 264-check checkpoint. These are automated checks, not a
complete gameplay run.

Fresh sessions of the earlier seed154 verified Day 15 completion releasing all 264
checks from zero, both online and after an offline ending/save reload, with
automatic collect disabled. A disabled-release room correctly retained all
unchecked locations and showed the host restriction. The native calendar probe
also verifies vanilla quest cutoffs and the generic ending with unfinished quests.

## Build the development package

```powershell
python -B tools/build_package.py --game-dir 'C:/Games/Steam/steamapps/common/Look Outside'
```

The bundle is written under `build/packages`. It contains the APWorld, plugin,
sample YAML, preparation script, and setup/playtest docs. It includes no game
assets or test instrumentation. The preparation script reads a matching game
and writes replacement files inside the extracted package; installation is a
separate copy step into a test game.
