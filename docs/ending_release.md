# Vanilla quest timing and ending release

## Confirmed design

Quest timing stays vanilla: fixed-date events, real new-day waits, and dialogue
cutoffs are preserved. The existing manual day advancement and Day15 cap stay
in place. There are no extra Day15 cycles, quest-stage writes, or wait bypasses.

Players who reach Day15 with unfinished quests or no other available ending can
take the generic home-door ending, **No Going Back**. It counts as the AP goal
and releases the remaining checks. Other real endings still count on any day;
cheat-mode Credits do not. The nine existing filler-only placements remain,
without adding a blanket exclusion for all timed quests.

Generation-only calendar reservations now prevent the audited inherently late
prerequisite chains. Ending release is recovery for player choice, delay or error;
it is not justification for invalid placements. The solver proves the Day15
fallback route, while runtime completion still accepts earlier real endings.
See `calendar_deadlines.md`.

## Client and server behavior

On entering Credits Map168, a bound save records completion. The connected
client sends `StatusUpdate` with status30 followed by `Say: !release` when the
server still has unchecked locations. It retries on reconnect after offline
completion or interrupted release. A server acknowledgement updates the check
set. The client does not simulate pickups, advance quest variables, or send a
collect request.

The host must allow release: `auto`, `goal`, `enabled`, and `auto-enabled` work.
With release disabled, completion still counts and Status explains that the
host must allow release. Changing the room permission while connected retries
the request. AP's server enforces release policy and processes the goal before
the release command. See the [AP0.6.7 server implementation](https://github.com/ArchipelagoMW/Archipelago/blob/0.6.7/MultiServer.py#L1383-L1403).

Release sends remaining items **from** this world to their recipients. It does
not collect items still located in other players' worlds. Receiving all items
in the single-slot test below is a consequence of every item belonging locally.

## Verification

- 41 Node tests pass, including five permission modes, duplicate Credits,
  server acknowledgement, host permission changes, and offline save/reconnect.
- The staged native calendar probe passes ten door outcomes, three source
  guards, four clock cases, two Leigh dialogue cutoff cases, and the generic
  ending with unfinished Roach/Leigh quests and zero AP checks.
- The native ending probe executes the home-door transfer to172, the ending's
  name/metadata, and its transfer to168. It skips audiovisual waits and Steam
  achievement writes. It does not constitute an interactive playthrough.
- Three fresh AP0.6.7 sessions use seed154, registry62. With release set to
  `goal` and collect set to `disabled`, online and offline/save-reload endings
  each release all264 checks from zero and deliver264 local items. No
  `LocationChecks` or collect packet is sent. Quest stages remain unchanged.
- With release and collect both disabled, goal completes but zero checks/items
  are released, and Status shows the host restriction.

Commands (each live test needs a fresh project-local server session):

```powershell
node tools/probe_staged_game.js <debug-port> calendar
node tests/live_protocol_smoke.js ws://127.0.0.1:<port> --release-only
node tests/live_protocol_smoke.js ws://127.0.0.1:<port> --release-only --offline-ending
node tests/live_protocol_smoke.js ws://127.0.0.1:<port> --release-only --release-disabled
```

The full region graph and direct acquisition inventory are reviewed. Seed167
reaches all 273 locations and seed168 reaches all 546 two-player locations
without release. Calendar ordering and a complete gameplay run remain unverified.

## Warnings before committing

The Day15 home door offers **Keep exploring** by default. Registry73 also labels
four native decisions: roof access (Map113 event4), both Word of Power choices
(Map169 event2), and reading the planetarium notes (Map362 event3). The roof
choice already contains a native no-return warning and precedes its ending routes.
The notes set switch1000, close the exit and start the ending; the warning is
shown before reading them. Native choice indices, defaults and consequences stay
intact. A later ending-map transfer is never blocked after the story has committed.

`ending_warning_scope.py` validates the choice and consequence signatures.
The native `ending-warnings` probe passes 38 choice and source-guard scenarios.
