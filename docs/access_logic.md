# Access-only generation logic

## Confirmed scope

Generation checks keys, quest inputs, and routes. It never checks attack power,
weapon tiers, armor strength, party composition, levels, or the ability to win
a fight. Equipment can be progression when used as an actual quest object:
the Lucky Cowboy Hat is one such input. Combat preparation remains the player's
responsibility.

Vanilla consumable supplies are assumed obtainable through gathering or crafting.
Herbicide and ice-melting barriers therefore add no AP item or fixed-supply
requirements. Native consumption and recipes remain unchanged. This assumption
does not apply to randomized keys, whose finite spending budgets are modeled.

## Current implementation

`apworld/lookoutside/access.py` supplies item counts, alternatives, conjunctions,
region prerequisites, a deterministic reachability runner, and an AP rule adapter.
The validator rejects combat equipment requirements, unknown items/regions,
impossible item counts, and missing source evidence.

`access_data.py` assigns **all 273 locations** to **74 regions with 81 entrances**.
The APWorld creates these regions and installs the reviewed rules, including
indirect region dependencies used for disc transformations. Complete-rule
validation passes; an omitted rule fails validation instead of defaulting to
free access. The APWorld remains hidden while development playtesting continues.

The first routes cover the starting pickups, Padlock Key stairwell, Apartment
21 route to Floor 1, the elevator alternative, janitor closets, Painter's Key
interiors, rat apartment, manuscript pickups, Rafta's two quest inputs, and
basement access to the fuse box and elevator encounter. It also covers key
sources, ordinary locks, ground-floor pickups, both teeth-apartment forms,
the observatory, Apartment18, the taxidermy/flesh passage, the boiler maze,
and the playable sea-valve route. Further rules cover frozen/herbicide routes,
fungus tunnels, the cafe, the Unlabeled Cartridge game, Kaeley's maze, garage
encounters, Frederic's milestones, the astronomers' offerings, and the planetarium.
Tests cover these
dependencies and the exclusion of combat equipment requirements.

```powershell
python -B tools/audit_access.py
python -B tools/audit_access.py --require-complete
python -B -m unittest discover -s tests -p 'test_*.py'
```

The second command is a passing release gate. With all items, every check is
reachable; 54 checks require no AP items. These counts describe item access,
not how many checks can be completed immediately on the first native day.

## Current quest and Normal-mode findings

- Frederic's introductory key precedes the internal key doors. His bag can be
  earned after three portraits with Painter's Key; the final palette route
  also needs Stained Key to reach Map239. Friendly-kill shortcuts are not used
  to declare his entire quest free.
- Jasper's apartment-key conversation requires visiting the other astronomers,
  including powered Aster/Beryl encounters. His roof key and robes require four
  distinct offerings. A single Guinea Pig can replace one category. Native
  transformations remain accepted, and Lyle's repeatable local photo-paper
  dialogue is available through Apartment21. Tests reject using one pig twice.
- The astrolabe check requires Power Restored and all nine Sun-through-Neptune
  discs. Telescope Pieces instead require the separately received Planetarium
  Door Access item; solving the puzzle and opening the door remain independent.
- Unlabeled Cartridge works at the flesh bedroom TV (Map267 event24), without
  a power or Day15 gate. The game itself requires a conservative budget for all
  nine colored locks. The home TV does not provide this entrance.
- Registry62 removes Map372's Pool Cue: both incoming transfers require Hard
  mode. Unlabeled Cartridge is now progression. Common-event, troop-event, and
  variable transfers are checked alongside map transfers when excluding maps.

Quest timing is confirmed vanilla: retain fixed-date events, waits for a real
new day, and dialogue cutoffs such as Leigh's CE125 exit on Day15. The calendar
cap does not run additional new-day cycles or finish quest stages. Players with
unfinished quests can take the generic Day15 ending to complete the AP goal and
release the remaining checks. This decision does not automatically restrict all
timed quests to filler; the nine existing exclusions remain. Review actual
quest inputs and routes before assigning access rules. See `ending_release.md`
for completion/release behavior and `flesh_route_audit.md` for the separate
spatial audit and its one-way-door evidence.

## Route evidence and pitfalls

- The tutorial doorway (Map023 event40) accepts the bat pickup's native
  self-switch. Checking the bat location permits access even before the actual
  Baseball Bat arrives from AP. No combat equipment gate is needed.
- The Floor 1 stairwell doors unlock **from Floor 1** (Map092 events11/12,
  switch88). Padlock Key alone reaches Floor 2, not Floor 1. Apartment 21's
  unrestricted side room leads through Maps012/013/094 to Floor 1; its herbicide
  bedroom door is a separate route.
- Painter's Key is needed for the studio's internal rooms. The front-room
  machete is before that key gate.
- Rafta's Love Letter requires both Stationery and Fountain Pen. Native
  consumption does not remove those items from AP's monotone collection history.
- A nonpowered route reaches the western basement from Basement Key access:
  Maps048 -> 079 -> 189 -> 192 -> 193 -> 197 -> 303 -> 084 -> 075 -> 086 -> 087
  -> 050. The maze and garage encounters introduce no equipment requirements.
  The electrical room opens during the native outage (or after restoration).
  Power Restored and Elevator Access are not required for their own checks.
- Powered routes conservatively require Power Restored so placement does not
  depend on completing a route before the outage. Vanilla starting electricity
  still permits earlier visits. Disc alternatives include the transformed
  Negative Disc and account for simultaneously occupied sockets.
- Transfer rows alone cannot prove access. Page priority, jumps, exit commands,
  internal barriers, and switch writers must also be reviewed. Game database
  map names do not reliably describe their contents.

## Goal semantics

The native Day 15 home door (Map003 event9 page2 command10) leads to Map172,
whose event1 command154 goes to Credits Map168 without an AP key requirement.
This is the real **No Going Back** ending and remains eligible under the user's
any-ending goal. Early real endings also count; the client has no Day 15 goal
restriction. Completion requests server release of unfinished checks, including
quests missed through vanilla timing. Release requires the room to allow it.
Tests of seed solvability must still check location accessibility as well as
completion: the permitted ending fallback does not prove a route or quest can
be completed during play. No access rule should rely on synthetic post15 days.

## Disc allocations

`disc_rules.py` enumerates distinct physical discs for all doors that must stay
open along a route. Ground-floor entry uses Earth+Mars or Sun+Negative. Office
front/inner doors use totals29/15; mailroom storage uses five discs totaling146.
Their stairwell routes also reserve the discs at the ground-floor entrance.
The elevator provides a route without that reservation. Security storage needs
four balanced discs at the outer door plus two different discs totaling18 inside.

The Void-to-Negative transformation stays vanilla and irreversible. Logic uses
the Negative form as available from Void Disc plus access to Apartment31; it
does not rely on keeping the original -1 form for later doors. Every reviewed
puzzle has solutions without that form, so converting early cannot invalidate
those placement requirements. Vanilla extra solutions remain usable.

Six native scenarios verify the actual Common Event64 arithmetic and simultaneous
door states. Regression tests reject reusing Earth/Mars across the stair door
and office, reusing security discs, and depending on the pre-conversion Void form.
All current graph routes use these audited allocation rules.

## Ordinary locks and Simple Keys

Ordinary locks invoke Common Event184 and accept Simple Keys (item320, consumed)
or Lockpicks (item363, breakable). There are 26 distinct map
events calling that common event, including safes and internal doors. The
existing cafe schedule supplies lockpicks; this stock stays outside AP.

The user requested a guaranteed AP supply. Registry version58 has ten
**Simple Keys (3)** progression bundles: 30 native keys cover all 26 locks.
Purchased and random-loot keys remain vanilla, as do lockpicks.
See `simple_keys.md` for the complete source and native-test evidence.

Reviewed ordinary locks require nine bundles (27 keys) in the independent
graph. This global budget covers every lock in any order, including vanilla-only
safes and wrong maze turns. Eight bundles are insufficient. AP collection
history therefore cannot reuse one consumed key across unrelated doors.
This is conservative placement logic; the game allows using each key on arrival.

Finite key supplies have also been validated, including a two-black-key bundle
and removal of two disconnected valve rooms. See `finite_key_budgets.md`.

## Completed late-route audit

- Landlord rooms use the native rent progression and local coins/herbicide.
- The elevator's secret floor uses its native button sequence. Fixed ticket
  bins and the platform ladder make the metro checks accessible without an AP ticket.
- Wilhelmina's route needs Pluto Storage and the Apartment21 crossword book.
- Charan's two rewards need Rose and their original before-Day7 sequence.
- Six Iris Keys cover the global spending budget. Eye/garage entrances reach
  the central component; reception/sea entrances reach the outer component.
  The home flesh entrance does not reach those deeper pickups.
- Sybil's peaceful Telescope route reconciles the Oracle reward and closet
  Iris Key. Its rule requires Apartment35 Key, Telescope Pieces, and Jasper's
  repair location; it does not require attacking a friendly character.
- Hellen/Dan refusals and the High Five early consumed branch now resolve their
  checks. Access rules remain conservative where those routes are earlier.
- Scout's Radio uses the Landlord route and local rent coins. Bright Frederic's
  Medic-in-a-jar uses Painter Interior plus the Stained Key for the peaceful
  portrait completion route. Neither item is required to reach its own check.
- The car-trunk Shotgun requires Basement West and Electronic Key. CE60 checks
  the garage map, proximity to event59, and the one-time trunk flag601.
- The first Metal Detector uses the Landlord route; Comatus and the three
  fungus rescues use Fungus Tunnels. Darryl uses Basement West. The Spider Husk
  uses Floor1, Jasper's Key and the cafe on Ground Floor. Screamatorium is at home.

## Generation evidence

`tools/verify_seed_spheres.py` reads real generated spoiler placements and
collects only reachable checks before delivering each sphere's items. It checks
pool quantities, all checks, and filler-only exclusions without using Victory
or ending release. Seed169 reaches all 273 checks in 13 spheres. Two-player
seed171 reaches all 546 checks in 17 spheres, with 266 cross-player items and
18 excluded locations containing filler. Earlier seeds155–168 also passed.

The native Day15 fallback makes AP's completion event reachable without an
AP item. Consequently goal-only generation success is insufficient evidence;
the independent all-location sphere check remains required. It does not model
the native calendar order or replace a complete interactive playthrough.
