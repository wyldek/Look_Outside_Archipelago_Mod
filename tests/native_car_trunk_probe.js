"use strict";

module.exports = function nativeCarTrunkProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    let scenarios = 0;
    function setup(active, mid = 86, near = true, opened = false) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $gamePlayer.clearTransferInfo();
        $gameSwitches.setValue(401, true);
        $gameVariables.setValue(213, 2);
        $dataMap = JSON.parse(fs.readFileSync(`data/Map${String(mid).padStart(3, "0")}.json`, "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(mid);
        if (mid === 86) {
            const trunk = $gameMap.event(59);
            $gamePlayer.locate(trunk.x + (near ? 0 : 9), trunk.y);
        }
        $gameSwitches.setValue(601, opened);
        if (active) {
            ap.bindIdentityForDevelopment("car-trunk", 0, 1);
            ap.activateForDevelopment();
            ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
        }
    }
    function run(list = $dataCommonEvents[60].list) {
        const original = JSON.stringify(list);
        const interpreter = new Game_Interpreter();
        interpreter.setup(list, 0);
        const text = [];
        let steps = 0;
        while (interpreter.currentCommand()) {
            assert.ok(steps++ < 150);
            const command = interpreter.currentCommand();
            if (command.code === 205) {
                const character = interpreter.character(command.parameters[0]);
                for (const move of command.parameters[1].list) {
                    if (move.code === 45) character.processMoveCommand(move);
                }
                interpreter._index++;
            } else if ([0, 101, 111, 121, 122, 126, 128, 355, 411, 412].includes(command.code)) {
                interpreter.executeCommand();
                text.push(...$gameMessage._texts);
                $gameMessage.clear();
            } else interpreter._index++;
        }
        assert.equal(JSON.stringify(list), original);
        return text;
    }
    function receive() {
        ap.queueReceivedItemsForDevelopment(0, [{item: 540200140}]);
        ap.deliverPendingForDevelopment();
        assert.equal(ap.pendingItems().length, 0);
    }
    for (const active of [false, true]) for (const mid of [3, 86]) {
        for (const near of [false, true]) for (const opened of [false, true]) {
            setup(active, mid, near, opened);
            const acquired = mid === 86 && near && !opened;
            const text = run();
            assert.equal($gameParty.numItems($dataArmors[140]), acquired && !active ? 1 : 0);
            assert.equal($gameParty.numItems($dataItems[184]), acquired ? 12 : 0);
            assert.equal($gameSwitches.value(601), opened || acquired);
            assert.equal($gameSelfSwitches.value([86, 22, "B"]), acquired);
            assert.deepEqual(ap.checkedKeys(), acquired && active ? ["car_trunk_shotgun"] : []);
            assert.equal(text.some(t => t.startsWith("Archipelago location checked. Find 12x")), acquired && active);
            run();
            assert.equal($gameParty.numItems($dataItems[184]), acquired ? 12 : 0);
            if (acquired && active) {
                receive();
                assert.equal($gameParty.numItems($dataArmors[140]), 1);
            }
            scenarios++;
        }
    }
    setup(true);
    receive();
    assert.equal($gameSwitches.value(601), false, "Delivery must not consume the trunk");
    run();
    DataManager.extractSaveContents(JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents())));
    ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
    receive();
    run();
    assert.equal($gameParty.numItems($dataArmors[140]), 1);
    assert.equal($gameParty.numItems($dataItems[184]), 12);
    assert.deepEqual(ap.checkedKeys(), ["car_trunk_shotgun"]);
    scenarios++;
    for (const guard of ["clone", "wrong-build"]) {
        setup(true);
        const version = $dataSystem.versionId;
        try {
            if (guard === "wrong-build") $dataSystem.versionId++;
            run(guard === "clone" ? JSON.parse(JSON.stringify($dataCommonEvents[60].list)) : undefined);
            assert.deepEqual(ap.checkedKeys(), []);
            assert.equal($gameParty.numItems($dataArmors[140]), 1);
            assert.equal($gameParty.numItems($dataItems[184]), 12);
        } finally { $dataSystem.versionId = version; }
        scenarios++;
    }
    return {scenarios, nativeGates: 16, earlyDeliverySaveReplay: 1, sourceGuards: 2};
};
