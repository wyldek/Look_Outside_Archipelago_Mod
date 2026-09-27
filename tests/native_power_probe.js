"use strict";

module.exports = function nativePowerProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    const sounds = [];
    const originalPlaySe = AudioManager.playSe;
    const originalPush = SceneManager.push;
    const originalRandom = Math.random;
    SceneManager.push = function(scene) {
        if (scene !== Scene_Battle) return originalPush.call(this, scene);
    };
    AudioManager.playSe = sound => sounds.push(sound.name);
    let scenarios = 0;
    function loadMap(id) {
        $dataMap = JSON.parse(fs.readFileSync("data/Map" + String(id).padStart(3, "0") + ".json", "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(id);
        // Keep unrelated autoruns out of this focused native-event probe.
        $gameMap._interpreter.clear();
        for (const event of $gameMap.events()) event.clearStartingFlag();
    }
    function setup(active) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $gamePlayer.clearTransferInfo();
        loadMap(369);
        $gameVariables.setValue(15, 7);
        $gameSwitches.setValue(21, true);
        $gameSwitches.setValue(984, true);
        $gameSwitches.setValue(986, true);
        if (active) {
            ap.bindIdentityForDevelopment("native-power", 0, 1);
            ap.activateForDevelopment();
            ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
        }
        sounds.length = 0;
    }
    function deliver() {
        ap.queueReceivedItemsForDevelopment(0, [{ item: 540300987 }]);
        ap.deliverPendingForDevelopment();
        assert.equal(ap.pendingItems().length, 0);
    }
    function reload() {
        const contents = JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents()));
        DataManager.extractSaveContents(contents);
        ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
    }
    function flush() {
        const texts = [];
        while (ap.powerState().notices.length) {
            $gameMessage.clear();
            ap.updatePowerForDevelopment();
            assert.ok($gameMessage._texts.length > 0, JSON.stringify({ power: ap.powerState(),
                eventRunning: $gameMap.isEventRunning(), busy: $gameMessage.isBusy(), active: ap.active }));
            texts.push(...$gameMessage._texts);
        }
        $gameMessage.clear();
        return texts;
    }
    function outage(active, deliverDuring = false) {
        $gameSwitches.setValue(830, true);
        $gameVariables.setValue(737, 120);
        const list = $dataCommonEvents[16].list;
        const original = JSON.stringify(list);
        let interpreter = new Game_Interpreter();
        interpreter.setup(list, 0);
        interpreter._index = 25;
        let sawCut = false;
        while (interpreter._index <= 34) {
            const index = interpreter._index;
            const code = interpreter.currentCommand().code;
            // Omit only the BGS plugin call and achievement script in this probe.
            if ([111, 121, 122, 250].includes(code)) interpreter.executeCommand();
            else interpreter._index++;
            if (index === 26) {
                assert.equal($gameSwitches.value(21), false, "Native loss must actually execute");
                assert.equal(sounds.includes("Blackout"), false);
                sawCut = true;
                if (deliverDuring) {
                    deliver();
                    assert.equal(ap.powerState().outageInProgress, true);
                    assert.equal($gameSwitches.value(21), false);
                }
            }
        }
        assert.equal(sawCut, true);
        assert.ok(sounds.includes("Blackout"));
        assert.equal($gameSwitches.value(830), false);
        assert.equal($gameVariables.value(940), 0);
        assert.equal(JSON.stringify(list), original);
        if (active) assert.equal(ap.powerState().outageInProgress, false);
    }
    function repair(active, accept = true) {
        loadMap(369);
        $gameMap.refresh();
        assert.equal($gameMap.event(24)._pageIndex, 0, "An early AP item must not consume the check");
        const list = $dataMap.events[24].pages[0].list;
        const original = JSON.stringify(list);
        const interpreter = new Game_Interpreter();
        interpreter.setup(list, 24);
        while (interpreter._index <= 21) {
            const code = interpreter.currentCommand().code;
            if ([0, 101, 102, 121, 250, 402, 404].includes(code)) {
                interpreter.executeCommand();
                if ($gameMessage.isChoice()) $gameMessage.onChoice(accept ? 0 : 1);
                $gameMessage.clear();
            } else interpreter._index++;
        }
        $gameMap.refresh();
        assert.equal($gameMap.event(24)._pageIndex, accept ? 1 : 0);
        assert.deepEqual(ap.checkedKeys(), active && accept ? ["power_restoration"] : []);
        assert.equal(JSON.stringify(list), original);
    }
    try {
        for (const mode of ["inactive", "before", "after", "after-save", "repair-first", "before-save", "during"]) {
            const active = mode !== "inactive";
            setup(active);
            const early = mode.startsWith("before");
            if (early) {
                deliver();
                assert.equal($gameSwitches.value(21), true);
                assert.equal($gameSwitches.value(987), false);
                assert.equal($gameSwitches.value(986), true);
                assert.deepEqual(ap.checkedKeys(), []);
                if (mode === "before-save") {
                    reload();
                    assert.equal(ap.powerState().received, true);
                }
                assert.match(flush().join("\n"), /when the outage occurs/);
            }
            outage(active, mode === "during");
            const restoredAtOutage = early || mode === "during";
            assert.equal($gameSwitches.value(21), restoredAtOutage);
            if (active) {
                const notice = flush().join("\n");
                assert.match(notice, restoredAtOutage ? /power cuts out.*immediately brings it back/s : /power has gone out/);
                assert.equal(sounds.filter(s => s === "RestorePower").length, restoredAtOutage ? 1 : 0);
            }
            if (mode === "after-save") {
                reload();
                assert.equal(ap.powerState().outageSeen, true);
            }
            if (mode === "after" || mode === "after-save") {
                deliver();
                assert.equal($gameSwitches.value(21), true);
                assert.match(flush().join("\n"), /Electricity has returned/);
            }
            const beforeRepair = sounds.length;
            repair(active, false);
            assert.equal(sounds.length, beforeRepair);
            repair(active);
            assert.equal($gameSwitches.value(21), !active || mode !== "repair-first");
            assert.equal($gameSwitches.value(987), !active || mode !== "repair-first");
            assert.equal(sounds.slice(beforeRepair).includes("RestorePower"), !active);
            if (mode === "repair-first") {
                assert.equal($gameSwitches.value(986), true, "Checking alone must not disable powered-world hazards");
                assert.match(flush().join("\n"), /Awaiting/);
                deliver();
                assert.match(flush().join("\n"), /Electricity has returned/);
                assert.equal($gameSwitches.value(21), true);
            }
            if (active) {
                assert.equal($gameSwitches.value(984), false);
                assert.equal($gameSwitches.value(986), false);
                assert.equal($gameVariables.value(737), 0);
                const notices = ap.powerState().notices.length;
                deliver(); // Replay the same indexed item.
                assert.equal(ap.powerState().notices.length, notices);
                reload();
                assert.equal(ap.powerState().received, true);
                assert.equal(ap.powerState().outageSeen, true);
                assert.equal($gameSwitches.value(21), true);
                assert.deepEqual(ap.checkedKeys(), ["power_restoration"]);
            }
            scenarios++;
        }
        // Keep queued text out of a native message already on screen.
        setup(true);
        deliver();
        $gameMessage.add("Existing dialogue.");
        ap.updatePowerForDevelopment();
        assert.deepEqual($gameMessage._texts, ["Existing dialogue."]);
        assert.deepEqual(ap.powerState().notices, ["received"]);
        $gameMessage.clear();
        flush();
        scenarios++;
        // A repair command cloned from the original list must remain vanilla.
        setup(true);
        $gameSwitches.setValue(21, false);
        const clone = JSON.parse(JSON.stringify($dataMap.events[24].pages[0].list));
        const clonedRepair = new Game_Interpreter();
        clonedRepair.setup(clone, 24);
        for (const index of [10, 11, 12, 13]) {
            clonedRepair._index = index;
            clonedRepair.executeCommand();
        }
        assert.equal($gameSwitches.value(21), true);
        assert.equal($gameSwitches.value(987), true);
        assert.deepEqual(ap.checkedKeys(), []);
        scenarios++;
        // Cloned lists and a changed build must not run outage-specific behavior.
        for (const guard of ["cloned", "build", "inactive"]) {
            setup(guard !== "inactive");
            if (guard !== "inactive") deliver();
            let list = $dataCommonEvents[16].list;
            if (guard === "cloned") list = JSON.parse(JSON.stringify(list));
            if (guard === "build") $dataSystem.versionId++;
            try {
                const interpreter = new Game_Interpreter();
                interpreter.setup(list, 0);
                for (const index of [26, 34]) {
                    interpreter._index = index;
                    interpreter.executeCommand();
                }
                assert.equal($gameSwitches.value(21), false);
                assert.equal(ap.powerState().outageSeen, false);
                assert.equal($gameSwitches.value(987), false);
            } finally {
                if (guard === "build") $dataSystem.versionId--;
            }
            scenarios++;
        }
        // Native power restoration can happen before olmPhase is initialized.
        // Run both actual encounters and their consumed pages at phase zero.
        for (const [mid, eid] of [[50, 11], [86, 104]]) {
            for (const timing of ["before", "after"]) for (const result of [0, 1]) {
                setup(true);
                if (timing === "before") deliver();
                outage(true);
                if (timing === "after") deliver();
                loadMap(mid);
                const pages = $dataMap.events[eid].pages;
                const original = JSON.stringify(pages);
                assert.equal($gameVariables.value(740), 0);
                assert.equal($gameMap.event(eid)._pageIndex, 0);
                assert.equal($gameMap.event(eid).meetsConditions(JSON.parse(JSON.stringify(pages[0]))), false);
                const battle = new Game_Interpreter();
                battle.setup(pages[0].list, eid);
                battle._index = 1;
                battle.executeCommand();
                for (const enemy of $gameTroop.members()) enemy.setHp(0);
                Math.random = () => 0.99;
                if (result === 0) BattleManager.processVictory(true);
                else BattleManager.endBattle(result);
                Math.random = originalRandom;
                while (battle.currentCommand()) {
                    if ([0, 121, 122, 123, 601, 602, 603, 604].includes(battle.currentCommand().code)) {
                        battle.executeCommand();
                    } else battle._index++;
                }
                $gameMap.refresh();
                assert.equal($gameMap.event(eid)._pageIndex, result === 0 ? 3 : 2);
                if (mid === 50) {
                    assert.deepEqual([...ap.checkedKeys()].sort(), result === 0 ?
                        ["boss_drop_619_260", "boss_drop_619_44"] : []);
                } else if (result === 0) {
                    assert.equal($gameMap.event(106)._pageIndex, 3);
                    const key = new Game_Interpreter();
                    key.setup($dataMap.events[106].pages[3].list, 106);
                    for (const index of [5, 8]) {
                        key._index = index;
                        key.executeCommand();
                    }
                    assert.deepEqual([...ap.checkedKeys()].sort(), ["darryl_legs", "map086_event106"]);
                    assert.equal($gameParty.numItems($dataItems[395]), 0);
                }
                reload();
                $gameMap.refresh();
                assert.equal($gameMap.event(eid)._pageIndex, result === 0 ? 3 : 2);
                assert.equal($gameVariables.value(740), 0, "Restoration must not advance the native chase story");
                assert.equal(JSON.stringify(pages), original);
                scenarios++;
            }
            for (const guard of ["pre-outage", "no-item", "inactive", "build"]) {
                setup(true);
                if (guard !== "no-item") deliver();
                if (guard !== "pre-outage") outage(true);
                if (guard === "inactive") ap.deactivate();
                if (guard === "build") $dataSystem.versionId++;
                try {
                    loadMap(mid);
                    assert.equal($gameMap.event(eid)._pageIndex, -1);
                } finally {
                    if (guard === "build") $dataSystem.versionId--;
                }
                scenarios++;
            }
        }
        return { scenarios };
    } finally {
        AudioManager.playSe = originalPlaySe;
        SceneManager.push = originalPush;
        Math.random = originalRandom;
        $gameMessage.clear();
    }
};
