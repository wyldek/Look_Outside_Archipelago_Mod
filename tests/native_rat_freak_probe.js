"use strict";

module.exports = function nativeRatFreakProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    const key = "map106_event011_complex";
    let scenarios = 0;
    function setup(active, page) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $gamePlayer.clearTransferInfo();
        if (page === 1) $gameSelfSwitches.setValue([106, 11, "A"], true);
        if (page === 3) $gameSwitches.setValue(351, true);
        $dataMap = JSON.parse(fs.readFileSync("data/Map106.json", "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(106);
        if (active) {
            ap.bindIdentityForDevelopment("rat-freak", 0, 1);
            ap.activateForDevelopment();
        }
        assert.equal($gameMap.event(11)._pageIndex, page);
    }
    function run(page, start, end, result = 0, clone = false, event = 11) {
        const original = $dataMap.events[11].pages[page].list;
        const snapshot = JSON.stringify(original);
        const interpreter = new Game_Interpreter();
        interpreter.setup(clone ? JSON.parse(snapshot) : original, event);
        interpreter._index = start;
        interpreter._branch[0] = result; // Native battle callback's victory/escape result.
        while (interpreter.currentCommand() && interpreter._index <= end) {
            const code = interpreter.currentCommand().code;
            if ([0, 111, 123, 127, 601, 602, 604, 412].includes(code)) interpreter.executeCommand();
            else interpreter._index++;
        }
        assert.equal(JSON.stringify(original), snapshot);
    }
    for (const active of [false, true]) {
        for (const page of [0, 1]) for (const result of [0, 1]) {
            setup(active, page);
            run(page, 3, 10, result);
            assert.equal($gameSelfSwitches.value([106, 11, "C"]), result === 0);
            assert.equal($gameSelfSwitches.value([106, 11, "B"]), result === 1);
            assert.deepEqual(ap.checkedKeys(), active && result === 0 ? [key] : []);
            assert.equal($gameParty.numItems($dataWeapons[112]), 0);
            const saved = JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents()));
            DataManager.extractSaveContents(saved);
            assert.deepEqual(ap.checkedKeys(), active && result === 0 ? [key] : []);
            if (result === 0) {
                $gameMap.refresh();
                assert.equal($gameMap.event(11)._pageIndex, 4);
            }
            scenarios++;
        }
        setup(active, 3);
        run(3, 2, 10);
        assert.equal($gameParty.numItems($dataWeapons[112]), active ? 0 : 1);
        assert.deepEqual(ap.checkedKeys(), active ? [key] : []);
        assert.equal($gameSelfSwitches.value([106, 11, "D"]), true);
        run(3, 2, 10);
        assert.equal($gameParty.numItems($dataWeapons[112]), active ? 0 : 1);
        assert.deepEqual(ap.checkedKeys(), active ? [key] : []);
        scenarios++;
    }
    for (const guard of ["clone", "wrong-event", "wrong-build"]) {
        setup(true, 0);
        const version = $dataSystem.versionId;
        if (guard === "wrong-build") $dataSystem.versionId++;
        try {
            run(0, 3, 10, 0, guard === "clone", guard === "wrong-event" ? 10 : 11);
            assert.deepEqual(ap.checkedKeys(), []);
        } finally { $dataSystem.versionId = version; }
        scenarios++;
    }
    return { ratFreakScenarios: scenarios, sharedCheck: key };
};
