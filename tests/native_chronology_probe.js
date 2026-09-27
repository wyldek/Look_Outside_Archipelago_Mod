"use strict";

// Original event lists execute in the staged engine. Presentation commands
// are skipped; no timing/branch commands are replaced. Not a full playthrough.
module.exports = function nativeChronologyProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    const results = [];
    function map(id) {
        $dataMap = JSON.parse(fs.readFileSync(`data/Map${String(id).padStart(3, "0")}.json`, "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(id);
        $gamePlayer.clearTransferInfo();
        $gameMap._interpreter.clear();
        $gameMap.events().forEach(e => e.clearStartingFlag());
    }
    function fresh(day) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $gameVariables.setValue(15, day);
        $gameVariables.setValue(13, 3);
        map(3);
    }
    function run(list, start = 0, end = list.length - 1, choice = () => 0, eid = 0) {
        const it = new Game_Interpreter();
        it.setup(list, eid);
        it._index = start;
        let steps = 0;
        while (it.currentCommand() && it._index <= end) {
            assert.ok(++steps < 1500, "Native chronology fixture did not terminate");
            const code = it.currentCommand().code;
            if ([0, 101, 102, 111, 115, 118, 119, 121, 122, 123, 126, 201,
                 402, 404, 411, 412].includes(code)) {
                it.executeCommand();
                if ($gameMessage.isChoice()) $gameMessage.onChoice(choice($gameMessage.choices()));
                $gameMessage.clear();
            } else it._index++;
        }
        return it;
    }
    // Earliest and exact latest Phone starts succeed. One day later fails.
    for (const start of [0, 3, 10, 11]) {
        fresh(start);
        $gameSwitches.setValue(34, true); // Native local recruitment, no AP item.
        $gameParty.addActor(5);
        $gameParty.gainItem($dataItems[389], 1);
        run($dataCommonEvents[3].list, 356, 362);
        assert.equal($gameVariables.value(900), 1);
        assert.equal($gameParty.numItems($dataItems[389]), 0);
        const stages = [];
        for (let wait = 1; wait <= 4; wait++) {
            $gameVariables.setValue(15, start + wait);
            run($dataCommonEvents[6].list, 628, 657);
            assert.equal($gameVariables.value(900), 2 * wait);
            let choices = 0;
            run($dataCommonEvents[233].list, 0, Infinity,
                options => choices++ === 0 ? 0 : options.length - 1);
            assert.equal($gameVariables.value(900), 2 * wait + 1);
            stages.push($gameVariables.value(900));
        }
        run($dataCommonEvents[125].list, 0, 79, options =>
            options.findIndex(text => text.includes('"LIAR"')));
        assert.equal($gameVariables.value(900), start <= 10 ? 20 : 9);
        if (start <= 10) {
            map(7);
            $gameMap.event(4).refresh();
            assert.equal($gameMap.event(4)._pageIndex, 3);
            run($dataMap.events[4].pages[3].list, 0, Infinity, () => 0, 4);
            assert.equal($gamePlayer._newMapId, 434);
        }
        results.push({ quest: "Leigh", start, stages, finalDay: start + 4, valid: start <= 10 });
    }
    // Gift on Day5 -> cave Day6. Gift on Day6 -> closure before next visit.
    for (const start of [5, 6]) {
        fresh(start);
        $gameParty.gainItem($dataItems[360], 1);
        $gameVariables.setValue(6, 360);
        run($dataTroops[590].pages[0].list, 296, 320);
        assert.equal($gameSwitches.value(680), true);
        assert.equal($gameSwitches.value(677), false);
        $gameVariables.setValue(15, start + 1);
        run($dataCommonEvents[6].list, 616, 619);
        assert.equal($gameSwitches.value(677), true);
        map(86);
        run($dataMap.events[105].pages[0].list, 0, Infinity, () => 0, 105);
        assert.equal($gameSwitches.value(1097), start === 6);
        map(272);
        run($dataMap.events[7].pages[0].list, 0, Infinity, () => 0, 7);
        assert.equal($gamePlayer._newMapId, start === 5 ? 339 : 399);
        results.push({ quest: "Charan", start, nextDay: start + 1, valid: start === 5 });
    }
    for (const day of [0, 1, 2, 3, 4, 8, 9]) {
        fresh(day);
        map(6);
        assert.equal($gameMap.event(2)._pageIndex, day >= 2 ? 1 : 0);
        assert.equal($gameMap.event(8)._pageIndex, day >= 4 ? 1 : 0);
        if (day === 3) {
            run($dataMap.events[83].pages[0].list, 43, 43, () => 0, 83);
            $gameMap.event(33).refresh();
            assert.equal($gameMap.event(33)._pageIndex, 1);
            run($dataMap.events[33].pages[1].list, 8, 8, () => 0, 33);
            $gameMap.event(33).refresh();
            assert.equal($gameMap.event(33)._pageIndex, 2);
            run($dataMap.events[33].pages[2].list, 0, Infinity, () => 0, 33);
            assert.equal($gamePlayer._newMapId, 353);
        }
        if (day === 8) {
            $gameSwitches.setValue(1062, true);
            $gamePlayer.locate(4, 0); // Native timer checks proximity to controller29.
            const controller = $gameMap.event(29);
            $gamePlayer.locate(controller.x, controller.y);
            for (const hour of [5, 6]) {
                $gameVariables.setValue(16, hour);
                run($dataMap.events[29].pages[0].list, 40, 79, () => 0, 29);
                assert.equal($gameSwitches.value(1062), hour === 5);
            }
            run($dataMap.events[7].pages[7].list, 10, 10, () => 0, 7);
            $gameMap.event(7).refresh();
            assert.equal($gameMap.event(7)._pageIndex, 9);
            run($dataMap.events[7].pages[9].list, 0, Infinity, () => 0, 7);
            assert.equal($gamePlayer._newMapId, 435);
        }
        if (day === 9) assert.equal($gameMap.event(7)._pageIndex, 10);
        if (day < 2) assert.equal($gameMap.event(7)._pageIndex, day);
        results.push({ regionDay: day });
    }
    for (const day of [14, 15]) {
        fresh(day);
        run($dataMap.events[20].pages[0].list, 0, 24, () => 0, 20);
        assert.equal($gameVariables.value(493) > 0, day === 14);
        results.push({ crosswordDay: day, available: day === 14 });
    }
    return { scenarios: results.length, results };
};
