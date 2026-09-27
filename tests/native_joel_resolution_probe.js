"use strict";

module.exports = function nativeJoelResolutionProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    const keys = ["joel_peaceful_door_knob", "joel_resolution_toothy_whip"];
    const originalPush = SceneManager.push;
    let dialogue = 0, recruitment = 0, battles = 0, guards = 0;
    SceneManager.push = function(scene) {
        if (scene !== Scene_Battle) return originalPush.call(this, scene);
    };
    function loadMap(id) {
        $dataMap = JSON.parse(fs.readFileSync("data/Map" + String(id).padStart(3, "0") + ".json", "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(id);
    }
    function setup(active, map) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $gamePlayer.clearTransferInfo();
        loadMap(map);
        $gameVariables.setValue(15, 2);
        if (active) {
            ap.bindIdentityForDevelopment("joel-resolution", 0, 1);
            ap.activateForDevelopment();
        }
    }
    function run(list, event, start, end, choose = () => 0) {
        const interpreter = new Game_Interpreter();
        interpreter.setup(list, event);
        interpreter._index = start;
        let steps = 0;
        while (interpreter._index <= end) {
            assert.ok(steps++ < 600, "Joel dialogue did not terminate");
            const command = interpreter.currentCommand();
            // Stop at native abort/game-over endpoints instead of changing the test scene.
            if ([340, 353].includes(command.code)) return command.code;
            if ([0, 101, 102, 111, 117, 118, 119, 121, 122, 126, 129, 402, 404, 411, 412].includes(command.code)) {
                interpreter.executeCommand();
                if ($gameMessage.isChoice()) $gameMessage.onChoice(choose($gameMessage.choices()));
                $gameMessage.clear();
            } else interpreter._index++;
        }
        return 0;
    }
    try {
        for (const active of [false, true]) for (const choice of [0, 1, 2]) {
            for (const hp of choice === 0 ? [1, 100] : [100]) {
                setup(active, 32);
                BattleManager.setup(26, true, false);
                $gameParty.onBattleStart();
                $gameActors.actor(1).setHp(hp);
                $gameVariables.setValue(107, 6);
                $gameTroop.members()[0].addState(8);
                const list = $dataTroops[26].pages[1].list;
                const original = JSON.stringify(list);
                const endpoint = run(list, 0, 0, 60, () => choice);
                const completed = endpoint === 340;
                assert.equal(endpoint, hp === 1 ? 353 : 340);
                assert.deepEqual(ap.checkedKeys(), active && completed ? keys : []);
                assert.equal($gameParty.numItems($dataItems[310]), !active && completed ? 1 : 0);
                assert.equal($gameParty.numItems($dataWeapons[215]), 0);
                assert.equal($gameVariables.value(107), choice === 2 ? 7 : 8);
                assert.equal(JSON.stringify(list), original);
                if (active && completed) {
                    $gameParty.onBattleEnd();
                    DataManager.extractSaveContents(JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents())));
                    assert.deepEqual(ap.checkedKeys(), keys);
                    loadMap(32);
                    run($dataMap.events[7].pages[2].list, 7, 8, 10);
                    assert.deepEqual(ap.checkedKeys(), keys);
                    assert.equal($gameParty.numItems($dataItems[310]), 0);
                }
                dialogue++;
            }
        }
        for (const active of [false, true]) for (const full of [false, true]) {
            setup(active, 32);
            if (full) for (const id of [2, 3, 5]) $gameParty.addActor(id);
            BattleManager.setup(26, true, false);
            $gameParty.onBattleStart();
            const list = $dataTroops[26].pages[0].list;
            const original = JSON.stringify(list);
            run(list, 0, 321, 356);
            assert.equal($gameVariables.value(107), 20);
            assert.equal($gameSwitches.value(33), true);
            assert.equal($gameSwitches.value(784), true);
            assert.deepEqual(ap.checkedKeys(), active ? keys : []);
            assert.equal($gameParty._actors.includes(4), !full);
            assert.equal(JSON.stringify(list), original);
            recruitment++;
        }
        for (const map of [32, 435]) for (const page of map === 32 ? [0, 1, 2, 3] : [0, 1]) {
            for (const active of [false, true]) for (const result of [0, 1, 2]) {
                setup(active, map);
                const event = map === 32 ? 7 : 2;
                const list = $dataMap.events[event].pages[page].list;
                const original = JSON.stringify(list);
                const interpreter = new Game_Interpreter();
                interpreter.setup(list, event);
                interpreter._index = map === 32 ? 2 : 1;
                interpreter.executeCommand();
                for (const enemy of $gameTroop.members()) enemy.setHp(0);
                if (result === 0) BattleManager.processVictory(true);
                else BattleManager.endBattle(result);
                while (interpreter._index < list.length) {
                    const code = interpreter.currentCommand().code;
                    if ([0, 101, 121, 122, 123, 126, 601, 602, 603, 604].includes(code)) {
                        interpreter.executeCommand();
                        $gameMessage.clear();
                    } else interpreter._index++;
                }
                const won = result === 0;
                assert.deepEqual(ap.checkedKeys(), active && won ? keys : [], JSON.stringify({map, page, active, result}));
                assert.equal($gameSwitches.value(541), won);
                assert.equal($gameParty.numItems($dataItems[310]), map === 32 && !active && won ? 1 : 0);
                assert.equal($gameParty.numItems($dataWeapons[215]), map === 435 && !active && won ? 1 : 0);
                assert.equal(JSON.stringify(list), original);
                battles++;
            }
        }
        for (const guard of ["cloned", "other_map", "build"]) {
            setup(true, 32);
            const list = $dataMap.events[7].pages[0].list;
            const interpreter = new Game_Interpreter();
            interpreter.setup(guard === "cloned" ? JSON.parse(JSON.stringify(list)) : list, 7);
            interpreter._index = 9;
            if (guard === "other_map") interpreter._mapId = 31;
            if (guard === "build") $dataSystem.versionId++;
            try {
                interpreter.executeCommand();
                assert.deepEqual(ap.checkedKeys(), []);
                assert.equal($gameParty.numItems($dataItems[310]), 1);
            } finally {
                if (guard === "build") $dataSystem.versionId--;
            }
            guards++;
        }
        return { dialogue, recruitment, battles, guards };
    } finally {
        SceneManager.push = originalPush;
        $gameMessage.clear();
        $gameParty.onBattleEnd();
    }
};
