"use strict";

module.exports = function nativeBookshelfProbe() {
    const assert = require("assert").strict, fs = require("fs"), ap = LookOutsideArchipelago;
    let scenarios = 0;
    function setup(active, mid = 3) {
        DataManager.setupNewGame(); $gameMessage.clear(); $gamePlayer.clearTransferInfo();
        $gameSwitches.setValue(401, true); $gameVariables.setValue(213, 2);
        $dataMap = JSON.parse(fs.readFileSync(`data/Map${String(mid).padStart(3, "0")}.json`, "utf8"));
        DataManager.onLoad($dataMap); $gameMap.setup(mid);
        if (active) {
            ap.bindIdentityForDevelopment("bookshelf", 0, 1); ap.activateForDevelopment();
            ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
        }
    }
    function run(eid, list = $dataMap.events[eid].pages[0].list) {
        const it = new Game_Interpreter(), before = JSON.stringify(list), messages = [];
        it.setup(list, eid);
        let steps = 0;
        while (it.currentCommand()) {
            assert.ok(steps++ < 100);
            if ([0, 101, 102, 111, 121, 122, 123, 126, 402, 404, 411, 412].includes(it.currentCommand().code)) {
                it.executeCommand(); messages.push(...$gameMessage._texts);
                if ($gameMessage.isChoice()) $gameMessage.onChoice(0);
                $gameMessage.clear();
            } else it._index++;
        }
        assert.equal(JSON.stringify(list), before);
        return messages;
    }
    function receive() {
        ap.queueReceivedItemsForDevelopment(0, [{item: 540000423}]); ap.deliverPendingForDevelopment();
    }
    for (const active of [false, true]) for (const order of [[88, 88, 88, 88], [89, 89, 89, 89], [88, 89, 88, 89], [89, 88, 89, 88]]) {
        setup(active);
        for (let i = 0; i < order.length; i++) {
            const messages = run(order[i]);
            assert.equal($gameVariables.value(496), i + 1);
            assert.equal($gameParty.numItems($dataItems[423]), !active && i === 3 ? 1 : 0);
            assert.deepEqual(ap.checkedKeys(), active && i === 3 ? ["home_bookshelf_screamatorium"] : []);
            assert.equal(messages.includes("Archipelago location checked."), active && i === 3);
        }
        run(88); run(89);
        assert.equal($gameParty.numItems($dataItems[423]), active ? 0 : 1);
        scenarios++;
    }
    setup(true); receive(); assert.equal($gameVariables.value(496), 0);
    for (let i = 0; i < 4; i++) run(88 + i % 2);
    DataManager.extractSaveContents(JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents())));
    ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
    receive(); run(88); run(89);
    assert.equal($gameParty.numItems($dataItems[423]), 1);
    assert.deepEqual(ap.checkedKeys(), ["home_bookshelf_screamatorium"]); scenarios++;
    for (const [mid, eid, dbid] of [[277, 3, 239], [270, 18, 261], [270, 19, 262], [275, 3, 263], [275, 2, 264]]) {
        setup(true, mid); run(eid);
        assert.equal($gameParty.numItems($dataItems[dbid]), 1);
        assert.equal($gameSelfSwitches.value([mid, eid, "A"]), true);
        assert.deepEqual(ap.checkedKeys(), []); scenarios++;
    }
    for (const guard of ["clone", "wrong-build"]) {
        setup(true); $gameVariables.setValue(496, 3);
        const version = $dataSystem.versionId;
        try {
            if (guard === "wrong-build") $dataSystem.versionId++;
            run(88, guard === "clone" ? JSON.parse(JSON.stringify($dataMap.events[88].pages[0].list)) : undefined);
            assert.equal($gameParty.numItems($dataItems[423]), 1); assert.deepEqual(ap.checkedKeys(), []);
        } finally { $dataSystem.versionId = version; }
        scenarios++;
    }
    return {scenarios, sharedInspectionOrders: 8, earlyDeliverySaveReplay: 1, restoredVanillaValuables: 5, sourceGuards: 2};
};
