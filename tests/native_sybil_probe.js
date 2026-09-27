"use strict";

module.exports = function nativeSybilProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    const keys = ["map348_event005", "map367_event001_quest_reward"];
    let scenarios = 0;
    function setup(active, mid, troop = null) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $gamePlayer.clearTransferInfo();
        $dataMap = JSON.parse(fs.readFileSync(`data/Map${String(mid).padStart(3, "0")}.json`, "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(mid);
        if (active) {
            ap.bindIdentityForDevelopment("sybil-probe", 0, 1);
            ap.activateForDevelopment();
        }
        if (troop) {
            BattleManager.setup(troop, true, true);
            $gameParty.onBattleStart();
        }
    }
    function run(list, eid, start, end, choose = () => 0, result = 0) {
        const original = JSON.stringify(list);
        const interpreter = new Game_Interpreter();
        interpreter.setup(list, eid);
        interpreter._index = start;
        interpreter._branch[list[start].indent] = result;
        let steps = 0;
        while (interpreter.currentCommand() && interpreter._index <= end) {
            assert.ok(++steps < 1000, "Sybil dialogue did not finish");
            const c = interpreter.currentCommand();
            if (c.code === 117) {
                const common = $dataCommonEvents[c.parameters[0]].list;
                run(common, eid, 0, common.length - 1, choose);
                interpreter._index++;
            } else if (c.code === 119 && c.parameters[0] === "leave") break;
            else if ([0, 101, 102, 111, 112, 113, 118, 119, 121, 122, 123, 126,
                402, 404, 411, 412, 413, 601, 602, 604].includes(c.code)) {
                interpreter.executeCommand();
                if ($gameMessage.isChoice()) $gameMessage.onChoice(choose($gameMessage.choices()));
                $gameMessage.clear();
            } else interpreter._index++;
        }
        assert.equal(JSON.stringify(list), original);
    }
    function expect(expected) { assert.deepEqual([...ap.checkedKeys()].sort(), expected); }
    for (const active of [false, true]) for (const response of [0, 1, 2]) {
        setup(active, 364, 16);
        $gameParty.gainItem($dataItems[387], 1);
        $gameVariables.setValue(6, 387);
        run($dataTroops[16].pages[0].list, 0, 213, 216,
            choices => choices[0] === "You did." ? response : 0);
        expect(active ? keys : []);
        assert.equal($gameParty.numItems($dataItems[387]), 0);
        assert.equal($gameSwitches.value(970), true);
        assert.equal($gameSwitches.value(969), false, "Peaceful resolution does not transform her apartment");
        assert.equal($gameSwitches.value(975), false, "Peaceful resolution does not fake an Oracle kill");
        assert.equal($gameParty.numItems($dataItems[388]), 0);
        assert.equal($gameParty.numItems($dataItems[395]), 0);
        $gameParty.onBattleEnd();
        DataManager.extractSaveContents(JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents())));
        expect(active ? keys : []);
        scenarios++;
    }
    for (const active of [false, true]) for (const result of [0, 1]) {
        setup(active, 367);
        run($dataMap.events[1].pages[1].list, 1, 2, 21, () => 0, result);
        expect(active && result === 0 ? keys : []);
        assert.equal($gameSwitches.value(975), result === 0);
        assert.equal($gameParty.numItems($dataItems[388]), !active && result === 0 ? 1 : 0);
        scenarios++;
    }
    for (const guard of ["wrong-item", "clone", "outside-battle", "wrong-troop", "wrong-build"]) {
        setup(true, 364, guard === "outside-battle" ? null : guard === "wrong-troop" ? 17 : 16);
        $gameVariables.setValue(6, guard === "wrong-item" ? 386 : 387);
        const version = $dataSystem.versionId;
        if (guard === "wrong-build") $dataSystem.versionId++;
        try {
            const list = $dataTroops[16].pages[0].list;
            run(guard === "clone" ? JSON.parse(JSON.stringify(list)) : list, 0, 213, 216);
            expect([]);
        } finally { $dataSystem.versionId = version; }
        scenarios++;
    }
    // Checking the closet alone does not prematurely resolve the Oracle fight.
    setup(true, 348);
    run($dataMap.events[5].pages[0].list, 5, 2, 11);
    expect(["map348_event005"]);
    scenarios++;
    return { sybilScenarios: scenarios, sharedChecks: keys };
};
