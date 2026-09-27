"use strict";

module.exports = function nativeReusableGiftsProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    let scenarios = 0;
    function map(mid) {
        $dataMap = JSON.parse(fs.readFileSync(`data/Map${String(mid).padStart(3, "0")}.json`, "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(mid);
    }
    function setup(active, mid, tid) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $gamePlayer.clearTransferInfo();
        $gameSwitches.setValue(401, true);
        $gameVariables.setValue(213, 2);
        map(mid);
        if (active) {
            ap.bindIdentityForDevelopment("reusable-gifts", 0, 1);
            ap.activateForDevelopment();
            ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
        }
        BattleManager.setup(tid, true, false);
        $gameParty.onBattleStart();
    }
    function run(list, start, end, choose = () => 0, eid = 0, branch = undefined) {
        const before = JSON.stringify(list);
        const interpreter = new Game_Interpreter();
        interpreter.setup(list, eid);
        interpreter._index = start;
        if (branch !== undefined) interpreter._branch[0] = branch;
        const messages = [];
        let steps = 0;
        while (interpreter.currentCommand() && interpreter._index <= end) {
            assert.ok(steps++ < 900, "Reusable gift dialogue loop did not finish");
            const code = interpreter.currentCommand().code;
            if (code === 340) break;
            if ([0, 101, 102, 111, 118, 119, 121, 122, 123, 126,
                 402, 404, 411, 412, 601, 602, 604].includes(code)) {
                interpreter.executeCommand();
                messages.push(...$gameMessage._texts);
                if ($gameMessage.isChoice()) $gameMessage.onChoice(choose($gameMessage.choices()));
                $gameMessage.clear();
            } else interpreter._index++;
        }
        assert.equal(JSON.stringify(list), before, "Native event list changed");
        return messages;
    }
    function common(cid, start, end) { return run($dataCommonEvents[cid].list, start, end); }
    function count(id) { return $gameParty.numItems($dataItems[id]); }
    function receive(id) {
        ap.queueReceivedItemsForDevelopment(0, [{item: 540000000 + id}]);
        ap.deliverPendingForDevelopment();
        assert.equal(ap.pendingItems().length, 0);
    }
    function reload() {
        DataManager.extractSaveContents(JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents())));
        ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
    }
    function scout(choice = 0) { return run($dataTroops[295].pages[0].list, 6, 55, () => choice); }
    function jar(route) {
        return run($dataTroops[334].pages[0].list, 12, 252, choices => {
            if (choices[0] === "Sure!") return route === "refuse" ? 1 : 0;
            if (route === "later" && $gameVariables.value(320) === 5) {
                const index = choices.findIndex(text => text.includes("Want to come along?"));
                assert.ok(index >= 0);
                return index;
            }
            const leave = choices.findIndex(text => text.includes("(Leave.)"));
            assert.ok(leave >= 0);
            return leave;
        });
    }
    for (const active of [false, true]) {
        for (const choice of [0, 1]) {
            setup(active, 180, 295);
            $gameSwitches.setValue(1199, true);
            const text = scout(choice);
            assert.deepEqual(ap.checkedKeys(), active ? ["scout_radio"] : []);
            assert.equal(count(156), active ? 0 : 1);
            assert.equal($gameVariables.value(355), 1);
            assert.equal($gameSwitches.value(394), !active);
            assert.equal(text.includes("Archipelago location checked."), active);
            scout(choice);
            assert.equal(count(156), active ? 0 : 1);
            if (active) {
                receive(156);
                assert.equal(count(156), 1);
                assert.equal($gameSwitches.value(394), true);
                assert.equal($gameVariables.value(355), 1);
            }
            scenarios++;
        }
        for (const route of ["accept", "refuse", "later", "unready"]) {
            setup(active, 218, 334);
            $gameVariables.setValue(306, route === "unready" ? 2 : 1);
            $gameVariables.setValue(320, route === "later" ? 5 : 0);
            const text = jar(route);
            const granted = route === "accept" || route === "later";
            assert.equal($gameVariables.value(320), granted ? 6 : route === "refuse" ? 5 : 1);
            assert.deepEqual(ap.checkedKeys(), active && route !== "unready" ? ["bright_frederic_jar"] : []);
            assert.equal(count(4), !active && granted ? 1 : 0);
            assert.equal(text.includes("Archipelago location checked."), active && granted);
            if (route === "refuse") {
                if (active) reload();
                jar("later");
                assert.equal($gameVariables.value(320), 6);
                assert.equal(count(4), active ? 0 : 1);
                assert.deepEqual(ap.checkedKeys(), active ? ["bright_frederic_jar"] : []);
            }
            scenarios++;
        }
        for (const outcome of [0, 1]) {
            setup(active, 218, 334);
            $gameParty.onBattleEnd();
            run($dataMap.events[2].pages[0].list, 2, 12, () => 0, 2, outcome);
            assert.equal($gameVariables.value(320), outcome === 0 ? 99 : 0);
            assert.deepEqual(ap.checkedKeys(), active && outcome === 0 ? ["bright_frederic_jar"] : []);
            assert.equal(count(4), 0);
            scenarios++;
        }
    }
    // Deliver before meeting the giver, use it, and then collect its check.
    setup(true, 180, 295);
    receive(156);
    assert.equal($gameVariables.value(355), 0, "Delivery must not complete Scout's conversation");
    // No signal -> no battery usage. The native room signal works before meeting Scout.
    common(175, 3, 13);
    assert.equal(count(156), 1);
    run($dataMap.events[13].pages[0].list, 4, 4, () => 0, 13);
    common(175, 3, 13);
    assert.equal(count(155), 1);
    assert.equal(count(156), 0);
    common(5, 179, 187);
    assert.equal($gameVariables.value(456), 1);
    common(11, 1, 12);
    assert.equal($gameSwitches.value(394), false);
    scout();
    assert.equal($gameVariables.value(456), 1, "Scout reset an already-running recharge");
    assert.equal($gameSwitches.value(394), false);
    assert.equal(count(155), 1);
    assert.equal(count(156), 0);
    reload();
    receive(156); // Replayed ReceivedItems index must not recreate the charged form.
    assert.equal(count(156), 0);
    for (let hour = 2; hour <= 8; hour++) {
        common(5, 179, 187);
        assert.equal(count(156), hour === 8 ? 1 : 0);
        assert.equal(count(155), hour < 8 ? 1 : 0);
    }
    common(5, 179, 187);
    common(11, 1, 12);
    assert.equal(count(156), 1);
    assert.equal($gameSwitches.value(394), true);
    assert.deepEqual(ap.checkedKeys(), ["scout_radio"]);
    scenarios++;

    for (const route of ["accept", "refuse", "victory"]) {
        setup(true, 218, 334);
        receive(4);
        assert.equal($gameVariables.value(320), 0);
        common(193, 0, 17);
        assert.equal(count(4), 0);
        assert.equal(count(372), 1);
        $gameVariables.setValue(306, 1);
        if (route === "victory") {
            $gameParty.onBattleEnd();
            run($dataMap.events[2].pages[0].list, 2, 12, () => 0, 2, 0);
        } else jar(route);
        assert.equal(count(4), 0, "Quest outcome reset a tired AP Medic");
        reload();
        receive(4);
        common(5, 179, 187); // Hours do not refresh the healing item.
        assert.equal(count(4), 0);
        assert.equal(count(372), 1);
        common(6, 142, 146); // Native real-new-day transformation.
        common(6, 142, 146);
        assert.equal(count(4), 1);
        assert.equal(count(372), 0);
        assert.deepEqual(ap.checkedKeys(), ["bright_frederic_jar"]);
        scenarios++;
    }
    for (const [mid, tid, start, end, variable, item] of [[180, 295, 43, 48, 355, 156], [218, 334, 223, 226, 320, 4]]) {
        for (const guard of ["clone", "wrong-troop", "wrong-build"]) {
            setup(true, mid, tid);
            $gameVariables.setValue(variable, tid === 295 ? 0 : 1);
            let list = $dataTroops[tid].pages[0].list;
            if (guard === "clone") list = JSON.parse(JSON.stringify(list));
            if (guard === "wrong-troop") BattleManager.setup(tid === 295 ? 334 : 295, true, false);
            const version = $dataSystem.versionId;
            try {
                if (guard === "wrong-build") $dataSystem.versionId++;
                run(list, start, end);
                assert.deepEqual(ap.checkedKeys(), []);
                assert.equal(count(item), 1);
                if (tid === 295) {
                    assert.equal($gameVariables.value(456), 8);
                    assert.equal($gameSwitches.value(394), true);
                }
            } finally { $dataSystem.versionId = version; }
            scenarios++;
        }
    }
    return {scenarios, questOutcomes: 16, earlyDeliveryCooldowns: 4, sourceGuards: 6};
};
