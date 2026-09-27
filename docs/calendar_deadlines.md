# Chronological progression safety

Logic **`chronological_access_v1`**, registry **74**, Normal build **74642914**.
Calendar events exist only in generation. The runtime plugin, numeric IDs,
item pool, save schema, quest dates and manual advancement are unchanged.
Regenerate seeds to apply the rules; existing placements do not change.

## What the model means

1. **Ordinary access:** keys, item counts, distinct disc allocations and routes.
2. **Fixed dates:** a region cannot supply items before its native opening.
3. **Hard deadlines:** actions must be available before crossing the last safe
   day boundary, including all their indirect item dependencies.
4. **Latest starts:** reserve enough real transitions for multi-day quests.
5. **Player-caused misses:** players can advance, refuse, delay or miss a visitor.
   Availability is constrained by the audited rules; player behavior is not modeled.
6. **Ending release:** host-supported release rescues missed checks. Generation
   must not intentionally depend on release for inherently late prerequisites.

AP does not simulate the actual runtime clock. Synthetic day/action events are
monotonic generation abstractions: addressless locations with locked, code-less
progression items. They contain no randomized rewards and produce no client
checks or save data. There are still **273 randomized checks and item copies**.
Cross-player dependencies participate in the same normal AP solver.

## Exact event catalog

The native game starts on Day0. For N from **1 through 15**, `Begin Day N` holds
`Day N` in Apartment33. N>1 requires `Day N-1`; Day1 is initially free.

| Action location | Locked event item | Region and requirement | Required before |
| --- | --- | --- | --- |
| Open Original Teeth Safe | Original Teeth Safe Accessible | Original Teeth Apartment; nine Simple Keys (3) bundles | Begin Day5 |
| Deliver Charan's Rose | Charan Rose Delivered | Charan's Pit; Rose | Begin Day6 |
| Start Leigh's Phone Quest | Leigh Quest Started | Apartment33; Phone and Floor2 access | Begin Day11 |
| Finish Wilhelmina's Crossword | Wilhelmina Crossword Solved | Apartment33; Apartment21 access | Begin Day15 |

There are **15 day events + 4 timed-action events**. The existing `Any Ending`
event holds `Victory`, now logically requiring Day15 to prove the safe fallback
route even under minimal accessibility. **Runtime victory still accepts every
real ending on any day.** No action is required by the Advance Day menu.

## Fixed-date entrance audit

All page/command indices below are zero based.

| Region | Earliest opening | Native evidence |
| --- | --- | --- |
| Original Teeth Apartment | Day1 | Map006 e7 p1 ->031; p2/3 retain entry on Days3/4. |
| Apartment31 | Day2 | Map006 e2 p1; lighting selects108 or265, both retaining the interior route. |
| Apartment32 / Kaeley | **Day3**, fallback Day4 | Map006 e83 and doorway branches set904=1 from Day3; e33 p1 sets2, p2 enters353. p3 is the Day4 fallback. Foyer355 precedes the maze locks. |
| Taxidermy Apartment | Day4 | Map006 e8 p1 ->270. No earlier external entry was found. |
| Late Teeth Apartment | **Day8 after06:00**, fallback Day9 | Map006 e29 c40-44 clears1062 at Day8/hour>=6/proximity; e7 p7 sets selfB, p9 enters435. p10 is the Day9 fallback. |

The old Day4 Kaeley and Day9 teeth comments omitted earlier paths. Native
interpreter/page-selection tests confirm both corrections. Clint, Joel,
Benjamin and Madison keep their audited original-room resolution alternatives;
their checks are not forced behind the Day8 forms.

## Charan: Rose by Day5, cave on Day6

Map086 e77 reaches272; e7 enters339 while1097 is off and399 after it is on.
Troop590 c233 offers the gift quest through Day5; c309 consumes Rose360 and
c310 sets680. CE213 sets sword availability1064 after that encounter.
CE6 c616-619 sets677 only on the next real new day. CE213 then opens400 ->401
for the second check.

CE5 c334-337 tests Day>=7/hour>=10, but map events close the route earlier:
Map006 e87 and Map086 e105 set1097 from Day7 with **no hour condition**.
Stair/basement maps have additional Day7 quake triggers. The safe complete
route therefore delivers by Day5 and visits the cave on Day6. A Day6 Rose may
still give the sword, but cannot guarantee the cave on the following day.

The delivery event is in the Pit, reached without requiring its own gift.
The sword requires delivery. The cave requires delivery plus Day6, reserving
the wait after the latest valid start. Earlier native completion is still allowed.

## Leigh: Phone by Day10, four transitions, conversation by Day14

CE3 c356-360 consumes Phone389 and sets900=1 at home. Four separate CE6 runs
advance odd stages, with a player reading each new message in CE233:

| Transition | CE6 state | After reading |
| --- | --- | --- |
| 1 | 1 ->2, c629-632 | 3, CE233 c137 |
| 2 | 3 ->4, c635-638 | 5, CE233 c157 |
| 3 | 5 ->6, c641-644 | 7, CE233 c176 |
| 4 | 7 ->8, c647-651; requires recruited Leigh/switch34 | 9, CE233 c197 |

CE125 c0-3 exits on Day>=15. Before then, stage9 conversation c4-47 can set
900=20. With Leigh present, Map007 e4 p3 enters434 for the final ring check.
Day10 ->11/12/13/14 succeeds; Day11 ->12/13/14/15 fails.

Logic requires the start before Day11 and credits the reward on Day14. This
conservative reservation prevents Phone on Day10 -> immediate ring -> Rose
from evading Charan's earlier deadline. It reserves an actual four-day window;
native early completion remains possible and does not wait for a synthetic event.

## Other progression-order corrections

- **Original teeth safe:** Map006 e29 closes entry at Day4 noon near the doorway;
  e7 p6 closes from Day5 regardless. Map034 e24 uses CE184. Its existing global
  nine-bundle key budget must be available in Day4 for a prompt visit before
  noon. All eight original-only checks retain filler-only placement. A player
  already inside can keep collecting; this is not an assumed re-entry route.
- **Crossword:** Map009 e12 gives the vanilla book. Map003 e20 p0 c0-3 disables
  work on Day15. Repeated local hourly sessions before advancing past Day14
  finish491=100 and reveal493, including during the existing manual day hold.
  Only crossword access must precede Day15; Pluto Storage can be unlocked
  later. No code guessing or friendly kill is assumed.
- **Louis:** Day3 apartment access, victory setting904=4, a CE6 for halves,
  then another after their defeat for907-910. Four body drops require Day5,
  preventing them from supplying the original safe's Day4 key budget.
- **Masked Shadow:** conversations and CE6 alternate150 through1/2/3/4/5/6,
  requiring three transitions before the doorstep resolution. Charan's required
  basement route guarantees Floor2 by Day5 through either existing route.
  All three shared rewards are conservatively credited on Day8, including the
  earlier tongue. Relationship-dependent gifts and alternate terminals remain
  unchanged. This prevents the quest from providing a falsely early Rose.
- **Juicebox:** the first special visitor follows the three Day0 slots, so
  recruitment can start on Day1. CE6 increments213; Map002 e48 requires213>=2.
  Seven conversations with400 reset only by CE6 put the first possible card
  resolution on Day9. Actual visitor order may delay it further, so logic
  conservatively reserves this reward at Day15. It cannot supply Phone or any
  other prerequisite needed before a calendar boundary. Earlier native collection
  still works; Day15 is a solver reservation, not a claimed native opening date.

Hellen and Dan already reconcile invitation refusal, so their longer walkthrough
routes are not mandatory AP prerequisites. Pierre has defeat and later-resolution
paths. No new item requirements were added for these alternatives. Power loss is
driven by local progression/random checks rather than a fixed date: Basement Key,
the fuse box and elevator encounter retain access independent of their rewards.
Distinct-disc allocations and painter/astronomer milestones retain their rules.

## Verification and limits

`tools/audit_chronology.py` validates native command/page signatures, reports
source hashes, and runs the existing audit of every external entry to the original
teeth rooms. `tests/native_chronology_probe.js` runs **15 native scenarios**:
Phone starts0/3/10/11, Rose starts5/6, entrance selection and the Day14/15 crossword
cutoff. Original branch commands execute; presentation waits are skipped.

`tests/test_chronology.py` covers monotonicity, exact boundaries, direct/transitive
cycles, waited rewards, alternatives, strict validation and all273 checks. Disc
allocation and key-budget tests still pass. `run_ap_chronology_probe.py` verifies
**10 real AP CollectionState cases**, including all19 locked/addressless events.
Its project-local archive instrumentation is restored afterward and never ships.

AP0.6.7 seed172 reaches273/273 checks; two-player seed173 reaches546/546.
AP rejects forced direct and transitive late-Rose plandos. These tests use no
ending release. The earliest Day8 teeth opening remains late enough to form
the same invalid Rose cycle as the originally proposed Day9 fixture.

This targeted abstraction is not proof of a whole playthrough. Remaining native
verification includes visitor-order variation, especially Monty/Xaria arrival
and Juicebox's actual date, repeated shadow encounters, and travel/interaction
time near intraday cutoffs. Juicebox's Day15 reservation prevents the unresolved
visitor variation from supplying a pre-deadline input, but does not prove every
native visitor schedule. These cases require chronological playtesting
before claiming every seed/runtime combination is verified. No synthetic event
is sent to the game to repair lateness.

## Player presentation remains unchanged

Archipelago Status lists tracked unchecked deadlines and says the list is
incomplete. The Day3->4 warning describes the original apartment's noon closure;
later warnings say access may be lost because a player still inside can finish.
Advance Day remains available, with Keep exploring the default. Any real ending
requests remaining-check release when the server permits it. See `ending_release.md`.

## Files changed for this implementation

- APWorld: `apworld/lookoutside/access.py`, `access_data.py`, `chronology.py`,
  `__init__.py`, `archipelago.json`, and `docs/setup_en.md`, `docs/en_Look Outside.md`
  within that APWorld directory.
- Tests: `tests/test_access_logic.py`, `tests/test_chronology.py`,
  `tests/ap_chronology_probe.py`, `tests/native_chronology_probe.js`, and
  `tests/fixtures_chronology/{late_rose,transitive_rose}/player.yaml`.
- Tools: `tools/audit_access.py`, `tools/audit_chronology.py`,
  `tools/run_ap_chronology_probe.py`, `tools/probe_staged_game.js`,
  `tools/verify_seed_spheres.py`, `tools/sync_setup_guide.py`, `tools/build_package.py`.
- Documentation: `README.md`, `docs/access_logic.md`, `docs/calendar_deadlines.md`,
  `docs/current_status.md`, `docs/ending_release.md`, `docs/playtest.md`.

`vertical_slice.json` and `game_plugin/LookOutsideArchipelago.js` were reviewed
and remain byte-for-byte unchanged. Installed game and AP directories were read only.
