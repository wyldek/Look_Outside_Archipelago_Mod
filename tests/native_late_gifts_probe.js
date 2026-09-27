"use strict";

module.exports = function nativeLateGiftsProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    let gifts = 0;
    let dispatch = 0;
    function setup(active, map, troop) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $dataMap = JSON.parse(fs.readFileSync("data/Map" + String(map).padStart(3, "0") + ".json", "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(map);
        if (active) ap.activateForDevelopment();
        BattleManager.setup(troop, true, false);
        $gameParty.onBattleStart();
    }
    function run(list, start, end, choose) {
        const original = JSON.stringify(list);
        const interpreter = new Game_Interpreter();
        interpreter.setup(list, 0);
        interpreter._index = start;
        let steps = 0;
        while (interpreter._index <= end) {
            assert.ok(steps++ < 1000, "Gift dialogue did not finish");
            const code = interpreter.currentCommand().code;
            if (code === 340) break; // The native escape/abort endpoint.
            if ([0, 101, 102, 111, 118, 119, 121, 122, 126, 402, 404, 411, 412].includes(code)) {
                interpreter.executeCommand();
                if ($gameMessage.isChoice()) $gameMessage.onChoice(choose($gameMessage.choices()));
                $gameMessage.clear();
            } else interpreter._index++;
        }
        assert.equal(JSON.stringify(list), original);
        return interpreter;
    }
    for (const active of [false, true]) {
        for (const route of ["accept", "refuse", "leave"]) {
            setup(active, 3, 80);
            $gameVariables.setValue(617, 5);
            $gameVariables.setValue(51, 80);
            $gameSwitches.setValue(24, true);
            const result = run($dataTroops[80].pages[0].list, 0, 220, choices => {
                if (choices.length === 2) return route === "refuse" ? 1 : 0;
                if (choices[0] === "Who is it?" && route === "leave") return 4;
                return 0;
            });
            assert.equal(result._index, 220);
            assert.deepEqual(ap.checkedKeys(), active ? ["pierre_old_mail"] : []);
            assert.equal($gameParty.numItems($dataItems[285]), !active && route === "accept" ? 1 : 0);
            assert.equal($gameVariables.value(617), route === "accept" ? 10 : 6);
            assert.equal($gameSwitches.value(24), false);
            assert.equal($gameVariables.value(51), 0);
            gifts++;
        }
        for (const blood of [79, 80]) for (const rat of [0, 1]) for (const choice of [0, 3]) {
            setup(active, 189, 415);
            $gameVariables.setValue(524, 6);
            $gameVariables.setValue(837, blood);
            $gameVariables.setValue(187, rat);
            const list = $dataTroops[415].pages[0].list;
            run(list, 383, 432, () => choice);
            const acquired = blood >= 80;
            assert.deepEqual(ap.checkedKeys(), active && acquired ? ["tickle_drawing"] : []);
            assert.equal($gameParty.numItems($dataItems[367]), !active && acquired ? 1 : 0);
            assert.equal($gameVariables.value(524), acquired ? 7 : 6);
            if (acquired) {
                const repeat = run(list, 383, 432, () => choice);
                assert.ok(repeat._index > 429);
                assert.equal($gameParty.numItems($dataItems[367]), active ? 0 : 1);
            }
            gifts++;
        }
    }
    // Verify the actual dispatch guard and the expired time window.
    for (const state of [5, 6, 10]) for (const hour of [5, 7]) {
        setup(false, 3, 80);
        $gameVariables.setValue(617, state);
        $gameVariables.setValue(16, hour);
        run($dataCommonEvents[4].list, 369, 383, () => 0);
        assert.equal($gameSwitches.value(24), state === 5 && hour === 5);
        assert.equal($gameVariables.value(51), state === 5 && hour === 5 ? 80 : 0);
        assert.equal($gameVariables.value(617), state === 5 && hour === 7 ? 6 : state);
        dispatch++;
    }
    return { gifts, dispatch };
};
