# Connection and item feedback

The development game menu opens one Archipelago dialog for both Connect and
Status. It accepts a server address with or without `ws://` or `wss://`, a slot
name, and an optional masked password. Server and slot are remembered in the local NW.js
profile. The password is never written to preferences or the AP save field.

Bare addresses initially use `ws://`. If that transport fails before opening
or receiving a message, the plugin tries `wss://` on the same host/port. This
supports hosted rooms requiring TLS, as in
[Archipelago's standard client](https://github.com/ArchipelagoMW/Archipelago/blob/0.6.7/CommonClient.py#L801-L805).
An explicit `wss://` address and an opened secure connection never retry in
plaintext. AP authentication/protocol errors also never trigger transport changes.
If both opening attempts fail, normal reconnect backoff restarts the original
request, allowing a temporarily offline plain server to recover.

The successful address, including the secure scheme after fallback, is remembered
for later connections. Status displays the current address; failed connections
identify the attempted host/port. In the original `0.0.2-dev74` tagged package,
automatic secure retry is absent: enter `wss://host:port` explicitly for TLS rooms.

Connection state, errors, seed binding, check count, queued items, and calendar
hold are shown in the dialog. Disconnect cancels automatic retries while
preserving the bound save, its offline checks, and pending deliveries. Invalid
settings or a failed socket constructor leave an existing connection intact.
Save/build/difficulty guards apply to connections started from the menu as well
as the development API.

Delivered items produce a nonblocking six-second notice when the map is idle.
Large batches show three names and the number of additional items. The latest
50 deliveries are available under Recent items in Status, for the current game
session. Replayed packets and inventory-full queues do not announce an item
until it has actually been delivered. Power Restored retains its dedicated
outage/restoration messages.

Go to Next Day asks for confirmation, with Keep exploring focused by default.
Confirming advances exactly once through the existing native calendar hook.
Eight expiring teeth-apartment checks are listed in Status and in the day
confirmation before their Day 4 noon deadline. Checked entries disappear from
the list. The broader expiry audit remains unfinished; see `calendar_deadlines.md`.

The dialog uses keyboard and pointer input. It isolates text entry from RPG
Maker's game key handlers and clears held input on open/close. Scene changes or
a new game remove the dialog and its status timer. The layout is sized for the
game's 816 x 624 window; long status content scrolls with the buttons retained.

`tests/native_menu_probe.js` exercises 12 scenarios in the staged NW.js runtime:
focus/input isolation, bad settings, connection/status/password persistence,
delivery/replay, full inventory, constructor failure with a live connection,
offline disconnect, Escape, day cancellation/confirmation with a deadline list,
the deadline's noon warning, and new-game cleanup.
These are simulated server interactions; the separate protocol smoke test uses
a real local Archipelago server.

The plugin regression suite also verifies secure retry, identity/item replay,
secure reconnects, recovery of offline plain servers, cancellation, and rejection
paths. A live transport probe confirmed ws failure followed by wss RoomInfo on
a hosted room, suppressing Connect so no slot, checks, or chat were affected.
