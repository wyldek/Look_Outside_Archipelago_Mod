"""The two home bookshelves share one fourth-inspection videogame reward."""


def source(eid):
    return {"map_id": 3, "event_id": eid, "page": 0, "command_index": 24, "command_code": 126,
            "required_variables": [{"id": 496, "value": 3}], "message_index": 23,
            "message_text": "Find \\C[3]Screamatorium\\C[0]!"}


def location():
    return {"key": "home_bookshelf_screamatorium", "name": "Home Bookshelf - Screamatorium",
            "ap_id": 592000160, **source(88), "reward_kind": "item", "reward_database_id": 423,
            "reviewed_item_pickup": True, "bookshelf_counter": True, "source_variants": [source(89)]}


def validate_bookshelf(row, variant, commands, require):
    require(row == location() and variant in (row, source(89)), "Bookshelf source changed")
    for index, code, params in [(15, 111, [1, 496, 0, 3, 0]), (24, 126, [423, 0, 0, 1]),
                                (28, 412, []), (29, 111, [1, 496, 0, 4, 1]),
                                (34, 122, [496, 496, 1, 0, 1])]:
        require(commands[index]["code"] == code and commands[index]["parameters"] == params,
                f"Bookshelf consumed counter changed at {index}")
    require(commands[34]["indent"] == 0 and all(c["indent"] >= 1 for c in commands[16:28]),
            "Bookshelf counter no longer consumes the gift branch")
