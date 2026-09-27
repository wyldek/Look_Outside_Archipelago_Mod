"use strict";

module.exports = function nativeQuestItemProbe(locations) {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    let scenarios = 0;
    function setup(location, source, active) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $dataMap = JSON.parse(fs.readFileSync(
            "data/Map" + String(source.map_id).padStart(3, "0") + ".json", "utf8"));
        DataManager.onLoad($dataMap);
        if (source.page === 1) $gameSelfSwitches.setValue([source.map_id, source.event_id, "A"], true);
        $gameMap.setup(source.map_id);
        if (active) ap.activateForDevelopment();
        const list = $dataMap.events[source.event_id].pages[source.page].list;
        const interpreter = new Game_Interpreter();
        interpreter.setup(list, source.event_id);
        return { interpreter, list, original: JSON.stringify(list) };
    }
    function run(fixture, last, choice) {
        const interpreter = fixture.interpreter;
        const messages = [];
        let steps = 0;
        while (interpreter._index <= last && interpreter.isRunning()) {
            assert.ok(steps++ < 1000, "Quest event did not finish");
            const code = interpreter.currentCommand()?.code;
            if ([0, 101, 102, 111, 115, 121, 122, 123, 126, 355, 402, 404, 411, 412, 601, 602, 604].includes(code)) {
                interpreter.executeCommand();
                if (code === 123) $gameMap.refresh();
                messages.push(...$gameMessage._texts);
                if ($gameMessage.isChoice()) $gameMessage.onChoice(choice);
                $gameMessage.clear();
            } else interpreter._index++;
        }
        assert.equal(JSON.stringify(fixture.list), fixture.original);
        return messages;
    }
    function verify(location, active, acquired) {
        assert.deepEqual(ap.checkedKeys(), active && acquired ? [location.key] : []);
        assert.equal($gameParty.numItems($dataItems[location.reward_database_id]),
            !active && acquired ? 1 : 0);
        scenarios++;
    }
    for (const location of locations) for (const active of [false, true]) {
        if (location.map_id === 69) {
            for (const ready of [false, true]) for (const lyle of [false, true]) for (const choice of [0, 1]) {
                const fixture = setup(location, location, active);
                $gameVariables.setValue(583, ready ? 1 : 0);
                if (lyle) $gameParty.addActor(2);
                const messages = run(fixture, 23, choice);
                const acquired = ready && choice === 0;
                verify(location, active, acquired);
                assert.equal($gameMap.event(56)._pageIndex, acquired ? 1 : 0);
                assert.equal(messages.includes("Archipelago location checked."), active && acquired);
            }
        } else if (location.map_id === 94) {
            for (const supply of ["none", "both", "pen", "stationery"]) for (const choice of [0, 1]) {
                const fixture = setup(location, location, active);
                $gameVariables.setValue(282, 2);
                if (supply === "both" || supply === "pen") $gameParty.gainItem($dataItems[318], 1);
                if (supply === "both" || supply === "stationery") $gameParty.gainItem($dataItems[317], 1);
                $gameSwitches.setValue(245, supply === "stationery");
                $gameSwitches.setValue(246, supply === "pen");
                fixture.interpreter._index = 264;
                const messages = run(fixture, 334, choice);
                const acquired = supply !== "none" && choice === 0;
                verify(location, active, acquired);
                assert.equal($gameVariables.value(282), acquired ? 3 : 2);
                assert.equal(messages.includes("Archipelago location checked."), active && acquired);
                if (acquired) {
                    assert.equal($gameParty.numItems($dataItems[317]), 0);
                    assert.equal($gameParty.numItems($dataItems[318]), 0);
                    fixture.interpreter._index = 267;
                    fixture.interpreter.executeCommand();
                    assert.ok(fixture.interpreter._index > 334);
                }
            }
        } else {
            for (const source of [location, ...(location.source_variants || [])]) for (const outcome of [0, 1]) {
                const fixture = setup(location, source, active);
                const branchIndent = source.map_id === 115 ? 0 : 1;
                fixture.interpreter._branch[branchIndent] = outcome;
                fixture.interpreter._index = 2;
                const messages = run(fixture, source.map_id === 115 ? 16 : 21, 0);
                verify(location, active, outcome === 0);
                assert.equal(messages.includes("Archipelago location checked."), active && outcome === 0);
                if (source.map_id === 115) {
                    assert.equal($gameMap.event(2)._pageIndex, outcome === 0 ? 3 : 2);
                } else {
                    assert.equal($gameSwitches.value(975), outcome === 0);
                    $gameMap.refresh();
                    assert.equal($gameMap.event(1)._pageIndex, outcome === 0 ? 2 : 1);
                }
            }
        }
    }
    return { scenarios };
};
