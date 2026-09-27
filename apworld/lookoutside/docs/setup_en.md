# Look Outside development playtest setup

This APWorld is for local development on Normal difficulty only. Hard and Easy
sessions are rejected.

<!-- BEGIN GENERATED REGISTRY SUMMARY -->
Registry **74** provides **273 checks**: 167 equipment copies, 103 physical items and 3 access unlocks.
All checks have access rules across **74 regions and 81 entrances**,
with **35 quest-resolution groups**.
<!-- END GENERATED REGISTRY SUMMARY -->

Permanent unlocks include Elevator Access, Planetarium Door Access and Power
Restored. Starting electricity and the native
outage remain; an early Power Restored item restores electricity immediately
after the outage, with a message confirming both events. The fuse box remains
an independent AP check. Joel's peaceful and hostile resolutions award both
Door Knob and Toothy Whip checks; Pierre's mail choices award the same check.
Any real ending on any day completes the AP goal; cheat-mode Credits do not count.
Quest dates, new-day waits, and dialogue cutoffs stay vanilla. At Day15, the
generic home-door ending can finish a run with unfinished quests. The client
reports completion and requests release of every remaining check; an offline
ending is saved and reported on reconnect. The host must allow release with
`release_mode: auto`, `goal`, `enabled`, or `auto-enabled`. A disabled-release
room requires host intervention, which is shown in Archipelago Status.
The entire Gauntlet stays vanilla. Use the project
README to stage a separate game copy. The Steam installation is read only for
this project. Start the staged game with `LOA_DEV_MODE=1` to expose the
development Archipelago Connect and Status menu commands. The dialog accepts a
server address, slot name, and optional masked password; it also shows status
and recent deliveries. Passwords are not saved. Combat preparation remains up
to the player. Quest resolution includes permanent
Hellen/Dan refusals, Sybil's peaceful Telescope outcome, and Bright Frederic.
The Radio and Medic-in-a-jar are useful AP items. Their eight-hour and real-new-day
recharge cycles remain vanilla, and delivery works before meeting their givers.

Use the matching plugin/APWorld pair from the development package and follow
its README to prepare replacements for a separate test game. No game assets
are distributed. Start a fresh seed/save after a registry change and connect
before collecting randomized pickups. First connection is rejected after a
randomized reward, an audited quest resolution or a day rollover. Existing
vanilla saves without reliable start metadata cannot be converted to AP.

AP saves require matching registry and game build metadata. Save schema 7 rejects
older AP schemas rather than migrating them: use their original mod/game versions
to finish those runs, or start a fresh save. A rejected load leaves the save file
untouched and shows an error. Already-received queued items can deliver offline
after a compatible reload when inventory space becomes available.

Automated native probes, live exchange, and all-location sphere tests pass.
A full interactive playthrough, including adverse multiplayer timing, remains
the release gate. See the package playtest guide.
