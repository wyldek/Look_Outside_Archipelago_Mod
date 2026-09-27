# Save and session compatibility

Registry74 uses **save schema7**. Each AP snapshot stores its registry version,
audited game ID and audited game version in addition to seed/team/slot identity.
These must match before the native map, inventory or quest state is installed.
Unsupported schemas, mismatched builds, malformed queues and unknown queued item
IDs reject the load. The load screen shows the reason, gameplay is blocked for
the rejected state, and the existing save file is left untouched.

**Schemas1–6 are rejected.** They lack the compatibility evidence needed for safe
migration. Finish older runs with their original matching mod/game version, or
start a fresh Normal save and seed. A new registry version also requires a new
save and seed. This is an intentional development compatibility boundary.

## Offline delivery

A compatible load restores delivery definitions from the embedded registry.
Already-received items waiting for inventory space can deliver while offline.
The saved item index and remaining queue are retained; there is no replay or
index reset to compensate for loading. Invalid or duplicate queue indices and
unknown item IDs are rejected. Unknown incoming item packets are rejected before
any of their entries advance the receipt index.

## First connection

New games record eligibility metadata even before binding to an AP seed. An
audited randomized reward, quest-resolution terminal, guaranteed encounter drop,
or native day rollover before connecting makes that save ineligible. Native
gameplay continues normally while unbound; a later connection is refused before
it assigns an identity. The check runs both before opening the socket and when
the server accepts the slot, covering progress made while connecting.

Ordinary vanilla saves without reliable metadata remain playable as vanilla;
they cannot be converted into AP saves. No native quest flags are converted into
checks. A pristine save made with this mod can be loaded and connected later.

## Serialized interpreters

Saving records the canonical source of map/common-event interpreter lists,
including child and parallel interpreters. After loading, only those saved
interpreters may regain the canonical array reference, after their owning context
and complete command list match. Setup of a new interpreter clears pending
restoration. Arbitrary copied lists still fail source matching, and a changed
saved canonical list stops execution. Reference guards remain in place.

The native session probe uses compressed disk saves in the project game copy.
It covers **16 scenarios**, including offline overflow/replay, rejected saves,
visible load errors, pristine/progressed binding, and two real save commands:
the bed's Sleeping event and Sybil's conversation. Additional controlled pending
clock/reward fixtures test restored source matching; these are not claimed as
ordinary save points.

## Adverse multiplayer timing

Registry74 seed171 places player B's Rose at player A's Deep Basement Creature.
The native multiplayer probe executes the Day7 10:00 earthquake conditions,
then sends Rose from A. B still enters the closed-era pit (Map399); the item
does not undo the deadline. B then takes the native Day15 home-door route while
offline, saves, reloads, and reconnects. The server acknowledges all **273** B
checks and sends **133** items to A. A still has only its one checked location.
The unfinished quest variable and earthquake flag remain unchanged. Release is
set to `goal` and collect to `disabled` for this test.

This exercises actual native events, disk saves and a real two-player server,
with controlled days and skipped ending presentation. A full chronological
Normal playthrough remains outstanding.

```powershell
node tools/probe_staged_game.js <debug-port> session
# Requires a fresh seed171 server with the matching registry74 fixtures:
node tools/probe_staged_game.js <debug-port> multi-delay ws://127.0.0.1:<server-port>
```
