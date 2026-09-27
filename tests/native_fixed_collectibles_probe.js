"use strict";

module.exports = function nativeFixedCollectiblesProbe(locations) {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    const originalPush = SceneManager.push;
    const originalRandom = Math.random;
    let scenarios = 0;
    SceneManager.push = function(scene) {
        if (scene !== Scene_Battle) return originalPush.call(this, scene);
    };
    function setup(source, active) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $gamePlayer.clearTransferInfo();
        $gameSwitches.setValue(401, true);
        $gameVariables.setValue(213, 2);
        $dataMap = JSON.parse(fs.readFileSync(`data/Map${String(source.map_id).padStart(3, "0")}.json`, "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(source.map_id);
        if (active) {
            ap.bindIdentityForDevelopment("fixed-collectibles", 0, 1);
            ap.activateForDevelopment();
        }
    }
    function command(list, eid, index) {
        const interpreter = new Game_Interpreter();
        interpreter.setup(list, eid);
        interpreter._index = index;
        interpreter.executeCommand();
        return interpreter;
    }
    function appearHighFive() {
        const interpreter = new Game_Interpreter();
        interpreter.setup($dataTroops[225].pages[0].list, 0);
        while (interpreter._index <= 20) interpreter.executeCommand();
    }
    try {
        for (const location of locations) for (const source of [location, ...location.source_variants]) {
            for (const active of [false, true]) for (const result of [0, 1, 2]) {
                setup(source, active);
                const list = $dataMap.events[source.event_id].pages[source.page].list;
                const original = JSON.stringify(list);
                const interpreter = command(list, source.event_id, source.command_index);
                if (location.reward_database_id === 280) appearHighFive();
                for (const enemy of $gameTroop.members()) enemy.setHp(0);
                Math.random = () => 0.99;
                const vanillaDrops = $gameTroop.makeDropItems();
                if (result === 0) BattleManager.processVictory(true);
                else BattleManager.endBattle(result);
                assert.deepEqual(ap.checkedKeys(), active && result === 0 ? [location.key] : []);
                assert.equal($gameParty.numItems($dataItems[location.reward_database_id]), !active && result === 0 ? 1 : 0);
                // The native consumable rewards stay in the game.
                if (result === 0) {
                    for (const id of [16, 359]) assert.equal($gameParty.numItems($dataItems[id]),
                        vanillaDrops.filter(item => item === $dataItems[id]).length);
                    $gameMessage.clear();
                    const proof = source.battle_completion;
                    interpreter._index = proof.command_index;
                    interpreter.executeCommand();
                    if (proof.command_code === 121) assert.equal($gameSwitches.value(proof.parameters[0]), true);
                    else assert.equal($gameSelfSwitches.value([source.map_id, source.event_id, proof.parameters[0]]), true);
                    const save = JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents()));
                    DataManager.extractSaveContents(save);
                    assert.deepEqual(ap.checkedKeys(), active ? [location.key] : []);
                }
                assert.equal(JSON.stringify(list), original);
                scenarios++;
            }
        }
        // A native early victory sets High Five's consumed flag before it can
        // appear. Its resolution hook gives the same check, but escape does not.
        for (const active of [false, true]) for (const result of [0, 1]) {
            setup({map_id: 70}, active);
            const list = $dataMap.events[57].pages[1].list;
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, 57);
            interpreter._index = 43;
            interpreter._branch[list[42].indent] = result;
            while (interpreter._index < 62) {
                const code = interpreter.currentCommand().code;
                if ([0, 121, 122, 601, 602, 604, 411, 412].includes(code)) interpreter.executeCommand();
                else interpreter._index++;
            }
            assert.equal($gameSwitches.value(433), result === 0);
            assert.deepEqual(ap.checkedKeys(), active && result === 0 ? ["boss_drop_293_280"] : []);
            assert.equal($gameParty.numItems($dataItems[280]), 0);
            scenarios++;
        }
        for (const guard of ["hidden", "clone", "wrong-build"]) {
            const source = locations.find(r => r.reward_database_id === 280);
            setup(source, true);
            if (guard === "hidden") $gameSwitches.setValue(433, true);
            let list = $dataMap.events[source.event_id].pages[source.page].list;
            if (guard === "clone") list = JSON.parse(JSON.stringify(list));
            const build = $dataSystem.versionId;
            try {
                if (guard === "wrong-build") $dataSystem.versionId++;
                command(list, source.event_id, source.command_index);
                appearHighFive();
                for (const enemy of $gameTroop.members()) enemy.setHp(0);
                BattleManager.processVictory(true);
                assert.deepEqual(ap.checkedKeys(), []);
                assert.equal($gameParty.numItems($dataItems[280]), guard === "hidden" ? 0 : 1);
            } finally { $dataSystem.versionId = build; }
            scenarios++;
        }
        return {scenarios, encounterSources: locations.reduce((n, r) => n + 1 + r.source_variants.length, 0)};
    } finally { SceneManager.push = originalPush; Math.random = originalRandom; }
};
