"""First reviewed building routes; see docs/access_logic.md for outstanding work.

Page and command numbers are zero based. No rule measures combat capability.
Powered routes use permanent AP restoration so generation does not depend on
finishing a route before the native outage. Earlier access remains possible.
"""

from .access import AccessGraph, Check, Entrance, FREE, all_of, any_of, item, region
from .disc_rules import sums


POWERED_ELEVATOR = all_of(item("Elevator Access"), item("Power Restored"))
# Nine bundles supply 27 keys, covering all 26 native ordinary locks in any
# order, including vanilla-only safes and every wrong turn in Kaeley's maze.
# AP collection history cannot model a spent key. Use a conservative global
# budget instead of treating the same key as reusable at unrelated doors.
ORDINARY_LOCK = item("Simple Keys (3)", 9)
IRIS_LOCKS = item("Iris Key", 6)  # Six native spends, in any order; seven AP copies.
# All colored locks can be opened in any order with this finite regional budget.
# Black Keys (2) is one AP receipt; yellow keys are three separate receipts.
UNLABELED_LOCKS = all_of(item("green key"), item("red key"), item("yellow key", 3),
                       item("blue key"), item("white key"), item("Black Keys (2)"))
# The four astronomers each hold one offering. Native transformations of these
# inputs also qualify. Lyle's repeatable photo-paper dialogue stays vanilla.
# One Guinea Pig may replace ONE category, not satisfy all four simultaneously.
OFFERING_CATEGORIES = (
    any_of(region("Apartment 21"), item("Old Photograph")),
    any_of(item("Blank VHS tape"), item("Old Tape")),
    any_of(item("Canvas Carry Bag"), item("Wrapped Painting")),
    any_of(item("Crumpled Manuscript"), item("Clean Manuscript"),
           item("Loose Manuscript"), item("Last Will")),
)
RITUAL_OFFERINGS = any_of(all_of(*OFFERING_CATEGORIES), *(
    all_of(item("Guinea Pig"), *(rule for index, rule in enumerate(OFFERING_CATEGORIES) if index != replaced))
    for replaced in range(len(OFFERING_CATEGORIES))
))
ASTROLABE_DISCS = all_of(*(item(name + " Disc") for name in (
    "Sun", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune")))
ENTRANCES = (
    Entrance("Menu", "Apartment 33", FREE, "Map003 event9 page0 command40 exits home; no AP prerequisite"),
    Entrance("Apartment 33", "Floor 3", FREE, "Map003 event9 page0 command40 -> Map006"),
    Entrance("Floor 3", "Apartment 36", FREE, "Map006 event9 page0 command0 -> Map023"),
    Entrance("Floor 3", "Original Teeth Apartment", FREE,
             "Map006 event7 pages1-3 -> Map031 -> Maps032/033/034; eight timed pickups are excluded from progression"),
    Entrance("Floor 3", "Late Teeth Apartment", FREE,
             "Map006 event7 page10 opens Map435 on Day9 without AP items; -> Maps436/408; calendar advancement is player controlled"),
    Entrance("Floor 3", "Apartment 31", FREE,
             "Map006 event2 Day2 -> Map108 when lit or Map265 when dark; both have doors to Maps109/110; temporary shadow blocks clear locally"),
    Entrance("Floor 3", "Taxidermy Apartment", FREE,
             "Map006 event8 page1 opens Map270 on Day4; unrestricted internal doors to Maps276/277/278"),
    Entrance("Taxidermy Apartment", "Flesh Taxidermy Apartment", item("Shrunken Head"),
             "Map276 event2 consumes item378 to open selfA -> Map279 -> Map282; event1 sets694 and opens Map280/281/283/284"),
    Entrance("Flesh Taxidermy Apartment", "Taxidermy Northeast Room", FREE,
             "Map282 event1 sets694; return through Map279/276/270; Map270 event1 now opens Map275"),
    Entrance("Apartment 36", "Wounded Man", FREE,
             "Map023 event40 page0 commands18-20 accept the bat pickup's self-switch even without receiving its AP item"),
    Entrance("Wounded Man", "Apartment 37", FREE,
             "Map024 event3 page0 command2 sets94; Map006 event4 page1 command0 -> Map035"),
    Entrance("Wounded Man", "Apartment 36 Bedroom", FREE,
             "Map023 event8/43-47 TV encounter sets97 after94; event3 page1 -> Map025"),
    Entrance("Apartment 37", "Apartment 37 Locked Room", ORDINARY_LOCK,
             "Map035 event24 CE184 consumes one key and permanently opens selfA -> Map352"),
    Entrance("Floor 3", "Stairwell", item("Padlock Key"),
             "Map006 event11/12 page0 item301 sets101; page1 command13 -> Map028"),
    Entrance("Stairwell", "Floor 2", FREE, "Map028 -> Map091; Map091 event1/2 -> Map007"),
    Entrance("Stairwell", "Basement East", item("Basement Key"),
             "Map028/091/026/027 -> Map030; event5 page0 item303 sets102; page1 command8 -> Map048"),
    Entrance("Floor 2", "Apartment 21", item("Apt. 21 Key"),
             "Map007 event2 page0 item302 unlocks selfA; page1 command9 -> Map009"),
    Entrance("Apartment 21", "Floor 1", FREE,
             "Map009 event4 -> Map012 event2 -> Map013 event2 -> Map094 event1 -> Map092; bedroom herbicide door is separate"),
    Entrance("Floor 1", "Stairwell", FREE,
             "Map092 event11/12 page0 sets88 and exits to Map026; this unlock is only from the Floor 1 side"),
    Entrance("Floor 3", "Elevator", POWERED_ELEVATOR,
             "Map006 event5 page3 requires115+21; command9 -> Map074"),
    Entrance("Elevator", "Floor 2", FREE, "Map074 event2 page1 command110 -> Map007"),
    Entrance("Elevator", "Floor 1", FREE, "Map074 event2 page1 command114 -> Map092"),
    Entrance("Elevator", "Ground Floor", FREE, "Map074 event2 page1 command118 -> Map047"),
    Entrance("Elevator", "Basement West", FREE, "Map074 event2 page1 command122 -> Map050"),
    Entrance("Stairwell", "Ground Floor", all_of(sums((2, 3)), item("Power Restored")),
             "CE64 command55 total3 (Earth1+Mars2 or Sun13+Negative-10); Map027 event7/8 page2 require100+21"),
    Entrance("Floor 1", "Abyss Apartment", all_of(item("Earth Disc"), item("Power Restored")),
             "CE64 command37 requires disc value1; Map092 event10 page1 requires99+21 -> Map106"),
    Entrance("Floor 3", "Floor 3 Janitor Closet", item("Janitor Key Ring"),
             "Map006 event10 page0 item306 sets selfA; page1 -> Map089"),
    Entrance("Floor 2", "Floor 2 Janitor Closet", item("Janitor Key Ring"),
             "Map007 event3 page0 item306 sets selfA; page1 -> Map090"),
    Entrance("Floor 1", "Painter Front Room", FREE, "Map092 event17 page0 command10 -> Map096"),
    Entrance("Painter Front Room", "Painter Interior", item("Painter's Key"),
             "Map096 event2/22 require item293 -> Map217/236 -> Map097/119/237/238/042"),
    Entrance("Floor 1", "Rat Apartment", FREE, "Map092 event13 -> Map100; event2 -> Map102 without an item"),
    Entrance("Floor 1", "Floor 1 Closet", FREE, "Map092 event8 page0 command10 -> Map098"),
    Entrance("Floor 1", "Eye Apartment", FREE, "Map092 event15 page0 command11 -> Map099"),
    Entrance("Floor 1", "Rat Lair", FREE,
             "Map092 event57 -> Map289; events3/5 -> Map291/290 with no item gate"),
    Entrance("Floor 1", "Apartment 18", FREE,
             "Map092 event59 -> Map293 event5 -> Map296 event1 -> Map297 event6 -> Map298; this east route bypasses the locked north/south doors"),
    Entrance("Floor 2", "Manuscript Apartment", FREE,
             "Map007 event8 -> Map115; events4/5/12 -> Map117/118/116 without an AP prerequisite"),
    Entrance("Basement East", "Boiler Maze", FREE,
             "Map048 event3 -> Map079; event16 command18 -> Map189; no key or power requirement on Normal"),
    Entrance("Boiler Maze", "Basement West", FREE,
             "Map189/192/193 event7 page0 command1 -> Map197; event12 -> Map303 -> Map084 -> Map075 -> Map086 -> Map087 -> Map050"),
    Entrance("Basement West", "Basement East", FREE,
             "Map050 event16 -> Map087 -> Map086 -> Map075; event1 unlocks111 from the far side -> Map048"),
    Entrance("Basement West", "Electrical Room", FREE,
             "Map050 event2 -> Map088 event2 -> Map368 event5 -> Map369; restoration is not required to reach its own fuse box"),
    Entrance("Basement East", "Basement Apartment B1", FREE,
             "Map048 event14 page1 is unconditional and shadows the old key page; -> Map299 event2 -> Map300"),
    Entrance("Basement East", "Basement Locked Storage", ORDINARY_LOCK,
             "Map048 event3 -> Map079 event3 CE184/selfA -> Map081"),
    Entrance("Ground Floor", "Corner Store Storage", item("Store Key"),
             "Map047 event5 page0 item304 unlocks selfA -> Map052 event2 -> Map053"),
    Entrance("Ground Floor", "Ground Janitor Room", item("Janitor Key Ring"),
             "Map047 event8 page0 item306 unlocks selfA -> Map060"),
    Entrance("Ground Floor", "Ground Lobby", FREE,
             "Map047 event3 -> Map128; free trigger events10/12-14/16/66-69 set223; event6 bus scene sets222 -> Map070"),
    Entrance("Ground Lobby", "Ground Janitor Closet", item("Janitor Key Ring"),
             "Map070 event13 page0 item306 unlocks selfA; page1 -> Map061"),
    Entrance("Ground Lobby", "Office Front", all_of(item("Power Restored"), any_of(
        all_of(region("Elevator"), sums((2, 29))),
        all_of(region("Stairwell"), sums((2, 3), (2, 29))))),
             "Map065 event3 -> Map068 needs29; retain separate discs at the Ground Floor gate unless using the elevator"),
    Entrance("Office Front", "Office Inner", all_of(item("Power Restored"), any_of(
        all_of(region("Elevator"), sums((2, 29), (2, 15))),
        all_of(region("Stairwell"), sums((2, 3), (2, 29), (2, 15))))),
             "Map068 event7 -> Map126 needs15 while front door29 remains open; allocation includes ground gate3 on stair route"),
    Entrance("Ground Floor", "Mailroom Storage", all_of(item("Power Restored"), any_of(
        all_of(region("Elevator"), sums((5, 146))),
        all_of(region("Stairwell"), sums((2, 3), (5, 146))))),
             "Map071 event2 -> Map072 needs five discs totaling146; retain ground-gate discs on stair route"),
    Entrance("Basement East", "Security Lobby", all_of(item("Power Restored"), sums((4, None))),
             "Map048 event2 page1 requires112+21 -> Map049; CE64 balance uses four occupied sockets261-264"),
    Entrance("Security Lobby", "Security Storage", all_of(item("Power Restored"), sums((4, None), (2, 18))),
             "Map049 event1 -> Map077 needs total18 while four distinct discs hold the outer balance gate"),
    Entrance("Basement East", "Pluto Storage", all_of(item("Power Restored"), item("Pluto Disc")),
             "Map079 event5 -> Map080 requires255+21; CE64 command150 socket272 value5"),
    Entrance("Floor 2", "Sea Apartment Entrance", FREE,
             "Map007 event18 -> Map125; Maps137/140 have no valve gate; Rebreather only increases oxygen time"),
    Entrance("Sea Apartment Entrance", "Sea Apartment West", item("Twilight Valve"),
             "Map125 event7 consumes296 and sets selfA -> Map133/135/136"),
    Entrance("Sea Apartment Entrance", "Sea Apartment East", item("Midnight Valve"),
             "Map140 event6 consumes297 and sets selfA -> Map143/138; variable444 is only set in unused Map164"),
    Entrance("Sea Apartment Entrance", "Sea Apartment Lower", item("Abyssal Valve"),
             "Map125 events24/27 advance445 to2; event13 consumes298 -> Map144; local story triggers open Map155/147/149/159/152"),
    Entrance("Sea Apartment Lower", "Sea Apartment Depths", item("Hadal Valve"),
             "Map152 event1 consumes299 -> Map158; event6 advances445 to10 for Lethargy; no combat equipment requirement"),
    Entrance("Floor 3", "Frozen Apartment", FREE,
             "Map006 event6 accepts local incendiaries or salt -> Map120; local salt clears internal ice in Maps121-124/271"),
    Entrance("Apartment 21", "Apartment 21 Bedroom", FREE,
             "Map009 event2 consumes local herbicide -> Map010; vanilla supplies are assumed obtainable"),
    Entrance("Basement West", "Basement Herbicide Storage", FREE,
             "Map303 event19 consumes local herbicide -> Map085; vanilla supplies are assumed obtainable"),
    Entrance("Basement West", "Fungus Tunnels", FREE,
             "Map303 events3/5 -> Map083 event8 -> Map188 -> Map187 -> Map127; local mushroom barriers and fights require no AP item"),
    Entrance("Ground Lobby", "Cafe", FREE,
             "Map070 event17 -> Map056 event2 -> Map058; Normal Uranus pickup is in the kitchen"),
    Entrance("Apartment 31", "Flesh Home", FREE,
             "Map108 event17 sets local darkness223=0 even with power on; Map111 event2 -> Map269 -> Map268 -> Map267; alternative Map265/266 route"),
    Entrance("Flesh Home", "Unlabeled Game", all_of(item("Unlabeled Cartridge"), UNLABELED_LOCKS),
             "Map267 event24 sets660 around CE12 -> CE40 -> Map406; full colored-key budget covers Maps439-450 and their exits to First Head on Map463"),
    Entrance("Floor 3", "Apartment 32", FREE,
             "Map006 event33 page3 opens Map353 from Day4; Map353 event2 -> Map355 foyer before its twelve maze locks"),
    Entrance("Floor 1", "Jasper Apartment", item("Jasper's Key"),
             "Map092 event44 local herbicide -> Map105 event13 item384/selfA -> Map344; herbicide door6 -> Map357"),
    Entrance("Jasper Apartment", "Planetarium", FREE,
             "Map357 event5 combination puzzle sets993; event1 page1 -> Map345; combination input needs no AP item"),
    Entrance("Planetarium", "Planetarium Telescope Room", item("Planetarium Door Access"),
             "Map345 event31 page1 requires699 -> Map360; receiving the access item opens this permanent door independently of solving the astrolabe"),
    Entrance("Ground Lobby", "Astronomers", all_of(item("Power Restored"), region("Floor 2"),
             region("Floor 1"), region("Basement West")),
             "Troops121-124 lore advances595 through local conversations; Aster Map007 event14 and Beryl Map075 event6 require21; Aurelius Map098 and Jasper Map065"),
    Entrance("Floor 2", "Apartment 20 Early", FREE,
             "Map007 event24 starts583=1 and enters Map285 before the native transformation; no AP item is required"),
    Entrance("Floor 2", "Apartment 20 Late", all_of(region("Stairwell"), item("Power Restored"), sums((2, 3))),
             "Cross Map027 event7/8's powered disc door to advance583 to20/22; Map007 event24 then enters304, whose doors1/4 reach286/287; the elevator alone does not advance583"),
    Entrance("Floor 2", "Apartment 22", region("Apartment 20 Late"),
             "Troop59's native visitor conversation enables409; Map007 event21 opens334 once583>=20; no Laundry delivery or combat capability gate"),
    Entrance("Ground Lobby", "Landlord's Apartment", FREE,
             "Map070 event61 starts362; CE5 advances it hourly; Map047 event9 opens62 after362>=4; native rent stages169 use local coins via CE109, leading through184/182 to130"),
    Entrance("Elevator", "Floor 4", FREE,
             "Map074 event2's Ground->3->1->2 sequence advances817 to4 and offers Floor4 ->313 ->454; native scripted sequence verified without another AP item"),
    Entrance("Pluto Storage", "Wilhelmina's Tomb", region("Apartment 21"),
             "Map009 event12 gives the vanilla crossword book237; finish it at home beforeDay15 to learn randomized code493; Map080 event1 ->167 ->342 event4 ->169; no guessing or friendly kill required"),
    Entrance("Basement West", "Charan's Pit", item("Rose"),
             "Map086 event77 ->272 ->339 before the Day7 earthquake; CE213 ->Troop590 accepts Rose360 and sets680; no combat requirement"),
    Entrance("Charan's Pit", "Charan's Cave", FREE,
             "A later real CE6 new day sets677 after680; revisit CE213 before the Day7 earthquake ->400 ->401; this does not promise synthetic days or bypass the native cutoff"),
    Entrance("Eye Apartment", "Flesh Central", IRIS_LOCKS,
             "Map099 event18's Stab me choice consumes an Iris Key and sets1071; event21 ->414; local one-way opener1111 reaches415 and the wrapped central hall384"),
    Entrance("Basement West", "Flesh Central", IRIS_LOCKS,
             "Map086 event90 ->308 event6 consumes an Iris Key ->423; opening1109 from396 connects the same central network; no combat-capability predicate"),
    Entrance("Ground Floor", "Flesh Outer", IRIS_LOCKS,
             "Map047 event2 ->55 event18's Iris interaction ->419; opener420 event1 sets1113; only the outer385/421/426 component is reachable"),
    Entrance("Sea Apartment Depths", "Flesh Outer", IRIS_LOCKS,
             "Map158 event10 consumes an Iris Key ->383 west component;395/393 west ->424 west ->385/421/426;427's far-side opener sets1114"),
)


CHECKS = {}


def add(region_name, evidence, *keys, rule=FREE):
    for key in keys:
        if key in CHECKS:
            raise ValueError(f"Duplicate access rule: {key}")
        CHECKS[key] = Check(region_name, rule, evidence)


add("Landlord's Apartment", "Map064 event5 page1 -> Map180 event12 Troop295; native rent stages use local coins; first conversation gives the Radio",
    "scout_radio")
add("Apartment 33", "Map003 events88/89 share variable496; the fourth inspection yields the same single Screamatorium copy",
    "home_bookshelf_screamatorium")
add("Painter Interior", "Map217 event4 -> Map218 event2 Troop334; peaceful gift requires portraits306<=1, including the final Stained Key room; refusal or victory also resolves it",
    "bright_frederic_jar", rule=item("Stained Key"))
add("Basement West", "Electronic Key invokes CE60 near Map086 event59;601 consumes the trunk;12 shells remain vanilla",
    "car_trunk_shotgun", rule=item("Electronic Key"))
add("Landlord's Apartment", "Map207 -> Map240 event13 Troop294; first conversation gives the detector before any attack/leave choice; replacements cost local coins",
    "minesweeper_first_detector")
add("Fungus Tunnels", "Map127 event76 -> Map437 event2 -> Map438 event3 Troop207; nonlethal duel ends in surrender at 2% HP, with no combat-equipment predicate",
    "comatus_whisperblade")
add("Fungus Tunnels", "Map187 fungus rescues; Papineau presence is optional; Mother victory or exposing the illusion reconciles closed rescue checks",
    "jean_pierre_greatsword", "sylvain_elegant_cap", "claire_breastplate")
add("Basement West", "Map086 event104 Troop615; every victory resolves the reward, including victory before Darryl's turn-four gift condition",
    "darryl_legs")
add("Floor 1", "Map105 event13 Jasper's Key -> Map344; event7 local herbicide ->351; help the Husk and wait24 native hours, then cafe56 gift; early victory also resolves",
    "spider_husk_heart", rule=all_of(item("Jasper's Key"), region("Ground Floor")))


add("Floor 3", "Map006 event13 page0: planter pickup; no key required",
    "map006_event013")
add("Apartment 36", "Map023 event41 page0: fixed bat pickup before the tutorial doorway",
    "map023_event041_baseball_bat")
add("Wounded Man", "Map024 events3/7: hostile encounter and pickups; no combat gear requirement",
    "map024_event003_complex", "map024_event007_padlock_key")
add("Apartment 37", "Map035 event11; free internal doors to Maps038/039; Vincent is hostile",
    "map035_event011_carving_fork", "map038_event003", "map038_event004_quest_item",
    "map039_event005", "map039_event007_quest_item", "boss_drop_21_3")
add("Stairwell", "Map030 event10 is outside the locked basement door", "map030_event010")
add("Floor 2", "Map007 events1/30: hallway pickups", "map007_event001_quest_item", "map007_event030_complex")
add("Apartment 21", "Map009 event3 is an unrestricted closet door -> Map011 event4", "map011_event004")
add("Floor 3 Janitor Closet", "Map089 event9", "map089_event009_quest_item")
add("Floor 2 Janitor Closet", "Map090 fixed equipment and figure events",
    "map090_event005", "map090_event006", "map090_event007", "map090_event008", "map090_event011_quest_item")
add("Painter Front Room", "Map096 event7 is in the front room before either Painter's Key door", "map096_event007")
add("Painter Interior", "Unrestricted internal routes from Map217/236; simple-key safes reviewed separately",
    "map097_event009", "map097_event049_quest_item", "map119_event010",
    "map237_event009_complex", "map238_event006_complex", "map042_event009")
add("Rat Apartment", "Map100 and Map102 fixed pickups; no item gate between these rooms",
    "map100_event013", "map100_event014", "map100_event016_quest_item",
    "map102_event009", "map102_event010", "map102_event013")
add("Floor 1 Closet", "Map098 events2/14", "map098_event002", "map098_event014_quest_item")
add("Manuscript Apartment", "Map115 event11 and unrestricted door to Map117 event7",
    "map115_event011", "map117_event007")
add("Manuscript Apartment", "Map115 event2 pages0/1 Typewrither victory grants the Loose Manuscript without an AP input",
    "map115_event002_quest_reward")
add("Painter Front Room", "Troop327 page0 command95 introductory gift precedes the internal key doors",
    "frederic_painters_key")
add("Painter Interior", "Troop327 command163 requires at least three portraits resolved (306<=7); several portraits are before the Stained Key door",
    "frederic_canvas_bag")
add("Painter Interior", "Troop332 command80 accepts Lucky Cowboy Hat's native transformed187 form; hostile six-part victory is another source; this rule keeps the hat route available",
    "green_portrait_stained_key", rule=item("Cowboy Hat (Lucky)"))
add("Painter Interior", "Troop327 command221 final reward requires306<=1; final portrait Map239 is behind Map097 event53 Stained Key door; resolution also covers hostile Frederic outcomes",
    "frederic_paint_palette", rule=item("Stained Key"))
add("Astronomers", "Troops121-124 lore conversation sequence unlocks Jasper's apartment-key dialogue; no offering is needed for this intermediate reward",
    "jasper_apartment_key")
add("Astronomers", "Troop124 command577 requires36>=4; CE264 and Troops122-124 accept four distinct offerings; normal ritual departure reconciles all Jasper rewards",
    "ritual_roof_key", "ritual_dark_robes", rule=RITUAL_OFFERINGS)
add("Floor 1", "Map094 event9 commands268/269 and319/320 require both quest inputs before command333",
    "map094_event009_quest_reward", rule=all_of(item("Stationery"), item("Fountain Pen")))
add("Abyss Apartment", "Map106 event2 fixed Mars Disc", "map106_event002_quest_item")
add("Basement West", "Map050 event3 page0 enters Map074 for its hostile encounter before the AP elevator unlock",
    "map074_event003_elevator_freak")
add("Electrical Room", "Map369 event24; native and AP restoration states do not consume the fuse-box check",
    "power_restoration")
add("Apartment 36 Bedroom", "Map025 event2 fixed key before its separate vanilla safe",
    "simple_key_map025_event002")
add("Apartment 37 Locked Room", "Map352 events14/15; one shared lock at Map035 event24",
    "map352_event014", "map352_event015")
add("Apartment 21", "Map011 event9 safe; one key consumed by CE184",
    "map011_event009_safe_94", rule=ORDINARY_LOCK)
add("Floor 3 Janitor Closet", "Map089 event2; no additional internal lock", "simple_key_map089_event002")
add("Eye Apartment", "Map099 event17 fixed key", "simple_key_map099_event017")
add("Rat Lair", "Maps290/291 unrestricted fixed pickups; actor conditions only add dialogue",
    "map290_event006", "map291_event006", "simple_key_map291_event019")
add("Floor 1", "Map094 connects to the Floor1 hall; Nestor body forms share one hostile encounter resolution",
    "simple_key_drop_153")
add("Abyss Apartment", "Map106 event8 -> Map107; event1 actor condition only adds dialogue", "map107_event001_complex")
add("Painter Interior", "Map119 event14 safe; one key consumed by CE184",
    "map119_event014_safe_102", rule=ORDINARY_LOCK)
add("Basement Apartment B1", "Map299 event7 and Map300 event4 fixed pickups",
    "map299_event007", "map300_event004")
add("Basement Locked Storage", "Map081 event3; lock is on Map079 event3", "map081_event003")
add("Basement West", "Map086 event77 -> Map272; Map303 lies on the Boiler Maze/west-basement connection",
    "simple_key_map272_event004", "simple_key_map303_event023")
add("Basement West", "Native outage introduces Map050 event11 and Map086 event104; AP restoration preserves both phase-gated encounters",
    "boss_drop_619_260", "boss_drop_619_44", "map086_event106")
add("Basement West", "Map086 event60 native pickup triggers383 and Hellcar event14; car42 activates on local coordinates and car58 on contact; no security-room gate",
    "map086_event060_complex", "boss_salvage_351", "boss_salvage_352", "boss_salvage_353",
    "boss_drop_184_10", "boss_drop_189_10")
add("Basement West", "Map086 event90 -> Map308 event1 after Hellcar; no AP combat capability requirement",
    "map308_event001")
add("Ground Floor", "Map047 event1 -> Map054 and event2 -> Map055; fixed pickups have no further gate",
    "simple_key_map054_event039", "map055_event039_quest_item")
add("Corner Store Storage", "Map052 event5 and Map053 event2; actor conditions only add dialogue",
    "map052_event005_quest_item", "map053_event002")
add("Corner Store Storage", "Map053 event8 safe; one key consumed by CE184",
    "map053_event008_safe_101", rule=ORDINARY_LOCK)
add("Ground Janitor Room", "Map060 event11 fixed Acid Sprayer; no quest input", "map060_event011_complex")
add("Ground Janitor Closet", "Map061 events3/6 fixed pickups",
    "simple_key_map061_event003", "map061_event006_quest_item")
add("Ground Floor", "Map047 event11 -> Map071; events5/22/24 unrestricted fixed pickups",
    "map071_event005_quest_item", "map071_event022", "map071_event024")
add("Ground Floor", "Map047 event14 -> Map069; fixed equipment and figure before the laundry quest",
    "map069_event006", "map069_event010", "map069_event021_quest_item")
add("Ground Floor", "Map047 events24/25 -> Map073 event8; both rewards behind the same safe lock",
    "map073_event008_safe_83", "map073_event008_safe_54", rule=ORDINARY_LOCK)
add("Basement West", "Map073 event11 starts Janitor phase424; event7 victory or CE118 sets2; Map087 event21 then has the ring",
    "map087_event021_quest_item", rule=region("Ground Floor"))
add("Original Teeth Apartment", "Maps031/032/033/034 fixed pickups before the Day4 deadline; internal side door bypasses the locked bedroom door",
    "map031_event009_frying_pan", "map031_event030_hoodie", "map032_event009_mop",
    "map033_event007_baseball_cap", "map034_event019", "map034_event025_tank_top")
add("Original Teeth Apartment", "Map034 event24 safe; deadline makes this filler-only even with the key budget",
    "map034_event024_complex", rule=ORDINARY_LOCK)
add("Late Teeth Apartment", "Clint/Joel/Benjamin/Madison resolution hooks reconcile early rewards through their permanent Map435 forms",
    "clint_rags", "clint_tooth_knife", "joel_peaceful_door_knob", "joel_resolution_toothy_whip",
    "benjamin_game", "benjamin_pendant", "madison_tooth_hammer")
add("Late Teeth Apartment", "Map435 event6 -> Map408; events7/8/9 -> Map436; equipment pickups have no item requirement",
    "map408_event010", "map436_event008", "map436_event010", "map436_event011")
add("Apartment 31", "Map108/265 events4/5 -> Map110/109 in either lighting state; all three fixed pickups are unrestricted",
    "map109_event007", "map110_event010", "map110_event014")
add("Apartment 31", "Map109 event12 safe", "map109_event012_safe_95", rule=ORDINARY_LOCK)
add("Taxidermy Apartment", "Map276 event5 and Map277 event4, before the Shrunken Head passage; household valuables stay vanilla",
    "map276_event005", "map277_event004_quest_item")
add("Flesh Taxidermy Apartment", "Unrestricted internal doors from Map282 after activating switch694; fixed equipment pickups",
    "map280_event006", "map281_event002", "map282_event002", "map283_event003", "map284_event004")
add("Flesh Taxidermy Apartment", "Returning after Map282 event1 activates Map270 event6's hostile Suture Wire encounter; no combat equipment requirement",
    "boss_salvage_355", "boss_drop_450_135")
add("Taxidermy Northeast Room", "Map275 event4 fixed equipment after the switch694 door; taxidermy valuables stay vanilla",
    "map275_event004")
add("Taxidermy Northeast Room", "Map275 event7 safe; head passage plus ordinary key budget",
    "map275_event007_safe_96", rule=ORDINARY_LOCK)
add("Apartment 18", "Fixed pickups along unrestricted east route: Maps296/297/298",
    "map296_event006", "map297_event004", "map297_event005", "map298_event007_quest_item")
add("Office Front", "Map068 event8 fixed Claymore after the first disc door", "map068_event008")
add("Office Inner", "Map126 event2 fixed Unlabeled Cartridge after both office doors", "map126_event002_quest_item")
add("Mailroom Storage", "Map072 events3/5 fixed Saturn Disc and Silver Magnum",
    "map072_event003_quest_item", "map072_event005_complex")
add("Security Storage", "Map077 events4/5/7 fixed equipment after the 18-value disc door",
    "map077_event004", "map077_event005", "map077_event007_complex")
add("Pluto Storage", "Map080 event3 fixed Claymore", "map080_event003")
add("Sea Apartment Entrance", "Unrestricted pickups on Maps137/140 before either branch valve",
    "map137_event006", "map140_event010")
add("Sea Apartment West", "Map136 event7 after the single playable Twilight lock", "map136_event007")
add("Sea Apartment East", "Map138 event6 after the single playable Midnight lock", "map138_event006")
add("Sea Apartment Lower", "Map155 branches to Map147/149; Map144/159 reaches Shrimp Knight on Map152 before the Hadal lock",
    "map147_event008", "map149_event052", "boss_salvage_364")
add("Sea Apartment Depths", "Map158 event8 Lethargy victory after the Hadal lock", "boss_drop_267_347")
add("Frozen Apartment", "Native ice barriers consume assumed-local salt; internal doors reach Maps121/122/124/271",
    "map121_event010", "map122_event009_quest_item", "map122_event010", "map124_event010", "map271_event006")
add("Apartment 21 Bedroom", "Map010 event16 fixed game pickup after the herbicide passage", "map010_event016_quest_item")
add("Basement Herbicide Storage", "Map085 event24 fixed Musk Figure after the herbicide passage", "map085_event024_quest_item")
add("Fungus Tunnels", "Map188 event15 and Map187 event35 fixed keys/discs along the native mushroom path",
    "map188_event015", "map187_event035_quest_item")
add("Fungus Tunnels", "Map127 Guardian and Mother encounters; native local mushroom states, no AP combat requirements",
    "boss_salvage_354", "boss_drop_228_56", "boss_drop_226_288")
add("Cafe", "Map058 event4 Normal Uranus Disc and Mutt's choice-independent key resolution in Map056",
    "map058_event004_quest_item", "mutt_vending_key")
add("Flesh Home", "Map269 event13 Stretchface on the route from Apartment31 to the flesh bedroom", "boss_drop_164_48")
add("Unlabeled Game", "Full colored-key budget covers all nine colored lock spends in the game; no combat requirement or TV power/day gate",
    "map406_event002_quest_item", "map406_event016", "map439_event009", "map439_event010",
    "map440_event012", "map441_event005", "map442_event007", "map442_event009_quest_pickup",
    "map443_event008", "map443_event013", "map444_event002", "map446_event004",
    "map448_event006", "map450_event004", "boss_drop_824_377", "boss_drop_821_228", "boss_drop_889_275")
add("Apartment 32", "Map355 event43 Kaeley is in the foyer before the first maze lock; this guaranteed key drop was explicitly approved",
    "simple_key_drop_130")
add("Apartment 32", "Map355 events35/36 inside the twelve-lock maze; global budget covers every turn regardless of purchases",
    "map355_event035", "map355_event036", rule=ORDINARY_LOCK)
add("Jasper Apartment", "Map357 event2 -> Map377 event3 -> Map359; event5 -> Map378; both fixed pickups precede the astrolabe",
    "map359_event003_quest_item", "map378_event003")
add("Planetarium", "CE55 powered disc insertion; CE64 commands186-216 require nine occupied sockets771-779 holding Sun through Neptune in order",
    "planetarium_access", rule=all_of(item("Power Restored"), ASTROLABE_DISCS))
add("Planetarium Telescope Room", "Map360 event4 Telescope Pieces after permanent AP door switch699",
    "map360_event004")
add("Original Teeth Apartment", "Map034 event4 sets106 on local touch; event3 then107; events5-10/13 trigger Baby Teeth without a quest input; this check is deadline-excluded",
    "boss_drop_28_143")
add("Floor 1", "Map092 event16 -> Map036 event5 fixed equipment; native exit redirection introduces no AP gate",
    "map036_event005")
add("Basement East", "Map048 event19 -> Map273 event5; unlocked apartment entrance", "map273_event005")
add("Ground Lobby", "Map070 events57/58/59/60/71 share High Five; early terminal branch also resolves the Watch; local landlord wait changes phase362",
    "boss_drop_293_280")
add("Boiler Maze", "Map197 event17 hostile Pipe Man and Map256 event10 Boiler Beast; escaped Beast may appear in other maze rooms; no AP combat requirement",
    "boss_drop_415_379", "boss_drop_424_379")
add("Boiler Maze", "Map189 event6 -> Map194 event32; free maze corridor",
    "map194_event032")
add("Boiler Maze", "Map189 -> Map192 -> Map193 event5 -> Map219 event32",
    "map219_event032")
add("Boiler Maze", "Map189 -> Map194 -> Map195 event12 -> Map255; side-room equipment before the separate Gauntlet entrance",
    "map255_event003", "map255_event005", "map255_event006", "map255_event007")
add("Boiler Maze", "Map195 -> Map196 -> Map243 -> Map248 event6 -> Map256 event17",
    "map256_event017")
add("Boiler Maze", "Map193 -> Map219 -> Map244 -> Map245 -> Map254 -> Map257 event12",
    "map257_event012")
add("Boiler Maze", "Map189 -> Map194 -> Map200 event5 -> Map203 event38; fixed game pickup",
    "map203_event038_quest_item")
add("Boiler Maze", "Map189 -> Map198 -> Map199 event5 -> Map202 event18; hostile encounter requires no AP item",
    "boss_drop_421_116")
add("Boiler Maze", "Eight arm encounters in Maps189/193/195/243/246/251/257/258 set phase523=8; Map201 Furnace victory sets669 and reveals its key",
    "boss_drop_423_145", "map201_event063")
add("Boiler Maze", "Map198 -> Map201 -> Map251 -> Map252 events14/15 -> Map258 event17 safe",
    "map258_event017_safe_104", rule=ORDINARY_LOCK)

# These schedules describe opportunities during the native fifteen days.
# They never promise extra quest cycles after the cap. The generic ending can
# release missed checks; see docs/ending_release.md. Local recruiting/training
# and consumables remain player actions, without combat capability predicates.
add("Apartment 33", "Map004 event20/Troop279 recruits the bathroom roaches; CE6 advances899 through1/3/5 after home conversations; Map003 event121 reconciles all leadership choices",
    "roach_leadership_crown", "roach_leadership_sash")
add("Apartment 33", "Native Troop60 visitor recruits Monty/Xaria; CE6 advances213 and resets400; template Map002 event48 resolves the seventh conversation's card trick at638, before the powered vending machine",
    "map006_event025_quest_pickup")
add("Floor 2", "Map007 event13 and other native shadow rooms use CE54 spawning and Troop18; real new days advance150; Map006 event40 reconciles the doorstep gift, independent of relationship-dependent item choice",
    "shadow_tongue", "map006_event040_complex", "map006_event040_quest_item")
add("Apartment 32", "Map353 event6 enters356 for Pierre; native home/sleep/hour events advance617 and621; final conversation, victory, or final retreat reconciles all three rewards without an AP input",
    "pierre_clown_drawing", "pierre_old_mail", "pierre_clown_wig")
add("Apartment 32", "Map353 event13 hostile Louis victory sets904=4; CE6 spawns halves, then907/908 after their defeat; events21/19 provide head/torso drops without AP inputs",
    "boss_drop_707_366", "boss_drop_708_367")
add("Apartment 36", "Louis' native split quest spawns910; Map023 event57 is before its bedroom locks",
    "boss_drop_710_368", rule=region("Apartment 32"))
add("Apartment 37", "Louis' native split quest spawns909; Map035 event28 is before the ordinary locked side room",
    "boss_drop_709_369", rule=region("Apartment 32"))
add("Floor 2", "CE3 requires Basement Key to offer Dan's native quest; local Dan recruiting/training stays vanilla; Map007 event58 -> Map015 event2 -> Map016 event3 before the later quest finale",
    "map016_event003_quest_item", rule=item("Basement Key"))
add("Floor 2", "CE3 consumes Phone389 to start900; CE6/233 and Leigh's native conversations advance it; Map007 event4 ->434 requires900>=20 and Leigh present; CE125 Day15 cutoff stays vanilla",
    "leighs_call_ring", rule=item("Phone"))
add("Basement West", "Map075 event40 opens51 after seven interactions; Map051 event4 unseals430; event16's unconditional page1 supplies the check before Lumpy's optional transformation",
    "map430_event016_quest_pickup")
add("Floor 1", "Map092 event14 spawns Rat King locally; event45 victory yields the skull and reconciles the crown with or without the native good-luck flag659",
    "map092_event045_quest_pickup", "boss_drop_100_41")
add("Abyss Apartment", "Map106 event11 pages0/1 hostile victory and page3's Rusty Crown interaction now resolve the same Rat Claws check; crown is not required to use the hostile route",
    "map106_event011_complex")
add("Apartment 20 Early", "Map285 events10/12 are available before583>=20 redirects the apartment to304; no Laundry hand-in is needed",
    "map285_event010", "map285_event012")
add("Apartment 20 Late", "Map304 events1/4 freely enter286/287; fixed equipment before later Jeanne quest choices",
    "map286_event023", "map286_event026", "map287_event027")
add("Apartment 22", "Map334 event9 is an unrestricted pickup after the native Eileen visitor and Jeanne transformation gates",
    "map334_event009")
add("Ground Floor", "Map007 event24 starts583>=1; Map069 event56 then offers the Laundry check, before receiving or handing in the Laundry item",
    "map069_event056_quest_reward", rule=region("Floor 2"))
add("Apartment 18", "East route296->297->294->375 bypasses locked hall doors; Hellen's native recruitment, plant care and real new-day stages lead through376/371/432 to433 event9; no AP item consumed",
    "map433_event009_quest_pickup")
add("Landlord's Apartment", "Map062 ->64 event11 precedes the separate ordinary-key safe; native rent payments use assumed-local coins",
    "map064_event011")
add("Landlord's Apartment", "CE109 rent advances169 through the native apartment stages; Map184 event5 ->182 event2 ->130; Tank encounter checks player proximity to event2, not proximity to its off-map controller9",
    "boss_salvage_357", "map181_event003", "landlords_hell_basement_key")
add("Landlord's Apartment", "Stage2 Map064 event5 ->180 ->209 WarMedal before the later sealed door; 208 Bat is also reachable from the later warzone; collect within the native stage window",
    "map208_event018", "map209_event004_complex")
add("Landlord's Apartment", "Map205/206/130 doors reach207 and240; APC event22's native proximity move route triggers the hostile encounter; no party or gear predicate",
    "boss_salvage_356", "map240_event043")
add("Landlord's Apartment", "Native local herbicide opens Map215 event2 ->230 and216 event4 ->233; no Basement Key required (the item303 doors on these maps lead to other rooms)",
    "map230_event003_complex", "boss_salvage_365")
add("Landlord's Apartment", "Map064 event7 atstage4 ->211 ->235 ->234; Wraithscourge precedes234 event3's local-herbicide door ->380 Old Photograph",
    "map234_event002_quest_item", "map380_event003_quest_item")
add("Floor 4", "Map454 event9 ->465 event2; before the subway turnstile",
    "map465_event002")
add("Floor 4", "One of six accessible bins on451/452 guarantees local Metro Ticket349 via CE104; turnstile scripted move ->405; event9 ladder crosses to tracks ->453/455 ->457/456; native movement verified",
    "map456_event001_quest_item", "map457_event008")
add("Wilhelmina's Tomb", "Map169 event2 Wordsmith victory reconciles all five mutually exclusive rewards; crossword code and Pluto door are the only AP route dependencies",
    "wilhelmina_reward_sword", "wilhelmina_reward_spear", "wilhelmina_reward_hammer",
    "wilhelmina_reward_gun", "wilhelmina_reward_book")
add("Charan's Pit", "CE213 returning from Troop590 sets1064 when the Rose gift set680; Map339 event12 now supplies the sword check",
    "map339_event012")
add("Charan's Cave", "CE213's goCave branch ->400 ->401 event7; party member only adds dialogue, not an item gate",
    "map401_event007_quest_item")
add("Boiler Maze", "Map189 events19/32/33/37 execute a native move route on event18 that sets its selfA; hostile and peaceful terminal outcomes reconcile Tickle's drawing",
    "tickle_drawing")
add("Flesh Central", "Audited connected components from414 or423: wrapped384 ->393 Iris;415 Tetherblade;424 east Iris;385 ->429 grocery Iris;1115 does not open from394",
    "map393_event012", "map415_event006", "map424_event008", "map429_event001")
add("Flesh Outer", "Reception419 ->420 ->385/421 ->426 outside component; sea entrance is an alternative; disconnected from the central393 Iris component",
    "map421_event004", "map426_event001")
add("Floor 3", "Peaceful Sybil resolution: Apt35 Key opens364; bring Telescope Pieces to Jasper on65 (Ground Lobby) for vanilla repair, then give Telescope387 to Sybil; CE226 return reconciles both checks without attacking her",
    "map367_event001_quest_reward", "map348_event005",
    rule=all_of(item("Apt. 35 Key"), item("Telescope Pieces"), region("Ground Lobby")))

GRAPH = AccessGraph(ENTRANCES, CHECKS)
