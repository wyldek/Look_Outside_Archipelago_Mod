"use strict";

module.exports = function nativeEndingWarningsProbe() {
    const assert = require("assert").strict, fs = require("fs"), ap = LookOutsideArchipelago;
    const sources = [
        [113, 4, 0, 5, ["Yes (no return).", "No. I need more time."]],
        [169, 2, 1, 53, ["Say the Word (ending).", "What is my reward?", "I won't say it."]],
        [169, 2, 1, 75, ["Say the Word (ending).", "No."]],
        [362, 3, 0, 6, ["Read (begin ending).", "No."]],
    ];
    let scenarios = 0;
    function setup(source, active) {
        DataManager.setupNewGame(); $gameMessage.clear();
        $gameSwitches.setValue(401, true); $gameVariables.setValue(213, 2);
        const [mid, eid, pg, index] = source;
        $dataMap = JSON.parse(fs.readFileSync(`data/Map${String(mid).padStart(3, "0")}.json`, "utf8"));
        DataManager.onLoad($dataMap); $gameMap.setup(mid);
        if (active) {
            ap.bindIdentityForDevelopment("ending-warnings", 0, 1); ap.activateForDevelopment();
        }
        const list = $dataMap.events[eid].pages[pg].list;
        const it = new Game_Interpreter(); it.setup(list, eid); it._index = index;
        return { it, list, params: list[index].parameters, before: JSON.stringify(list) };
    }
    for (const source of sources) for (const active of [false, true]) {
        for (let choice = 0; choice < source[4].length; choice++) {
            const {it, list, params, before} = setup(source, active);
            it.executeCommand();
            assert.deepEqual($gameMessage.choices(), active ? source[4] : params[0]);
            assert.equal($gameMessage.choiceCancelType(), params[1]);
            assert.equal($gameMessage.choiceDefaultType(), params[2]);
            $gameMessage.onChoice(choice); $gameMessage.clear();
            const indent = list[source[3]].indent;
            assert.equal(it._branch[indent], choice);
            const branch = list.findIndex((c, i) => i > source[3] && c.code === 402 &&
                c.indent === indent && c.parameters[0] === choice);
            it._index = branch; it.executeCommand();
            assert.equal(it._index, branch + 1, "The selected native branch must still execute");
            assert.equal(JSON.stringify(list), before);
            assert.deepEqual(ap.checkedKeys(), []);
            assert.equal(ap.goalCompleted, false);
            scenarios++;
        }
    }
    for (const source of sources) for (const guard of ["clone", "build", "unbound", "event", "params"]) {
        const {it, list, params, before} = setup(source, guard !== "unbound");
        const version = $dataSystem.versionId;
        if (guard === "clone") it._list = JSON.parse(JSON.stringify(list));
        if (guard === "build") $dataSystem.versionId++;
        if (guard === "unbound") ap.activateForDevelopment();
        if (guard === "event") it._eventId++;
        if (guard === "params") list[source[3]].parameters = [["Changed.", ...params[0].slice(1)], ...params.slice(1)];
        try {
            it.executeCommand();
            assert.deepEqual($gameMessage.choices(), list[source[3]].parameters[0]);
            scenarios++;
        } finally {
            $dataSystem.versionId = version; list[source[3]].parameters = params;
        }
        assert.equal(JSON.stringify(list), before);
    }
    return {scenarios, decisions: sources.length};
};
