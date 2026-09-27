"use strict";

module.exports = function nativePortraitProbe(location) {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    let combat = 0, agreement = 0, friendlyKills = 0;
    function setup(map, active) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $dataMap = JSON.parse(fs.readFileSync("data/Map" + String(map).padStart(3, "0") + ".json", "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(map);
        if (active) ap.activateForDevelopment();
    }
    function run(list, event, start, end, outcome = 0) {
        const original = JSON.stringify(list);
        const interpreter = new Game_Interpreter();
        interpreter.setup(list, event);
        interpreter._index = start;
        interpreter._branch[0] = outcome;
        let steps = 0;
        const messages = [];
        while (interpreter._index <= end && interpreter.isRunning()) {
            assert.ok(steps++ < 1000);
            const code = interpreter.currentCommand().code;
            if ([0, 101, 102, 111, 121, 122, 123, 126, 128, 319, 402, 404, 411, 412, 601, 602, 604].includes(code)) {
                interpreter.executeCommand();
                messages.push(...$gameMessage._texts);
                if ($gameMessage.isChoice()) $gameMessage.onChoice(0);
                $gameMessage.clear();
            } else interpreter._index++;
        }
        assert.equal(JSON.stringify(list), original);
        return messages;
    }
    for (const source of location.source_variants) for (const active of [false, true]) {
        for (const parts of [4, 5]) for (const outcome of [0, 1]) for (const allied of [false, true]) {
            setup(source.map_id, active);
            $gameVariables.setValue(318, parts);
            $gameVariables.setValue(313, 42);
            $gameVariables.setValue(306, 10);
            $gameSwitches.setValue(186, allied);
            const list = $dataMap.events[source.event_id].pages[source.page].list;
            const messages = run(list, source.event_id, 2, list.length - 1, outcome);
            const reward = parts === 5 && outcome === 0;
            const checked = active && !allied && reward;
            assert.deepEqual(ap.checkedKeys(), checked ? [location.key] : []);
            assert.equal($gameParty.numItems($dataItems[294]), reward && !checked ? 1 : 0);
            assert.equal(messages.includes("Archipelago location checked."), checked);
            assert.equal($gameVariables.value(318), parts + (outcome === 0 ? 1 : 0));
            assert.equal($gameVariables.value(306), reward ? 9 : 10);
            assert.equal($gameSelfSwitches.value([source.map_id, source.event_id, "C"]), outcome === 0);
            combat++;
        }
    }
    for (const active of [false, true]) for (const state of [0, 1]) {
        setup(119, active);
        BattleManager.setup(332, true, false);
        $gameParty.onBattleStart();
        $gameVariables.setValue(313, state);
        $gameParty.gainItem($dataArmors[186], 1);
        $gameActors.actor(1).changeEquip(2, $dataArmors[186]);
        // Preserve both stages of the native hat transformation.
        run($dataCommonEvents[108].list, 0, 19, 30);
        assert.equal($gameParty.hasItem($dataArmors[187], true), true);
        run($dataTroops[332].pages[0].list, 0, 79, 159);
        assert.deepEqual(ap.checkedKeys(), active && state === 0 ? [location.key] : []);
        assert.equal($gameParty.numItems($dataItems[294]), !active && state === 0 ? 1 : 0);
        assert.equal($gameVariables.value(313), 1);
        if (state === 0) {
            assert.equal($gameSwitches.value(186), true);
            assert.equal($gameSwitches.value(535), true);
            assert.equal($gameParty.hasItem($dataArmors[188], true), true);
            run($dataTroops[332].pages[0].list, 0, 79, 159);
            assert.equal($gameParty.numItems($dataItems[294]), active ? 0 : 1);
        }
        agreement++;
    }
    for (const active of [false, true]) for (const page of [0, 1, 2]) {
        setup(96, active);
        $gameVariables.setValue(305, 70);
        $gameVariables.setValue(306, 10);
        const list = $dataMap.events[12].pages[page].list;
        run(list, 12, 4, 23);
        assert.deepEqual([...ap.checkedKeys()].sort(), active ?
            ["frederic_canvas_bag", "frederic_paint_palette", "frederic_painters_key"].sort() : []);
        assert.equal($gameParty.numItems($dataItems[341]), active ? 0 : 1);
        assert.equal($gameParty.numItems($dataItems[362]), 1);
        assert.equal($gameSwitches.value(188), !active);
        assert.equal($gameSwitches.value(233), true);
        assert.equal($gameVariables.value(305), 99);
        friendlyKills++;
    }
    return { combat, agreement, friendlyKills };
};
