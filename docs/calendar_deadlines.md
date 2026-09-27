# Reviewed calendar deadlines

Registry **55** marks eight checks in the original teeth apartment as missable.
Archipelago's EXCLUDED placement keeps both progression and useful items out
of these checks. Together with Pierre's mail visit, nine checks currently have
this restriction. At the version54 deadline checkpoint, item counts and IDs
were unchanged: 257 checks / 257 copies. The current total is in `audit_status.md`.

## Original teeth apartment

Map006 event29 page0 checks Day4, hour >=12, and player proximity, then sets
switch1062. Door event7 pages4/5 respond to that switch; page6 closes the door
on Day5 regardless. Pages9/10 eventually enter Map435 rather than the original
Maps031-034. No other external map transfers lead into the original rooms.
`tools/calendar_scope.py` validates those timing and transfer signatures.

The affected checks are Frying Pan, Hoodie, bathroom Mop, Baseball Cap, Army Guy
Figure, Old Rifle safe, Tank Top, and Baby Teeth's Jawbone Club. Five earlier
labels incorrectly said Apartment12; they now say Apartment32, matching the
Floor3 entrance. No item IDs or source hooks changed.

Joel, Benjamin, Clint, and Madison retain their audited later resolution paths
and are not given this deadline merely because an early source was in these rooms.

## Player presentation

Quest dates and waits stay vanilla. No additional new-day cycle runs after the
Day15 cap, and late quest stages are not advanced by the client. If quests are
unfinished or no other ending is available, the generic Day15 home-door ending
completes the AP goal and requests release of all remaining checks. The nine
existing placement exclusions remain; this policy adds no blanket filler-only
rule for other timed quests. See `ending_release.md` for server requirements
and the native/online/offline verification.

Archipelago Status lists tracked unchecked deadline locations. The list explicitly
says it is incomplete. Day advancement always warns that checks can expire,
unfinished quests do not advance past Day15, and ending release needs host support.
Before advancing from
Day3 to Day4, Go to Next Day opens the list and warns about the approaching
noon closure. It continues warning afterward, saying access **may** be lost:
a player still inside can finish pickups even if the door would close outside.
The warning does not modify the native door, collect checks, or prohibit day
advancement. Keep exploring remains the default focused action.

Counts use the saved check set, so offline checks, server acknowledgements,
quest reconciliation, and save/load share the same source of truth. The audit
is incomplete: other visitors and quests can still expire; an empty list is not
a claim that every quest is permanently available.

## Verification

At registry73, all 41 Node tests and 12 native menu scenarios pass. The menu
probe also checks the general warning, incomplete-list label and visibility of
the day-advance actions with the expanded text. Earlier evidence follows.

- 39 Node tests pass, including deadline timing, checked-location filtering,
  late reopening, inactive behavior, and saved offline checks.
- The native menu probe passes 12 scenarios, including the Day3 warning,
  cancellation, confirmed advancement, and the noon status message.
- Layout was inspected at 816 x 624; the full eight-check warning and both
  action buttons fit. Preview: `build/ui-preview/deadlines.png` (local only).
- Archipelago0.6.7 seed149, before the five label corrections, generated all
  nine excluded checks with filler. This validates placement exclusions, not
  the still-incomplete region graph or a full playthrough.

Use `promote_calendar_deadlines.py --game-dir <installed game>` to reapply the
metadata idempotently; it writes only the project registry.
