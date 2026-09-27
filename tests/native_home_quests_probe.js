"use strict";

module.exports = function nativeHomeQuestsProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    let scenarios = 0;
    function map(mid) {
        $dataMap = JSON.parse(fs.readFileSync(`data/Map${String(mid).padStart(3, "0")}.json`, "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(mid);
    }
    function setup(active) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $gamePlayer.clearTransferInfo();
        $gameSwitches.setValue(401, true);
        $gameVariables.setValue(213, 2);
        map(6);
        if (active) {
            ap.bindIdentityForDevelopment("home-quests", 0, 1);
            ap.activateForDevelopment();
        }
    }
    function run(interpreter, choices, end = Infinity) {
        let steps = 0;
        while (interpreter.currentCommand() && interpreter._index <= end) {
            assert.ok(steps++ < 900, "Quest interpreter did not terminate");
            const index = interpreter._index;
            const code = interpreter.currentCommand().code;
            if ([0, 101, 102, 111, 115, 117, 118, 119, 121, 122, 123, 126, 127,
                 402, 404, 411, 412].includes(code)) {
                interpreter.executeCommand();
                if ($gameMessage.isChoice()) {
                    // command101 can absorb the following command102.
                    const first = $gameMessage.choices()[0];
                    const choiceIndex = {"Oh...": 7, "Okay, sure.": 22,
                        "Sure, I guess.": interpreter._list === $dataCommonEvents[235].list ? 31 : 30,
                        "Hi, chat...": 6, "Fine, fine, we'll go.": 46}[first];
                    $gameMessage.onChoice(choices[choiceIndex] || 0);
                }
                $gameMessage.clear();
                if (interpreter._childInterpreter) {
                    run(interpreter._childInterpreter, choices);
                    interpreter._childInterpreter = null;
                }
            } else interpreter._index++;
        }
    }
    function common(cid, index, choices) {
        // Execute the original return-home command117, so setupChild uses the
        // native common-event list and nested interpreter context.
        const interpreter = new Game_Interpreter();
        interpreter.setup($dataCommonEvents[3].list, 1);
        interpreter._index = index;
        assert.deepEqual(interpreter.currentCommand().parameters, [cid]);
        run(interpreter, choices, index);
    }
    function pickup(mid, eid, page, start, end) {
        map(mid);
        const interpreter = new Game_Interpreter();
        interpreter.setup($dataMap.events[eid].pages[page].list, eid);
        interpreter._index = start;
        run(interpreter, {}, end);
    }
    for (const active of [false, true]) {
        for (let intro = 0; intro < 3; intro++) {
            for (const choice of [{22: 0}, {22: 1, 31: 0}, {22: 1, 31: 1}, {22: 2}]) {
                setup(active);
                $gameVariables.setValue(869, 2);
                common(235, 333, {7: intro, ...choice});
                const refused = choice[22] === 2 || choice[31] === 1;
                assert.equal($gameVariables.value(869), refused ? -1 : 3);
                assert.deepEqual(ap.checkedKeys(), active && refused ? ["map433_event009_quest_pickup"] : []);
                assert.equal($gameParty.numItems($dataWeapons[165]), 0);
                const save = JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents()));
                DataManager.extractSaveContents(save);
                // A later audited reward cannot duplicate a reconciled check.
                $gameVariables.setValue(869, 18);
                pickup(433, 9, 2, 10, 11);
                assert.deepEqual(ap.checkedKeys(), active ? ["map433_event009_quest_pickup"] : []);
                assert.equal($gameParty.numItems($dataWeapons[165]), active ? 0 : 1);
                scenarios++;
            }
            for (const choice of [{30: 0}, {30: 1, 46: 0}, {30: 1, 46: 1}]) {
                setup(active);
                common(237, 345, {6: intro, ...choice});
                const refused = choice[46] === 1;
                assert.equal($gameVariables.value(896), refused ? 1 : 2);
                assert.deepEqual(ap.checkedKeys(), active && refused ? ["map016_event003_quest_item"] : []);
                const save = JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents()));
                DataManager.extractSaveContents(save);
                pickup(16, 3, 0, 2, 6);
                assert.deepEqual(ap.checkedKeys(), active ? ["map016_event003_quest_item"] : []);
                assert.equal($gameParty.numItems($dataItems[376]), active ? 0 : 1);
                assert.equal($gameVariables.value(896), 5);
                scenarios++;
            }
        }
    }
    for (const [cid, index, variable, value] of [[235, 40, 869, 3], [235, 48, 869, 3], [237, 54, 896, 0]]) {
        for (const guard of ["clone", "wrong-stage", "wrong-build"]) {
            setup(true);
            $gameVariables.setValue(variable, guard === "wrong-stage" ? 999 : value);
            const interpreter = new Game_Interpreter();
            let list = $dataCommonEvents[cid].list;
            if (guard === "clone") list = JSON.parse(JSON.stringify(list));
            interpreter.setup(list, 1);
            interpreter._index = index;
            const build = $dataSystem.versionId;
            try {
                if (guard === "wrong-build") $dataSystem.versionId++;
                run(interpreter, {}, index);
                assert.deepEqual(ap.checkedKeys(), []);
            } finally { $dataSystem.versionId = build; }
            scenarios++;
        }
    }
    return {scenarios, outcomes: 42, sourceGuards: 9};
};
