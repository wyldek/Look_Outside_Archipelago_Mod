"use strict";

module.exports = function nativeTransformationsProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    let scenarios = 0;
    function setup(active, map) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $dataMap = JSON.parse(fs.readFileSync("data/Map" + String(map).padStart(3, "0") + ".json", "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(map);
        if (active) LookOutsideArchipelago.activateForDevelopment();
    }
    function run(interpreter, end, choice) {
        let steps = 0;
        while (interpreter.isRunning() && interpreter._index <= end) {
            assert.ok(steps++ < 200, "Transformation did not finish");
            const command = interpreter.currentCommand();
            if ([0, 101, 102, 111, 115, 121, 126, 402, 404, 411, 412].includes(command.code)) {
                interpreter.executeCommand();
                if ($gameMessage.isChoice()) $gameMessage.onChoice(choice);
                $gameMessage.clear();
            } else interpreter._index++;
        }
        assert.deepEqual(LookOutsideArchipelago.checkedKeys(), []);
        scenarios++;
    }
    for (const active of [false, true]) {
        for (const light of [false, true]) for (const input of [false, true]) for (const accept of [false, true]) {
            setup(active, 110);
            $gameSwitches.setValue(202, true);
            $gameVariables.setValue(223, light ? 1 : 0);
            $gameMap.refresh();
            assert.equal($gameMap.event(7)._pageIndex, light ? 1 : 0);
            if (input) $gameParty.gainItem($dataItems[331], 1);
            const list = $dataMap.events[7].pages[light ? 1 : 0].list;
            const original = JSON.stringify(list);
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, 7);
            // Without a Void Disc, only inspect/leave are offered. Choose leave.
            run(interpreter, light ? 27 : 43, input ? (accept ? 0 : 2) : 1);
            const converted = input && accept && !light;
            assert.equal($gameParty.numItems($dataItems[331]), input && !converted ? 1 : 0);
            assert.equal($gameParty.numItems($dataItems[332]), converted ? 1 : 0);
            assert.equal(JSON.stringify(list), original);
        }
        for (const correctSelection of [false, true]) {
            setup(active, 65);
            BattleManager.setup(124, true, false);
            $gameParty.onBattleStart();
            $gameParty.gainItem($dataItems[386], 1);
            $gameVariables.setValue(42, correctSelection ? 386 : 335);
            const list = $dataTroops[124].pages[0].list;
            const original = JSON.stringify(list);
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, 0);
            interpreter._index = 482;
            run(interpreter, 517, 0);
            assert.equal($gameParty.numItems($dataItems[386]), correctSelection ? 0 : 1);
            assert.equal($gameParty.numItems($dataItems[387]), correctSelection ? 1 : 0);
            assert.equal(JSON.stringify(list), original);
        }
    }
    return { scenarios };
};
