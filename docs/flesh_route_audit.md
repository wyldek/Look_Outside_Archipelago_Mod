# Flesh route audit

The reviewed flesh components are integrated into the generation graph.
Tile passability and native one-way door commands distinguish their routes.

## Geometry and doors

`tools/audit_tile_routes.py` follows native layered tile flags, including map
wrapping. Map384 loops horizontally and vertically. Several other flesh maps
contain disconnected sections. A map-level edge cannot imply that every exit
or pickup in the map is reachable.

`tests/native_flesh_routes_probe.js` checks six starting positions against
native RPG Maker passability across 43 maps. It separately runs seven original
one-way-door event lists with their switches both off and on (14 cases).
Five additional cases propagate reachable door-unlock switches through the
network. All 25 cases passed in the project-local game. These probes do not simulate a
complete walk, combat, or every source of an unlock.

| Door | Requires switch | Unlock from far side |
| --- | --- | --- |
| Map383 event1 | 1112 | Map417 event1 command0 |
| Map383 event2 | 1108 | Map418 event1 command0 |
| Map385 event1 | 1113 | Map420 event1 command0 |
| Map385 event13 | 1114 | Map427 event3 command3 |
| Map394 event5 | 1115 | Map412 event5 command3 |
| Map415 event1 | 1111 | Map414 event2 command0 |
| Map398 event1 | 1109 | Map396 event2 command10 |

The animation tilesets45-48 and69-72 have identical passage/star flags within
each group. Animation does not bridge their gaps.

## Routes after accounting for one-way doors

These results assume local enemy barriers can be cleared, following access-only
logic. Entrance prerequisites are represented in `access_data.py`.

| Entry position | Candidate checks reached through this network |
| --- | --- |
| Flesh home267 at12,20 | None of the six deeper pickups; reaches the upper stairwell and its exit to Map026. |
| Apartment21 iris portal417 at32,5 | Same upper network; opens1112, but cannot open1108 from this side. |
| Apartment36 iris portal407 at12,6 | Separate section of Maps382/407/408; no deeper network checks. |
| Reception iris portal419 at27,26 | Goblin Claws421 event4 and outside Iris Key426 event1. |
| Eye portal414 at15,44 | Iris Keys393 event12,424 event8,429 event1; Ocular Tetherblade415 event6. |
| Sea iris portal383 at11,10 | Goblin Claws421 event4 and outside Iris Key426 event1; separate return to Map059. |
| Garage iris portal423 at12,17 | Same four deeper pickups as Eye; exits to laundry69 and rat room291. |
| Oracle367 at25,43 | Those four pickups plus Oracle's Small Red Key and Apartment12 closet Iris Key348 event5. |

Iris logic uses the global six-key spending budget where an iris entrance is
required. Floor3 door3 needs Apt.35 Key; Sybil's peaceful telescope reveal now
reconciles the Oracle and closet checks without changing states969/975 or
transforming her apartment. Native tests verify both outcomes and source guards.

The upper flesh stair exit can reach the ordinary stairwell from the far side,
potentially bypassing the Padlock Key route. The original access graph is
conservative here; verify the complete route before adding this alternative.

```powershell
node tools/probe_staged_game.js 9264 flesh-routes
```

Run against a newly launched project-local game debugger;9264 was the port of
this completed test, not a persistent service.
