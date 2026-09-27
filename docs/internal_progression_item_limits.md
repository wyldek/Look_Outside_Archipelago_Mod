# Internal reference: progression item limitations

**Implementation snapshot:** registry **74**, `chronological_access_v1`, Normal
game build **74642914**, APWorld `0.0.2`. This describes current behavior and its
limits, not proposed requirements. Update it when the registry, routes, calendar
events, native transformations, or item classifications change.

The default randomized pool has **64 distinct progression item names and 81
progression copies**. Every one has a row below, including the **ten without a
direct access predicate**. The other 192 copies are useful/filler. The solver's
19 calendar events and separate Victory event are not randomized pool items.

## Source of truth and reading conventions

- [vertical_slice.json](../apworld/lookoutside/vertical_slice.json): exact names,
  quantities, delivery amounts, classification, IDs, and intercepted sources.
- [access_data.py](../apworld/lookoutside/access_data.py): actual region/check
  dependencies, alternatives, key budgets, and source evidence.
- [chronology.py](../apworld/lookoutside/chronology.py): day/action events and
  conservative completion reservations.
- [disc_rules.py](../apworld/lookoutside/disc_rules.py): distinct-disc allocations
  and irreversible Void conversion assumptions.
- [calendar audit](calendar_deadlines.md), [route audit](access_logic.md), and
  [power hooks](power_progression.md): native evidence and verification limits.

**AP copies** count receipts, not necessarily native objects: one Simple Keys (3)
receipt gives three keys and one Black Keys (2) receipt gives two. All other rows
have a one-to-one delivery unless they are virtual switches.

**Route dependent** means there is no dedicated latest day for that item. Its
placement still obeys the entire dependency graph. If its route is needed to
obtain Rose, Phone, early key bundles, or the crossword book, the corresponding
deadline propagates through that chain. Alternative routes can avoid a particular
item. This is not a static list of items that must always arrive early.

**No direct rule** means no entrance, location, or calendar action directly tests
ownership of the item. It remains flagged progression in the registry, but that
flag alone does not protect the timing of its native use. These rows explicitly
identify classification/model mismatches; this documentation does not change them.

Location labels and graph regions sometimes differ. For example, original teeth
locations use Apartment 32 labels; graph `Apartment 32` instead names the later
Kaeley/Pierre/Louis area. Use registry keys and native evidence for code changes.

## Limits shared by every progression item

1. **Access only.** No attack, defense, levels, weapon tiers, or combat-party
   thresholds. Native fights and quest interactions still have to be completed.
   A quest use of equipment, such as the Lucky Cowboy Hat, is an access predicate.
2. **Local supplies assumed.** Herbicide, salt/ice-melting supplies, rent money,
   and other vanilla supplies are assumed obtainable. The solver neither budgets
   them nor proves a fixed source. Randomized finite keys have explicit budgets.
3. **Monotone collection history.** Rules count AP receipts, not current game
   inventory. Native consumption, hand-ins, and transformations still happen.
   Audited key budgets and disc allocations compensate for specific uses; there
   is no general simulation of all inventory spending or quest-state histories.
4. **Source and reward are independent.** Checking an item's original source
   need not give that item. Receiving an item does not check its original source.
   Quest groups reconcile checks, not native inventories or all story outcomes.
5. **Availability, not forced behavior.** Calendar events constrain generation.
   They never prevent the player from advancing, force a hand-in, deliver items
   over an offline connection, or repair a missed native quest. Other players
   may need time to send an item before the local player advances.
6. **Nine excluded checks.** No progression/useful items go in the eight
   original-only teeth checks or Pierre's Old Mail Visit. This is not a blanket
   exclusion of every timed quest.
7. **Conservative timing.** A reward may be available earlier in actual play
   than its reserved logical date. Conversely, unmodeled visitor variation or
   player delay can make an actual route later. Full chronological playtesting
   remains required; logical reachability is not proof of every native schedule.
8. **Ending release is recovery.** Any real ending on any day reports the goal;
   host-permitted release sends remaining items from this world. It does not
   supply a logically valid route for a late prerequisite. Generation proves
   the Day 15 fallback even when minimal accessibility is used.

## Calendar boundaries that propagate into item placement

The native game starts on Day 0. The solver uses Day 1 through Day 15 plus four
actions; the runtime retains normal dates and real new-day waits.

| Boundary | Required availability | What this does not prove |
| --- | --- | --- |
| Before logical Day 5 | Original Teeth Apartment and **nine** Simple Keys (3) receipts, for the original safe | The gate models a prompt Day 4 visit. It does not simulate travel to beat the **noon** closure. All eight original-only rewards stay filler. |
| Before logical Day 6 | Rose and Charan's Pit route, with delivery by Day 5 | Cave access is credited on Day 6 after one real transition. Day 7 map triggers close the route; assuming the hourly 10 a.m. quake is the earliest closure is unsafe. |
| Before logical Day 11 | Phone and Floor 2 access, with the home quest started by Day 10 | Four real transitions, message reading, Leigh recruitment, and the final conversation are still native actions. The conversation must happen by Day 14; Day 15 is too late. |
| Before logical Day 15 | Apartment 21 access for the vanilla book and completing the home crossword by Day 14 | Only the crossword must be early. Pluto/power/tomb access may follow. Hourly crossword work is possible during the manual hold, but Day 15 disables the interaction. |

Fixed openings: original teeth Day 1; Apartment 31 Day 2; Kaeley's apartment
Day 3; taxidermy Day 4; late teeth Day 8 after 06:00. Waited rewards are reserved
at Day 5 for Louis, Day 6 for Charan's cave, Day 8 for Shadow's shared rewards,
Day 14 for Leigh, and Day 15 for Juicebox's card trick. The last two dates are
conservative scheduling reservations, not a claim that native rewards always
first become available on those dates.

For example, Rose at a late teeth check is a cycle: reaching that date requires
the earlier Rose action. Rose at an early studio check with Painter's Key in
late teeth is the same cycle transitively. AP must reject both. Crediting the
Leigh reward immediately upon receiving Phone would incorrectly allow another
late-input chain; its Day 14 reservation prevents that.

## Building routes and ordinary locks — 7 item types

| Progression item | AP copies | Actual logical use | Progression limitations |
| --- | ---: | --- | --- |
| `Padlock Key` | 1 | Floor 3 to Stairwell, then Floor 2; Stairwell is one route to Basement East and the powered ground-floor disc door. | Route dependent. Does **not** alone unlock Floor 1 from the stairs. Apartment 21 reaches Floor 1 from Floor 2; the powered elevator is another route. Reaching Floor 1 also opens the stairwell from that side without this key. |
| `Apt. 21 Key` | 1 | Floor 2 to Apartment 21; its side route reaches Floor 1, and its book enables Wilhelmina's crossword. Apartment 21 also supplies the repeatable local photo route for astronomer offerings. | Apartment 21 access must be available by **Day 14** for the crossword. The key can be needed earlier through other chains. Bedroom herbicide is assumed local. The vanilla book is neither an AP item nor another check. |
| `Basement Key` | 1 | Stairwell to Basement East; independently required for **Dan Resolution - NeoDuo** on Floor 2. | Route dependent, notably a possible route to Charan by Day 5. Powered elevator access to Basement West bypasses this key for basement exploration, but does not remove Dan's explicit key predicate. The boiler maze route requires no restoration item on Normal. |
| `Store Key` | 1 | Ground Floor to Corner Store Storage and its inner room. | Route dependent. The inner safe separately requires the ordinary-lock budget. Owning the key does not provide Ground Floor access or guarantee shop supplies. |
| `Janitor Key Ring` | 1 | Floor 3 and Floor 2 janitor closets; Ground Janitor Room and Ground Janitor Closet. | Route dependent. Each closet still needs its floor/lobby route. The same ring is reusable; no multiple-ring requirement. Obtaining the original ring check needs Basement West and Ground Floor access. |
| `Simple Keys (3)` | 10 | Nine receipts for every modeled ordinary lock: locked rooms/storage, safes, and Kaeley's maze. Nine also enable Original Teeth Safe Accessible. | **At least nine bundles by Day 4**, for a pre-noon safe visit. The tenth has no dedicated deadline. Ten receipts deliver 30 native keys for 26 spends; nine deliver 27, sufficient in any order including vanilla-only locks and maze wrong turns. Early individual keys work in-game. Purchases, random keys, and breakable lockpicks are not credited toward this AP budget. A bundle queues until three keys fit. |
| `Electronic Key` | 1 | **Garage Car Trunk - Shotgun**, after reaching Basement West. | Route dependent. Native use still requires the garage, proximity to the correct trunk, and its unconsumed state. The 12 shells remain vanilla. Receiving the Shotgun does not open/check the trunk; this key has no broader basement gate. |

## Painter and other physical quest routes — 8 item types

| Progression item | AP copies | Actual logical use | Progression limitations |
| --- | ---: | --- | --- |
| `Painter's Key` | 1 | Painter Front Room to Painter Interior, including portrait and bag sources. | Route dependent. The introductory key check and front-room Machete precede the internal lock. The Stained Key is separately needed for final portraits; this key does not finish the quest or supply a Canvas Carry Bag. |
| `Stained Key` | 1 | **Frederic Resolution - Paint Palette** and **Bright Frederic Resolution - Medic-in-a-jar**, through Painter Interior. | Route dependent. Logic preserves the peaceful final-portrait route, including the last key room. Earlier hostile terminal resolutions may work in-game but are not used to make all painter rewards free in logic. |
| `Cowboy Hat (Lucky)` | 1 | **Green Portrait - Stained Key**, through Painter Interior. | Route dependent. This is armor ID 186, distinct from other Cowboy Hat items. Native transformed armor 187 is accepted by the quest route. The hat is a quest object requirement, not a combat-stat check; native hat transformations remain local. |
| `Stationery` | 1 | **Rafta - Love Letter**, on Floor 1, together with Fountain Pen. | Route dependent. Both inputs must be received; native hand-ins still happen. Completing the check does not immediately grant Love Letter. No deadline for delivering the resulting letter is modeled. |
| `Fountain Pen` | 1 | **Rafta - Love Letter**, on Floor 1, together with Stationery. | Route dependent. Neither input substitutes for the other. AP retains receipt history after native hand-in; the quest's original consumption remains. |
| `Shrunken Head` | 1 | Taxidermy Apartment to Flesh Taxidermy Apartment, then the northeast-room return route. | Route dependent. The outer apartment opens on Day 4; the passage consumes the head and opens permanently. Local switch 694 and return travel still occur. Its northeast safe also needs nine Simple Key bundles. This route is separate from the Iris-gated central/outer flesh networks. |
| `Jasper's Key` | 1 | Floor 1 to Jasper Apartment/Planetarium; also **Spider Husk Resolution - Beating Heart** with Cafe access. | Route dependent. Local herbicide and the native planetarium combination remain required gameplay, with no AP supply/code item. This key does not satisfy the astrolabe, telescope-room door, or red padlock. The Spider Husk retains its native interaction/hour waits. |
| `Apt. 35 Key` | 1 | Both **Sybil Resolution** checks, together with Telescope Pieces and Ground Lobby access. | Route dependent. Logic uses the peaceful telescope route. Simply entering Sybil's apartment does not resolve the group; her closet Iris pickup alone also does not resolve it. The Oracle route remains a native alternative. |

## Sea and flesh routes — 5 item types

| Progression item | AP copies | Actual logical use | Progression limitations |
| --- | ---: | --- | --- |
| `Twilight Valve` | 1 | Sea Apartment Entrance to Sea Apartment West. | Route dependent. One native consumed lock (Map125 event7); no additional Twilight copy is needed. Floor 2 reaches the sea entrance without a valve or Rebreather predicate. |
| `Midnight Valve` | 1 | Sea Apartment Entrance to Sea Apartment East. | Route dependent. One playable consumed lock (Map140 event6). The disconnected old underwater map clusters are outside the AP graph/budget. |
| `Abyssal Valve` | 1 | Sea Apartment Entrance to Sea Apartment Lower. | Route dependent. One consumed lock (Map125 event13) plus native local story progression. Does not replace Hadal Valve for the depths. |
| `Hadal Valve` | 1 | Sea Apartment Lower to Sea Apartment Depths, including Lethargy. | Route dependent. Requires the Abyssal route first; one consumed lock (Map152 event1). Oxygen management and combat are left to the player. |
| `Iris Key` | 7 | Six receipts for any reviewed entrance to Flesh Central or Flesh Outer. | Route dependent. Six keys cover all six spends, including the optional Eye interaction; the seventh is surplus. Eye/garage entrances reach the central network, reception/deep-sea entrances the outer network. One-way doors keep these components distinct. Flesh Home does not grant all deeper checks. Actual entrances can be opened one key at a time. |

## Disc puzzles — 11 item types

All powered doors require **Power Restored** in logic, even though starting
electricity can permit earlier native access. Allocation rules require separate
physical discs at every simultaneously open door. The stair route to the office
or mailroom reserves the Ground Floor pair as well; the elevator bypasses that
reservation. Security Storage keeps four discs at the balance gate and two
different discs at its inner total-18 door.

| Puzzle | Modeled requirement |
| --- | --- |
| Ground Floor / Apartment 20 transformation route | Two discs totaling 3: Earth + Mars or Sun + Negative; power and the relevant stair route. Elevator alone does not advance the Apartment 20 transformation. |
| Abyss Apartment | Earth Disc and power, from Floor 1. |
| Office Front / Inner | Two discs totaling 29, then a distinct pair totaling 15; power and the parent route. |
| Mailroom Storage | Five distinct discs totaling 146, plus any stair-route reservation. |
| Security Lobby / Storage | Four discs forming equal pairs; inside, a distinct pair totaling 18. |
| Pluto Storage | Pluto Disc and power, from Basement East. |
| Astrolabe check | Power plus all nine discs Sun through Neptune, from Planetarium. |

The roles below are the ones actually referenced by the current allocation
rules. A listed numeric contribution does not mean that disc alone opens a door.
All eleven are **route dependent**; none has its own latest-day event.

| Progression item | AP copies | Value and modeled use | Progression limitations |
| --- | ---: | --- | --- |
| `Sun Disc` | 1 | 13; Ground Floor, office, mailroom, security, Apartment 20 Late, astrolabe. | Ground total 3 uses Sun with Negative as an alternative to Earth + Mars. That route additionally needs Void conversion access. Cannot also occupy a downstream door. |
| `Mercury Disc` | 1 | 0; required by the astrolabe. | No current entrance rule directly needs it. Equal numeric value does not make it interchangeable with Venus at the astrolabe's identity-specific sockets. |
| `Venus Disc` | 1 | 0; required by the astrolabe. | No current entrance rule directly needs it. Does not substitute for Mercury in the nine-disc identity check. |
| `Earth Disc` | 1 | 1; Abyss Apartment, Ground Floor, office, Security Lobby, Apartment 20 Late, astrolabe. | Abyss has an explicit Earth requirement. Earth + Mars opens the ground gate, but those discs cannot then be counted at another door that must stay open simultaneously. |
| `Mars Disc` | 1 | 2; Ground Floor, office, mailroom, security, Apartment 20 Late, astrolabe. | Requires valid companion discs and power. Its vanilla source is in Abyss Apartment; its AP placement is independent of that original source. |
| `Jupiter Disc` | 1 | 95; mailroom allocations and astrolabe. | Not a universal high-value substitute; mailroom needs exactly five discs and the correct total. |
| `Saturn Disc` | 1 | 146; required by the astrolabe. | No current entrance predicate needs it, despite the mailroom's target also being 146: that door needs five occupied sockets. Its original source behind the mailroom is not a self-lock requirement. |
| `Uranus Disc` | 1 | 28; office, mailroom, security, astrolabe. | Different allocations may use it in different doors; no simultaneous reuse. The supported native source is the Normal cafe pickup. Hard's relocation is outside supported difficulty. |
| `Neptune Disc` | 1 | 16; Office Front, mailroom, security, astrolabe. | A component of exact-count/exact-total solutions, not general access by itself. Office Inner reachability also depends on having reached its front room. |
| `Pluto Disc` | 1 | 5; Pluto Storage, mailroom/security alternatives. | Not part of the nine-disc astrolabe. Tomb access additionally requires the completed crossword. The crossword must finish by Day 14, but Pluto can arrive later. |
| `Void Disc` | 1 | Modeled through Negative Disc, value -10, for Ground Floor, Office Front, mailroom, security, Apartment 20 Late. | Negative requires Apartment 31 access (opens Day 2) and the vanilla irreversible conversion. There is no randomized Negative Disc or conversion check. Logic never depends on retaining the original -1 form after conversion; all reviewed puzzles have solutions without that form. |

## Astronomer offerings — 9 item types

These items gate **Ritual Preparations - Roof Access Key** and
**Ritual Preparations - Dark Robes**, after reaching `Astronomers`. That region
requires Ground Lobby, Floor 2, Floor 1, Basement West, and Power Restored for the
reviewed conversation route. Jasper's introductory apartment-key check requires
the astronomer route but **no offerings**.

Four different categories are needed: photograph, tape, painting, manuscript.
The local photograph route is available through Apartment 21. Original native
transformations/hand-ins remain necessary where applicable. One Guinea Pig may
replace **one** missing category, never several. Multiple manuscripts do not
replace a missing painting. All nine rows are **route dependent**; the ritual
has no dedicated latest-start reservation in the current model.

| Progression item | AP copies | Actual logical use | Progression limitations |
| --- | ---: | --- | --- |
| `Guinea Pig` | 1 | Wildcard for one offering category. | Other three categories must be satisfied separately. The one physical pig cannot be offered to every astronomer in the solver. |
| `Blank VHS tape` | 1 | Tape category, alternative to Old Tape. | Native preparation and offering steps remain local. Receipt does not automatically perform the ritual or satisfy another category. |
| `Old Tape` | 1 | Tape category, alternative to Blank VHS tape. | One of the alternative tape inputs; having both tapes does not cover two categories. |
| `Canvas Carry Bag` | 1 | Painting category, alternative to Wrapped Painting. | AP delivery also enables native painting collection (switch 188). Checking Frederic's original bag source alone must not enable it. The bag does not open Painter's Key/Stained Key doors; local collection/transformation steps remain native. |
| `Wrapped Painting` | 1 | Painting category, alternative to Canvas Carry Bag. | Does not grant the bag's painting-collection switch or act as an apartment key. |
| `Crumpled Manuscript` | 1 | Manuscript category. | Interchangeable for this category with Clean Manuscript, Loose Manuscript, or Last Will; only one category credit in total. |
| `Clean Manuscript` | 1 | Manuscript category. | No additional modeled access beyond this alternative offering. Native object and hand-in behavior remain unchanged. |
| `Loose Manuscript` | 1 | Manuscript category. | Its original Typewrither quest reward is a separate check; AP receipt does not mark that encounter complete. |
| `Last Will` | 1 | Manuscript category. | Covers only the manuscript slot; other categories and the astronomer route remain required. |

## Other timed/transformable quest inputs — 4 item types

| Progression item | AP copies | Actual logical use | Progression limitations |
| --- | ---: | --- | --- |
| `Old Photograph` | 1 | Photograph offering category, alternative to the repeatable local photo route via Apartment 21. | Route dependent. Same astronomer/category constraints as above. Does not substitute for the Apartment 21 crossword book or remove its Day 14 requirement. |
| `Rose` | 1 | Charan Rose Delivered, then the sword check and cave route. | **Deliver by Day 5** with Charan's Pit accessible; cave credited Day 6. Native consumption and one real new-day wait remain. A Day 6 start cannot guarantee the cave before Day 7 closure. Shadow's original Rose reward is reserved Day 8 in logic, so the randomized Rose must come through a different reachable chain. |
| `Phone` | 1 | Leigh Quest Started at home, with Floor 2 access; Leigh's ring requires that action and Day 14. | **Start by Day 10**, then four real new days with messages read; recruit Leigh for the last transition and finish the conversation by Day 14. Starting on Day 11 reaches the conversation cutoff too late. Receipt itself does not run those stages. No post-Day-15 cycles are supplied. |
| `Telescope Pieces` | 1 | Both Sybil Resolution checks with Apt. 35 Key and Ground Lobby access. | Route dependent. Bring the pieces to Jasper for vanilla repair and give the resulting Telescope to Sybil. Repair output/consumption are vanilla and add no AP check. Pieces do not open Planetarium Door Access or solve its astrolabe; their original source is behind the separate door item. |

## Unlabeled Game — 7 item types

The graph conservatively groups this entire game behind its complete colored-key
budget. It does not credit an early internal check before collecting that budget.
Use the flesh bedroom TV via Apartment 31/Flesh Home; the ordinary home TV is not
the modeled entrance. No Power Restored or Day 15 requirement is imposed there.
All seven rows are **route dependent**.

| Progression item | AP copies | Actual logical use | Progression limitations |
| --- | ---: | --- | --- |
| `Unlabeled Cartridge` | 1 | Flesh Home to Unlabeled Game, together with every color below. | Does not grant colored keys or waive native game interactions. Apartment 31 opens Day 2; an early cartridge does not bypass its route. |
| `green key` | 1 | One required green lock spend in the full budget. | All colored supplies and Cartridge required before any internal AP check is logically reachable. |
| `red key` | 1 | One required red lock spend in the full budget. | Distinct from Small Red Key; cannot substitute for it or another color. |
| `yellow key` | 3 | Three required yellow lock spends. | All three AP copies are counted. A single yellow key is not reusable at all three locks. |
| `blue key` | 1 | One required blue lock spend in the full budget. | Native spending opens that lock permanently; no replacement receipt is generated. |
| `white key` | 1 | One required white lock spend in the full budget. | Does not provide any other color; full-budget entrance is intentionally conservative. |
| `Black Keys (2)` | 1 | One receipt provides both black lock spends. | Delivers two native black keys, for independent Map440 event7 and Map445 event2 locks. Opening one does not open the other. The bundle waits until both objects fit. |

## Virtual access items — 3 item types

| Progression item | AP copies | Actual logical use | Progression limitations |
| --- | ---: | --- | --- |
| `Elevator Access` | 1 | Floor 3 to Elevator **with Power Restored**, then other floors, Basement West, and the secret Floor 4 sequence. | Route dependent; may enable early deadline routes as an alternative to stairs/keys. Sets switch 115, but does not restore electricity. The native Floor 4 button sequence and local metro ticket remain gameplay; there is no AP ticket requirement. The original elevator encounter check is reachable from Basement West without receiving this item. |
| `Planetarium Door Access` | 1 | Planetarium to Planetarium Telescope Room. | Route dependent. Sets switch 699 permanently. Does not require solving the astrolabe after receipt; the astrolabe **check** independently requires power and all nine Sun-through-Neptune discs. Parent access still requires Jasper's Key/Floor 1. |
| `Power Restored` | 1 | Powered elevator/disc routes, Astronomers, Apartment 20 Late, and astrolabe check. | Route dependent; no fixed outage day. Native starting electricity and outage run normally. Early receipt waits for actual loss, then restores with explicit feedback. Logic requires permanent restoration even when native starting power could suffice. Receipt neither checks the fuse box nor grants Elevator Access/discs. Basement/fuse-box access has a nonpowered route. |

## Progression-classified items with no direct rule — 10 item types

Each item below still contributes to the 64-name/81-copy progression pool and
cannot be placed in the nine excluded locations. None directly gates a current
AP entrance, check, calendar event, or the generic ending proof. There is **no
item-specific deadline guarantee** for its native use. Do not infer otherwise
from its classification or the word "Key" in its name.

| Progression item | AP copies | Native role / current modeling decision | Progression limitations |
| --- | ---: | --- | --- |
| `Apt. 33 Key` | 1 | Home apartment key; Menu to Apartment 33 is free in the graph. | No modeled home-entry gate, ending prerequisite, or timed protection. Receipt is not needed to start in or logically return to the home region. |
| `Child Barrier Key` | 1 | Native child-safety barrier in the rat apartment (Map100 event1). Reviewed Rat Apartment pickups use routes without this barrier. | No direct rule. The solver does not guarantee the barrier can be opened before a date or require it for those checks. |
| `Door Knob` | 1 | Native Map031 event4 inserts/consumes the knob to repair a door; registered teeth pickups have an audited side route. | No direct rule and **no guaranteed arrival before the Day 4 closure**. Joel's group checks Door Knob/Toothy Whip independently of receiving the knob. The safe is protected by its own key-budget event, not this item. |
| `Roof Access Key` | 1 | Native stairwell roof door (Map028 event7), leading toward roof ending routes. | No modeled roof-ending requirement or deadline. Runtime roof endings still work, but generation proves the generic Day 15 ending instead. Obtaining the ritual check does not supply this key until AP delivers it. |
| `Love Letter` | 1 | Native letter addressed to Nestor; Troop40 accepts/consumes it. | No direct rule protecting delivery to Nestor. The upstream Rafta check requires Stationery + Fountain Pen; receiving Love Letter is not a substitute for checking that source. |
| `Clown Drawing` | 1 | Retained native quest/collectible item; registered rewards can supply the same item type. | No current ownership predicate or deadline reservation. Its progression flag does not establish an additional modeled route or quest use. |
| `Vending Machine Key` | 1 | Retained native vending-machine key from Mutt's registered resolution. | No modeled vending-machine check or supply guarantee. Local supplies remain the assumed vanilla economy. Resolving Mutt and receiving this item are independent. |
| `Laundry` | 1 | Native Jeanne hand-in, including its local money reward. | No direct rule. Apartment 20 Early pickups precede hand-in; the later apartment transformation instead requires the stairwell/power/disc route. Laundry delivery does not logically open Apartment 22. No schedule protection for the hand-in itself. |
| `Small Red Key` | 1 | Native red padlock at Map345 event30. | No modeled AP check behind that padlock. It is separate from Planetarium Door Access, the telescope-room check, and the Unlabeled Game's red key. No guaranteed date for this native route. |
| `Rebreather` | 1 | Extends native time before drowning (CE97/99 and sea transitions). | No oxygen/capability predicate. Sea checks are considered reachable without it once routes/valves are satisfied. The player handles oxygen management; the progression flag does not guarantee receipt before underwater exploration. |

## Maintenance and remaining verification

The table groups contain **7 + 8 + 5 + 11 + 9 + 4 + 7 + 3 + 10 = 64** item types.
Extra copies are nine additional Simple Key bundles, six additional Iris Keys,
and two additional yellow keys: **64 + 9 + 6 + 2 = 81** progression receipts.

For changes, compare every registry `classification: progression` name with the
rows above and inspect item atoms in entrances, checks, and calendar actions.
Keep the ten no-direct-rule rows explicit until implementation changes justify
moving or reclassifying them. Original source locations are not automatic
dependencies of the corresponding received item.

Current evidence includes complete access validation, finite-key/disc regressions,
77 chronology source signatures, 15 native chronology scenarios, 10 actual AP
CollectionState cases, and single/two-player sphere verification without release.
Forced direct/transitive late-Rose plandos are rejected. See
[current status](current_status.md) for test counts and seed artifacts.

Still outstanding: a complete randomized Normal run, visitor-order variation
(including Monty/Xaria and Juicebox), repeated Shadow encounters, and travel or
interaction time around intraday cutoffs. Juicebox's Day 15 reservation keeps its
check out of pre-deadline input chains but does not prove every visitor schedule.
The ten progression flags without direct predicates also do not promise access
to every native side activity or optional ending. These limits must remain
visible when describing seed solvability.
