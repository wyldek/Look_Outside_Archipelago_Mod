# Look Outside Archipelago Mod

An Archipelago integration for **Look Outside**, supporting solo randomizer seeds
and multiworld games. Explore the building and resolve quests to send checks;
the items at those locations can belong to you or to another player.

**This is a development playtest build.** The access graph and targeted native
event tests are implemented, but a complete randomized Normal playthrough remains
a release requirement. New AP sessions require `LOA_DEV_MODE=1`.

## Contents

- [Supported version and scope](#supported-version-and-scope)
- [What becomes an AP check or item](#what-becomes-an-ap-check-or-item)
- [What stays vanilla](#what-stays-vanilla)
- [How progression logic works](#how-progression-logic-works)
- [Winning, missed checks, and release](#winning-missed-checks-and-release)
- [Setup guide](#setup-guide)
- [Saves, updating, and troubleshooting](#saves-updating-and-troubleshooting)
- [Verification and developer references](#verification-and-developer-references)

## Supported version and scope

| Component | Current target |
| --- | --- |
| Game | Windows Look Outside, game ID `51778622`, build `74642914` |
| Difficulty | **Normal**; Easy and Hard cannot activate this APWorld |
| Archipelago | Minimum client version `0.6.7`; tested with Archipelago `0.6.7` |
| Registry / save format | Registry **74**, AP save schema **7** |
| Generation logic | `chronological_access_v1` |
| Randomized pool | **273 locations and 273 item copies**, representing 233 distinct item names |
| Item classification | 81 progression, 122 useful, 70 filler **copies** |
| Access graph | 74 regions, 81 entrances, a rule for every randomized location |
| Quest handling | 35 shared resolution groups |

The 273 item copies comprise **70 weapons, 97 armor/accessories, 103 other
physical items, and three virtual access unlocks**. There are 64 distinct items
classified as progression. That classification does not always mean the item
gates an AP location; see the [internal item reference](docs/internal_progression_item_limits.md).

Your installed Look Outside and Archipelago folders are treated as
**read-only sources**. Their locations are supplied during setup.
All working copies, saves, profiles, generated seeds, and build outputs belong
inside this project. Game assets are not distributed with the mod.

## What becomes an AP check or item

A **location/check** is an audited acquisition or quest milestone. Completing it
sends its location ID to Archipelago and suppresses the randomized vanilla reward
at that source. The server determines the replacement item and its recipient.
Checking a location does not guarantee receiving its original item or receiving
anything locally at that moment. Names such as **Garage Car Trunk - Shotgun**
identify the vanilla source, not the item a generated seed places there.

Interception is specific to the source. Another source of the same item can remain
vanilla, such as a purchase, random drop, or crafting recipe.

| Included source or item category | Scope |
| --- | --- |
| Fixed equipment | Reviewed weapon, armor, and accessory pickups, including equipment in safes and locked rooms. |
| Keys and quest objects | Reviewed fixed keys, discs, sea valves, manuscript/ritual inputs, Phone, Rose, Telescope Pieces, and other registered quest items. |
| Collectibles | Reviewed playable videogames, the six named Kingdoms of the Dump figures, and other explicitly registered collectibles. Ordinary household valuables are separate. |
| Persistent enemy rewards | Reviewed guaranteed drops and boss salvage. Alternate appearances of the same encounter share a check where registered. Boss salvage checks do not require Audrey. |
| Quest rewards | Audited gifts, intermediate rewards, and shared terminal resolutions. The exact membership of each group is fixed in the registry. |
| Simple Keys | Eight fixed pickups and the approved Kaeley/Nestor drops become ten checks; the pool contains ten **Simple Keys (3)** bundles. Purchases and random keys stay vanilla. |
| Reusable gifts | Scout's **Radio** and Bright Frederic's **Medic-in-a-jar** are useful AP items with their native recharge behavior. |
| Other reviewed acquisitions | The first Metal Detector, Comatus's Whisperblade, fungus rescue equipment, Darryl's Legs, Spider Husk's Beating Heart, and the shared bookshelf Screamatorium reward. |
| Virtual unlocks | **Elevator Access**, **Planetarium Door Access**, and **Power Restored** arrive as permanent access state instead of inventory objects. Their source checks remain separate. |

The eight fixed Simple Key pickups are in Apartment 36 Bedroom, Corner Store,
Ground Floor Janitor Closet, Floor 3 Janitor Closet, Eye Apartment, Garage Side
Room, Rat Lair North, and Basement Storage. Nestor's early, rooted, and mound
body victories resolve one shared key check. Kaeley's guaranteed key drop is the
explicitly approved exception to excluding standalone friendly-kill checks.

### Quest choices and shared resolutions

An audited terminal outcome completes the qualifying checks in its resolution
group, including rewards that the chosen branch makes unavailable. Native story
consequences still happen. Starting a quest, postponing an available offer,
escaping an unfinished fight, or getting a game over does not generally resolve it.

For example, **Joel Resolution** sends both the Door Knob and Toothy Whip checks
through his audited peaceful, recruitment, or hostile outcomes. Those remain two
AP locations and two item copies, collected by one resolution. Wilhelmina's
resolution reconciles her five mutually exclusive reward checks. Closing the
fungus illusion resolves the remaining rescue checks; an individual rescue
checks only that person's reward.

The 35 groups also cover reviewed branches of Frederic, Jasper, Pierre, Benjamin,
Clint, Madison, the Masked Shadow, Mutt, Tickle, Juicebox's card trick, Rat Freak,
Sybil, Hellen, Dan, High Five, and other registered resolutions. This does not
preserve every quest indefinitely or change its native dates. See
[choice handling](docs/quest_resolution_policy.md) for the audited outcomes.

### Nine locations can contain only filler

These missable checks cannot hold progression or useful items:

- Original teeth apartment: Frying Pan, Hoodie, bathroom Mop, west-bedroom
  Baseball Cap, east-bedroom Army Guy Figure and Tank Top, safe Old Rifle,
  and Baby Teeth's Jawbone Club.
- **Pierre - Old Mail Visit**.

The original teeth entrance closes at **noon on Day 4**. Its location labels use
Apartment 32; the access graph calls this region **Original Teeth Apartment**.
Other timed quests are not automatically restricted to filler.

## What stays vanilla

| System or source | Preserved behavior |
| --- | --- |
| Combat | Enemy behavior, battles, levels, party preparation, and equipment use. AP does not judge whether your party can win. |
| Local supplies | Food, healing, ammunition, other consumables, crafting materials such as Junk/Duct Tape, and local currency. Gather, buy, or craft them normally. |
| Shops and random loot | Stock, purchases, repeat purchases, random loot, and random key grants. Metal Detector replacement purchases also stay vanilla. |
| Household valuables | Jewelry boxes, comic books, old consoles, Spirit Board, and the excluded taxidermy valuables used for selling/gifts. Wearable equipment jewelry can still be randomized. |
| Crafting and transformations | Original recipes, inputs, consumption, and outputs. AP inputs are used normally: Telescope Pieces are repaired locally, and Void Disc becomes Negative Disc locally. Conversions add no AP checks. |
| Selected companion rewards | Ernest's Metal Bat; Hellen's Paper Mask/Cleaver; Juicebox's battle-assistance gifts; Marc-Andre's recruitment item and cooldown forms. This exemption does not include every reward involving those characters. |
| Morton donations | Junk donation rewards, including the fixed equipment milestones. |
| Gauntlet | The entire area, its entrance key, and all rewards. |
| Excluded friendly-kill routes | Eugene's locked rooms, Lyle's Dark Room, and their keys/interior rewards; other unapproved standalone friendly-kill rewards. Audited shared quest resolutions and approved key drops are the stated exceptions. |
| Quest and visitor timing | Fixed dates, real new-day waits, hourly stages, visitor behavior, and dialogue cutoffs. AP does not rewrite quest stages to recover a missed deadline. |
| Recharges | Radio recharges after eight native hours; Medic-in-a-jar rests until a real new day. Recharging creates no extra check or AP copy. |

Mixed rewards are split at the audited grant: the car trunk's Shotgun is an AP
check, while its **12 shells remain vanilla**. Unregistered sources retain their
native behavior even when they grant an item also found in the AP pool.

### Electricity

The building starts with electricity and undergoes its normal outage. The main
fuse box is a check; restoration is the separate **Power Restored** item.

- Received before the outage: ownership is saved, then the native power-loss
  event runs before immediate restoration. An explicit loss/restoration message
  and native sounds make both events visible.
- Received after the outage: power returns when the item is delivered.
- Fuse box checked first: it sends its check, but power waits for the item.
- Power restored first: the fuse-box check is still available.

See [power progression](docs/power_progression.md) for the exact hooks.

## How progression logic works

### Access, supplies, and alternatives

Generation considers **routes, keys, quest inputs, finite item counts, and audited
calendar ordering**. It does not require weapon tiers, armor strength, levels, or
combat party composition. A fight can still be mandatory in the game. Cowboy
Hat (Lucky) is progression because it is a quest input, not because of its stats.

Vanilla supplies such as herbicide, salt/ice-melting items, and rent money are
assumed obtainable locally. The solver does not require a particular fixed supply
pickup. This assumption does not replace the AP key budgets.

Routes can have alternatives. Padlock Key reaches the stairwell and Floor 2;
Apartment 21 provides a route to Floor 1. The powered elevator is another way
down. Basement Key and the boiler maze can reach the western basement without
restored power, so the fuse box and elevator encounter are reachable independently
of their own randomized rewards.

| Finite resource | Generation requirement |
| --- | --- |
| Ordinary locks | Nine Simple Keys (3) receipts, or 27 keys, for any reviewed ordinary lock. The pool supplies ten bundles/30 keys for all 26 locks, including vanilla-only safes and every maze turn. |
| Iris locks | Six Iris Key receipts cover six spends in any order; seven copies are in the pool. |
| Unlabeled Game | Cartridge plus all colored-key supplies: one each green/red/blue/white, three yellow, and one Black Keys (2) receipt. Together they cover nine locks. |
| Sea valves | One copy of each of the four playable valves, each for its own lock. |

These are conservative **placement rules**. The game lets you use a key as soon
as it arrives; it does not make you wait for nine bundles before opening a door.
AP tracks received-item history, so the budgets prevent logical reuse of a key
that the game has consumed.

Disc logic assigns **distinct physical discs** to doors that must remain open
together. It includes powered doors, the elevator alternative, the four-socket
balance gate, and the nine-disc astrolabe. Void Disc's Negative form requires
Apartment 31 access; logic does not depend on retaining the original form after
that irreversible conversion. Astronomer offerings likewise need four categories;
one Guinea Pig substitutes for only one category.

### Days and chronological safety

The native calendar starts on **Day 0**. At the native **4 a.m. boundary**, time
holds until you choose **Go to Next Day**. The calendar caps at Day 15; it never
runs extra new-day cycles while pretending to remain on Day 15. Local hourly
actions do not substitute for a quest's required real new day.

Generation uses 15 day milestones and four action events to reserve a feasible
ordering. These **19 events are internal to the solver**: they are not randomized
items, client checks, or runtime requirements for advancing the day.

| Required action | Reserved timing |
| --- | --- |
| Reach/open the original teeth safe | Nine Simple Key bundles and its route by Day 4, with a prompt visit before noon. This constrains logical Day 5. |
| Deliver Rose to Charan | By Day 5, leaving the next real day for his cave on Day 6 before the Day 7 closure. This constrains logical Day 6. |
| Start Leigh's Phone quest | Phone and Floor 2 access by Day 10; read messages and progress over four real new days, finishing the conversation by Day 14. This constrains logical Day 11. |
| Finish Wilhelmina's crossword | Apartment 21's vanilla book and home crossword work by Day 14. Work is disabled on Day 15. This constrains logical Day 15; Pluto access can come later. |

Fixed openings are modeled: original teeth Day 1, Apartment 31 Day 2, Kaeley's
apartment Day 3, taxidermy Day 4, and late teeth Day 8 after 06:00. Logical rewards
reserve enough time: Louis's body drops Day 5, Charan's cave Day 6, shared Shadow
rewards Day 8, Leigh's reward Day 14, and Juicebox's card trick Day 15. Some can
be collected earlier in native play.

These dependencies work through item chains and across players. Rose cannot be
placed behind a late opening, or behind a key that itself requires that late
opening. Merely calling its immediate location an early room does not bypass
the rule. New generation is necessary to apply these rules to an older seed.

**Limits:** this is a targeted calendar model, not a simulation of every action
or visitor schedule. You can still advance too soon, miss a visitor, or spend
too long near an intraday cutoff. The Status deadline list is incomplete.
Visitor-order variation, repeated Shadow encounters, and travel time near
deadlines need full chronological playtesting. See
[calendar evidence](docs/calendar_deadlines.md) and
[per-item limitations](docs/internal_progression_item_limits.md).

## Winning, missed checks, and release

**Any real ending on any day completes the AP goal.** There is no Day 15 minimum
for actual play. Opening Credits through cheat mode does not count.

At Day 15, the home door offers **Keep exploring** or the original generic
**No Going Back** ending. That ending works with unfinished quests. Generation
proves access to this Day 15 fallback through its calendar reservations; this
does not change which earlier endings the client accepts.

On completion, the client reports the goal and requests `!release` for remaining
unchecked locations. The host must permit release with `goal`, `enabled`, `auto`,
or `auto-enabled`. Release sends the items **located in your world** to their
recipients. It does not collect your items still in other players' worlds or
complete native quests. Offline completion is saved and reported on reconnect.

Ending release recovers checks missed during play; generation does not use it
to justify the audited impossible deadline chains. If release is disabled, the
goal still counts, but remaining checks need a host permission change. See
[ending behavior](docs/ending_release.md).

## Setup guide

### 1. Requirements

- A matching Windows game installation and Archipelago installation. You will
  enter their folder paths during setup; the originals remain read-only.
- Python **3.10 or newer**, available as `python` in PowerShell.
- A local checkout of this repository in a writable folder, with space for
  copies of both installations.
- A fresh **Normal** game and a seed generated with the current APWorld.

This mod adds `js/plugins/LookOutsideArchipelago.js` and registers it in a
replacement `js/plugins.js`. There is no separate general-purpose mod loader or
external AP bridge client to launch; the game plugin connects to the AP server.

### 2. Stage the game and APWorld inside the project

Open PowerShell in the repository root (the folder containing this README),
then run the following. At each prompt, enter the full folder path without
surrounding quotes. The game folder must contain `Game.exe`; the Archipelago
folder must contain `ArchipelagoGenerate.exe`.

```powershell
$projectRoot = (Get-Location).Path
$gameSource = Read-Host 'Path to your Look Outside installation'
$apSource = Read-Host 'Path to your Archipelago installation'
python -B tools/validate_registry.py --game-dir "$gameSource"
python -B tools/sync_plugin_registry.py --check
python -B tools/stage_game.py --game-dir "$gameSource"
python -B tools/stage_archipelago.py --ap-dir "$apSource"
```

This creates `.local/game-smoke` and `.local/archipelago-smoke`. The game copy
omits the original save folder. The AP copy receives the current
`custom_worlds/lookoutside.apworld`. Neither source installation is modified.
The development game copy suppresses Steam achievement/stat writes during
testing; that instrumentation is absent from the distributable plugin.

If these staged directories already exist, close their game/generator processes
and use the matching refresh flag instead of the initial staging command.
Run from the repository root with `$gameSource` and `$apSource` set as above:

```powershell
python -B tools/stage_game.py --game-dir "$gameSource" --refresh-plugin
python -B tools/stage_archipelago.py --ap-dir "$apSource" --refresh-world
```

Refresh updates the mod component, not the underlying installation. After an
underlying installation changes, use a new project-local `--out-dir`.

### 3. Create the player YAML and generate a seed

For an initial solo test, create `.local/players/LookOutside.yaml` using this
sample. Use a different file for each player in a multiworld and unique player
names. Keep unrelated YAMLs out of this player directory.

```yaml
name: LookOutside_Test
game: Look Outside
Look Outside: {}
```

The supplied fixture contains this configuration. On first setup, copy it and
generate with the staged executable:

```powershell
New-Item -ItemType Directory -Path "$projectRoot\.local\players" -Force
Copy-Item -LiteralPath "$projectRoot\tests\fixtures\lookoutside.yaml" -Destination "$projectRoot\.local\players\LookOutside.yaml"
Push-Location "$projectRoot\.local\archipelago-smoke"
.\ArchipelagoGenerate.exe --multi 1 --spoiler 2 --player_files_path "$projectRoot\.local\players" --outputpath "$projectRoot\.local\playtest-output"
Pop-Location
```

Keep your edited YAML for subsequent seeds; do not recopy the sample over it.
For a multiworld, change `--multi` to the player count and install the other games'
required APWorlds into this staged AP copy. Look Outside is hidden from normal
world listings during development, but its YAML works.

### 4. Host the generated game

Extract the generated ZIP from `.local/playtest-output` into a new project-local
folder, for example `.local/hosted-seed`. Find its `.archipelago` multidata file.
Open a separate PowerShell terminal in the repository root and run the following,
replacing `AP_<seed>` with the actual filename:

```powershell
$projectRoot = (Get-Location).Path
Set-Location "$projectRoot\.local\archipelago-smoke"
.\ArchipelagoServer.exe "$projectRoot\.local\hosted-seed\AP_<seed>.archipelago" --host 127.0.0.1 --port 38281 --release_mode goal --collect_mode disabled
```

Keep that terminal open. This example hosts on this PC only and enables release
after the goal. `collect_mode disabled` keeps completion from automatically
collecting your items in other worlds; it does not prevent releasing this world.
For a room hosted elsewhere, use its supplied address, port, and password and
ensure its host permits release. The generator needs the custom APWorld.

### 5. Launch and connect

Open another PowerShell terminal in the repository root:

```powershell
$projectRoot = (Get-Location).Path
$env:LOA_DEV_MODE = '1'
Set-Location "$projectRoot\.local\game-smoke"
.\Game.exe --user-data-dir="$projectRoot\.local\nw-profile"
```

1. Start a **new Normal game**.
2. Open **Archipelago Connect** from the in-game menu before taking any audited
   reward, resolving a tracked quest, or advancing a day.
3. Enter `localhost:38281` for the local server, the exact YAML player name
   (`LookOutside_Test` in the sample), and a room password if required.
   Explicit `ws://` and `wss://` addresses are supported.
4. Confirm the bound seed/slot in **Archipelago Status**, then play and save in
   the test copy. Server/slot settings are remembered; passwords are masked and
   are not saved.

Status shows connection state, checked locations, queued items, recent deliveries,
calendar holds, and tracked deadline warnings. Inventory-full items wait in a
saved queue; make space for delivery. A three-key bundle needs room for all three.
After binding, offline checks are saved for reconnect, and already-received queued
items can deliver on a compatible offline reload. Items that have not reached
the client still require a server connection.

### Optional: build and install an extracted package

The staging workflow above runs directly from this checkout. To prepare the
distributable files instead, run from the repository root:

```powershell
$gameSource = Read-Host 'Path to your Look Outside installation'
python -B tools/build_package.py --game-dir "$gameSource"
```

The ZIP under `build/packages` contains the APWorld, plugin, sample YAML,
preparation script, manifest/checksums, and playtest documentation. It includes
no game assets. Rebuild after source changes; the registry-based filename alone
does not show whether an older ZIP includes current generation logic.

1. Extract it to a new folder inside this project, such as `build/package-test`.
2. From that extracted folder, run the command below. It validates the manifest
   and game build, then writes `prepared` inside the package.
3. Make a separate, unmodified game copy inside the project, omitting `save`,
   and back up that copy's `js/plugins.js`.
4. Copy `prepared/js` contents into the test game's `js` directory. This replaces
   `plugins.js` and adds `plugins/LookOutsideArchipelago.js`.
5. Put the package's `lookoutside.apworld` in the project-local AP copy's
   `custom_worlds` folder, restart AP, then follow generation/hosting/connection
   steps above, using the new test game's path.

```powershell
$gameSource = Read-Host 'Path to your Look Outside installation'
python .\prepare_mod.py --game-dir "$gameSource"
```

Preparation reads an original plugin list and preserves its entries and order.
It refuses a source already containing this mod or an existing output directory.
For removal, close the test game, restore its original `js/plugins.js`, and remove
only `js/plugins/LookOutsideArchipelago.js`. Keep AP saves separate. See the
[package setup guide](docs/package_setup.md).

## Saves, updating, and troubleshooting

| Situation | Action |
| --- | --- |
| AP menu is missing | Launch the staged `Game.exe` with `LOA_DEV_MODE=1`; verify the plugin is registered in that copy. |
| Connection refuses difficulty/build | Use Normal and the audited build. Guards reject unsupported versions. |
| First connection says the save is ineligible | Start a fresh mod-created save and bind before an audited reward, terminal resolution, or day rollover. Existing vanilla saves cannot be converted reliably. |
| Wrong seed or slot | Load that seed/slot's matching save, or start a fresh one. A bound save cannot be reassigned. |
| Items have not appeared | Check connection and the pending queue in Status; clear inventory space. Repeat packets do not grant duplicate items. |
| The day has stopped advancing | Use Go to Next Day at the 4 a.m. hold. Review deadlines first. Day 15 has no further quest-day transitions. |
| Goal counted but checks were not released | Reconnect if offline, or ask the host to permit release. Release-disabled rooms retain unchecked locations. |
| Save compatibility error after updating | Use the original matching mod/game version, or start a fresh compatible seed/save. Older AP schemas are not silently migrated. |

Registry/build changes require matching plugin/APWorld versions and may require
a new seed/save. The current chronology-only update preserves registry 74's
runtime/save format, but **existing seeds do not gain its placement rules**:
regenerate to use them. Keep old packages for unfinished runs. Schema 7 checks
compatibility before native AP save state is installed. See
[save compatibility](docs/save_compatibility.md).

## Verification and developer references

The recorded checkpoint has **55 Python tests and 44 Node tests passing**, plus
targeted native event probes. Chronology verification includes 77 native source
signatures, 15 native scenarios, and 10 real AP CollectionState cases. AP 0.6.7
seed 172 reaches all 273 locations; two-player seed 173 reaches all 546 locations
without ending release. Invalid direct and transitive late-Rose placements are
rejected. These results do not replace a full interactive playthrough.

Run from the project root:

```powershell
$gameSource = Read-Host 'Path to your Look Outside installation'
python -B -m unittest discover -s tests -p 'test_*.py'
node tests/plugin_interception.test.js
python -B tools/audit_access.py --require-complete
python -B tools/audit_chronology.py --game-dir "$gameSource"
python -B tools/sync_plugin_registry.py --check
python -B tools/sync_setup_guide.py --check
```

- [Current status and test evidence](docs/current_status.md)
- [Full playtest checklist](docs/playtest.md)
- [Internal progression item limitations: all 64 types](docs/internal_progression_item_limits.md)
- [Access rules and route evidence](docs/access_logic.md)
- [Calendar boundaries and remaining risks](docs/calendar_deadlines.md)
- [Registry: exact item, location, and resolution-group lists](apworld/lookoutside/vertical_slice.json)
- [Generation rules](apworld/lookoutside/access_data.py), [calendar events](apworld/lookoutside/chronology.py), and [disc allocations](apworld/lookoutside/disc_rules.py)

Older audit documents preserve historical counts; the current status and registry
supersede those checkpoints. The [initial workplan](docs/initial_codex_workplan.md)
records design intentions, not authoritative implementation instructions.
