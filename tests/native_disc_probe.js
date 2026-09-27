"use strict";

module.exports = function nativeDiscProbe() {
    const assert = require("assert").strict;
    const expectedValues = [-999, 13, 0, 0, 1, 2, 95, 146, 28, 16, 5, -1, -10];
    expectedValues.forEach((value, index) => assert.equal(getDiscVal(index), value));
    const cases = [
        { sockets: { 251: 4, 252: 5 }, flags: [100] },
        { sockets: { 251: 1, 252: 12 }, flags: [100] },
        { sockets: { 253: 4, 254: 8, 257: 1, 258: 5 }, flags: [251, 252] },
        { sockets: { 251: 1, 252: 12, 253: 4, 254: 8 }, flags: [100, 251] },
        { sockets: { 261: 1, 262: 10, 263: 9, 264: 5, 265: 8, 266: 12 }, flags: [112, 250] },
        { sockets: { 251: 1, 252: 12, 267: 6, 268: 8, 269: 9, 270: 5, 271: 10 }, flags: [100, 253] },
    ];
    let scenarios = 0;
    for (const test of cases) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $gamePlayer.clearTransferInfo();
        // Every occupied socket contains a distinct physical disc.
        assert.equal(new Set(Object.values(test.sockets)).size, Object.keys(test.sockets).length);
        for (const [id, value] of Object.entries(test.sockets)) $gameVariables.setValue(Number(id), value);
        const list = $dataCommonEvents[64].list;
        const original = JSON.stringify(list);
        const interpreter = new Game_Interpreter();
        interpreter.setup(list, 0);
        while (interpreter._index < 186) {
            if ([0, 108, 111, 121, 355, 411, 412].includes(interpreter.currentCommand().code)) {
                interpreter.executeCommand();
            } else interpreter._index++;
        }
        for (const flag of test.flags) assert.equal($gameSwitches.value(flag), true, `Door ${flag} did not open`);
        assert.equal(JSON.stringify(list), original);
        scenarios++;
    }
    return { scenarios, discValues: expectedValues.length };
};
