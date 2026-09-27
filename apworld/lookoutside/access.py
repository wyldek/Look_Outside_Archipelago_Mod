"""Access-only rules shared by the audit runner and the APWorld graph.

Missing locations fail validation instead of silently acquiring free access.
"""

from dataclasses import dataclass
from typing import Callable, Mapping


@dataclass(frozen=True)
class Rule:
    kind: str
    name: str = ""
    count: int = 1
    children: tuple["Rule", ...] = ()

    def evaluate(self, has: Callable[[str, int], bool], reaches: Callable[[str], bool]) -> bool:
        if self.kind in ("item", "event"):
            return has(self.name, self.count)
        if self.kind == "region":
            return reaches(self.name)
        if self.kind == "all":
            return all(child.evaluate(has, reaches) for child in self.children)
        if self.kind == "any":
            return any(child.evaluate(has, reaches) for child in self.children)
        raise ValueError(f"Unknown access rule: {self.kind}")

    def atoms(self):
        if self.kind in ("item", "event", "region"):
            yield self
        elif self.kind in ("all", "any"):
            for child in self.children:
                yield from child.atoms()
        else:
            raise ValueError(f"Unknown access rule: {self.kind}")

    def as_ap_rule(self, player: int):
        return lambda state: self.evaluate(
            lambda name, count: state.has(name, player, count),
            lambda name: state.can_reach(name, "Region", player),
        )


def item(name, count=1):
    if not isinstance(count, int) or isinstance(count, bool) or count < 1:
        raise ValueError("An access item count must be a positive integer")
    return Rule("item", name, count)


def region(name):
    return Rule("region", name)


def event(name):
    """A generation-only event item, validated separately from the AP pool."""
    return Rule("event", name)


def all_of(*rules):
    return Rule("all", children=tuple(rules))


def any_of(*rules):
    return Rule("any", children=tuple(rules))


FREE = all_of()


@dataclass(frozen=True)
class Entrance:
    source: str
    target: str
    rule: Rule
    evidence: str


@dataclass(frozen=True)
class Check:
    region: str
    rule: Rule = FREE
    evidence: str = ""


@dataclass(frozen=True)
class Event:
    location: str
    name: str
    region: str
    rule: Rule
    evidence: str
    day: int | None = None


@dataclass
class AccessGraph:
    entrances: tuple[Entrance, ...]
    checks: dict[str, Check]
    start: str = "Menu"
    events: tuple[Event, ...] = ()

    @property
    def regions(self):
        return {self.start} | {name for edge in self.entrances for name in (edge.source, edge.target)}

    def sweep(self, inventory: Mapping[str, int], *, through_day=15):
        """Least fixed point of regions and locked events, like AP's event sweep.

        through_day is an audit/test horizon, never a runtime clock. Inventory
        contains randomized items only: callers cannot inject future milestones.
        """
        reached = {self.start}
        collected = set()
        event_names = {entry.name for entry in self.events}
        has = lambda name, count: (name in collected if name in event_names else
                                   inventory.get(name, 0) >= count)
        while True:
            additions = {edge.target for edge in self.entrances if edge.source in reached and
                         edge.rule.evaluate(has, reached.__contains__)} - reached
            new_events = {entry.name for entry in self.events if entry.region in reached and
                          (entry.day is None or entry.day <= through_day) and
                          entry.rule.evaluate(has, reached.__contains__)} - collected
            if not additions and not new_events:
                break
            reached.update(additions)
            collected.update(new_events)
        checks = {key for key, check in self.checks.items() if check.region in reached and
                  check.rule.evaluate(has, reached.__contains__)}
        return reached, checks, collected

    def reachable(self, inventory: Mapping[str, int], *, through_day=15):
        reached, checks, _ = self.sweep(inventory, through_day=through_day)
        return reached, checks

    def validate(self, registry, *, require_complete=True):
        locations = {entry["key"] for entry in registry["locations"]}
        items = {entry["name"]: entry for entry in registry["items"]}
        event_names = {entry.name for entry in self.events}
        event_locations = {entry.location for entry in self.events}
        if (len(event_names) != len(self.events) or len(event_locations) != len(self.events) or
                event_names & items.keys() or event_locations & {row["name"] for row in registry["locations"]}):
            raise ValueError("Duplicate or colliding generation event names")
        unknown = self.checks.keys() - locations
        if unknown:
            raise ValueError(f"Unknown location rules: {sorted(unknown)}")
        missing = locations - self.checks.keys()
        if require_complete and missing:
            raise ValueError(f"Access audit incomplete: {len(missing)} locations have no rule")
        for edge in self.entrances:
            if not edge.evidence:
                raise ValueError(f"Entrance lacks source evidence: {edge}")
        for key, check in self.checks.items():
            if check.region not in self.regions or not check.evidence:
                raise ValueError(f"Location lacks a region or source evidence: {key}")
        for entry in self.events:
            if not entry.name or not entry.location or entry.region not in self.regions or not entry.evidence:
                raise ValueError(f"Event lacks a name, region or source evidence: {entry}")
        for rule in ([edge.rule for edge in self.entrances] + [check.rule for check in self.checks.values()] +
                     [entry.rule for entry in self.events]):
            for atom in rule.atoms():
                if atom.kind == "event":
                    if atom.name not in event_names or atom.count != 1:
                        raise ValueError(f"Unknown or invalid event dependency: {atom.name}")
                    continue
                if atom.kind == "region":
                    if atom.name not in self.regions:
                        raise ValueError(f"Unknown region dependency: {atom.name}")
                    continue
                definition = items.get(atom.name)
                if definition is None or definition["classification"] != "progression":
                    raise ValueError(f"Access rule requires a non-progression item: {atom.name}")
                # This is a quest input, not a combat equipment tier. No other
                # equipment is permitted in the reviewed access requirements.
                if definition["kind"] in ("weapon", "armor") and atom.name != "Cowboy Hat (Lucky)":
                    raise ValueError(f"Combat equipment requirement is outside scope: {atom.name}")
                if not 1 <= atom.count <= definition["quantity"]:
                    raise ValueError(f"Unavailable access item count: {atom.name}")
        return sorted(missing)
