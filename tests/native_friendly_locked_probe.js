"use strict";

module.exports = function nativeFriendlyLockedProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    let doors = 0, rewards = 0;
    const load = mid => {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $gamePlayer.clearTransferInfo();
        $dataMap = JSON.parse(fs.readFileSync(`data/Map${String(mid).padStart(3, "0")}.json`, "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(mid);
        LookOutsideArchipelago.activateForDevelopment();
    };
    for (const [eid, target, unlocked] of [[3, 329, 332], [66, 330, 333]]) {
        for (const route of ["no-key", "key-refused", "key-accepted", "already-unlocked"]) {
            load(132);
            if (route.startsWith("key-")) $gameParty.gainItem($dataItems[377], 1);
            if (route === "already-unlocked") $gameSwitches.setValue(unlocked, true);
            const list = $dataMap.events[eid].pages[0].list;
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, eid);
            let steps = 0;
            while (interpreter.isRunning() && interpreter.currentCommand()) {
                assert.ok(steps++ < 100, "Door interpreter did not terminate");
                const code = interpreter.currentCommand().code;
                if ([0, 101, 102, 111, 115, 118, 119, 121, 201, 402, 404, 411, 412].includes(code)) {
                    interpreter.executeCommand();
                    if ($gameMessage.isChoice()) $gameMessage.onChoice(route === "key-refused" ? 1 : 0);
                    $gameMessage.clear();
                } else interpreter._index++;
            }
            const allowed = ["key-accepted", "already-unlocked"].includes(route);
            assert.equal($gamePlayer.isTransferring(), allowed, route);
            if (allowed) assert.equal($gamePlayer._newMapId, target);
            assert.deepEqual(LookOutsideArchipelago.checkedKeys(), []);
            doors++;
        }
    }
    for (const mid of [112, 329, 330, 333]) {
        load(mid);
        for (const event of $dataMap.events.filter(Boolean)) {
            for (const page of event.pages) {
                for (const [index, command] of page.list.entries()) {
                    const p = command.parameters;
                    if (!([127, 128].includes(command.code) || command.code === 126 && p[0] === 300) ||
                        p[1] !== 0 || p[2] !== 0 || p[3] !== 1) continue;
                    const database = { 126: $dataItems, 127: $dataWeapons, 128: $dataArmors }[command.code];
                    const before = $gameParty.numItems(database[p[0]]);
                    const interpreter = new Game_Interpreter();
                    interpreter.setup(page.list, event.id);
                    interpreter._index = index;
                    interpreter.executeCommand();
                    assert.equal($gameParty.numItems(database[p[0]]), before + 1);
                    assert.deepEqual(LookOutsideArchipelago.checkedKeys(), []);
                    rewards++;
                }
            }
        }
    }
    assert.equal(rewards, 8, "Excluded room reward inventory changed");
    return { doors, rewards };
};
