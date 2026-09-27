"use strict";

module.exports = function nativeAdvancedDropsProbe(locations) {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    const originalPush = SceneManager.push;
    const originalRandom = Math.random;
    let scenarios = 0;
    SceneManager.push = function(scene) {
        if (scene !== Scene_Battle) return originalPush.call(this, scene);
    };
    function loadMap(map) {
        $dataMap = JSON.parse(fs.readFileSync("data/Map" + String(map).padStart(3, "0") + ".json", "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(map);
    }
    function command(list, event, index) {
        const interpreter = new Game_Interpreter();
        interpreter.setup(list, event);
        interpreter._index = index;
        interpreter.executeCommand();
        return interpreter;
    }
    try {
        for (const location of locations) for (const source of [location, ...(location.source_variants || [])]) {
            for (const active of [false, true]) for (const result of [0, 1, 2]) {
                for (const transformed of location.battle_drop.native_transform ? [false, true] : [true]) {
                    DataManager.setupNewGame();
                    $gameMessage.clear();
                    $gamePlayer.clearTransferInfo();
                    loadMap(source.map_id);
                    const condition = $dataMap.events[source.event_id].pages[source.page].conditions;
                    if (condition.switch1Valid) $gameSwitches.setValue(condition.switch1Id, true);
                    if (condition.selfSwitchValid) $gameSelfSwitches.setValue(
                        [source.map_id, source.event_id, condition.selfSwitchCh], true);
                    $gameSwitches.setValue(107, true);
                    $gameSwitches.setValue(108, true);
                    if (active) ap.activateForDevelopment();
                    const list = $dataMap.events[source.event_id].pages[source.page].list;
                    const original = JSON.stringify(list);
                    const interpreter = command(list, source.event_id, source.command_index);
                    if (location.battle_drop.native_transform && transformed) {
                        command($dataTroops[441].pages[2].list, 0, 2);
                        assert.equal($gameTroop.members()[0].enemyId(), 450);
                    }
                    for (const enemy of $gameTroop.members()) enemy.setHp(0);
                    Math.random = () => 0.99;
                    if (result === 0) BattleManager.processVictory(true);
                    else BattleManager.endBattle(result);
                    Math.random = originalRandom;
                    const reward = result === 0 && transformed;
                    assert.deepEqual(ap.checkedKeys(), active && reward ? [location.key] : []);
                    assert.equal($gameParty.numItems($dataWeapons[location.reward_database_id]), !active && reward ? 1 : 0);
                    $gameMessage.clear();
                    // Exercise the native victory continuation and its consumed gate.
                    if (result === 0) {
                        if (source.battle_completion) {
                            interpreter._index = 9;
                            interpreter.executeCommand();
                            $gameMap.refresh();
                            assert.equal($gameMap.event(source.event_id)._pageIndex, 4);
                        } else if (source.map_id === 34) {
                            interpreter._index = 9;
                            interpreter.executeCommand();
                            interpreter._index = 13;
                            interpreter.executeCommand();
                            assert.equal($gameSwitches.value(107), false);
                            assert.equal($gameSwitches.value(544), true);
                            interpreter._index = 3;
                            interpreter.executeCommand();
                            assert.ok(interpreter._index > source.command_index);
                        } else {
                            interpreter._index = 3;
                            interpreter.executeCommand();
                            assert.equal($gameSwitches.value(1206), true);
                        }
                    }
                    assert.equal(JSON.stringify(list), original);
                    if (source.map_id === 463) {
                        $gamePlayer.clearTransferInfo();
                        loadMap(462);
                        const gate = command($dataMap.events[1].pages[0].list, 1, 0);
                        while (gate._index <= 4 && !$gamePlayer.isTransferring()) gate.executeCommand();
                        assert.equal($gamePlayer._newMapId, result === 0 ? 406 : 463);
                        $gamePlayer.clearTransferInfo();
                    }
                    scenarios++;
                }
            }
        }
        return { scenarios };
    } finally {
        SceneManager.push = originalPush;
        Math.random = originalRandom;
    }
};
