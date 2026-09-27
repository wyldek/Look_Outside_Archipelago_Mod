# Remaining encounter review

Audit evidence for game version `74642914`. These findings refine acquisition
scope; they do not change native encounters.

## Optional friendly-character kills

The following enemy drops are excluded under the existing user decision:

| Enemy | Native evidence |
| --- | --- |
| Montgomery 38 / Xaria 39 | Troop 60 page 0 command 79 offers shelter, refusal, or Attack. Commands 131–134 enter and confirm the Attack branch. |
| Gamer 55 | Troop 55 page 0 command 191 offers trade, leave, or Attack. Commands 198–201 enter and confirm Attack. Bargaining for his game has peaceful outcomes. |
| Swordsgamer 74 | Troops 55 and 255 transform the same optional Gamer attack into enemy 74 on page 1, command 7. |
| Harriet 59 | Troop 33 page 0 command 168 offers rescue dialogue, supplies, Attack, or leave; commands 209–212 confirm Attack. |
| Craftsman 72 | Troop 72 page 0 command 97 offers trade, leave, or Attack; commands 105–108 confirm Attack. |
| Aster 191 | Troop 121 page 0 can add actor 3 at command 214. Commands 330–338 enter and confirm Attack. Troop 192 is his peaceful finale. |
| Face Taker 281 | Transformations in troop 327 belong to Fake Frederic's optional Attack path, already reviewed. Its other direct encounter is in the excluded Gauntlet. |

These IDs are recorded in `tools/encounter_scope.py`. The registry validator
rejects their promotion as enemy-drop checks, and the drop review report marks
them vanilla. This is a reviewed set, not a complete enemy classification.

## Rooms reached only through a friendly kill

Eight previously registered pickups have been returned to vanilla. Their item
copies were removed from the AP pool without renumbering retained IDs.

- Eugene's South/East/Back rooms (Maps 329–333): seven equipment rewards.
  Both outside doors are Map 132 events 3/66. Commands 7–15 require item 377,
  Eugene's Key, to set switches 332/333 and jump past the Exit Event command.
  The only other writes unlock those doors from inside Maps 329/330. All
  external transfer entries pass through those two doors. Item 377 has no
  event-grant source and is a guaranteed drop from Eugene or Nestor. Their
  troops 117/118 put combat behind an explicit Attack choice.
- Lyle's Dark Room (Map 112): one spare Apartment 33 Key. Its only non-cheat
  entry is Map 9 event 13 page 1, requiring self-switch A. Page 0 commands
  3–11 unlock it with item 315, Dark Room Key. The three Map 9 event 14 grants
  are Lyle's optional combat victories. Developing photographs peacefully
  does not unlock this door. The separate Apartment 37 projector room is not
  affected.

The no-required-friendly-kill policy therefore applies to these interior
pickups as well as the kill rewards. `exclude_friendly_locked.py` records the
door signatures; the validator and promotion tools prevent reintroducing these
rooms. Native tests verify eight Eugene door outcomes and all eight vanilla
reward commands while AP is active.

## Hostile variants and quest resolutions

Enemy 29 (Clint) on Map 006 is a hostile contact encounter before Day 4, not an
optional Attack conversation. His Rags now share Clint Resolution with the late
Tooth Knife; all three forms complete both checks. This avoids a day-specific check.

Map 435 has hostile contact encounters for tooth versions of Clint (enemy 737),
Madison (739), and Joel (742). Their troops 737/739/741 have combat dialogue but
no peaceful choices. Joel's pages also disappear when switches 784 or 33 are on.
The user clarified that all quest branch rewards should reconcile regardless of
choice. Joel's transformed Toothy Whip now shares Joel Resolution with the Door
Knob: peaceful and hostile outcomes complete both. Clint and Madison now have
shared form resolution groups too; their early and intermediate victories
complete later weapon checks. See `character_resolution_audit.md`.

## Bus crash is a story-map transition

Map 128 is FakeLobby; Map 70 is MainLobby. Nine contact triggers on Map 128
(events 10/12/13/14/16/66/67/68/69) set switches 225 and 223. Event 6 is a
parallel cutscene gated by 223. It sets `busCrashed` (222) at command 49, directly
transfers to Map 70 at command 51, and consumes itself with self-switch A at 52.

Switch 222 redirects ten hallway/room entrances to Map 70 and changes music
and conversation. It is not an independently audited acquisition: withholding
that switch alone would still execute the transfer into the destination.
Keep this transition intact while constructing region logic; do not promote a
flag to an AP access item without auditing the complete route and cutscene.
