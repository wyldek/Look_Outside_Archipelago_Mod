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
        if self.kind == "item":
            return has(self.name, self.count)
        if self.kind == "region":
            return reaches(self.name)
        if self.kind == "all":
            return all(child.evaluate(has, reaches) for child in self.children)
        if self.kind == "any":
            return any(child.evaluate(has, reaches) for child in self.children)
        raise ValueError(f"Unknown access rule: {self.kind}")

    def atoms(self):
        if self.kind in ("item", "region"):
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


@dataclass
class AccessGraph:
    entrances: tuple[Entrance, ...]
    checks: dict[str, Check]
    start: str = "Menu"

    @property
    def regions(self):
        return {self.start} | {name for edge in self.entrances for name in (edge.source, edge.target)}

    def reachable(self, inventory: Mapping[str, int]):
        reached = {self.start}
        has = lambda name, count: inventory.get(name, 0) >= count
        while True:
            additions = {edge.target for edge in self.entrances if edge.source in reached and
                         edge.rule.evaluate(has, reached.__contains__)} - reached
            if not additions:
                break
            reached.update(additions)
        checks = {key for key, check in self.checks.items() if check.region in reached and
                  check.rule.evaluate(has, reached.__contains__)}
        return reached, checks

    def validate(self, registry, *, require_complete=True):
        locations = {entry["key"] for entry in registry["locations"]}
        items = {entry["name"]: entry for entry in registry["items"]}
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
        for rule in [edge.rule for edge in self.entrances] + [check.rule for check in self.checks.values()]:
            for atom in rule.atoms():
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
