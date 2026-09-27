# Acquisition review continuation

**Current checkpoint:** registry 68 has 270 checks/items and 32 quest groups.
All current access rules are integrated and pass single-/two-player sphere
verification. See [current status](current_status.md) for the updated evidence.
The earlier checkpoint below is retained as audit history.

## Confirmed user choices

- Work only in the project; treat the installed game as read-only.
- The initial workplan expresses design intent.
- Standard replacement-file installation is acceptable.
- Goal: any real ending on any day; cheat-mode Credits do not count.
- Target Normal difficulty first. Hard and Easy are outside the first release.
- Generation logic checks access only: keys, quest prerequisites, and routes.
  Combat preparation and the ability to win fights are the player's responsibility;
  do not require weapons, armor, party strength, or combat capability in logic.
- Keep the entire Gauntlet vanilla, including its entrance key and rewards.
- Preserve vanilla starting power and outage progression. Keep a fuse-box AP
  check and Power Restored item. An early item restores power immediately after
  the native outage; make both the loss and restoration clear to the player.
- Crafting materials and consumables stay vanilla.
- Morton's Junk-donation rewards stay vanilla, including the fixed Denim Vest,
  Pitchfork, Machete, Flak Jacket and Four-Leaf Clover milestones.
- Companion rewards stay vanilla: Ernest's Metal Bat, Hellen's Paper Mask and
  Cleaver, Juicebox's battle-assistance gifts, and Marc-Andre's recruitment item.
- Scout's Radio and Bright Frederic's Medic-in-a-jar are AP items and checks;
  their rechargeable/tired forms retain native cooldowns and add no checks.
- Access logic assumes players obtain or craft vanilla access supplies as needed,
  including herbicide and ice-melting supplies. Do not require fixed supply access.
- Eight fixed Simple Key pickups and both guaranteed drops are AP checks.
  Purchases and random loot stay vanilla. The AP pool must guarantee enough
  keys without either source; ten three-key bundles supply 30 keys for 26 locks.
- Quest transformations stay vanilla with their original input requirements.
  Randomize the original inputs (e.g. Void Disc and Telescope Pieces); their
  conversions produce the normal local outputs and do not send checks.
- Boss salvage checks do not require Audrey.
- Quest resolutions complete all qualifying branch rewards regardless of the
  chosen outcome. Optional friendly kills have no separate checks except the
  explicitly approved Kaeley/Nestor key drops; if a kill
  closes an audited quest, it resolves the shared group. Joel now demonstrates
  this rule across peaceful, recruitment, early combat, and transformed routes.

## Difficulty scope

The user selected Normal first. Hard mode changes acquisitions and access requirements:

- Uranus moves from Map 058 event 4 to Map 302 event 16. These already share a
  check, with exact difficulty conditions validated.
- Antoine's, Clyde's, Jennifer's, and Auguste's keys are granted only with
  switch 8 ON. They are not yet in the registry.
- Mutt gives the Vending Machine Key on Normal but sells it on Hard. Stores
  remain vanilla; do not treat a shop entry as a check by default.

## Earlier verified checkpoint (superseded by current_status.md)

Registry version 62 has 264 checks and item copies: 158 equipment, 103 physical
items, Elevator Access, Planetarium Door Access, and Power Restored. It remains a development scaffold without region
logic or a finished acquisition pool. New sessions require `LOA_DEV_MODE=1`.

- 40 Node tests and 26 Python tests pass; validation and sync pass.
- Eight fixed Simple Key pickups and two approved drops add ten progression
  bundles. Nestor's body forms share one check; repeatable grants remain vanilla.
  86 native scenarios and live seed153 verify the addition. See `simple_keys.md`.
- Two disconnected valve rooms are excluded. Four playable valves cover four
  locks; a two-black-key bundle covers two independent doors. Three native
  spending orders (57 uses) verify all other finite-key supplies. See `finite_key_budgets.md`.
- Juicebox's card-trick acceptance/refusal resolves the same existing check;
  24 native scenarios cover choices, saves, delayed acquisition, and source guards.
- An independent access model covers 206 locations, 64 regions and 69 entrances;
  generator integration waits for the remaining 58 location rules. See `access_logic.md`.
  It models a global ordinary-lock budget and simultaneous disc allocations;
  six native cases verify the disc puzzle arithmetic.
- Eight original teeth-apartment checks now use filler-only placement and have
  Day 4 deadline warnings. Seed 149 verified all nine excluded checks received
  filler (before five apartment-label corrections). See `calendar_deadlines.md`.
- Native NW.js probes: 96 salvage, 185 drop, 68 fixed-item, 10 NPC-gift, four
  ritual, 12 peaceful quest, 44 additional quest-item, and six Joel dialogue
  scenarios; four alternate Joel reward sources; ten final-day door outcomes,
  three source guards, four clock-loop scenarios, and 12 planetarium scenarios;
  earlier safe/quest tests. Also 20 transformation, 22 late-gift, six visitor,
  490 portrait/friendly-kill, 36 advanced-drop, 28 power, and 51 Joel resolution scenarios.
- The character audit adds 223 native scenarios; see `character_resolution_audit.md`.
- Twelve menu/delivery/deadline scenarios and sixteen friendly-locked-room scenarios pass.
  Eight interior pickups were removed because reaching them required killing
  Eugene/Nestor or Lyle. Their loot stays vanilla.
- Live Archipelago 0.6.7 seed154:
  `.local/ap-output/AP_62267338445117946993.zip`. All 264 checks/items
  passed, with 26 reconciliation families. The server confirmed goal completion on Day 7.
  Pierre's missable mail visit was filled with a filler item, as required.
- Normal scope now excludes Map372's Hard-only Pool Cue; Unlabeled Cartridge
  is progression. Its working TV is in Map267, not the ordinary home.
- Twenty native flesh-route scenarios verify geometry and one-way door gates;
  see `flesh_route_audit.md` before adding these routes to generation.
- Probes simulate events and combat outcomes; no full interactive playthrough.
- Day 15 now allows continued exploration through the home door. Long actions
  stop at the native 04:00 boundary; held action/battle minutes are discarded
  before they can spill into the following day. Native tests exercise both
  rollover paths and save/load. Eight reviewed deadlines now have metadata/UI;
  the remaining expiry audit is unfinished.

## Completed since the earlier 220-check checkpoint

Janitor Key Ring, Shrunken Head, nine fixed videogames, Guinea Pig, Rose,
Pierre's Clown Drawing, Frederic's peaceful Painter's Key and Canvas Carry Bag,
Jasper's apartment/roof keys, Dark Robes, Mutt's Normal vending key, the shadow's
Tongue, Benjamin's game/pendant, Laundry, Love Letter, Loose Manuscript, and
Oracle's End Small Red Key are registered. The Canvas Carry Bag access switch
is granted on AP delivery; its native story-completion switch stays local.

Seven more hostile drops were reviewed: Vincent's Polo Shirt, Spore Mother's
Mycelium Cloak, four hostile Louis body parts, and gun's equipment drop.
Three Hard-only equipment checks were removed. Hard-only keys are excluded.
Lyle's Dark Room Key kill reward and Stuart's merchant-kill drop stay vanilla.
The Oracle encounter remains hostile after the optional hug dialogue; it has
no peaceful surrender branch and is distinct from killing a friendly NPC.

Pierre's Old Mail visit and Tickle's final drawing are registered. Pierre's
accept/refuse/leave outcomes share a check; native time expiry still applies,
and its location uses EXCLUDED placement.
The Stained Key is one check shared by the green hat agreement and the final
hostile portrait part across 30 map-page alternatives. Kills after the hat
agreement stay vanilla. Lucky Cowboy Hat is now progression; its two native
transformations still execute. Fake Frederic's Torn-Off Face reward stays vanilla.
His alternate Canvas Carry Bag grants now share his quest's resolution group.

Baby Teeth's Jawbone Club, Suture Wire's Great Needle, and First Head's Slime
Spear are registered with consumed-state and transformation proofs. Clyde's
Angel of Death and the random Fridge encounter are Hard-only and excluded.

Power Restored and the main fuse-box check are implemented with vanilla starting
power and outage timing. Early receipt waits for the outage, then restores power
with an explicit loss/restoration notice. See `power_progression.md`.

The optional kill drops of Montgomery, Xaria, Gamer, Harriet, Craftsman, Aster,
and Fake Frederic's Face Taker form are now explicitly excluded. See
`remaining_encounter_review.md` for the dialogue evidence and bus route review.
The user resolved the transformed-Joel question through a broader rule: reconcile
all quest branch rewards at any terminal outcome. Joel and Pierre's mail visit
are implemented, and the audit now covers Frederic, Jasper, Pierre's finale,
Benjamin's forms, the Shadow's alternative gifts, Mutt, and Tickle. Paint Palette
and Clown Wig and Nose add two equipment rewards. Clint's Rags/Tooth Knife and
Madison's Tooth Hammer share checks across their hostile forms, including forms
without native drops. See `character_resolution_audit.md`.

## Next sources to review

Local access supplies are resolved: assume the player obtains/crafts them.
Herbicide barriers and frozen passages add no AP consumable requirements.
Their surrounding key, power, and quest requirements still apply.

Quest timing is resolved: preserve vanilla date gates, new-day waits, and
dialogue cutoffs. Leigh's CE125 still exits on Day15. Do not add new-day cycles
at the cap or synthetic quest advancement. The generic Day15 ending completes
the AP goal and requests release of unfinished checks. Preserve the nine current
placement exclusions; this decision adds no blanket filler restriction to
timed quests. See `ending_release.md` for verified behavior and room settings.

Transformation scope is confirmed: keep conversion recipes and outputs vanilla.
Void Disc and Telescope Pieces remain progression items in the AP pool. The
validator prevents their conversion commands or outputs becoming AP sources.

These are evidence leads, not approved locations. Verify native consumed state,
alternative sources, peaceful resolutions, and access before promotion.

- Normal generation uses access requirements only. Equipment may still be a
  progression item when it serves as a noncombat quest input (the Lucky Cowboy
  Hat, for example); its combat strength is never an access requirement.
- Ordinary-lock supply is resolved: guarantee enough AP keys. Reviewed locks
  require nine bundles (27 keys) in logic, covering all 26 native locks in any
  order. Players can use keys earlier. Other finite-key supplies now also cover
  all reviewed spends. Iris and colored-key access rules are now integrated.

- Do not assume all permanent database items are progression. Continue checking
  selected-item variables, item common events, and scripts before finalizing
  classification and progression-state delivery effects.
- Apply the choice-independent quest rule to any newly promoted character gifts.
  The previously identified Frederic/Jasper/Pierre/Benjamin gaps are covered;
  preserve intermediate milestones when a character has several quest stages.
- Permanent-state review: switch 699 is now AP Planetarium Door Access (CE 64,
  command 216; original list and nine correct sockets required). Its access
  door is Map 345 event 31 -> Map 360. Power restoration (987/21, Map 369 event
  24) is implemented; see `power_progression.md`. Remaining candidates include
  bus crash access (222, Map 128 event 6),
  and major route unlocks. Ordinary shortcut doors and story-state flags must
  be distinguished from these; do not bulk-randomize permanent switches.
- Ending audit: Credits has 13 normal ending-map sources, including early ritual
  and special quest endings, plus a CHEATMODE source. All real ending routes
  qualify on any day. Review warnings about unfinished checks at irreversible
  ending entrances (e.g. Map 113 event 4) alongside the final calendar UI.

## Reviewed leads that should stay separate from fixed acquisitions

- Joel's four Map 032 reward paths and his transformed weapon share one
  resolution group. Native Attack's `fight`/`Fight` fall-through is preserved
  and resolves the same group when it reaches the gift.
- Telescope repair, Drooling Husk returns, returning manuscripts to Jasper,
  and picking up a previously placed Guinea Pig are transformations/returns.
  Do not count them again as new physical acquisitions.
- Painting 342/343 swaps reset the previous painting's self-switch through
  Common Event 43. CCTV recordings can be repeated; photography is a processing
  chain using purchasable paper. Keep their native processing and requirements.
- Negative Disc consumes the unique Void Disc without a one-time event flag.
  It remains a vanilla transformation under the confirmed scope decision.
- Philippe's Remains require his death; investigate story causes rather than
  treating friendly-character death as a check.
- Cafe stock (including Lockpicks, Trophy, Coffee Machine, Crossword) stays
  vanilla whether paid or free. Gardening and container-generated rewards are
  not fixed sources merely because an event has a direct grant command.
- Map 464 Strange Key and Map 313 Old Rusty Key are CHEATMODE-only.

The refreshed guaranteed-drop report has 132 entries: 30 active and 102 vanilla,
with no unreviewed rows in that report. The simple equipment report has 80 active
and 8 vanilla sources; the simple item report has 46 active and 51 vanilla sources.
These scoped reports do not complete the broader common-event/script audit.
`encounter_scope.py` records random visitor, friendly, noncombat, unused, and
Gauntlet exclusions; High Five and two Plumbing Tools rewards are now active.

Broader work remains: common-event/script rewards, day-expiry and irreversible
ending warnings, and a full interactive playthrough. Region integration,
generation/sphere verification, and development packaging are complete.
Always launch the staged game with the project-local NW.js profile.

## Common-event inventory, registry68

All 444 direct positive common-event grants are now inventoried in
`build/game_audit/common_reward_review.json`: 443 vanilla grants and one active
car-trunk Shotgun check, with no unresolved rows in this report. Morton's five
fixed donation milestones and companion rewards stay vanilla by user choice.
The Shotgun's 12 ammunition
rounds stay vanilla. The Radio and Medic-in-a-jar original gifts are active
troop rewards, while their common-event recharge forms stay vanilla.

Juicebox's shuffled activities retain fixed gifts; they are excluded by the
companion-reward decision, not classified as random loot. Marc-Andre's original
gift is a separate map source; his gift and napping/active forms stay vanilla.
Fred Ring follows the Wriggly Fred route requiring the other Freds' deaths, so
it remains excluded under the no-standalone-friendly-kill-reward decision.
