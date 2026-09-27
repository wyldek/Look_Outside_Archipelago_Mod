"""Reviewed Normal-mode scope for build 74642914."""

HARD_ONLY_PICKUPS = {
    (60, 21, 0, 4): "Mackinaw Jacket",
    (60, 22, 0, 4): "Arrowed Sash",
    (102, 14, 0, 4): "Hoodie",
}

# These keys have no Normal-mode reward or access requirement.
HARD_ONLY_KEY_IDS = frozenset((383, 403, 404, 405))

# Clyde's Angel of Death only appears in troop 466 page 3's HARDMODE branch.
# Fridge is rolled by CE 286 only inside its HARDMODE branch.
HARD_ONLY_ENEMY_IDS = frozenset((724, 835, 836))
