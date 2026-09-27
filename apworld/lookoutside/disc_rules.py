"""Disc allocations for powered doors with reusable, physically distinct discs.

Void -> Negative is irreversible in vanilla. Placement logic uses the Negative
form when needed and never relies on preserving the original -1 form. All
reviewed puzzles have solutions without -1; native extra solutions still work.
"""

from itertools import combinations

from .access import all_of, any_of, item, region


# bunchastuff.js getDiscVal, indices1..10 and12. Empty sockets are -999.
DISC_VALUES = {
    "Sun Disc": 13, "Mercury Disc": 0, "Venus Disc": 0, "Earth Disc": 1,
    "Mars Disc": 2, "Jupiter Disc": 95, "Saturn Disc": 146, "Uranus Disc": 28,
    "Neptune Disc": 16, "Pluto Disc": 5, "Negative Disc": -10,
}


def disc_requirement(name):
    if name == "Negative Disc":
        return all_of(item("Void Disc"), region("Apartment 31"))
    return item(name)


def sum_solutions(slots, total):
    if total is None:
        if slots != 4:
            raise ValueError("The balance puzzle has four sockets")
        return balance_solutions()
    return tuple(frozenset(names) for names in combinations(DISC_VALUES, slots)
                 if sum(DISC_VALUES[name] for name in names) == total)


def sums(*puzzles):
    """Require disjoint solutions to every door that must stay open on a route."""
    allocations = {frozenset()}
    for slots, total in puzzles:
        solutions = sum_solutions(slots, total)
        allocations = {used | solution for used in allocations for solution in solutions
                       if used.isdisjoint(solution)}
    return any_of(*(all_of(*(disc_requirement(name) for name in sorted(used)))
                    for used in sorted(allocations, key=lambda names: tuple(sorted(names)))))


def balance_solutions():
    solutions = set()
    for names in combinations(DISC_VALUES, 4):
        for pair in combinations(names, 2):
            if 2 * sum(DISC_VALUES[name] for name in pair) == sum(DISC_VALUES[name] for name in names):
                solutions.add(frozenset(names))
    return tuple(solutions)
