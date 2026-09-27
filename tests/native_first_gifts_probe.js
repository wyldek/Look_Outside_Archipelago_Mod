"use strict";

module.exports = function nativeFirstGiftsProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    const rewards = [
        {mid: 240, tid: 294, page: 0, id: 122, key: "minesweeper_first_detector"},
        {mid: 438, tid: 207, page: 12, id: 201, key: "comatus_whisperblade"}
    ];
    let scenarios = 0;
    function setup(active, reward) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $gamePlayer.clearTransferInfo();
        $gameSwitches.setValue(401, true);
        $gameVariables.setValue(213, 2);
        $dataMap = JSON.parse(fs.readFileSync(`data/Map${String(reward.mid).padStart(3, "0")}.json`, "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(reward.mid);
        if (active) {
            ap.bindIdentityForDevelopment("first-gifts", 0, 1);
            ap.activateForDevelopment();
            ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
        }
        BattleManager.setup(reward.tid, true, false);
        $gameParty.onBattleStart();
    }
    function run(list, start, end, choose = () => 0) {
        const before = JSON.stringify(list);
        const interpreter = new Game_Interpreter();
        interpreter.setup(list, 0);
        interpreter._index = start;
        const messages = [];
        let steps = 0;
        while (interpreter.currentCommand() && interpreter._index <= end) {
            assert.ok(steps++ < 500, "First gift event loop did not finish");
            const code = interpreter.currentCommand().code;
            if (code === 340) break;
            if ([0, 101, 102, 111, 118, 119, 121, 122, 125, 127,
                 402, 404, 411, 412].includes(code)) {
                interpreter.executeCommand();
                messages.push(...$gameMessage._texts);
                if ($gameMessage.isChoice()) $gameMessage.onChoice(choose($gameMessage.choices()));
                $gameMessage.clear();
            } else interpreter._index++;
        }
        assert.equal(JSON.stringify(list), before, "Native event list was modified");
        return messages;
    }
    function gift(reward, list) {
        return run(list || $dataTroops[reward.tid].pages[reward.page].list,
                   reward.tid === 294 ? 6 : 0, reward.tid === 294 ? 57 : 45);
    }
    function receive(reward) {
        ap.queueReceivedItemsForDevelopment(0, [{item: 540100000 + reward.id}]);
        ap.deliverPendingForDevelopment();
        assert.equal(ap.pendingItems().length, 0);
    }
    function count(reward) { return $gameParty.numItems($dataWeapons[reward.id]); }
    function reload() {
        DataManager.extractSaveContents(JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents())));
        ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
    }
    for (const reward of rewards) for (const active of [false, true]) {
        setup(active, reward);
        const text = gift(reward);
        assert.equal(count(reward), active ? 0 : 1);
        assert.deepEqual(ap.checkedKeys(), active ? [reward.key] : []);
        assert.equal(text.includes("Archipelago location checked."), active);
        if (reward.tid === 294) {
            assert.equal($gameVariables.value(354), 1);
            gift(reward); // The native first-meeting branch is consumed.
        } else {
            assert.equal($gameSwitches.value(1174), true);
            assert.equal($gameVariables.value(960), 11);
            // All later conversations end before the challenge branch.
            run($dataTroops[207].pages[0].list, 0, 238, () => { throw Error("Completed duel offered again"); });
        }
        assert.equal(count(reward), active ? 0 : 1);
        if (active) {
            receive(reward);
            reload();
            receive(reward);
            assert.equal(count(reward), 1);
            assert.deepEqual(ap.checkedKeys(), [reward.key]);
        }
        scenarios++;
    }
    for (const reward of rewards) {
        setup(true, reward);
        receive(reward);
        assert.equal($gameVariables.value(354), 0);
        assert.equal($gameSwitches.value(1174), false);
        gift(reward);
        reload();
        receive(reward);
        assert.equal(count(reward), 1, "Early delivery duplicated the source weapon");
        assert.deepEqual(ap.checkedKeys(), [reward.key]);
        scenarios++;
    }
    // Both paid replacement routes retain their native $80 charge and inventory grant.
    for (const active of [false, true]) for (const broken of [false, true]) for (const buy of [false, true]) {
        const detector = rewards[0];
        setup(active, detector);
        $gameVariables.setValue(354, 1);
        $gameParty.gainGold(80);
        if (broken) $gameParty.gainItem($dataWeapons[123], 1);
        run($dataTroops[294].pages[0].list, 122, 167, () => buy ? 0 : 1);
        assert.equal($gameParty.gold(), buy ? 0 : 80);
        assert.equal(count(detector), buy ? 1 : 0);
        assert.equal($gameParty.numItems($dataWeapons[123]), broken ? 1 : 0);
        assert.deepEqual(ap.checkedKeys(), []);
        scenarios++;
    }
    for (const active of [false, true]) {
        setup(active, rewards[1]);
        run($dataTroops[207].pages[0].list, 118, 238, () => 1);
        assert.deepEqual(ap.checkedKeys(), []);
        assert.equal($gameSwitches.value(1174), false);
        assert.equal(count(rewards[1]), 0);
        gift(rewards[1]); // Declining the duel did not close its later reward.
        assert.deepEqual(ap.checkedKeys(), active ? [rewards[1].key] : []);
        scenarios++;
    }
    for (const reward of rewards) for (const guard of ["clone", "wrong-troop", "wrong-build"]) {
        setup(true, reward);
        let list = $dataTroops[reward.tid].pages[reward.page].list;
        if (guard === "clone") list = JSON.parse(JSON.stringify(list));
        if (guard === "wrong-troop") BattleManager.setup(reward.tid === 207 ? 294 : 207, true, false);
        const version = $dataSystem.versionId;
        try {
            if (guard === "wrong-build") $dataSystem.versionId++;
            gift(reward, list);
            assert.deepEqual(ap.checkedKeys(), []);
            assert.equal(count(reward), 1);
        } finally { $dataSystem.versionId = version; }
        scenarios++;
    }
    return {scenarios, firstGiftsAndReplay: 4, earlyDelivery: 2, paidReplacements: 8, postponedDuel: 2, sourceGuards: 6};
};
