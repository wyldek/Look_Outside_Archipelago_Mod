"use strict";

module.exports = function nativePlanetariumProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    let scenarios = 0;
    for (const mode of ["inactive", "delivery-after", "delivery-before"]) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $dataMap = JSON.parse(fs.readFileSync("data/Map345.json", "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(345);
        if (mode !== "inactive") {
            ap.bindIdentityForDevelopment("native-planetarium", 0, 1);
            ap.activateForDevelopment();
            ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
        }
        function deliver() {
            ap.queueReceivedItemsForDevelopment(0, [{ item: 540300699 }]);
            ap.deliverPendingForDevelopment();
            assert.equal(ap.pendingItems().length, 0);
        }
        if (mode === "delivery-before") deliver();
        const list = $dataCommonEvents[64].list;
        const original = JSON.stringify(list);
        function solve(correct) {
            for (let i = 0; i < 9; i++) $gameVariables.setValue(771 + i, i + 1);
            if (!correct) $gameVariables.setValue(779, 0);
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, 12);
            interpreter._index = 186;
            while (interpreter._index < list.length) {
                if ([0, 108, 111, 121, 355, 411, 412].includes(interpreter.currentCommand().code)) {
                    interpreter.executeCommand();
                } else interpreter._index++;
            }
            $gameMap.refresh();
            assert.equal(JSON.stringify(list), original);
            scenarios++;
        }
        solve(false);
        assert.deepEqual(ap.checkedKeys(), []);
        assert.equal($gameMap.event(31)._pageIndex, mode === "delivery-before" ? 1 : 0);
        solve(true);
        assert.deepEqual(ap.checkedKeys(), mode === "inactive" ? [] : ["planetarium_access"]);
        assert.equal($gameMap.event(31)._pageIndex, mode === "delivery-after" ? 0 : 1);
        if (mode === "delivery-after") deliver();
        $gameMap.refresh();
        assert.equal($gameMap.event(31)._pageIndex, 1);
        solve(true);
        solve(false);
        assert.deepEqual(ap.checkedKeys(), mode === "inactive" ? [] : ["planetarium_access"]);
        assert.equal($gameMap.event(31)._pageIndex, 1);
        assert.equal(DataManager.makeSaveContents().lookOutsideArchipelago?.elevatorFreakDefeated || false, false);
    }
    return { scenarios };
};
