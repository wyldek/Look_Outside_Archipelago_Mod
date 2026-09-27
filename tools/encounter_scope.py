"""Reviewed encounter scope for game build 74642914."""

# Optional kills do not have standalone checks. A quest's terminal combat route
# can resolve its shared reward group, as with Joel, under the user's later
# choice-independent resolution rule. This is not a complete NPC taxonomy.
# Fixed Simple Key drops from Kaeley and Nestor's body are an explicit user
# exception, validated by simple_key_scope.py. Other rewards stay excluded.
FRIENDLY_KILL_ENEMIES = {
    14: "Eugene: optional merchant kill",
    15: "Nestor: alternate merchant encounter in Eugene's shop",
    32: "Joel: no standalone kill drop; scripted rewards share Joel Resolution",
    38: "Montgomery: troop 60 offers shelter or refusal; combat requires Attack confirmation",
    39: "Xaria: troop 60 offers shelter or refusal; combat requires Attack confirmation",
    47: "Mystery Trader: optional visitor kill; the entire Gauntlet remains vanilla",
    55: "Gamer: merchant; troop 55 Attack choice and confirmation precede combat",
    74: "Swordsgamer: armed form of the same optional Gamer attack in troops 55/255",
    59: "Harriet: peaceful rescue quest; troop 33 Attack choice requires confirmation",
    72: "Craftsman: merchant; troop 72 Attack choice requires confirmation",
    145: "Lyle: peaceful photography quest; troop 145 explicitly asks before attacking",
    130: "Kaeley: merchant; only the explicitly approved Simple Key drop is an AP check",
    153: "Nestor's passive body: only the approved shared Simple Key check is in scope",
    191: "Aster: recruitable actor 3; troop 121 Attack choice requires confirmation",
    193: "Jasper: no standalone kill drop; gifts reconcile through Jasper Resolution",
    281: "Face Taker: Fake Frederic's optional Attack path or the excluded Gauntlet",
    693: "Stuart: mechanic and merchant; troop 604 choice 103 confirms an optional attack",
    740: "Hellen: recruitable character kill",
    52: "Gun Trader: troop52 offers trading; combat requires the Attack choice",
    53: "Tough Guy: troop53 offers trading; combat requires the Attack choice",
    54: "Doctor: troop54 offers trading; combat requires the Attack choice",
    56: "Dan: troop56 offers recruitment; combat requires the Attack choice",
    58: "Hellen: troop58 offers recruitment; combat requires the Attack choice",
    64: "Father Andrew: troop64 offers blessings/supplies; combat requires the Attack choice",
    69: "Kind Faced Man: troop73 offers shelter/refusal; combat requires the Attack choice",
    701: "Pizza delivery: troop249 offers ordering; combat requires the Attack choice",
    898: "Butcher: troop251 offers trading; combat requires the Attack choice",
}

# These combat encounters come from the random visitor queues in bunchastuff.js
# (grabDoorEncounter / cursed encounter selection), not fixed map spawns.
# Their ordinary guaranteed loot stays local along with other random encounters.
RANDOM_VISITOR_ENEMIES = frozenset((338, 341, 344, 896, 897, 904, 906, 909))

# Original visitor dialogue ends through command340 without a Fight branch.
# Enemy database loot on these dialogue actors is not an obtainable acquisition.
NONCOMBAT_VISITOR_ENEMIES = frozenset((63, 68, 70, 71))

# Test encounter4 and obsolete visitor65 have no fixed call, map encounter,
# enemy transformation, or entry in the live visitor queues in this build.
UNUSED_ENCOUNTER_ENEMIES = frozenset((5, 65))

# Map rewards outside an audited choice-independent resolution group.
# Joel's four map rewards are validated separately in quest_resolution_scope.py.
FRIENDLY_KILL_REWARDS = (
    {(9, 14, page, 9 if page < 2 else 8) for page in range(3)}
    # Fake Frederic only enters combat through the player's Attack choice.
    # States 60/70 are combat phases, not independently hostile quest outcomes.
    # His alternate bag grants now belong to Frederic Resolution. The face
    # remains a vanilla kill reward, with no additional AP location.
    | {(96, 12, page, 22) for page in range(3)}
)

# User decision: exclude the whole Gauntlet, whose entrance requires the
# Mystery Trader's kill reward. These are the native Gauntlet map IDs.
VANILLA_GAUNTLET_MAPS = frozenset((466, 467, 468, 469, 470, 471, 472, 474))

# Both entrances require Eugene's Key. The only copies are Eugene/Nestor kill
# drops; the interior unlock switches can only be set from inside those rooms.
# Keep the contents vanilla under the same no-required-friendly-kill policy.
# Lyle's Dark Room likewise requires his optional kill reward, item 315.
VANILLA_FRIENDLY_LOCKED_MAPS = frozenset((112, 329, 330, 331, 332, 333))
