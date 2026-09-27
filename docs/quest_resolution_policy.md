# Choice-independent quest resolutions

User clarification: a player must be able to resolve a quest through any of its
valid outcomes and receive its full set of AP checks. Quests use a shared
resolution group containing their qualifying branch rewards. Every terminal
outcome completes that group once.

This applies to peaceful and hostile resolutions, recruitment, refusal, and
other irreversible choices. Escaping an unfinished encounter, postponing a
quest that remains available, and game over do not count as completion.
The native choices and story consequences remain intact.

## Joel Resolution

One in-game resolution sends two AP locations together:

- **Joel Resolution - Door Knob**, existing location ID `592000001`.
- **Joel Resolution - Toothy Whip**, location ID `592000090`.

These keep two real item copies in the AP pool. Players receive both checks
without having to select mutually exclusive paths. The old internal Door Knob
key is retained to preserve saved check identity.

| Native outcome | AP result |
| --- | --- |
| Survive the hug or step back, then receive his gift | Complete both checks. |
| Native Attack branch falls through to the gift | Complete both checks; native dialogue behavior is preserved. |
| Recruit Joel, including when the active party is full | Complete both checks. |
| Defeat Joel on any of the four bathroom event pages | Complete both checks. |
| Defeat transformed Joel on either teeth-area page | Complete both checks. |
| Escape, lose, die during the hug, or merely start dialogue | No resolution check. |
| Reach another outcome after completing the group | No additional checks or vanilla copies of the randomized rewards. |

Door Knob grants and the transformed Toothy Whip drop are intercepted only at
their audited sources. Recruitment and transformed victory also have guarded
terminal hooks. The same saved check set deduplicates source acquisition,
terminal reconciliation, reconnects, and later visits.

## Pierre's mail visit

Accepting the visit, refusing to open the door, and leaving the eyehole now all
complete **Pierre - Old Mail Visit**. His actual dialogue and relationship
changes follow the chosen branch. The visit's natural time expiry remains a
separate availability issue; it retains EXCLUDED placement until calendar
reconciliation is complete.

## Audit rule

For each quest, enumerate its terminal outcomes, the rewards made unavailable
by each, and its replay/consumed state before approving its AP logic. The
registry's exact member list defines the group. Existing groups already cover
Roach Leadership, Leigh, Wilhelmina, and boss salvage. The completed character
audit extends this to Frederic, Jasper, Pierre, Benjamin, the Masked Shadow,
Mutt, Tickle, Clint, and Madison. See `character_resolution_audit.md` for exact
outcomes and intermediate milestones. Continue applying the same audit to any
new quest rewards added to the pool.

This review is a release requirement: region logic must not assume a particular
dialogue choice is required to obtain a reconciled quest reward.

## Verification

The character audit's registry version 53 checkpoint had 257 checks/items and
24 quest groups, with 38 Node tests and two Python tests passing. The native Joel probe covers 8 dialogue,
4 recruitment, 36 battle-result, and 3 source-guard scenarios, including actual
save serialization and alternate outcomes after completion. Pierre's existing
22 gift and 6 dispatch scenarios now verify equal check results on all visit
choices. Probes simulate combat outcomes and omit presentation waits.

The further character probe adds 223 native scenarios.

Live Archipelago 0.6.7 seed 148 exchanged all 257 checks/items and 24 groups;
the server confirmed goal completion on Day 7. That historical checkpoint
preceded region integration; current evidence is in `audit_status.md`.

## Later choice repairs

- **Rat Freak:** peaceful crown outcome and hostile victory share Rat Claws.
- **Sybil:** the peaceful repaired-telescope reveal completes the same two
  checks as the Oracle route. The closet Iris pickup alone does not resolve her
  quest. Original telescope consumption and story flags remain native.
- **Hellen:** either permanent invitation refusal resolves Stained Shears;
  accepting only starts the quest. Garden completion still checks the reward.
- **Dan:** the confirmed refusal resolves NeoDuo; accepting or changing one's
  mind starts the native quest without checking it early.
- **High Five:** the early arm victory that sets its consumed flag resolves
  the Watch check, as does defeating High Five later.

- **Bright Frederic:** accepting or declining his completed-portrait gift offer
  resolves Medic-in-a-jar. Defeating him resolves the same check. A later change
  of mind preserves the native dialogue and cannot duplicate the AP check or
  restore a tired Medic. This is separate from Fake Frederic's existing group.

Registry 73 has 35 resolution groups. The fungus rescues, Darryl and the Spider
Husk add three groups; see `late_reward_audit.md` for their terminal outcomes.
New native coverage includes 13 Rat Freak,
16 Sybil, 51 Hellen/Dan and 253 fixed-collectible scenarios. Tests include
save/reload, branch consequences, escape, original event-list guards, and no
duplicate rewards. Quest timing and elapsed-day stages remain vanilla.
The reusable-gift probe adds 26 scenarios for Frederic and Scout, including
delivery before their conversations and native recharge transformations.
The late-resolution probe adds 65 scenarios, including rescues with and without
Papineau, both illusion-ending routes, fast Darryl victories and Spider Husk
gift/victory/escape outcomes. Individual rescues complete only their own check;
closing the illusion completes all three remaining rescue checks.
