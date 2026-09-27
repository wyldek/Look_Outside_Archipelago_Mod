# Character resolution audit

## Juicebox card trick

Registry version61 adds a resolution for the existing Four of Spades check;
there are now 26 resolution families. Its AP ID is unchanged. Map002 event48
page0 command638 advances relationship variable287 from6 to7 after either
accepting the trick or saying "Maybe some other time?". Despite its wording,
that refusal permanently skips the native card setup. Both outcomes now
complete **Juicebox Card Trick** at that shared endpoint.

The vending-machine source remains intercepted, so obtaining the card there
later cannot duplicate the check or grant an extra local item. Native story
variables and vending stock are unchanged. Twenty-four native scenarios cover
acceptance/refusal, all nine card/response combinations, inactive sessions,
save/load, delayed vending acquisition, and four source guards.

## Earlier character audit

Audited against game build `74642914`. All edits and runtime probes use project
files; the installed game remains read-only. The character audit's version 53 checkpoint contains 257
checks/items and 24 resolution groups.

## Extended groups

| Character | Rewards | Terminal outcomes |
| --- | --- | --- |
| Frederic | Painter's Key, Canvas Carry Bag, Paint Palette | Final portrait reward or victory on any of three encounter pages. |
| Jasper | Apartment Key, Roof Access Key, Dark Robes | Accept final ritual preparations, or defeat Jasper. |
| Pierre | Clown Drawing, Old Mail, Clown Wig and Nose | Finish his final conversation, defeat him, retreat during his final phase, or survive his scripted defeat outcome. |
| Benjamin | Kill to Shoot, Teeth Pendant | Finish playtime, defeat either form, or finish a peaceful interaction with his later form. |
| Masked Shadow | Tongue, Kitchen Knife, Rose | Collect any relationship-dependent doorstep gift, or finish his final invitation with dismissal or acceptance. |
| Mutt | Vending Machine Key | Normal gift or defeat Mutt; merchant stock remains vanilla. |
| Tickle | Friendship Drawing | Donation gift, defeat Tickle, or accept him as a host companion. |
| Clint | Rags, Tooth Knife | Defeat any of his three forms, across six encounter pages. |
| Madison | Tooth Hammer | Defeat any of her three forms, across five encounter pages. |

Paint Palette and Clown Wig and Nose are newly audited equipment rewards.
Existing location IDs are preserved. NPC kill drops do not gain standalone
checks; native story and combat consequences still execute.
Clint and Madison are hostile contact encounters. Their shared defeated switches
remove later forms, so their checks reconcile on any form's victory. This avoids
requiring players to preserve an enemy until a particular day. The Gauntlet's
copies remain vanilla.

## Intermediate rewards

Each terminal can list a subset of its group's rewards. This prevents an early
milestone from completing the entire character arc:

- Frederic's key remains its own early check. Receiving the bag completes only
  key/bag checks, with the palette reserved for a final outcome.
- Pierre's accept/refuse/leave mail choices complete only the mail check.
  The final character outcomes also recover a missed mail check. Its placement
  stays conservatively EXCLUDED pending the full calendar/access audit.
- Accepting/refusing the Shadow's Tongue completes only that check. His later
  doorstep reward completes the alternatives together, preserving native money
  and consumable rewards on the other relationship branches.
- Jasper's optional apartment-key conversation remains an early check. Final
  preparations complete that check if skipped before his departure.

Ordinary escapes, postponed dialogue, failed readiness checks, and game over
are not completion. Pierre's scripted defeat is an exception because the game
revives the party and permanently closes his quest. Frederic's temporary escape
disappearance clears its self-switch through his move route and is not a terminal.

## Implementation evidence

`tools/quest_resolution_scope.py` records and validates exact terminal commands,
reward sources, branch guards, and alternate pages. The generator supports
terminal-specific member lists. Peaceful finales ending through native Abort
Battle are intercepted while their original troop context is still available.

The Canvas Carry Bag's three combat reward variants are suppressed and switch
188 is deferred to AP delivery, just like its peaceful gift. Native switch 233
and quest state still advance. Torn-Off Face remains vanilla.

`tests/native_character_resolution_probe.js` covers 168 battle outcomes, 54
dialogue/gift cases, and one actual serialized save/load case. It exercises the
original RPG Maker lists and branch commands with presentation waits omitted.
All existing native probes and 38 Node tests pass with the expanded groups.
This does not replace an interactive randomized playthrough or full region logic.
