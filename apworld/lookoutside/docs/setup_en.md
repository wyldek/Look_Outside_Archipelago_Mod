# Look Outside development playtest setup

This APWorld is for local development on Normal difficulty only. Hard and Easy
sessions are rejected. It provides 270 checks: 159
equipment acquisitions, 108 key or collectible acquisitions (including one
Basement Key check shared across five Landlord hub variants), Elevator Access,
Planetarium Door Access, and Power Restored. Starting electricity and the native
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
and recent deliveries. Passwords are not saved. All 270 checks have integrated
access rules across 74 regions and 81 entrances; combat preparation remains up
to the player. Registry68 has 32 quest-resolution groups, including permanent
Hellen/Dan refusals, Sybil's peaceful Telescope outcome, and Bright Frederic.
The Radio and Medic-in-a-jar are useful AP items. Their eight-hour and real-new-day
recharge cycles remain vanilla, and delivery works before meeting their givers.

Use the matching plugin/APWorld pair from the development package and follow
its README to prepare replacements for a separate test game. No game assets
are distributed. Start a fresh seed/save after a registry change and connect
before collecting randomized pickups. Automated native probes, live exchange,
and all-location sphere tests pass. The broader acquisition/expiry audit and
a full interactive playthrough remain release gates. See the package playtest guide.
