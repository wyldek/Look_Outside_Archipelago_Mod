"use strict";

module.exports = function nativeFleshRoutesProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    DataManager.setupNewGame();
    $gamePlayer.clearTransferInfo();
    const ids = [267, 348, 367, 381,
        ...Array.from({ length: 15 }, (_, i) => 382 + i), 398,
        ...Array.from({ length: 23 }, (_, i) => 407 + i)];
    const maps = new Map(ids.map(id => [id, JSON.parse(fs.readFileSync(`data/Map${String(id).padStart(3, "0")}.json`, "utf8"))]));
    const cache = new Map();
    function component(mid, start) {
        const cacheKey = `${mid}:${start}`;
        if (cache.has(cacheKey)) return cache.get(cacheKey);
        $dataMap = maps.get(mid);
        DataManager.onLoad($dataMap);
        $gameMap.setup(mid);
        const reached = new Set([start.join(",")]);
        const queue = [start];
        for (let i = 0; i < queue.length; i++) {
            const [x, y] = queue[i];
            for (const direction of [2, 4, 6, 8]) {
                const nx = $gameMap.roundXWithDirection(x, direction);
                const ny = $gameMap.roundYWithDirection(y, direction);
                const key = `${nx},${ny}`;
                if (!reached.has(key) && $gameMap.isValid(nx, ny) &&
                    $gameMap.isPassable(x, y, direction) && $gameMap.isPassable(nx, ny, 10 - direction)) {
                    reached.add(key);
                    queue.push([nx, ny]);
                }
            }
        }
        // Map setup includes event tiles. Character enemies are intentionally
        // omitted from the geometry audit; combat capability is outside logic.
        for (const position of reached) cache.set(`${mid}:${position}`, reached);
        return reached;
    }
    function nearby(mid, reached, event) {
        const map = maps.get(mid);
        return [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => {
            let x = event.x + dx, y = event.y + dy;
            if ([2, 3].includes(map.scrollType)) x = (x + map.width) % map.width;
            if ([1, 3].includes(map.scrollType)) y = (y + map.height) % map.height;
            return reached.has(`${x},${y}`);
        });
    }
    const wanted = ["348:5", "367:1", "393:12", "415:6", "421:4", "424:8", "426:1", "429:1"];
    const cases = [
        [267, [12, 20], ["348:5", "367:1", "393:12", "415:6", "424:8", "429:1"]],
        [407, [12, 6], []],
        [419, [27, 26], ["421:4", "426:1"]],
        [383, [11, 10], ["421:4", "426:1"]],
        [423, [12, 17], ["348:5", "367:1", "393:12", "415:6", "424:8", "429:1"]],
        [408, [58, 13], []],
    ];
    for (const [first, position, expected] of cases) {
        const queue = [[first, position]], visited = new Set(), checks = new Set();
        for (let i = 0; i < queue.length; i++) {
            const [mid, start] = queue[i];
            const reached = component(mid, start);
            const signature = `${mid}:${[...reached].sort()[0]}`;
            if (visited.has(signature)) continue;
            visited.add(signature);
            for (const event of maps.get(mid).events.filter(Boolean)) {
                if (!nearby(mid, reached, event)) continue;
                const key = `${mid}:${event.id}`;
                if (wanted.includes(key)) checks.add(key);
                for (const page of event.pages) {
                    const c = page.conditions;
                    if ((c.switch1Valid && c.switch1Id === 7) || (c.switch2Valid && c.switch2Id === 7)) continue;
                    for (const command of page.list) {
                        const [mode, target, x, y] = command.parameters;
                        if (command.code === 201 && mode === 0 && maps.has(target)) queue.push([target, [x, y]]);
                    }
                }
            }
        }
        assert.deepEqual([...checks].sort(), expected, `Native flesh geometry from Map${first}`);
    }
    let doorCases = 0;
    // Unlike the upper-bound cases above, respect each one-way door and learn
    // its unlock only after reaching the actual far-side event. This prevents
    // the normal Iris entrances from falsely reaching Sybil's Oracle area.
    const gates = new Map([["383:1", 1112], ["383:2", 1108], ["385:1", 1113],
        ["385:13", 1114], ["394:5", 1115], ["415:1", 1111], ["398:1", 1109]]);
    const openers = new Map([["417:1", 1112], ["418:1", 1108], ["420:1", 1113],
        ["427:3", 1114], ["412:5", 1115], ["414:2", 1111], ["396:2", 1109]]);
    const gatedCases = [
        [267, [12, 20], []],
        [414, [15, 44], ["393:12", "415:6", "424:8", "429:1"]],
        [423, [12, 17], ["393:12", "415:6", "424:8", "429:1"]],
        [419, [27, 26], ["421:4", "426:1"]],
        [383, [11, 10], ["421:4", "426:1"]],
    ];
    for (const [first, position, expected] of gatedCases) {
        const unlocked = new Set();
        let checks;
        while (true) {
            const before = unlocked.size;
            const queue = [[first, position]], visited = new Set();
            checks = new Set();
            for (let i = 0; i < queue.length; i++) {
                const [mid, start] = queue[i], reached = component(mid, start);
                const signature = `${mid}:${[...reached].sort()[0]}`;
                if (visited.has(signature)) continue;
                visited.add(signature);
                for (const event of maps.get(mid).events.filter(Boolean)) {
                    if (!nearby(mid, reached, event)) continue;
                    const key = `${mid}:${event.id}`;
                    if (wanted.includes(key)) checks.add(key);
                    if (openers.has(key)) unlocked.add(openers.get(key));
                    if (gates.has(key) && !unlocked.has(gates.get(key))) continue;
                    for (const page of event.pages) {
                        const c = page.conditions;
                        if ((c.switch1Valid && c.switch1Id === 7) || (c.switch2Valid && c.switch2Id === 7)) continue;
                        for (const command of page.list) {
                            const [mode, target, x, y] = command.parameters;
                            if (command.code === 201 && mode === 0 && maps.has(target)) queue.push([target, [x, y]]);
                        }
                    }
                }
            }
            if (unlocked.size === before) break;
        }
        assert.deepEqual([...checks].sort(), expected, `Flesh one-way route from Map${first}`);
    }
    // Geometry alone overstates access: these doors open only from the far
    // side. Exercise the real native branch lists in both switch states.
    for (const [mid, eid, flag] of [[383, 1, 1112], [383, 2, 1108], [385, 1, 1113],
        [385, 13, 1114], [394, 5, 1115], [415, 1, 1111], [398, 1, 1109]]) {
        for (const unlocked of [false, true]) {
            $dataMap = maps.get(mid);
            DataManager.onLoad($dataMap);
            $gameMap.setup(mid);
            $gameMessage.clear();
            $gameSwitches.setValue(flag, unlocked);
            $gamePlayer.clearTransferInfo();
            const list = $dataMap.events[eid].pages[0].list;
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, eid);
            while (interpreter._index < list.length) {
                if ([0, 111, 121, 201, 411, 412].includes(interpreter.currentCommand().code)) {
                    interpreter.executeCommand();
                } else interpreter._index++;
            }
            assert.equal($gamePlayer.isTransferring(), unlocked, `One-way door ${mid}:${eid} with ${flag}=${unlocked}`);
            doorCases++;
        }
    }
    assert.equal(maps.get(384).scrollType, 3, "The central flesh hall wraps in both directions");
    assert.equal($gameParty.numItems($dataItems[395]), 0, "Probe must not grant Iris Keys");
    return { geometryCases: cases.length, gatedRouteCases: gatedCases.length, doorCases, mapCount: maps.size,
        scope: "Native tile geometry and seven one-way doors; not a full movement playthrough" };
};
