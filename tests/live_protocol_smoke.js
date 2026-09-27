"use strict";

// Run only against a project-local AP server generated from this dev APWorld.
const assert = require("node:assert/strict");
process.env.LOA_DEV_MODE = "1";
const registry = require("../apworld/lookoutside/vertical_slice.json");

const inventory = new Map();
const switches = new Map();
let currentEvent = null;
let day = 1;
const variables = new Map();

class GameInterpreter {
    constructor(mapId, eventId, index, code, parameters) {
        this._mapId = mapId;
        this._eventId = eventId;
        this._index = index;
        this._list = Array.from({ length: index + 1 }, () => ({ code: 0 }));
        this._list[index] = { code, parameters };
    }
    command126() { throw new Error("Vanilla item grant was not intercepted"); }
    command127() { throw new Error("Vanilla weapon grant was not intercepted"); }
    command128() { throw new Error("Vanilla armor grant was not intercepted"); }
    command121(params) {
        if (params[0] === 115) throw new Error("Vanilla elevator grant was not intercepted");
        switches.set(params[0], params[2] === 0);
        return true;
    }
    command101() { return true; }
    command117() { return true; }
    command122() { return true; }
    command123() { return true; }
    command301(params) { BattleManager.setup(params[1], params[2], params[3]); return true; }
}
class GameMap {
    event(id) { return id === currentEvent?._eventId ? currentEvent : null; }
    setup() { return true; }
    requestRefresh() { return true; }
}
class GameEvent { meetsConditions() { return true; } }
globalThis.Game_Interpreter = GameInterpreter;
globalThis.Game_Map = GameMap;
globalThis.Game_Event = GameEvent;
globalThis.$gameMap = new GameMap();
globalThis.$dataSystem = { advanced: { gameId: 51778622 }, versionId: 74642914 };
globalThis.$gameVariables = {
    value(id) { return id === 15 ? day : variables.get(id) || 0; },
    setValue(id, value) { variables.set(id, value); },
};
globalThis.$gameSwitches = {
    value(id) { return switches.get(id) || false; },
    setValue(id, value) { switches.set(id, value); },
};
globalThis.$dataItems = {};
globalThis.$dataWeapons = {};
globalThis.$dataArmors = {};
for (const item of registry.items) {
    if (item.kind === "switch") continue;
    const database = item.kind === "weapon" ? $dataWeapons
        : item.kind === "armor" ? $dataArmors : $dataItems;
    database[item.database_id] = { name: item.name };
}
globalThis.$gameParty = {
    numItems(item) { return inventory.get(item) || 0; },
    maxItems() { return 99; },
    gainItem(item, amount) { inventory.set(item, this.numItems(item) + amount); },
};
globalThis.DataManager = {
    setupNewGame() {},
    makeSaveContents() { return {}; },
    extractSaveContents() {},
};

const battleHarness = require("./battle_drop_harness")();
require("../game_plugin/LookOutsideArchipelago.js");
const client = globalThis.LookOutsideArchipelago;

function waitFor(predicate, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
        const started = Date.now();
        const timer = setInterval(() => {
            if (predicate()) {
                clearInterval(timer);
                resolve();
            } else if (Date.now() - started > timeoutMs) {
                clearInterval(timer);
                reject(new Error(`Timed out; connection=${client.connectionState}; ${client.connectionError || ""}`));
            }
        }, 25);
    });
}

function check(location) {
    for (const condition of location.required_variables || []) variables.set(condition.id, condition.values?.[0] ?? condition.value);
    for (const condition of location.required_switches || []) switches.set(condition.id, condition.value);
    currentEvent = { _eventId: location.event_id, _pageIndex: location.page };
    if (location.troop_id) {
        const params = [location.reward_database_id, 0, 0, 1,
            ...(location.reward_kind === "item" ? [] : [false])];
        const interpreter = new GameInterpreter(location.map_id, 0,
            location.command_index, location.command_code, params);
        globalThis.$dataTroops ||= {};
        $dataTroops[location.troop_id] = { pages: [] };
        $dataTroops[location.troop_id].pages[location.page] = { list: interpreter._list };
        BattleManager.setup(location.troop_id);
        $gameParty.inBattle = () => true;
        try {
            interpreter["command" + location.command_code](params);
        } finally {
            $gameParty.inBattle = () => false;
        }
        return;
    }
    if (location.battle_drop) {
        const drop = location.battle_drop;
        const drops = Array.from({ length: drop.drop_index + 1 }, () =>
            ({ kind: 0, dataId: 1, denominator: 1 }));
        drops[drop.drop_index] = { kind: drop.kind, dataId: location.reward_database_id, denominator: 1 };
        battleHarness.configure(location.battle_parameters[1], [{ id: drop.enemy_id,
            drops }]);
        const interpreter = new GameInterpreter(location.map_id, location.event_id,
            location.command_index, 301, location.battle_parameters);
        interpreter.command301(location.battle_parameters);
        BattleManager.processVictory();
        assert.deepEqual(battleHarness.trace.granted, []);
        return;
    }
    const parameters = location.reward_kind === "switch"
        ? [location.reward_database_id, location.reward_database_id, 0]
        : [location.reward_database_id, 0, 0, 1,
            ...(location.reward_kind === "item" ? [] : [false])];
    const interpreter = new GameInterpreter(location.map_id, location.event_id,
        location.command_index, location.command_code, parameters);
    if (location.common_event_id) {
        globalThis.$dataCommonEvents ||= [];
        $dataCommonEvents[location.common_event_id] = { list: interpreter._list };
    }
    interpreter[`command${location.command_code}`](parameters);
}

async function main() {
    const url = process.argv[2] || "ws://127.0.0.1:38282";
    const outgoing = [];
    class RecordingWebSocket extends WebSocket {
        send(payload) { outgoing.push(...JSON.parse(payload)); super.send(payload); }
    }
    const options = {
        url,
        name: "LookOutside_Test",
        uuid: "lookoutside-live-smoke",
        autoReconnect: false,
        WebSocketClass: RecordingWebSocket,
    };
    client.connectForDevelopment(options);
    await waitFor(() => client.connectionState === "connected" || client.connectionState === "error");
    assert.equal(client.connectionState, "connected", client.connectionError);
    if (process.argv.includes("--release-only")) {
        assert.equal(client.checkedKeys().length, 0, "use a fresh server session");
        assert.equal(client.nextItemIndex, 0);
        day = 15;
        variables.set(899, 2); // Roach quest waiting for a new day.
        variables.set(900, 7); // Leigh quest unfinished.
        if (process.argv.includes("--offline-ending")) {
            const beforeEnding = DataManager.makeSaveContents();
            DataManager.extractSaveContents(beforeEnding); // Disconnect while retaining seed binding.
            assert.equal(client.connectionState, "disconnected");
        }
        $gameMap.setup(172);
        assert.equal(client.goalCompleted, false);
        $gameMap.setup(168);
        assert.equal(client.goalCompleted, true);
        if (process.argv.includes("--offline-ending")) {
            const endingSave = JSON.parse(JSON.stringify(DataManager.makeSaveContents()));
            DataManager.extractSaveContents(endingSave);
            assert.equal(client.goalCompleted, true);
            client.connectForDevelopment(options);
        }
        const expectedItems = registry.items.reduce((sum, item) => sum + item.quantity, 0);
        if (process.argv.includes("--release-disabled")) {
            await waitFor(() => /host must allow/.test(client.goalReleaseSummary()));
            await new Promise(resolve => setTimeout(resolve, 150));
            assert.equal(client.checkedKeys().length, 0);
            assert.equal(client.nextItemIndex, 0);
        } else {
            await waitFor(() => client.checkedKeys().length === registry.locations.length &&
                client.nextItemIndex === expectedItems);
            assert.match(client.goalReleaseSummary(), /acknowledged all checks/);
        }
        assert.equal(outgoing.some(packet => packet.cmd === "LocationChecks"), false,
            "the server must release all locations without fabricated pickup packets");
        assert.equal(outgoing.some(packet => packet.cmd === "Say" && packet.text === "!collect"), false);
        assert.deepEqual([variables.get(899), variables.get(900)], [2, 7]);
        assert.equal(day, 15);
        console.log(JSON.stringify({ mode: "ending-release", completionDay: day,
            checksBeforeEnding: 0, checksAfterEnding: client.checkedKeys().length,
            receivedItems: client.nextItemIndex, goalCompleted: client.goalCompleted,
            offlineEnding: process.argv.includes("--offline-ending"),
            nativeQuestStagesUnchanged: true, status: client.goalReleaseSummary() }));
        DataManager.setupNewGame();
        return;
    }
    for (const location of registry.locations) {
        if (!location.quest_family) check(location);
    }
    for (const family of registry.quest_families || []) {
        const first = registry.locations.find(location => location.key === family.location_keys[0]);
        // Rescue milestones may resolve only one member. Exercise the shared
        // closing outcome here; native probes separately cover each rescue.
        const terminal = family.terminals.find(entry => !entry.location_keys) || family.terminals[0];
        // Boss salvage must report even when Audrey's entire reward branch was skipped.
        if (!first.boss_salvage && !terminal.common_event_id) check(first);
        currentEvent = { _eventId: terminal.event_id, _pageIndex: terminal.page };
        const interpreter = new GameInterpreter(terminal.map_id, terminal.event_id,
            terminal.command_index, terminal.command_code, terminal.parameters);
        for (const condition of terminal.required_variables || []) variables.set(condition.id, condition.values?.[0] ?? condition.value);
        if (terminal.common_event_id) $dataCommonEvents[terminal.common_event_id] = { list: interpreter._list };
        if (terminal.troop_id) {
            $dataTroops[terminal.troop_id] = { pages: [] };
            $dataTroops[terminal.troop_id].pages[terminal.page] = { list: interpreter._list };
            BattleManager.setup(terminal.troop_id);
            $gameParty.inBattle = () => true;
        }
        try {
            interpreter[`command${terminal.command_code}`](terminal.parameters);
        } finally {
            $gameParty.inBattle = () => false;
        }
    }
    const expectedItems = registry.items.reduce((sum, item) => sum + item.quantity, 0);
    await waitFor(() => client.nextItemIndex === expectedItems || client.connectionState === "error");
    assert.equal(client.nextItemIndex, expectedItems, client.connectionError);
    client.deliverPendingForDevelopment();
    // Power Restored may arrive before the native blackout; receipt alone must
    // not mark the fuse-box/world state restored. Exercise the actual hook sites.
    assert.equal(client.powerState().received, true);
    assert.equal($gameSwitches.value(987), false);
    $gameSwitches.setValue(21, true);
    const outage = new GameInterpreter(3, 0, 26, 121, [21, 21, 1]);
    outage._list[34] = { code: 122, parameters: [940, 940, 0, 0, 0] };
    $dataCommonEvents[16] = { list: outage._list };
    outage.command121([21, 21, 1]);
    assert.equal($gameSwitches.value(21), false);
    outage._index = 34;
    outage.command122([940, 940, 0, 0, 0]);
    assert.equal($gameSwitches.value(21), true);
    assert.ok(client.powerState().notices.includes("outage-restored"));
    for (const item of registry.items) {
        if (item.kind === "switch") {
            assert.equal($gameSwitches.value(item.database_id), true);
        } else {
            const database = item.kind === "weapon" ? $dataWeapons
                : item.kind === "armor" ? $dataArmors : $dataItems;
            assert.equal($gameParty.numItems(database[item.database_id]),
                item.quantity * (item.delivery_amount || 1), `native quantity: ${item.name}`);
        }
        for (const id of item.delivery_switches || []) assert.equal($gameSwitches.value(id), true);
    }
    assert.equal(client.pendingItems().length, 0);
    day = 7;
    $gameMap.setup(168);
    assert.equal(client.goalCompleted, true);
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(client.checkedKeys().length, registry.locations.length);
    console.log(JSON.stringify({ connected: true, checks: client.checkedKeys().length,
        receivedItems: client.nextItemIndex, delivered: expectedItems,
        nativeSimpleKeys: $gameParty.numItems($dataItems[320]),
        nativeBlackKeys: $gameParty.numItems($dataItems[656]),
        reconciledFamilies: (registry.quest_families || []).length,
        goalCompleted: true, completionDay: day }));
    DataManager.setupNewGame();
}

main().catch(error => {
    console.error(error);
    DataManager.setupNewGame();
    process.exitCode = 1;
});
