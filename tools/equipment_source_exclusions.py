"""Reviewed source exclusions for build 74642914 (not whole-item exclusions)."""

# Map, event, zero-based page, reward command. Other fixed copies of these
# equipment types can still be randomized where they are genuine acquisitions.
EXCLUDED_SOURCES = {
    (2, 12, 1, 39): "Name-entry Easter egg: starting Straitjacket 336 is equipped for Lumpy mode; preserve the starting character setup.",
    (3, 12, 0, 17): "Playtest cheat reward explicitly labeled by the event; not a normal acquisition.",
    (3, 12, 0, 19): "Playtest cheat reward explicitly labeled by the event; not a normal acquisition.",
    (19, 2, 0, 2): "No one-time guard: sets global switch 86, while its consumed page requires self-switch A, which is never set here.",
    (50, 12, 0, 15): "Black Ooze vending purchase; shop transactions stay vanilla.",
    (50, 12, 0, 31): "Black Ooze vending purchase; shop transactions stay vanilla.",
    (50, 12, 0, 48): "Black Ooze vending purchase; shop transactions stay vanilla.",
    (50, 12, 0, 65): "Black Ooze vending purchase; shop transactions stay vanilla.",
    (50, 12, 0, 82): "Black Ooze vending purchase; shop transactions stay vanilla.",
    (266, 10, 0, 4): "Converts owned/equipped weapon 249 to 251 on leaving the area; preserve both inventory and swapAllWpn paths as a transformation.",
    (266, 10, 0, 15): "Converts owned/equipped weapon 250 to 252 on leaving the area; preserve both inventory and swapAllWpn paths as a transformation.",
    (333, 27, 0, 85): "Repairs Joel's equipped Fuzzy: grants 173, equips it, removes 171 and the loose 173 copy; preserve the character equipment transformation.",
    (457, 1, 3, 39): "User decision: Marc-Andre's companion recruitment item stays vanilla, including his active/napping forms.",
}
