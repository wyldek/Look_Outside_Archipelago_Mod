# Initial game-data audit

**Current checkpoint:** registry 74, 273 checks/items, 35 quest groups, and
all access rules active in the generator. See [current status](current_status.md)
for seed169/171 evidence, reconciled source reports, and remaining release gates.
The numbered batches below are historical evidence.

The extractor reads the installed game and writes its detailed output to the
ignored `build/game_audit/` directory. The installed game remains read-only.

## Audited build

- `System.versionId`: `74642914`
- `System.advanced.gameId`: `51778622`
- Data and plugin-list fingerprint: `34b98050ed77f2204adcfbe3ed2e074833f6e1fe3fc83968e748db03df69b278`

The fingerprint is a guard for this audit, not a claim that the mod supports the
build yet. Re-run `tools/audit_game.py` after a game update.

## Historical checkpoint before graph integration

At this earlier checkpoint: **264 checks and item copies**, registry version
62 (158 equipment, 103 physical items, Elevator Access, Planetarium Door Access,
and Power Restored), targeting Normal.
Native probes cover the current registry. Live seed154 covered the 264-check
checkpoint, with server-confirmed goal completion on Day 7.
There are 41 passing Node tests and 26 Python tests. The new access model
covers 206 locations; integration into the generator is pending the rest of the
graph. Eight teeth-apartment deadlines now have filler-only placement and menu
warnings; seed154 verified all nine excluded placements contain filler.
Eight fixed Simple Key pickups and two approved drops now contribute ten
progression bundles of three keys, guaranteeing 30 keys for all 26 ordinary
locks. Nestor's later body forms resolve the same check. Purchases
and random loot stay vanilla. The addition passes 86 native scenarios, and
seed154 generated 264 locations with ten bundles. See `simple_keys.md`.
The black-key bundle covers both independent doors. Two disconnected sea-valve
rooms and their item copies were removed; four playable valves remain. Three
native spending orders cover the other 19 key spends with save/load and replay.
See `finite_key_budgets.md`. Juicebox's card-trick refusal now resolves the same
check as acceptance; 24 native scenarios verify it.
Registry62 removes the Hard-only Map372 Pool Cue and marks Unlabeled Cartridge
as progression. Six native geometry scenarios and fourteen door scenarios
verify flesh-map wrapping, disconnected sections, and seven one-way locks.
See `flesh_route_audit.md`. Quest timing remains vanilla, including new-day waits
and Day15 dialogue cutoffs. The generic Day15 ending provides goal completion
and release of unfinished checks. Fresh seed154 server sessions verified all
264 checks released from zero, both online and after an offline ending/save
reload, with automatic collect disabled. A third session with release disabled
kept all checks unreported and displayed the host restriction. The native
calendar probe covers ten door outcomes, three guards, four clock cases, two
Leigh cutoff cases, and the generic ending with unfinished quests. See
`ending_release.md`. Region logic is still inactive in the development APWorld.
See `access_logic.md` and `calendar_deadlines.md`. Region logic and the
complete acquisition audit remain unfinished. See `acquisition_review_queue.md`
for current leads; counts in the history below describe individual audit batches.

Recent evidence: the green portrait's six-part kill counter feeds one shared
Stained Key reward across 30 map pages. Its hat agreement is a separate route
to that check; kills after the agreement stay vanilla. The Lucky Cowboy Hat is
a progression input, and both native hat transformations remain intact.
Fake Frederic's states 60/70 follow an optional Attack choice. His bag is now an
alternate quest reward; Torn-Off Face stays vanilla. The entire Gauntlet is excluded.

Baby Teeth, Suture Wire, and First Head now contribute three equipment checks.
Their evidence covers a one-time trigger and cleared battle switch, a native
enemy transformation, and an entrance redirected after victory, respectively.
Angel of Death's appearance and the random Fridge encounter are Hard-only.
Pierre's mail visit and Tickle's final drawing are registered; Pierre is
missable and uses AP's EXCLUDED placement type. Seed 145 put Elegant Suit (filler) there.
Accepting, refusing, and leaving that visit now all complete its check.
Joel's Door Knob and Toothy Whip are one resolution group across peaceful and
hostile outcomes; 51 native scenarios verify the group. See `quest_resolution_policy.md`.

Power restoration is now separate from the fuse-box check. Initial power and
the native outage remain intact; an early AP item restores it just after the
outage effects, with an explicit loss/restoration notice. Twelve native
scenarios cover delivery order, serialized saves, consumed-page independence,
dialogue queuing, replay, and source/build guards. See `power_progression.md`.

- 2,671 direct item/weapon/armor reward commands in map, common, and troop
  events. Of these, 2,286 are gain commands.
- 1,260 positive fixed-gain commands appear to grant non-consumable database
  entries or equipment. This is **not** the AP location count. The same event
  may contain mutually exclusive branches, repeated rewards, or developer
  cheats, and the database `consumable` flag does not distinguish all gameplay
  consumables from permanent items.
- 233 of those apparent persistent map-event grants are on pages gated by the
  game's `CHEATMODE` switch, so they should not enter the normal acquisition
  pool.
- 88 equipment rewards match a conservative one-time pickup pattern: one direct
  reward command, a self-switch set, a later consumed page, and no conditional branch,
  variable, common-event, or script command on the reward page. Some still have
  a normal Take/Leave choice. All 88 use the action-button event trigger. These are a
  useful queue for an interception proof of concept, not confirmed AP checks.
- 97 item rewards match the same conservative one-time source pattern and are
  queued in `item_review.csv`. They span 43 database items: 28 non-consumable
  key-item entries, two key-item entries marked consumable in the database,
  and 67 non-consumable normal-item entries. The latter include crafting
  materials such as Junk and Duct Tape, so database flags alone cannot decide
  whether they belong in the AP pool. Eighty-nine are action-button events and
  eight are player-touch events. Three earlier candidates were removed after
  checking RPG Maker page precedence: the apparent Old Rusty Key pickup on
  Map 089, Jupiter Disc pickup on Map 071, and Sun Disc pickup on Map 181 all
  have a later unconditional blank page that makes their reward page
  unreachable. The actual Sun Disc (Map 071 event 022) and Jupiter Disc
  (Map 181 event 003) pickups contain a conditional actor dialogue branch,
  so they remain in the broader grant inventory for separate review.
  Across the full map reward inventory, seven gain commands are permanently
  shadowed this way; `shadowed_reward_commands.json` lists them.
- The original scope decision kept crafting materials and consumables vanilla.
  At that checkpoint, `tools/review_equipment.py` proposed `keep_vanilla` for 54 of those 97
  candidate item sources (10 database items): Wrapped Gift, Ammo Crate,
  Detonator, Reagent, Enzyme, Catalyst, Duct Tape, Junk, Simple Key, and
  Potting Soil. The generated sheet records a reason for each exclusion.
  Wrapped Gift, Ammo Crate, and Duct Tape are usable through common events
  despite their database `consumable: false` flags. Detonator is a crafting
  component despite being a key-item entry. Simple Keys break on use; the later
  explicit decision adds their fixed pickups and drops (see above). This
  exclusion list is deliberately ID-specific and applies only to the audited
  build; it does not silently exclude every normal item or every item with a
  `consumable: true` flag.
- The other 43 simple item sources (33 database items) are active development
  locations after source review. They include one-use progression keys, quest
  objects, collectibles, and colored puzzle keys. Some pickup notices run before
  the reward and others after it. The eight silent colored-key events now receive
  an AP check notice from the plugin.
- `tools/draft_registry.py` assigns provisional stable IDs and exact command
  signatures to the 88 equipment and 43 included simple item sources, plus ten
  manually reviewed sources in `tools/manual_source_candidates.json` (the actual
  Sun/Jupiter Disc pickups, seven equipment pickups with optional actor dialogue,
  and a spare Apartment 33 Key). Its ignored `build/game_audit/draft_registry.json`
  has 141 source proposals and 141 corresponding item copies. Nineteen proposals
  lack nearby Show Text with the exact database item name; exact aliases and
  silent-source notices are handled in the active registry. The draft itself is
  **not loaded** by the client or APWorld. All 141 are now active; the Straitjacket
  check also resolves when its alternate Cheese Man pickup is taken, leaving that
  consumable vanilla. The active development locations include a
  separate Basement Key check shared across five alternate Landlord hub maps.
  Thirty-two further equipment checks come from manually reviewed complex
  events: fifteen branching pickups, eight quest-family rewards, and nine
  equipment rewards in eight locked safes. The two Pistol pages share a single
  check; the Shipping and Receiving safe contains two separate equipment checks.
  Safe cash, bullets, paid stock, lockpicks, and repeatable Simple Key grants remain vanilla.
  The two database entries named Cowboy Hat have distinct AP names: the lucky
  version (armor 186) is `Cowboy Hat (Lucky)` and still grants its original item.
  Mutt's free pickup pages were initially misclassified as fixed world pickups.
  Tracing Common Event 6 command 419 showed that variable 161's daily shop
  schedule unlocks those same pages. All eleven were removed, along with their
  item copies. Both free and paid cafe stock stay vanilla, and the validator
  now rejects either page type if it re-enters the registry.
- `tools/audit_item_uses.py` traces 92 candidate and registered database items through
  direct gains, losses, item conditions, item-gated event pages, and literal
  `$dataItems[id]` script references. It also records common-event item effects
  and possible selected-item variable comparisons (the latter require manual
  review). Forty-nine have a direct inventory condition. Raw gain counts can include CHEATMODE grants and dead event
  pages. For example, Sun Disc and Jupiter Disc each have five CHEATMODE
  grants, one unreachable removed pickup, and one real pickup with an actor
  dialogue branch. Such commands need event-level review before the full AP
  item count is chosen. The report is `build/game_audit/item_uses.json`.
- 366 shop entries and 685 enemy-drop entries were indexed separately. Shops
  remain vanilla by design. Enemy-drop denominator `1` means guaranteed in the
  database, but a guaranteed drop still needs an encounter-level audit before
  it can be treated as a one-time AP source.
- Six guaranteed key-item drop entries include `Eugene's Key` on two enemies,
  `Strange Key`, `Roof Access Key`, `Watch`, and `Cooking Book`. These need
  individual review; excluding every enemy drop would miss potential progression
  sources.
- `tools/review_complex_equipment.py` queues 94 additional fixed-value map
  equipment gain commands outside the simple pattern (22 weapons, 72 armor).
  Seventy are on pages with a single reward command and 48 have a later self-switch A
  page, but these properties do not certify one-time pickups. For example,
  Map 056 mixes free pickup and shop pages on the same events, while Map 019
  event 002 grants Studded Jacket, displays Bathrobe text, and does not set
  its consumed self-switch. The ignored `complex_equipment_review.csv` keeps
  these cases for source-by-source review.
  The refreshed queue identifies 60 active grant commands and 34 commands kept
  vanilla, with none left unclassified in this queue. Active grant commands
  exceed distinct checks when alternate pages share a source.
  Nine boss salvage equipment checks now complete whether Audrey is present or
  absent, as requested. The plugin hooks the end of each victory-only actor
  branch; escape and defeat paths skip that command. Six Fungus Fibers pages
  share one check, as do the two Jousting Lance and Rhinoceros Hide pages.
  The validator verifies the battle, branch nesting, defeated-state command,
  and consumed page (including the separate SWAT van event). The staged engine
  passed 96 branch scenarios; combat outcomes were simulated rather than played.
  Four further complex sources are the magician's Four of Spades, Rat King's
  Rusty Crown, Hellen's Stained Shears, and Ambrose's Pipe. The Rat King terminal
  reconciles either crown outcome. The card's variable guard is consumed before
  its grant, while the purchased snack stays vanilla. All sixteen consumables
  bundled with Ambrose's pipe also remain vanilla; the staged engine verified
  their quantities and the pipe's consumed event page.
  `tools/equipment_source_exclusions.py` records twelve additional exclusions:
  the Lumpy name-entry starting gear, two playtest grants, an unguarded repeatable
  jacket event, five Black Ooze purchases, and three owned-equipment transformations.
- `tools/review_enemy_drops.py` expands the guaranteed-drop audit with troop
  membership, direct encounters, random encounters, and enemy transformations.
  It currently records 205 apparent persistent drop entries (81 armor, 41 weapons,
  83 items) and two indirect battle commands: 11 entries are active, eight stay
  vanilla under the friendly-character kill exclusion, and 186 remain unreviewed.
  Approved drops require an exact hostile encounter, guaranteed reward, victory
  branch, and consumed-state proof. The runtime keeps original loot rolls and
  unrelated drops. A staged engine probe passed 100 battle-drop scenarios and
  confirmed Eugene's drops remain vanilla with no checks. The user's policy
  excludes optional kills of friendly or recruitable characters from AP checks.
- Twenty additional physical item checks cover two apartment keys, five planet
  discs, NeoDuo, six Kingdoms of the Dump figures, Stationery, Fountain Pen, and
  four Henderson-family quest objects. Uranus's two difficulty sources share
  one check. Native story progression stays with the acquisition event; NeoDuo
  itself is a collectible, while the figure story counter advances locally.
  The 42 staged engine scenarios check active/inactive behavior, consumed pages,
  state writes, intact source data, and both conditional multiline notices.
- Joel's original peaceful-only gift hook has been replaced by a resolution
  group under the user's choice-independent quest rule. All four bathroom
  reward pages, recruitment, the peaceful gift, native Attack fall-through,
  and the transformed victory resolve Door Knob and Toothy Whip together.
  Failed/escaped encounters and the fatal hug do not resolve the group.

## Next audit work

1. Trace common-event call sites and conditional branches before assigning one
   AP location to any common-event reward command.
2. Review map events by physical acquisition, including alternative pages and
   choices, rather than treating every gain command as a separate check. Use
   the generated equipment and item review sheets as starting queues.
3. Identify all effects that grant progression state, including switches and
   variables, before separating a vanilla source from an AP item.
4. Confirm candidate sources in the staged game copy and assign stable location
   names and IDs only after that review.

## Progression-switch index

`tools/audit_switches.py` indexes direct switch writes and reads from page
conditions, conditional branches, and simple numeric script calls. In this
build it found 6,313 switch writes and 7,087 reads. There are 574 named switches
that are written ON, have a recorded reader, and have no direct OFF write.
Fifty-eight of these also gate a page or branch containing a player transfer.
These are review queues, not AP progression items: some switches denote hazards,
boss deaths, shortcuts, or states set in several places, and dynamic scripts can
escape the extractor.

Switch 115, `unlockedElevator`, is a concrete case to investigate. The Elevator
Freak victory branch in Map 074 sets it, while elevator-door pages on multiple
floors and the elevator control panel read it. A randomized version must retain
the boss-defeated outcome while granting elevator access only when the AP item
arrives. Suppressing the switch write alone would leave the boss event on its
pre-victory page.

## Map-route index for region logic

`tools/audit_map_routes.py` records each direct event transfer with its source
page, destination map, page conditions, and surrounding event-branch context.
The audited build has 1,677 direct transfer commands forming 1,198 directed
map-to-map pairs. Twelve commands sit on permanently hidden pages; the
potentially live set is 1,665 transfers and 1,186 directed pairs. Of the raw
commands, 347 are on conditioned event pages and 291 sit inside conditional
or choice branches. The project-local outputs are
`build/game_audit/map_routes.csv` and `map_route_summary.json`. This is a
starting point for AP region rules, not a proof of reachability: a door may
set a self-switch before transferring on another page, and switches and
inventory conditions can be changed in distant events. The route index does
show direct ways into the currently checked maps and all direct transfers
to the Credits map for targeted review.

## Ending goal evidence

The game's `currentDay` is variable 15. The FrontDoor event on Map 003 has a
page requiring that variable to be at least 15; using it transfers to Map 172,
`No going back`. That map and the other ending-route maps inspected so far
transfer to Map 168, `Credits`, which then transfers to Map 274, `EndScreen`.
The development plugin records AP victory on entry to Credits on any day
when `CHEATMODE` is off. Direct transfer inspection found 13 ending
maps that lead to Credits (Map 168), then EndScreen (Map 274). The Day 15
FrontDoor route leads through Map 172 to Credits. Two additional direct
transfers to these maps are in a CHEATMODE-gated event. Dynamic/scripted
transfers and interactive ending branches still need a runtime check before
this can be treated as a complete route proof. Regression tests cover Credits
on Days 1, 7, 14, 15, and 16, seed binding, cheat exclusion, and saved completion.

## Calendar rollover evidence

`TimePasses` (Common Event 4) increments the hour and wraps it at 24. Its Day
variable writes are commands 59 and 78, both `currentDay += 1`. `HourPassed`
(Common Event 5) raises switch 40 around 4 a.m.; `TimePasses` then calls
`newDay` (Common Event 6) at command 135. The other direct Day writes found
in map events are in CHEATMODE timeskip events on Maps 003 and 354. Troop 619
sets fixed Day values only inside its `Utils.isOptionValid("btest")` battle-test
branch. The initial sequence on Map 005 also calls
`newDay` without incrementing Day, so the plugin targets the Common Event 4
call site rather than every invocation of Common Event 6.
