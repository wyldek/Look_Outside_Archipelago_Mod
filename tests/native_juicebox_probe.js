"use strict";

module.exports = function nativeJuiceboxProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    const key = "map006_event025_quest_pickup";
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
        $gameVariables.setValue(287, 6);
        map(2);
        if (active) {
            ap.bindIdentityForDevelopment("juicebox-card", 0, 1);
            ap.activateForDevelopment();
        }
    }
    function run(list, eid, start, end, choices) {
        const original = JSON.stringify(list);
        const interpreter = new Game_Interpreter();
        interpreter.setup(list, eid);
        interpreter._index = start;
        let steps = 0;
        while (interpreter.currentCommand() && interpreter._index <= end) {
            assert.ok(steps++ < 900);
            const code = interpreter.currentCommand().code;
            if ([0, 101, 102, 111, 115, 121, 122, 128, 402, 404, 411, 412].includes(code)) {
                interpreter.executeCommand();
                if ($gameMessage.isChoice()) {
                    const first = $gameMessage.choices()[0];
                    const choiceIndex = first === "Yes? What is it?" ? 551 :
                        first === "Pick a card from the middle." ? 569 : 596;
                    $gameMessage.onChoice(choices[choiceIndex] || 0);
                }
                $gameMessage.clear();
            } else interpreter._index++;
        }
        assert.equal(JSON.stringify(list), original);
    }
    // All nine card/response combinations and the irreversible refusal.
    for (const active of [false, true]) {
        const outcomes = [{551: 1}];
        for (let card = 0; card < 3; card++) {
            for (let response = 0; response < 3; response++) outcomes.push({569: card, 596: response});
        }
        for (const choices of outcomes) {
            setup(active);
            run($dataMap.events[48].pages[0].list, 48, 545, 639, choices);
            assert.equal($gameVariables.value(287), 7);
            assert.equal($gameVariables.value(741), choices[551] === 1 ? 0 : 1);
            assert.deepEqual(ap.checkedKeys(), active ? [key] : []);
            assert.equal($gameParty.numItems($dataArmors[71]), 0);
            const save = JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents()));
            DataManager.extractSaveContents(save);
            assert.deepEqual(ap.checkedKeys(), active ? [key] : []);
            if (!choices[551]) {
                // Later vending acquisition still consumes its native state;
                // it cannot duplicate the AP check or hand out a local card.
                $gameSwitches.setValue(21, true);
                map(6);
                run($dataMap.events[25].pages[1].list, 25, 138, 147, {});
                assert.equal($gameVariables.value(741), 2);
                assert.equal($gameParty.numItems($dataArmors[71]), active ? 0 : 1);
                assert.deepEqual(ap.checkedKeys(), active ? [key] : []);
            }
            scenarios++;
        }
    }
    for (const guard of ["wrong-stage", "clone", "wrong-event", "wrong-build"]) {
        setup(true);
        let list = $dataMap.events[48].pages[0].list;
        if (guard === "wrong-stage") $gameVariables.setValue(287, 5);
        if (guard === "clone") list = JSON.parse(JSON.stringify(list));
        const build = $dataSystem.versionId;
        if (guard === "wrong-build") $dataSystem.versionId++;
        try {
            run(list, guard === "wrong-event" ? 47 : 48, 638, 638, {});
            assert.deepEqual(ap.checkedKeys(), []);
        } finally { $dataSystem.versionId = build; }
        scenarios++;
    }
    return {scenarios, choices: 20, sourceGuards: 4};
};
