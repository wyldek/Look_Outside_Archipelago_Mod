"""Generation-only calendar reservations, never client checks or clock commands.

Day zero is the native starting day. A milestone means a prompt route may now
cross that boundary. Preceding actions must be available before it. See
docs/calendar_deadlines.md for native signatures and conservative reservations.
"""

from .access import Event, FREE, all_of, event, item, region

LOGIC_VERSION = "chronological_access_v1"
CHARAN_LAST_START = 5
LEIGH_LAST_START = 10
LEIGH_TRANSITIONS = 4


def day(number):
    if not isinstance(number, int) or isinstance(number, bool) or not 0 <= number <= 15:
        raise ValueError("Calendar day must be an integer from 0 through 15")
    return FREE if number == 0 else event(f"Day {number}")


TIMED_EVENTS = (
    Event("Deliver Charan's Rose", "Charan Rose Delivered", "Charan's Pit", item("Rose"),
          "Map086 e77 ->272 e7 ->339; CE213/Troop590 gives Rose360 and sets680; "
          "CE6 c616-619 sets677 on the next day; Map086 e105 closes entry from Day7"),
    Event("Start Leigh's Phone Quest", "Leigh Quest Started", "Apartment 33",
          all_of(item("Phone"), region("Floor 2")),
          "CE3 c356-360 consumes389/start900=1; CE6 c628-657 plus CE233 need four "
          "new days; CE125 c0-3 exits on Day15; Floor2 Map007 e4 is the finale route"),
    Event("Open Original Teeth Safe", "Original Teeth Safe Accessible", "Original Teeth Apartment",
          item("Simple Keys (3)", 9),
          "Map034 e24 safe uses CE184; Map006 e29 closes original entrance Day4 noon, "
          "e7 p6 always closes from Day5; preserve the existing global ordinary-key budget"),
    Event("Finish Wilhelmina's Crossword", "Wilhelmina Crossword Solved", "Apartment 33",
          region("Apartment 21"),
          "Map009 e12 supplies237; Map003 e20 p0 c0-3 exits on Day15; repeated local "
          "hourly sessions finish491=100 and reveal493, including during the manual day hold"),
)

# These prerequisites constrain the SOLVER, not the game's Advance Day menu.
BOUNDARY_REQUIREMENTS = {
    5: event("Original Teeth Safe Accessible"),
    CHARAN_LAST_START + 1: event("Charan Rose Delivered"),
    LEIGH_LAST_START + 1: event("Leigh Quest Started"),
    15: event("Wilhelmina Crossword Solved"),
}

DAY_EVENTS = tuple(
    Event(f"Begin Day {number}", f"Day {number}", "Apartment 33",
          all_of(day(number - 1), BOUNDARY_REQUIREMENTS.get(number, FREE)),
          "Native day variable15 and CE6; manual advancement preserves days0-15. "
          "Any boundary reservation is documented in the corresponding timed event.", day=number)
    for number in range(1, 16)
)

EVENTS = DAY_EVENTS + TIMED_EVENTS

# Reserve completion at the end of each safe window. This deliberately gives
# no earlier logical credit for a reward requiring real new-day transitions.
# Otherwise Phone on Day10 -> immediately collected ring -> Rose would evade
# Charan's earlier deadline despite a nominal four-day minimum on the ring.
CHARAN_CAVE_READY = all_of(event("Charan Rose Delivered"), day(CHARAN_LAST_START + 1))
LEIGH_READY = all_of(event("Leigh Quest Started"), day(LEIGH_LAST_START + LEIGH_TRANSITIONS))
