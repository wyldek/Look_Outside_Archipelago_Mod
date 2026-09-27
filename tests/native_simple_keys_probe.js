"use strict";

module.exports = function nativeSimpleKeysProbe(locations) {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    const originalPush = SceneManager.push;
    const originalRandom = Math.random;
    let scenarios = 0;
    SceneManager.push = function(scene) {
        if (scene !== Scene_Battle) return originalPush.call(this, scene);
    };
    function setup(mid, active = true) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $gamePlayer.clearTransferInfo();
        $dataMap = JSON.parse(fs.readFileSync(`data/Map${String(mid).padStart(3, "0")}.json`, "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(mid);
        if (active) {
            ap.bindIdentityForDevelopment("simple-keys", 0, 1);
            ap.activateForDevelopment();
            ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
        }
    }
    function interpreter(list, eid, index = 0) {
        const value = new Game_Interpreter();
        value.setup(list, eid);
        value._index = index;
        return value;
    }
    function run(value, end, choice = 0) {
        let steps = 0;
        while (value.currentCommand() && value._index <= end) {
            assert.ok(++steps < 500, "Simple Key event did not finish");
            const code = value.currentCommand().code;
            if ([0, 101, 102, 111, 118, 119, 121, 122, 123, 125, 126, 340,
                402, 404, 411, 412, 601, 602, 603, 604].includes(code)) {
                value.executeCommand();
                if ($gameMessage.isChoice()) $gameMessage.onChoice(choice);
                $gameMessage.clear();
            } else value._index++;
        }
    }
    function expect(keys, count) {
        assert.deepEqual([...ap.checkedKeys()].sort(), [...keys].sort());
        assert.equal($gameParty.numItems($dataItems[320]), count);
    }
    function win(value, result) {
        value.executeCommand();
        for (const enemy of $gameTroop.members()) enemy.setHp(0);
        Math.random = () => 0.99;
        if (result === 0) BattleManager.processVictory(true);
        else BattleManager.endBattle(result);
        Math.random = originalRandom;
        $gameMessage.clear();
        run(value, value._list.length - 1);
        $gameMap.refresh();
    }
    try {
        assert.equal(locations.length, 10);
        for (const location of locations.filter(r => r.simple_key_source === "pickup")) {
            for (const active of [false, true]) for (const choice of [0, 1]) {
                setup(location.map_id, active);
                const list = $dataMap.events[location.event_id].pages[0].list;
                const before = JSON.stringify(list);
                run(interpreter(list, location.event_id), list.length - 1, choice);
                expect(active && choice === 0 ? [location.key] : [], !active && choice === 0 ? 1 : 0);
                $gameMap.refresh();
                assert.equal($gameMap.event(location.event_id)._pageIndex, choice === 0 ? 1 : 0);
                assert.equal(JSON.stringify(list), before);
                scenarios++;
            }
        }
        for (const location of locations.filter(r => r.battle_drop)) {
            for (const source of [location, ...(location.source_variants || [])]) {
                for (const active of [false, true]) for (const result of [0, 1, 2]) {
                    setup(source.map_id, active);
                    const page = $dataMap.events[source.event_id].pages[source.page];
                    if (page.conditions.variableValid) {
                        $gameVariables.setValue(page.conditions.variableId, page.conditions.variableValue);
                    }
                    $gameMap.refresh();
                    const value = interpreter(page.list, source.event_id, source.command_index);
                    win(value, result);
                    expect(active && result === 0 ? [location.key] : [], !active && result === 0 ? 1 : 0);
                    if (result === 0) assert.equal($gameMap.event(source.event_id)._pageIndex,
                        source.battle_completion.consumed_page);
                    if (source.map_id === 94 && result === 0) {
                        assert.equal($gameParty.numItems($dataItems[16]), 1, "Other guaranteed loot must survive");
                    }
                    scenarios++;
                }
            }
        }
        // Kaeley's scripted sales happen inside the same troop as his combat
        // drop. Buying repeatedly, then leaving, must not collect that check.
        for (const active of [false, true]) {
            setup(355, active);
            const merchant = interpreter($dataMap.events[43].pages[0].list, 43, 1);
            merchant.executeCommand();
            for (const index of [137, 147, 155, 155]) {
                interpreter($dataTroops[78].pages[0].list, 0, index).executeCommand();
            }
            expect([], 4);
            BattleManager.endBattle(1);
            interpreter($dataCommonEvents[107].list, 43, 280).executeCommand();
            expect([], 5);
            scenarios++;
        }
        // Nestor's two later forms have no native key but complete the same
        // check on victory. Test all three mound interaction events.
        for (const lateEvent of [11, 40, 41, 42]) {
            for (const active of [false, true]) for (const result of [0, 1, 2]) {
                setup(94, active);
                const mound = lateEvent !== 11;
                $gameVariables.setValue(281, 11);
                $gameVariables.setValue(437, mound ? 10 : 2);
                $gameMap.refresh();
                let value;
                if (mound) {
                    const parent = interpreter($dataMap.events[lateEvent].pages[0].list, lateEvent);
                    parent.executeCommand();
                    value = parent._childInterpreter;
                    assert.equal(value._list, $dataCommonEvents[183].list);
                    value._index = 7;
                } else value = interpreter($dataMap.events[11].pages[3].list, 11, 8);
                win(value, result);
                expect(active && result === 0 ? ["simple_key_drop_153"] : [], 0);
                assert.equal($gameSwitches.value(448), result === 0);
                scenarios++;
            }
        }
        // Consuming a key must not let an indexed item replay replace it.
        setup(94);
        const items = Array.from({ length: 10 }, () => ({ item: 540000320, player: 1 }));
        ap.queueReceivedItemsForDevelopment(0, items);
        ap.deliverPendingForDevelopment();
        expect([], 30);
        run(interpreter($dataCommonEvents[184].list, 11, 50), 51);
        assert.equal($gameSelfSwitches.value([94, 11, "A"]), true, "Native lock must open");
        expect([], 29);
        const saved = JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents()));
        DataManager.extractSaveContents(saved);
        ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
        ap.queueReceivedItemsForDevelopment(0, items);
        ap.deliverPendingForDevelopment();
        expect([], 29);
        scenarios++;
        // Spend AP keys on every ordinary lock, including vanilla-only safes
        // and all twelve maze doors. No shop or random key grants are used.
        setup(94);
        ap.queueReceivedItemsForDevelopment(0, items);
        ap.deliverPendingForDevelopment();
        const locks = [];
        for (const file of fs.readdirSync("data").filter(name => /^Map\d{3}\.json$/.test(name)).sort()) {
            const map = JSON.parse(fs.readFileSync("data/" + file, "utf8"));
            const mid = Number(file.slice(3, 6));
            const events = map.events.filter(event => event && event.pages[0].list.some(
                command => command.code === 117 && command.parameters[0] === 184));
            if (!events.length) continue;
            $dataMap = map;
            DataManager.onLoad($dataMap);
            $gameMap.setup(mid);
            for (const event of events) {
                run(interpreter($dataCommonEvents[184].list, event.id, 50), 51);
                if (mid === 355) interpreter(event.pages[0].list, event.id, 12).executeCommand();
                $gameMap.refresh();
                assert.equal($gameMap.event(event.id)._pageIndex, 1);
                locks.push([mid, event.id, mid === 355 ? "B" : "A"]);
            }
        }
        assert.equal(locks.length, 26);
        expect([], 4);
        const opened = JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents()));
        DataManager.extractSaveContents(opened);
        for (const lock of locks) assert.equal($gameSelfSwitches.value(lock), true);
        scenarios++;
        // Early and late body victories still give only one check after reload.
        setup(94);
        $gameVariables.setValue(281, 11);
        $gameMap.refresh();
        win(interpreter($dataMap.events[11].pages[1].list, 11, 7), 0);
        expect(["simple_key_drop_153"], 0);
        const resolved = JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents()));
        DataManager.extractSaveContents(resolved);
        $gameVariables.setValue(437, 2);
        $gameMap.refresh();
        win(interpreter($dataMap.events[11].pages[3].list, 11, 8), 0);
        expect(["simple_key_drop_153"], 0);
        scenarios++;
        // A bundle must wait intact when fewer than three inventory slots are
        // available; reload and indexed replay must neither lose nor add keys.
        setup(94);
        const cap = $gameParty.maxItems($dataItems[320]);
        $gameParty.gainItem($dataItems[320], cap - 2);
        ap.queueReceivedItemsForDevelopment(0, [items[0]]);
        ap.deliverPendingForDevelopment();
        expect([], cap - 2);
        assert.equal(ap.pendingItems().length, 1);
        const full = JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents()));
        DataManager.extractSaveContents(full);
        ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
        ap.queueReceivedItemsForDevelopment(0, [items[0]]);
        $gameParty.loseItem($dataItems[320], 1);
        ap.deliverPendingForDevelopment();
        expect([], cap);
        assert.equal(ap.pendingItems().length, 0);
        ap.queueReceivedItemsForDevelopment(0, [items[0]]);
        $gameParty.loseItem($dataItems[320], 1);
        ap.deliverPendingForDevelopment();
        expect([], cap - 1);
        scenarios++;
        return { scenarios, checks: locations.length, bundles: 10, keys: 30 };
    } finally {
        SceneManager.push = originalPush;
        Math.random = originalRandom;
    }
};
