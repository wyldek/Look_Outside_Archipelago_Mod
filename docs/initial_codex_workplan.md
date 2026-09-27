# Look Outside Archipelago Mod Workplan

## 1. Project Goal

Create an Archipelago integration for *Look Outside* that randomizes:

1. **Primary progression items and permanent progression events**
2. **Deterministic non-consumable equipment and collectibles**
3. **Duplicate fixed copies of those items**

while leaving the game's consumable economy and randomized systems largely untouched.

The expected final world size is approximately:

**250–300 AP locations/items**

The exact count will come from an automated audit of the game data rather than targeting a number artificially.

There will be **no fake `Nothing` filler items**. Every item contributed by *Look Outside* to the multiworld corresponds to a real item or progression state from the game.

---

# 2. Major Changes From Vanilla

The AP mod makes three major systemic changes.

## 2.1 Intentional Day Advancement

Calendar days never advance automatically in Archipelago mode.

Normal time-of-day behavior continues until the game reaches the normal day-transition boundary. At that point the calendar is held on the current day until the player explicitly chooses:

**Go to Next Day**

There is no arbitrary forward-day selector and no backward time travel.

The player progresses:

```text
Day 4
  ↓
Go to Next Day
  ↓
Day 5
  ↓
Go to Next Day
  ↓
Day 6
```

never:

```text
Day 4 → Day 8
```

Existing *Look Outside* mod work demonstrates that the game exposes its time state and that normal forward advancement runs through the game's `TimePasses`, `HourPassed`, and `newDay` processing. The AP implementation should reuse the vanilla transition rather than simply changing the day variable.

---

## 2.2 Progression and Non-Consumables Become AP Items

Fixed acquisitions of qualifying items are removed from their vanilla locations and placed into the Archipelago item pool.

Their vanilla source becomes an AP location.

Example:

```text
VANILLA

Apartment 12
    ↓
Baseball Bat
```

becomes:

```text
ARCHIPELAGO

Apartment 12 - Baseball Bat
    ↓
AP CHECK

Baseball Bat
    ↓
exists somewhere in the multiworld
```

The Baseball Bat may be found by:

- another *Look Outside* player
- a Zelda player
- a System Shock 2 player
- any other world in the multiworld

When the AP client receives `Baseball Bat`, the bat is added to the player's inventory.

The same principle applies to progression:

```text
VANILLA

Kill Elevator Thing
    ↓
Elevator restored
```

becomes:

```text
ARCHIPELAGO

Elevator Thing Defeated
    ↓
AP CHECK

Elevator Restored
    ↓
exists somewhere in the multiworld
```

---

## 2.3 Stores Remain Completely Outside Archipelago

Store inventories remain vanilla.

A store inventory entry is:

- not an AP location
- not removed by the randomizer
- not converted into an AP check
- not required by AP logic
- not used as a progression placement

If a weapon can randomly appear in a shop, that shop copy remains exactly as vanilla.

If the same weapon also has a deterministic fixed pickup:

```text
Fixed Baseball Bat
→ randomized

Random shop Baseball Bat
→ vanilla
```

This means the player may occasionally obtain additional local copies of equipment that also exists in the AP pool.

That is intentional.

No player should ever be required to wait for a random store roll to progress.

---

# 3. What Becomes an AP Location

The fundamental rule is:

> A deterministic vanilla acquisition of a randomized persistent item or progression state becomes an AP location.

## Included

### Progression items

Examples:

- access keys
- apartment keys
- planet spheres/discs
- Iris Keys
- valves
- ritual objects
- major quest objects
- other objects that enable subsequent content

### Permanent progression states

Examples:

- Elevator Restored
- permanent passages opened by significant events
- system restoration
- progression-relevant world-state changes
- major route unlocks
- endgame access states

### Weapons

Every deterministic fixed weapon acquisition.

Examples:

- world pickups
- deterministic quest rewards
- deterministic boss rewards
- scripted rewards

### Armor

Fixed armor acquisition locations.

### Accessories and equipment

Fixed:

- rings
- boots
- helmets
- accessories
- shields
- reusable special equipment
- similar persistent equipment

### Persistent collectibles

Examples such as videogames or comparable permanent collectible/use items should be included when their source is deterministic.

### Duplicate fixed pickups

Duplicates count separately.

If vanilla contains:

```text
Baseball Bat - Apartment 12
Baseball Bat - Basement
Baseball Bat - Apartment 24
```

then AP contains:

```text
LOCATION:
Apartment 12 - Baseball Bat

LOCATION:
Basement - Baseball Bat

LOCATION:
Apartment 24 - Baseball Bat
```

and the AP item pool contains:

```text
Baseball Bat ×3
```

Archipelago permits multiple copies of one item to share the same item name and ID; the item type does not need a unique ID for every copy.

---

# 4. What Does NOT Become an AP Location

## Stores

All store inventories and purchases stay vanilla.

## Random enemy drops

Probabilistic drops remain vanilla.

Killing random enemies repeatedly should never be required to generate AP checks.

A **guaranteed scripted boss reward** can still be randomized.

## Consumables

Do not randomize:

- healing items
- food
- ammunition
- explosives
- temporary-use combat items
- other expendables

## Crafting materials

Do not randomize ordinary crafting ingredients.

## Money

Money remains vanilla.

## Repeatable crafting

Repeatable crafting systems stay outside AP.

A unique scripted transformation that functions as quest progression can still qualify as progression.

## Random containers

A container that chooses randomized vanilla loot is not automatically an AP location.

Only deterministic qualifying acquisitions count.

---

# 5. One-for-One Pool Construction

The AP pool should naturally balance itself.

For every randomized vanilla source:

```text
1 vanilla source
=
1 AP location
+
1 AP item
```

Therefore, if the audit finds:

```text
278 qualifying acquisition/event sources
```

then *Look Outside* contributes:

```text
278 AP locations
278 AP items
```

No padding is necessary.

Archipelago expects worlds normally to provide an item pool corresponding to their available locations.

---

# 6. Expected Pool Composition

The expected final count is currently approximately:

```text
250–300 locations
250–300 items
```

The exact breakdown must come from the extractor.

A plausible final distribution might resemble:

```text
Progression        ~70–100
Useful             ~60–90
Filler equipment  ~100–130
---------------------------
Total              ~250–300
```

These are design estimates, not target quotas.

If the natural audit produces 247 or 312 good locations, we use that rather than manufacturing or deleting content merely to hit 275.

---

# 7. AP Item Classification

Archipelago distinguishes between item classifications used by logic and fill. Progression items referenced by access rules must be classified as progression; useful items receive favorable placement treatment compared with ordinary filler.

## Progression

Anything referenced by AP logic.

Examples:

```text
Basement Key
Elevator Restored
Planet Disc
Iris Key
Major Apartment Key
Ritual prerequisite
Quest progression state
```

A useful rule:

> If receiving this item changes which AP locations are logically reachable, it is progression.

---

## Useful

Strong or desirable equipment that does not alter logical reachability.

Examples might include:

- exceptional weapons
- particularly strong armor
- valuable reusable equipment
- rare accessories
- unusual unique gear

Useful does **not** mean required.

---

## Filler

Everything else in the randomized persistent-item pool.

Examples:

- ordinary weapons
- weaker armor
- common accessories
- duplicate equipment
- lower-value videogames/collectibles
- equipment that is real but not particularly important

This is Archipelago "filler" in the technical sense.

It is still a real *Look Outside* item.

There will be no artificial:

```text
Nothing
AP Junk
5 Coins
Empty Package
```

items.

---

# 8. Location Classification

Locations have a separate classification from items.

Archipelago supports:

```text
DEFAULT
PRIORITY
EXCLUDED
```

Priority locations preferentially receive progression. Excluded locations cannot receive progression or useful items.

## DEFAULT

Almost all permanent deterministic locations.

This should be the normal classification.

---

## EXCLUDED

Use by default for locations that can become permanently unavailable through time or irreversible decisions and cannot later be reconciled.

These may still contain genuine filler equipment.

Example:

```text
Day 6-exclusive weapon pickup
```

may be an AP location, but it cannot receive:

```text
Basement Key
Elevator Restored
Powerful useful equipment
```

if missing Day 6 permanently destroys access to that location.

This ensures intentionally leaving old checks behind cannot logically brick the seed.

---

## PRIORITY

Do not automatically mark vanilla-important locations as priority.

For example:

```text
Elevator Thing Defeated
```

should not automatically be guaranteed to contain progression merely because the vanilla event is important.

Priority should primarily be available through normal Archipelago user configuration.

This keeps placement unpredictable.

---

# 9. Progression Items vs Vanilla Events

The AP item and its vanilla source are independent.

Suppose vanilla does:

```text
Kill Elevator Thing
    ↓
Elevator activates
```

AP mode instead does:

```text
Kill Elevator Thing
    ↓
"Elevator Thing Defeated" AP check
```

The actual elevator does not necessarily activate.

The player may later receive:

```text
Elevator Restored
```

from another location.

At that point the game applies the appropriate persistent elevator state.

This pattern applies throughout the randomizer.

---

# 10. Physical and Virtual AP Items

There are two implementations of progression items.

## Physical items

These correspond directly to normal inventory objects.

Examples:

```text
Basement Key
Planet Disc
Iris Key
```

Receiving one uses the game's normal inventory APIs.

---

## Virtual progression items

These represent persistent world state rather than an inventory object.

Example:

```text
Elevator Restored
```

The client records ownership and applies the minimum vanilla state necessary to produce that unlock.

Virtual items must not blindly trigger entire cutscenes.

Each one gets a dedicated state reconciliation routine.

---

# 11. Received Equipment

Receiving equipment from AP should behave as closely as possible to obtaining it normally.

Examples:

```text
Received Baseball Bat
Received Army Helmet
Received Pistol
Received Ring
```

The client grants the appropriate equipment.

If *Look Outside* can ever reject an item because of inventory limits, AP delivery must **never silently destroy the received item**.

The implementation must either:

1. deliver it to an appropriate storage system, or
2. queue delivery until the game can safely accept it.

That behavior must be determined during the inventory technical spike.

---

# 12. Quest Branch Reconciliation

Mutually exclusive vanilla choices remain mutually exclusive narratively.

We do not rewrite the story so every branch happens.

Instead, related AP locations can belong to a:

**Quest Family**

Example:

```text
Quest X

Branch A check
Branch B check
Branch C check
Final resolution check
```

If the player takes B:

```text
Branch B
→ checked immediately
```

When the quest reaches a valid terminal resolution:

```text
Branch A unchecked
→ check it

Branch B already checked
→ ignore

Branch C unchecked
→ check it

Final resolution
→ check normally
```

Archipelago's `LocationChecks` packet can contain multiple location IDs at once, so resolving several missed branch locations together is straightforward.

---

# 13. What Quest Reconciliation Does NOT Do

Quest completion does not automatically collect every location associated with the quest.

Only locations marked:

```text
branch_reconciled = true
```

are swept.

Optional:

- exploration
- hidden equipment
- optional boss encounters
- day-specific encounters
- side objectives

remain independent checks.

This prevents the system from turning:

> Finish quest

into:

> Automatically collect everything vaguely connected to quest.

---

# 14. Intentional Day Advancement

This is a fundamental AP-mode mechanic.

## Basic rule

**The calendar day cannot advance without explicit player approval.**

Normal in-day time functions as normally as practical.

When the game reaches the point where vanilla would invoke the next-day transition, AP prevents `newDay` from running automatically.

The player remains on the current calendar day.

---

# 15. Day Hold

When the normal rollover boundary is reached:

```text
Day N
↓
normal game requests newDay
↓
AP blocks the transition
↓
Day N remains active
```

The game enters:

```text
Day Hold
```

Time advancement is frozen at the boundary rather than allowing the calendar to change behind the player's back.

The player may remain on this day as long as desired.

This is an intentional departure from vanilla specifically to prevent multiworld progression delays from consuming calendar days.

Existing mod work has already demonstrated that *Look Outside* can freeze actual game time while still allowing game actions to execute, and can selectively permit normal time progression through a scoped override. That gives us a useful technical basis for implementing the AP day hold.

---

# 16. Go to Next Day

Archipelago mode adds an explicit:

**Go to Next Day**

action.

It should be available from an appropriate home/rest interaction.

Selecting it examines the current AP location state before proceeding.

---

# 17. Remaining-Day Check Warning

Every location receives optional time metadata:

```text
first_day
last_day
day_exclusive
quest_reconciled
```

When the player selects **Go to Next Day**, the client calculates:

```text
locations enabled in this seed
AND
not yet checked
AND
last_day == current day
AND
not recoverable through later quest reconciliation
```

The prompt then displays:

```text
Advance to Day 7?

4 unchecked locations are only available on Day 6.

[Stay on Day 6]
[View Remaining Checks]
[Go to Day 7]
```

If zero checks are being lost:

```text
Advance to Day 7?

No unchecked Day 6-exclusive locations remain.

[Cancel]
[Go to Day 7]
```

---

# 18. View Remaining Checks

The warning should be inspectable.

Example:

```text
DAY 6 REMAINING CHECKS

Apartment 24 - Baseball Bat
Shadow Quest - Second Encounter
Floor 2 - Videogame
Visitor Event - Strange Key

4 checks remaining
```

This removes ambiguity.

The player knows exactly what is being abandoned.

---

# 19. No Forward Time Warp

There is no:

```text
Choose Day 8
Choose Day 12
Skip three days
```

interface.

Day progression is always exactly:

```text
N → N+1
```

The player may repeatedly choose **Go to Next Day** if they genuinely want to move through several days, but each transition is independent and displays the appropriate expiring-check warning.

This preserves the importance of the game's calendar.

---

# 20. Normal New-Day Processing

Once the player confirms advancement:

```text
AP day permission ON
↓
run vanilla newDay processing
↓
advance exactly one day
↓
AP day permission OFF
```

The normal game transition should handle its own:

- quest timers
- daily resets
- store refreshes
- plants
- other vanilla systems

rather than the mod recreating those systems manually. Existing time-manipulation work confirms those systems are processed through the normal forward-time cascade.

Stores remain outside AP, but their vanilla refresh behavior still occurs normally.

---

# 21. Day 15 / Final Calendar Boundary

The AP player must never be forced into the ending merely because another world has not yet delivered progression.

Therefore:

```text
Reach final normal day
↓
AP goal not complete
↓
forced calendar-ending transition suppressed
```

The player may remain on the final supported day.

Once the selected AP goal becomes achievable/completed, the appropriate endgame behavior is restored.

We should avoid inventing unsupported Day 16+ content.

---

# 22. Region Logic

The APWorld models logical accessibility rather than every individual room.

Example:

```text
Starting Area
│
├── Floor 3
│
├── Floor 2 East
│
│
├── Floor 2 West
│      requires Elevator Restored
│
├── Ground Floor
│      requires relevant progression
│
├── Basement
│      requires Basement Key
│
├── Special Basement Areas
│      require additional progression
│
├── Floor 4
│
├── Meat World
│
└── Endgame
```

Regions should be subdivided only when doing so is necessary to express accurate item requirements.

---

# 23. Logic Definition

Every progression item needs a documented answer to:

> What new AP locations can this item make reachable?

For example:

```text
Basement Key

Unlocks:
- Basement region
- X equipment checks
- Y quest checks
- Z additional progression sources
```

If the answer is:

```text
Nothing
```

then the item probably should not be classified as progression.

---

# 24. Sphere Analysis

Spheres become one of the primary balancing tools.

For every generated test seed, produce:

```text
Sphere 0:
  reachable checks
  progression found

Sphere 1:
  newly reachable checks
  progression found

Sphere 2:
  newly reachable checks
  progression found
...
```

With 250–300 checks, we should have enough location density to detect and correct ugly progression bottlenecks.

---

# 25. Sphere Diagnostics

Automated seed testing should record:

```text
Starting reachable checks
Checks unlocked per sphere
Progression items per sphere
Largest progression drought
Largest single-item bottleneck
Number of checks opened by each progression item
Required items placed on late spheres
Day-exclusive checks by sphere
```

Example of suspicious progression:

```text
Sphere 0: 24 checks
Sphere 1: 2
Sphere 2: 3
Sphere 3: 71
```

This suggests a severe bottleneck.

A healthier structure might resemble:

```text
Sphere 0: 22
Sphere 1: +26
Sphere 2: +34
Sphere 3: +31
...
```

There is no need to force those exact numbers. They are diagnostics.

---

# 26. Early Progression Categories

During the progression audit, items should receive an additional internal tag such as:

```text
early_expansion
major_expansion
minor_expansion
late_progression
goal_progression
```

These are not necessarily AP item classifications.

They are tools for analyzing generation.

Examples:

```text
Basement Key
→ major_expansion

Small apartment key
→ minor_expansion

Final ritual requirement
→ goal_progression
```

After generating hundreds or thousands of test seeds, we can determine whether an early-item rule is actually necessary.

Do not hardcode early progression before testing proves it is needed.

---

# 27. Early Item Intervention

If generation testing reveals frequent opening stalls, use Archipelago's existing early-item mechanisms rather than fixing an item to one vanilla location.

Possible approach:

```text
Guarantee one item from Early Expansion
within early progression.
```

Avoid making important items permanently local unless testing demonstrates it is necessary.

Multiworld interaction should remain meaningful.

---

# 28. Game Data Extractor

The first major development tool should be an extractor for the RPG Maker data.

It should scan:

```text
Map*.json
CommonEvents.json
Items.json
Weapons.json
Armors.json
System.json
other relevant databases
```

and identify:

```text
item grants
weapon grants
armor grants
key-item grants
switch changes
variable changes
common event calls
map transfers
battle rewards
quest state changes
time/day conditions
store definitions
enemy drop tables
```

---

# 29. Acquisition Source Classification

Every possible acquisition found by the extractor should be classified.

Example:

```text
FIXED_WORLD_PICKUP
FIXED_QUEST_REWARD
FIXED_BOSS_REWARD
PROGRESSION_EVENT
STORE
RANDOM_ENEMY_DROP
RANDOM_CONTAINER
REPEATABLE_CRAFT
CONSUMABLE
TEST/CUT
```

Then apply the randomizer rules.

### Include

```text
FIXED_WORLD_PICKUP
FIXED_QUEST_REWARD
FIXED_BOSS_REWARD
PROGRESSION_EVENT
```

when the result is a qualifying persistent item/state.

### Exclude

```text
STORE
RANDOM_ENEMY_DROP
RANDOM_CONTAINER
REPEATABLE_CRAFT
CONSUMABLE
TEST/CUT
```

unless a specific source is manually overridden after review.

---

# 30. Canonical Acquisition Registry

The audit should generate one master registry.

Example:

```text
Location:
Apartment 12 - Baseball Bat

Source:
Map 42 / Event 17

Vanilla reward:
Baseball Bat

Randomized:
true

Item:
Baseball Bat

Item classification:
filler

Region:
Floor 2 East

Day availability:
permanent

Quest family:
none

Location classification:
DEFAULT
```

Progression example:

```text
Location:
Elevator Thing Defeated

Source:
Boss event X

Vanilla effect:
Restore elevator

Randomized:
true

Item:
Elevator Restored

Item classification:
progression

Region:
Basement

Location classification:
DEFAULT
```

This registry becomes the authoritative source for both sides of the project.

---

# 31. Shared Data Generation

Where possible, generate:

```text
Python APWorld data
JavaScript client tables
documentation reports
```

from the same registry.

Avoid separately hand-maintaining:

```text
locations.py
locations.js
spreadsheet of locations
```

because they will eventually disagree.

---

# 32. Game-Side Plugin Structure

Suggested architecture:

```text
js/plugins/
├── LookOutsideArchipelago.js
└── LookOutsideArchipelago/
    ├── ap-core.js
    ├── ap-network.js
    ├── ap-save.js
    ├── ap-items.js
    ├── ap-locations.js
    ├── ap-progression.js
    ├── ap-quests.js
    ├── ap-time.js
    ├── ap-ui.js
    ├── ap-hooks.js
    ├── ap-version.js
    └── generated/
        ├── items.js
        ├── locations.js
        └── quests.js
```

---

# 33. Pickup Interception

The mod should avoid rewriting hundreds of maps.

Instead, patch the RPG Maker interpreter/reward mechanisms.

When a known randomized source attempts to give its vanilla item:

```text
lookup current map/event/command
↓
recognized AP location?
↓
YES
    suppress randomized vanilla reward
    mark source consumed normally
    send AP check
```

Unrelated event behavior continues.

For example, defeating a boss still:

- plays dialogue
- grants XP
- updates quest state
- runs animations
- gives non-randomized rewards

Only the randomized persistent reward is replaced.

---

# 34. APWorld Structure

Suggested layout:

```text
look_outside/
├── __init__.py
├── items.py
├── locations.py
├── regions.py
├── rules.py
├── options.py
├── web.py
├── data/
│   ├── items.json
│   ├── locations.json
│   ├── regions.json
│   └── quests.json
└── docs/
    ├── setup_en.md
    └── Look Outside.md
```

The World defines:

- item IDs
- location IDs
- item classifications
- location classifications
- item quantities
- region graph
- access rules
- completion condition
- options
- slot data

---

# 35. Networking

Prefer an in-game JavaScript Archipelago client if the shipped NW.js runtime supports everything reliably.

Required behavior includes:

- secure and insecure WebSockets
- reconnect
- send location checks
- receive arbitrary items
- receive items while previously offline
- maintain the ReceivedItems index
- resynchronize after connection loss
- report goal completion

These are explicit Archipelago client requirements.

If the game's NW.js environment proves unsuitable, use a small external client as the fallback architecture.

---

# 36. Offline Support

Checking an AP location while disconnected must still work.

```text
pickup/event occurs
↓
record check in save
↓
continue game
↓
reconnect
↓
send outstanding LocationChecks
```

Archipelago accepts repeated location IDs safely, so synchronization should favor reliability over attempting fragile deduplication.

---

# 37. Save Data

Store AP world state inside the save.

Conceptually:

```text
seed identity
slot identity
received item index
locally checked locations
pending location checks
received progression ownership
pending item deliveries
quest reconciliation state
day-hold state
```

Connection address/password can remain external configuration.

---

# 38. Seed/Slot Protection

A save associated with:

```text
Seed A
Karl
```

must not silently connect to:

```text
Seed B
Karl
```

or another player's slot.

Display a blocking warning.

This prevents contamination of save state and network state.

---

# 39. Client UI

Add a small AP menu containing:

```text
Connection Status
Seed
Slot
Received Items
Checked Locations
Current Day
Day-Exclusive Checks Remaining
Reconnect
Archipelago Messages
```

The normal game UI should remain dominant.

---

# 40. Day UI

The most important custom screen is:

```text
GO TO NEXT DAY
```

Example:

```text
DAY 8

Unchecked locations exclusive to Day 8: 3

[View Checks]
[Stay on Day 8]
[Go to Day 9]
```

When the calendar is being held because the natural boundary was reached, indicate that clearly:

```text
DAY 8 HELD

The day will not advance until you choose
"Go to Day 9."
```

---

# 41. APWorld Options for Version 1

Keep the option set relatively conservative.

Possible initial options:

```text
goal

death_link

include_videogames

include_optional_equipment

include_day_exclusive_locations
```

Do **not** initially make these optional:

```text
progression randomization
fixed weapon randomization
fixed armor randomization
intentional day advancement
stores staying vanilla
```

Those define the core randomizer.

---

# 42. Development Milestones

## Milestone 1 — Game Database Snapshot

Capture the current supported *Look Outside* build.

Create version/fingerprint information.

---

## Milestone 2 — Data Extractor

Extract all:

- equipment
- fixed item grants
- key items
- progression flags
- stores
- random drops
- quests
- day conditions

Deliver an initial machine-readable acquisition list.

---

## Milestone 3 — Acquisition Audit

Classify every source as:

```text
AP
LOCAL
STORE
RANDOM
CONSUMABLE
CUT/TEST
```

Determine the actual final world size.

Target expectation:

```text
~250–300
```

but accept the natural result.

---

## Milestone 4 — Item Classification

Assign:

```text
progression
useful
filler
```

to every AP item.

Also tag progression items with:

```text
early expansion
major expansion
minor expansion
late
goal
```

---

## Milestone 5 — Location Classification

Assign:

```text
DEFAULT
EXCLUDED
```

to locations as appropriate.

Record:

```text
day availability
quest reconciliation
permanent missability
```

---

## Milestone 6 — Network Proof of Concept

Tiny test world.

Prove:

```text
connect
send check
receive item
save
load
disconnect
offline check
reconnect
resync
```

---

## Milestone 7 — Equipment Vertical Slice

Randomize:

```text
one weapon
one armor
one accessory
```

Prove their vanilla sources become AP checks and AP reception grants the item safely.

---

## Milestone 8 — Progression Vertical Slice

Randomize one true progression state such as a substantial key/access unlock.

Prove:

```text
vanilla source no longer grants progression
source sends AP check
AP item received elsewhere
correct world access activates
```

---

## Milestone 9 — Full Item Replacement

Implement all audited deterministic equipment sources.

Do not touch stores or random enemy drops.

---

## Milestone 10 — Quest Reconciliation

Implement Quest Families.

Test every branch and every supported terminal state.

---

## Milestone 11 — Region Graph

Create logical AP regions and access requirements.

Run basic generation tests.

---

## Milestone 12 — Intentional Day System

Implement:

```text
automatic rollover suppression
day hold
Go to Next Day
remaining-check calculation
View Checks
single vanilla newDay transition
```

---

## Milestone 13 — Time-Exclusive Classification

Audit all day-specific locations.

Ensure genuinely expiring locations are excluded from progression/useful placement by default.

Archipelago's excluded-location handling prevents progression and useful items from landing there.

---

## Milestone 14 — Sphere Testing

Generate large numbers of seeds.

Collect sphere statistics and identify:

- bottlenecks
- tiny spheres
- giant unlock cliffs
- excessively late progression
- weak starting access
- single-item chokepoints

---

## Milestone 15 — Logic Tuning

Only after sphere data exists:

- add early-item groups if needed
- subdivide regions if needed
- reclassify incorrectly marked progression
- adjust rules
- identify unnecessary hard gates

Do not patch symptoms by arbitrarily forcing important items local.

---

## Milestone 16 — Full Playtesting

Run:

- single-player AP seeds
- two-player multiworlds
- large multiworlds
- intentional disconnect tests
- aggressive sequence breaking
- incomplete day tests
- alternate quest choices
- duplicate-item-heavy seeds

---

# 43. Required Test Matrix

## Equipment

Test:

```text
unique weapon
duplicate weapon
armor
accessory
videogame
equipment received twice
equipment received before vanilla source
equipment received after vanilla source
```

---

## Progression

For every progression item:

```text
without item
→ gated locations unreachable

with item
→ intended locations reachable
```

Also test:

```text
receive early
receive late
receive during event
receive while offline
receive duplicate
```

---

## Shops

Verify:

```text
shop inventory still generated normally
shop purchases remain vanilla
shop inventory creates no AP checks
shop items are not removed
shop RNG cannot block AP logic
```

---

## Quest Reconciliation

Verify every route:

```text
actual branch checks immediately
unselected siblings remain unchecked during quest
terminal completion reconciles designated siblings
already checked siblings are not duplicated
optional unrelated checks remain unchecked
```

---

## Days

Test every relevant day transition:

```text
normal clock reaches rollover
day does not advance
day hold activates
player remains indefinitely
View Checks is accurate
Go to Next Day runs vanilla transition once
next day starts normally
```

Also test:

```text
0 remaining checks
1 remaining check
many remaining checks
offline checks
quest-reconcilable checks
true missables
```

---

## Networking

Test:

```text
ws
wss
disconnect
reconnect
server restart
offline progression
multiple received items
duplicate received item
received item during combat/dialogue/transition
```

---

# 44. Automated Generation Report

Every test generation should optionally output something similar to:

```text
LOOK OUTSIDE AP GENERATION REPORT

Locations: 283

Items:
  Progression: 84
  Useful:      73
  Filler:     126

Location types:
  Default:     251
  Excluded:     32

Sources excluded from AP:
  Store entries:       91
  Random drops:       143
  Consumables:        312
  Repeatable crafting: 28

Sphere 0:
  27 locations

Sphere 1:
  +31 locations

Sphere 2:
  +22 locations

Largest progression drought:
  19 checks

Largest single unlock:
  Elevator Restored → 34 checks

Day-exclusive locations:
  32
```

Numbers above are examples only.

The real report is generated from the completed audit.

---

# 45. Version Compatibility

*Look Outside* database IDs and event structures may change between game versions.

Existing modding work specifically warns that switches and variables can shift between releases.

Therefore the mod should maintain:

```text
supported game fingerprint
known map/event definitions
generated acquisition registry version
```

Unknown builds produce a compatibility warning.

For potentially dangerous mismatches, refuse to start AP mode rather than silently checking the wrong locations.

---

# 46. Definition of Version 1 Complete

Version 1 is complete when:

- deterministic progression sources are AP locations
- progression states are AP items
- deterministic fixed weapons are randomized
- deterministic fixed armor is randomized
- deterministic fixed accessories/equipment are randomized
- duplicate fixed acquisitions contribute duplicate item copies
- persistent qualifying collectibles are randomized
- consumables remain vanilla
- crafting resources remain vanilla
- random enemy drops remain vanilla
- stores remain completely vanilla
- no store roll is necessary for AP logic
- no fake `Nothing` filler exists
- every AP location has a corresponding real AP item/state
- branch-exclusive quest checks reconcile correctly
- day progression never occurs without player approval
- no forward-day warp exists
- no backward-day travel exists
- the next-day screen accurately reports expiring checks
- genuinely missable checks cannot hold progression/useful items by default
- AP items can arrive safely at arbitrary times
- offline checks synchronize correctly
- saves are protected from wrong-seed connections
- the APWorld produces valid beatable seeds
- sphere testing shows acceptable progression pacing
- goal completion is correctly reported to Archipelago

---

# 47. Core Design Principle

The final randomizer should feel like:

> **Look Outside, except the permanent things you normally find have been scattered across the multiworld.**

The player's survival economy remains *Look Outside*.

They still find and purchase:

- food
- healing
- ammunition
- crafting materials
- random shop equipment
- enemy drops

locally.

What Archipelago controls is the game's persistent acquisition layer:

- progression
- fixed weapons
- fixed armor
- fixed accessories
- reusable equipment
- collectibles
- permanent unlocks

This should naturally give us roughly **250–300 meaningful checks**, enough for healthy Archipelago sphere structure without turning every drawer, consumable, or random vendor roll into network content.