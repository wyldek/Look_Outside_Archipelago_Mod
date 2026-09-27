"use strict";

module.exports = function nativeKeyBudgetProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    let scenarios = 0;
    const locks = [
        [296, 125, 7, 0], [297, 140, 6, 0], [298, 125, 13, 1], [299, 152, 1, 0],
        [395, 10, 21, 0], [395, 23, 1, 1], [395, 55, 18, 1],
        [395, 99, 18, 1], [395, 158, 10, 0], [395, 308, 6, 1, 3],
        [651, 440, 14, 0], [652, 440, 5, 0], [653, 440, 1, 0],
        [653, 440, 9, 0], [653, 440, 11, 0], [654, 440, 8, 0],
        [655, 439, 6, 0], [656, 440, 7, 0], [656, 445, 2, 0],
    ];
    const supplies = {296: 1, 297: 1, 298: 1, 299: 1, 395: 7,
        651: 1, 652: 1, 653: 3, 654: 1, 655: 1, 656: 1};
    const orders = [locks, [...locks].reverse(), [...locks.slice(9), ...locks.slice(0, 9)]];
    function runDoor(event) {
        const interpreter = new Game_Interpreter();
        interpreter.setup(event.list(), event.eventId());
        while (interpreter.currentCommand()) {
            const code = interpreter.currentCommand().code;
            if (code === 104) {
                $gameVariables.setValue(interpreter.currentCommand().parameters[0], 395);
                interpreter._index++;
            } else if (code === 102) {
                // Choose "Yes" through the native branch machinery.
                // The optional Eye Apartment spend is choice 2, "Stab me".
                interpreter._branch[interpreter.currentCommand().indent] =
                    $gameMap.mapId() === 99 ? 2 : 0;
                interpreter._index++;
            } else if ([0, 111, 121, 123, 126, 402, 403, 404, 411, 412].includes(code)) {
                interpreter.executeCommand();
            } else interpreter._index++;
        }
    }
    for (const order of orders) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $gamePlayer.clearTransferInfo();
        ap.bindIdentityForDevelopment("finite-key-budget", 0, 1);
        ap.activateForDevelopment();
        ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
        const items = Object.entries(supplies).flatMap(([id, count]) =>
            Array.from({length: count}, () => ({item: 540000000 + Number(id)})));
        ap.queueReceivedItemsForDevelopment(0, items);
        ap.deliverPendingForDevelopment();
        const remaining = {...supplies, 656: 2};
        for (const [id, amount] of Object.entries(remaining)) {
            assert.equal($gameParty.numItems($dataItems[id]), amount);
        }
        for (const [id, mid, eid, page, openPage = page + 1] of order) {
            $dataMap = JSON.parse(fs.readFileSync(`data/Map${String(mid).padStart(3, "0")}.json`, "utf8"));
            DataManager.onLoad($dataMap);
            if (mid === 125 && eid === 13) $gameVariables.setValue(445, 2);
            if (mid === 23) $gameSwitches.setValue(21, true);
            if ([55, 99, 308].includes(mid)) $gameSelfSwitches.setValue([mid, eid, "A"], true);
            $gameMap.setup(mid);
            const event = $gameMap.event(eid);
            assert.equal(event._pageIndex, page, `locked page ${mid}/${eid}`);
            runDoor(event);
            $gameMap.refresh();
            assert.equal(event._pageIndex, openPage, `open page ${mid}/${eid}`);
            assert.equal($gameParty.numItems($dataItems[id]), --remaining[id], `cost ${mid}/${eid}`);
            const save = JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents()));
            DataManager.extractSaveContents(save);
            ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
            ap.queueReceivedItemsForDevelopment(0, items);
            ap.deliverPendingForDevelopment();
            assert.equal($gameParty.numItems($dataItems[id]), remaining[id]);
            $gameMap.refresh();
            assert.equal($gameMap.event(eid)._pageIndex, openPage, "unlock lost after load");
            runDoor($gameMap.event(eid));
            assert.equal($gameParty.numItems($dataItems[id]), remaining[id], "open door charged again");
        }
        assert.equal(remaining[395], 1);
        assert.ok(Object.entries(remaining).every(([id, count]) => count === (id === "395" ? 1 : 0)));
        assert.deepEqual(ap.checkedKeys(), []);
        scenarios++;
    }
    return { scenarios, doorsPerOrder: locks.length, totalDoorOpenings: locks.length * scenarios,
        valves: 4, irisKeys: 7, blackKeys: 2 };
};
