"use strict";

module.exports = function nativeAccessRoutesProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    let scenarios = 0;
    function setup(mid) {
        DataManager.setupNewGame();
        load(mid);
    }
    function load(mid) {
        $gameMessage.clear();
        $gamePlayer.clearTransferInfo();
        $dataMap = JSON.parse(fs.readFileSync(`data/Map${String(mid).padStart(3, "0")}.json`, "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(mid);
    }
    // Execute native branch/variable/item commands and actual scripted moves.
    // Presentation and elapsed animation frames are omitted, not access gates.
    function run(list, eid, { start = 0, end = list.length - 1, choice = 0, moves = false } = {}) {
        const interpreter = new Game_Interpreter();
        interpreter.setup(list, eid);
        interpreter._index = start;
        let steps = 0;
        while (interpreter.currentCommand() && interpreter._index <= end) {
            assert.ok(++steps < 2000, "Native event loop did not terminate");
            const c = interpreter.currentCommand();
            if (c.code === 102) {
                interpreter._branch[c.indent] = choice;
                interpreter._index++;
            } else if (c.code === 205 && moves) {
                const character = interpreter.character(c.parameters[0]);
                for (const move of c.parameters[1].list) {
                    if (move.code !== 0 && move.code !== 15) character.processMoveCommand(move);
                    character._realX = character.x;
                    character._realY = character.y;
                }
                interpreter._index++;
            } else if (c.code === 117) {
                run($dataCommonEvents[c.parameters[0]].list, eid);
                interpreter._index++;
            } else if ([0, 111, 121, 122, 123, 126, 201, 402, 403, 404, 411, 412].includes(c.code)) {
                interpreter.executeCommand();
            } else interpreter._index++;
        }
    }
    setup(74);
    $gameSwitches.setValue(115, true);
    $gameSwitches.setValue(21, true);
    $gameVariables.setValue(219, 3);
    const controls = $dataMap.events[2].pages[1].list;
    for (const [choice, count] of [[3, 1], [0, 2], [2, 3], [1, 4]]) {
        $gamePlayer.clearTransferInfo();
        run(controls, 2, { choice });
        assert.equal($gameVariables.value(817), count);
    }
    $gamePlayer.clearTransferInfo();
    run(controls, 2, { choice: 5 });
    assert.equal($gamePlayer._newMapId, 313);
    assert.deepEqual([$gamePlayer._newX, $gamePlayer._newY], [13, 7]);
    scenarios++;

    // Exactly one of six reachable bins is selected. Its ticket is guaranteed
    // by container type2, independently of luck or the random loot roll.
    for (const [selection, mid, eid] of [[1, 451, 8], [2, 452, 14], [3, 452, 15],
        [4, 452, 16], [5, 452, 17], [6, 451, 9]]) {
        setup(mid);
        $gameVariables.setValue(955, selection);
        run($dataMap.events[eid].pages[0].list, eid);
        assert.equal($gameParty.numItems($dataItems[349]), 1);
        assert.equal($gameSelfSwitches.value([mid, eid, "A"]), true);
        scenarios++;
    }
    for (const supplied of [false, true]) {
        setup(452);
        $gamePlayer.locate(12, 8);
        $gamePlayer.setDirection(8);
        if (supplied) $gameParty.gainItem($dataItems[349], 1);
        run($dataMap.events[4].pages[0].list, 4);
        assert.equal($gameSelfSwitches.value([452, 4, "A"]), supplied);
        if (supplied) {
            run($dataMap.events[4].pages[1].list, 4, { moves: true });
            assert.deepEqual([$gamePlayer.x, $gamePlayer.y], [12, 6]);
            assert.equal($gameParty.numItems($dataItems[349]), 1);
        }
        scenarios++;
    }
    for (const train of [false, true]) {
        setup(405);
        $gamePlayer.locate(13, 24);
        $gamePlayer.setDirection(4);
        $gameSwitches.setValue(1195, train);
        run($dataMap.events[9].pages[0].list, 9, { moves: true });
        assert.deepEqual([$gamePlayer.x, $gamePlayer.y], train ? [13, 24] : [11, 25]);
        assert.equal($gameSwitches.value(1153), !train);
        scenarios++;
    }
    setup(189);
    run($dataMap.events[19].pages[0].list, 19, { moves: true });
    assert.equal($gameSelfSwitches.value([189, 18, "A"]), true);
    assert.equal($dataMap.events[18].pages[0].list.some(c => c.code === 301 && c.parameters[1] === 415), true);
    scenarios++;

    setup(9);
    run($dataMap.events[12].pages[0].list, 12);
    assert.equal($gameSwitches.value(237), true, "Crossword book is in Apartment21");
    scenarios++;

    for (const selected of [360, 361]) {
        setup(339);
        $gameParty.gainItem($dataItems[selected], 1);
        $gameVariables.setValue(6, selected);
        run($dataTroops[590].pages[0].list, 5, { start: 296, end: 340 });
        assert.equal($gameSwitches.value(680), selected === 360);
        run($dataCommonEvents[213].list, 5, { start: 35, end: 50 });
        assert.equal($gameSwitches.value(1064), selected === 360);
        if (selected === 360) assert.equal($gameParty.numItems($dataItems[360]), 0);
        assert.equal($gameSwitches.value(677), false, "Cave needs a later real new day");
        run($dataCommonEvents[6].list, 5, { start: 616, end: 619 });
        assert.equal($gameSwitches.value(677), selected === 360);
        scenarios++;
    }
    return { accessRouteScenarios: scenarios,
        scope: "Native elevator sequence, guaranteed local ticket, turnstile/ladder movement, Tickle trigger, crossword pickup and Charan inputs" };
};
