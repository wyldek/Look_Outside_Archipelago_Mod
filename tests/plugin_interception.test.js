"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

process.env.LOA_DEV_MODE = "1";
const inventory = [];
const messages = [];
let goldAmount = 0;
class FakeInterpreter {
    executeCommand() {
        const c = this._list[this._index];
        const result = this[`command${c.code}`](c.parameters);
        if (result) this._index++;
        return result;
    }
    constructor(mapId, eventId, pageIndex, commandIndex, code, params) {
        this._mapId = mapId;
        this._eventId = eventId;
        this._index = commandIndex;
        this._list = Array.from({ length: commandIndex + 1 }, () => ({ code: 0 }));
        this._list[commandIndex] = { code, parameters: params };
        this.pageIndex = pageIndex;
    }
    command127(params) { inventory.push(["weapon", params[0]]); return true; }
    command126(params) { inventory.push(["item", params[0]]); return true; }
    command128(params) { inventory.push(["armor", params[0]]); return true; }
    command125(params) { goldAmount += params[0] === 0 ? params[2] : -params[2]; return true; }
    command121(params) { switchValues.set(params[0], params[2] === 0); return true; }
    command123() { return true; }
    command301(params) { BattleManager.setup(params[1], params[2], params[3]); return true; }
    command122(params) {
        if (params[0] === 15 && params[1] === 15 && params[2] === 1) currentDay += params[4];
        if (params[0] !== 15 && params[0] === params[1] && params[2] === 0 && params[3] === 0) {
            variableValues.set(params[0], params[4]);
        }
        return true;
    }
    command117(params) { commonEventCalls.push(params[0]); return true; }
    command101() {
        while (this._list[this._index + 1]?.code === 401) {
            this._index++;
            messages.push(this._list[this._index].parameters[0]);
        }
        return true;
    }
}
globalThis.Game_Interpreter = FakeInterpreter;
globalThis.$gameMessage = { add(message) { messages.push(message); } };
let currentEvent = null;
class FakeMap {
    event(id) { return id === currentEvent?._eventId ? currentEvent : null; }
    setup(mapId) { this.mapId = mapId; }
    requestRefresh() { this.refreshRequested = true; }
    isEventRunning() { return false; }
}
class FakeEvent {
    constructor(mapId, eventId, pages, pageIndex = 0) {
        this._mapId = mapId;
        this._eventId = eventId;
        this._pageIndex = pageIndex;
        this.pages = pages;
    }
    event() { return { pages: this.pages }; }
    meetsConditions(page) {
        return !page.conditions.switch1Valid || $gameSwitches.value(page.conditions.switch1Id);
    }
}
globalThis.Game_Event = FakeEvent;
globalThis.Game_Map = FakeMap;
globalThis.$gameMap = new FakeMap();
class FakeMenuWindow {
    constructor() { this.commands = []; this.handlers = {}; }
    addOriginalCommands() { /* vanilla menu */ }
    addCommand(name, symbol, enabled) { this.commands.push({ name, symbol, enabled }); }
    setHandler(symbol, handler) { this.handlers[symbol] = handler; }
    activate() { this.activated = true; }
}
class FakeSceneMenu {
    createCommandWindow() { this._commandWindow = new FakeMenuWindow(); }
    popScene() { this.popped = true; }
}
globalThis.Window_MenuCommand = FakeMenuWindow;
globalThis.Scene_Menu = FakeSceneMenu;
let currentDay = 1;
const variableValues = new Map();
let cheatMode = false;
const commonEventCalls = [];
const reservedCommonEvents = [];
const switchValues = new Map();
globalThis.$gameVariables = {
    value(id) { return id === 15 ? currentDay : (variableValues.get(id) || 0); },
    setValue(id, value) {
        if (id === 15) currentDay = value;
        else variableValues.set(id, value);
    },
};
globalThis.$gameTemp = {
    isCommonEventReserved() { return reservedCommonEvents.length > 0; },
    reserveCommonEvent(id) { reservedCommonEvents.push(id); },
};
globalThis.$dataCommonEvents = [];
globalThis.$dataCommonEvents[4] = { list: [] };
globalThis.$dataCommonEvents[6] = { list: [{ code: 0, parameters: [] }] };
globalThis.$gameSwitches = {
    value(id) { return id === 7 ? cheatMode : (switchValues.get(id) || false); },
    setValue(id, value) { switchValues.set(id, value); },
};
globalThis.$dataSystem = { advanced: { gameId: 51778622 }, versionId: 74642914 };
let nativeLoads = 0;
globalThis.DataManager = {
    setupNewGame() { return "new-game"; },
    makeSaveContents() { return { system: "vanilla-system" }; },
    extractSaveContents(contents) { nativeLoads++; assert.equal(contents.system, "vanilla-system"); },
};
const battleHarness = require("./battle_drop_harness")();
require("../game_plugin/LookOutsideArchipelago.js");
const plugin = globalThis.LookOutsideArchipelago;
const sliceSlotData = {
    development_slice: true,
    difficulty: "normal",
    registry_version: require("../apworld/lookoutside/vertical_slice.json").registry_version,
    audited_game_id: 51778622,
    audited_version_id: 74642914,
};

test("development protocol IDs agree with the shared vertical-slice registry", () => {
    const registry = require("../apworld/lookoutside/vertical_slice.json");
    const data = plugin.developmentData();
    assert.deepEqual(data.sources, registry.locations.flatMap(location =>
        [location, ...(location.source_variants || [])].map(source => ({
            key: location.key,
            mapId: source.map_id,
            ...(source.troop_id !== undefined ? { troopId: source.troop_id } : {}),
            ...(source.common_event_id !== undefined ? { commonEventId: source.common_event_id } : {}),
            eventId: source.event_id,
            pageIndex: source.page,
            commandIndex: source.command_index,
            commandCode: source.command_code,
            databaseId: location.reward_database_id,
            apId: location.ap_id,
        }))));
    assert.deepEqual(data.locationIds,
        Object.fromEntries(registry.locations.map(location => [location.key, location.ap_id])));
    assert.deepEqual(data.itemDefinitions,
        Object.fromEntries(registry.items.map(item => [item.ap_id, {
            kind: item.kind,
            id: item.database_id,
            name: item.name,
            ...(item.delivery_amount ? { amount: item.delivery_amount } : {}),
            ...(item.delivery_switches ? { deliverySwitches: item.delivery_switches } : {}),
        }])));
});

test("inactive plugin leaves vanilla grants alone", () => {
    DataManager.setupNewGame();
    inventory.length = 0;
    assert.equal(DataManager.makeSaveContents().lookOutsideArchipelago, undefined);
    const source = new FakeInterpreter(23, 41, 0, 7, 127, [15, 0, 0, 1, false]);
    currentEvent = { _eventId: 41, _pageIndex: 0 };
    assert.equal(source.command127([15, 0, 0, 1, false]), true);
    assert.deepEqual(inventory, [["weapon", 15]]);
});

test("first binding rejects consumed rewards and old vanilla saves before opening a socket", () => {
    DataManager.setupNewGame();
    const pristine = JSON.parse(JSON.stringify(DataManager.makeSaveContents()));
    const bat = new FakeInterpreter(23, 41, 0, 7, 127, [15, 0, 0, 1, false]);
    currentEvent = { _eventId: 41, _pageIndex: 0 };
    bat.command127([15, 0, 0, 1, false]);
    const progressed = JSON.parse(JSON.stringify(DataManager.makeSaveContents()));
    let sockets = 0;
    for (const contents of [progressed, {system: "vanilla-system"}]) {
        DataManager.extractSaveContents(contents);
        assert.throws(() => plugin.bindIdentityForDevelopment("late", 0, 1), /not eligible/);
        assert.throws(() => plugin.connectForDevelopment({WebSocketClass: class { constructor() { sockets++; } }}), /not eligible/);
        assert.equal(plugin.identity(), null);
    }
    assert.equal(sockets, 0);
    DataManager.extractSaveContents(pristine);
    plugin.bindIdentityForDevelopment("fresh", 0, 1);
    assert.equal(plugin.identity().seedName, "fresh");
    DataManager.setupNewGame();
});

test("compatibility and queue corruption fail before loading native state", () => {
    DataManager.setupNewGame();
    plugin.bindIdentityForDevelopment("compatible", 0, 1);
    const good = JSON.parse(JSON.stringify(DataManager.makeSaveContents()));
    for (const mutation of [
        s => s.compatibility.registryVersion++, s => s.compatibility.gameId++,
        s => s.compatibility.versionId++, s => delete s.compatibility,
        s => { s.nextItemIndex = 1; s.pendingItems = [{index: 0, item: {item: 999999}}]; },
        s => { s.nextItemIndex = 1; s.pendingItems = [{index: 1, item: {item: 540100015}}]; },
        s => { s.nextItemIndex = 1; s.pendingItems = [0, 0].map(index => ({index, item: {item: 540100015}})); },
        s => s.checkedKeys.push("unknown-source"),
    ]) {
        const bad = structuredClone(good); mutation(bad.lookOutsideArchipelago);
        const before = nativeLoads;
        assert.throws(() => DataManager.extractSaveContents(bad), /save .*differs|Unsupported/);
        assert.equal(nativeLoads, before);
        assert.equal(plugin.active, false);
    }
    for (const field of ["versionId", "gameId"]) {
        const target = field === "gameId" ? $dataSystem.advanced : $dataSystem;
        target[field]++;
        try { assert.throws(() => DataManager.extractSaveContents(good), /audited build/); }
        finally { target[field]--; }
    }
    DataManager.extractSaveContents(good);
    assert.equal(plugin.active, true);
    assert.throws(() => plugin.queueReceivedItemsForDevelopment(0, [{item: 999999}]), /Unknown/);
    assert.equal(plugin.nextItemIndex, 0);
    DataManager.setupNewGame();
});

test("native quest resolutions and guaranteed drops make an unbound save ineligible", () => {
    const registry = require("../apworld/lookoutside/vertical_slice.json");
    DataManager.setupNewGame();
    const terminal = registry.quest_families.flatMap(f => f.terminals).find(t =>
        !t.common_event_id && !t.troop_id && !t.required_variables && t.command_code === 121);
    currentEvent = { _eventId: terminal.event_id, _pageIndex: terminal.page };
    new FakeInterpreter(terminal.map_id, terminal.event_id, terminal.page, terminal.command_index,
        terminal.command_code, terminal.parameters).executeCommand();
    assert.throws(() => plugin.bindIdentityForDevelopment("late-quest", 0, 1), /not eligible/);
    assert.deepEqual(plugin.checkedKeys(), []);
    DataManager.setupNewGame();
    const location = registry.locations.find(l => l.battle_drop);
    const drop = location.battle_drop;
    const drops = Array.from({length: drop.drop_index + 1}, () => ({kind: 0, dataId: 1, denominator: 1}));
    drops[drop.drop_index] = {kind: drop.kind, dataId: location.reward_database_id, denominator: 1};
    battleHarness.configure(location.battle_parameters[1], [{id: drop.enemy_id, drops}]);
    currentEvent = { _eventId: location.event_id, _pageIndex: location.page };
    new FakeInterpreter(location.map_id, location.event_id, location.page,
        location.command_index, 301, location.battle_parameters).executeCommand();
    BattleManager.processVictory();
    assert.equal(battleHarness.trace.granted.length, 1);
    assert.throws(() => plugin.bindIdentityForDevelopment("late-drop", 0, 1), /not eligible/);
    DataManager.setupNewGame();
});

test("active source check suppresses only the matching reward", () => {
    inventory.length = 0;
    const checks = [];
    plugin.activateForDevelopment(key => checks.push(key));
    const bat = new FakeInterpreter(23, 41, 0, 7, 127, [15, 0, 0, 1, false]);
    currentEvent = { _eventId: 41, _pageIndex: 0 };
    assert.equal(bat.command127([15, 0, 0, 1, false]), true);
    assert.equal(bat.command127([15, 0, 0, 1, false]), true);
    assert.deepEqual(checks, ["map023_event041_baseball_bat"]);
    assert.deepEqual(inventory, []);

    const wrongPage = new FakeInterpreter(23, 41, 1, 7, 127, [15, 0, 0, 1, false]);
    currentEvent = { _eventId: 41, _pageIndex: 1 };
    wrongPage.command127([15, 0, 0, 1, false]);
    assert.deepEqual(inventory, [["weapon", 15]]);

    const hoodie = new FakeInterpreter(31, 30, 0, 4, 128, [7, 0, 0, 1, false]);
    currentEvent = { _eventId: 30, _pageIndex: 0 };
    hoodie.command128([7, 0, 0, 1, false]);
    assert.deepEqual(checks, ["map023_event041_baseball_bat", "map031_event030_hoodie"]);
    assert.deepEqual(inventory, [["weapon", 15]]);
    plugin.deactivate();
});

test("AP pickup text no longer claims the vanilla item was found", () => {
    messages.length = 0;
    function showText(mapId, eventId, messageIndex, text) {
        const interpreter = new FakeInterpreter(mapId, eventId, 0,
            messageIndex - 1, 101, []);
        interpreter._list[messageIndex] = { code: 401, parameters: [text] };
        currentEvent = { _eventId: eventId, _pageIndex: 0 };
        interpreter.command101([]);
        assert.equal(interpreter._list[messageIndex].parameters[0], text);
    }
    const vanillaText = "Find a \\C[3]{Baseball Bat}\\C[0].";
    showText(23, 41, 6, vanillaText);
    assert.deepEqual(messages, [vanillaText]);

    plugin.activateForDevelopment();
    showText(23, 41, 6, vanillaText);
    const hoodieText = "Find \\C[03]{Hoodie}\\C[0].";
    showText(31, 30, 7, hoodieText);
    const keyText = "You find a \\C[03]{Padlock Key}\\C[0].";
    showText(24, 7, 8, keyText);
    assert.deepEqual(messages.slice(1), [
        "This pickup is an Archipelago location.",
        "Archipelago location checked.",
        "Archipelago location checked.",
    ]);
    plugin.deactivate();
});

test("checks survive save/load and are not reported twice", () => {
    const saved = DataManager.makeSaveContents();
    assert.deepEqual(saved.lookOutsideArchipelago, {
        schema: 7,
        compatibility: { registryVersion: sliceSlotData.registry_version, gameId: 51778622, versionId: 74642914 },
        identity: null,
        checkedKeys: ["map023_event041_baseball_bat", "map031_event030_hoodie"],
        nextItemIndex: 0,
        pendingItems: [],
        goalCompleted: false,
        elevatorFreakDefeated: false,
        pendingDayRollover: false,
        dayHold: false,
        powerState: { received: false, outageSeen: false, outageInProgress: false,
            puzzleRefreshPending: false, notices: [] },
    });
    assert.equal(saved.system, "vanilla-system");

    DataManager.setupNewGame();
    assert.deepEqual(plugin.checkedKeys(), []);
    DataManager.extractSaveContents(saved);
    assert.equal(plugin.active, false);
    assert.deepEqual(plugin.checkedKeys(), saved.lookOutsideArchipelago.checkedKeys);

    const callbacks = [];
    plugin.activateForDevelopment(key => callbacks.push(key));
    const bat = new FakeInterpreter(23, 41, 0, 7, 127, [15, 0, 0, 1, false]);
    currentEvent = { _eventId: 41, _pageIndex: 0 };
    bat.command127([15, 0, 0, 1, false]);
    assert.deepEqual(callbacks, []);
    plugin.deactivate();
});

test("unsupported saved state blocks native loading, gameplay and saving", () => {
    const unknownState = { schema: 999, futureField: [1, 2, 3] };
    const before = nativeLoads;
    assert.throws(() => DataManager.extractSaveContents({ system: "vanilla-system", lookOutsideArchipelago: unknownState }), /Unsupported/);
    assert.equal(nativeLoads, before);
    assert.equal(plugin.active, false);
    assert.match(plugin.saveError, /Unsupported/);
    assert.throws(() => plugin.activateForDevelopment(), /Unsupported/);
    assert.throws(() => DataManager.makeSaveContents(), /Unsupported/);
    const it = new FakeInterpreter(23, 41, 0, 7, 127, [15, 0, 0, 1, false]);
    assert.equal(it.executeCommand(), false);
    assert.equal(it._index, 7);
    DataManager.setupNewGame();
    assert.equal(plugin.saveError, null);
});

test("a different game build cannot activate interception", () => {
    $dataSystem.versionId++;
    assert.throws(() => plugin.activateForDevelopment(), /audited build/);
    $dataSystem.versionId--;
});

test("legacy unbound checks are rejected without migration", () => {
    assert.throws(() => DataManager.extractSaveContents({
        system: "vanilla-system",
        lookOutsideArchipelago: { schema: 1, checkedKeys: ["map023_event041_baseball_bat"] },
    }), /Unsupported/);
    assert.throws(() => plugin.bindIdentityForDevelopment("seed-A", 0, 2), /Unsupported/);
    DataManager.setupNewGame();
});

test("all older AP schemas require their original mod instead of silent migration", () => {
    DataManager.setupNewGame();
    plugin.bindIdentityForDevelopment("old-calendar-seed", 0, 1);
    const saved = DataManager.makeSaveContents();
    for (const schema of [1, 2, 3, 4, 5, 6]) {
        saved.lookOutsideArchipelago.schema = schema;
        assert.throws(() => DataManager.extractSaveContents(saved), /older schemas/);
        assert.equal(plugin.active, false);
    }
    DataManager.setupNewGame();
});

test("invalid power save state disables AP without discarding the saved payload", () => {
    DataManager.setupNewGame();
    plugin.bindIdentityForDevelopment("power-save-seed", 0, 1);
    const saved = DataManager.makeSaveContents();
    for (const invalid of [
        { received: "true" },
        { outageSeen: false, outageInProgress: true },
        { notices: ["unknown notice"] },
    ]) {
        const broken = structuredClone(saved);
        Object.assign(broken.lookOutsideArchipelago.powerState, invalid);
        assert.throws(() => DataManager.extractSaveContents(broken), /Unsupported/);
        assert.equal(plugin.active, false);
        assert.match(plugin.saveError, /Unsupported/);
        assert.throws(() => DataManager.makeSaveContents(), /Unsupported/);
    }
    DataManager.setupNewGame();
});

test("Hard and Easy saves cannot activate or connect to the Normal-only AP world", () => {
    DataManager.setupNewGame();
    plugin.bindIdentityForDevelopment("normal-seed", 0, 1);
    const saved = DataManager.makeSaveContents();
    for (const difficultySwitch of [8, 13]) {
        DataManager.setupNewGame();
        switchValues.set(difficultySwitch, true);
        assert.throws(() => plugin.activateForDevelopment(), /Normal difficulty/);
        assert.throws(() => plugin.bindIdentityForDevelopment("hard-seed", 0, 1), /Normal difficulty/);
        assert.throws(() => plugin.connectForDevelopment({}), /Normal difficulty/);
        assert.equal(plugin.active, false);
        assert.throws(() => DataManager.extractSaveContents(saved), /Normal difficulty/);
        assert.equal(plugin.active, false);
        assert.match(plugin.saveError, /Normal difficulty/);
        assert.throws(() => DataManager.makeSaveContents(), /Normal difficulty/);
        switchValues.delete(difficultySwitch);
    }
    DataManager.extractSaveContents(saved);
    assert.equal(plugin.active, true);
    assert.equal(plugin.saveError, null);
    DataManager.setupNewGame();
});

test("seed and slot binding rejects a different session", () => {
    DataManager.setupNewGame();
    plugin.bindIdentityForDevelopment("seed-A", 0, 2);
    assert.deepEqual(plugin.identity(), { seedName: "seed-A", team: 0, slot: 2 });
    plugin.bindIdentityForDevelopment("seed-A", 0, 2);
    assert.throws(() => plugin.bindIdentityForDevelopment("seed-B", 0, 2), /differs/);
    assert.throws(() => plugin.bindIdentityForDevelopment("seed-A", 0, 3), /differs/);

    const saved = DataManager.makeSaveContents();
    DataManager.setupNewGame();
    DataManager.extractSaveContents(saved);
    assert.deepEqual(plugin.identity(), { seedName: "seed-A", team: 0, slot: 2 });
});

test("ReceivedItems replay is indexed and pending delivery survives reload", () => {
    const first = { item: 540100015, location: 2001, player: 3, flags: 0 };
    const second = { item: 540200007, location: 2002, player: 3, flags: 0 };
    assert.equal(plugin.queueReceivedItemsForDevelopment(0, [first, second]), true);
    assert.equal(plugin.nextItemIndex, 2);
    assert.deepEqual(plugin.pendingItems().map(entry => entry.index), [0, 1]);
    assert.equal(plugin.queueReceivedItemsForDevelopment(0, [first, second]), true);
    assert.deepEqual(plugin.pendingItems().map(entry => entry.index), [0, 1]);
    assert.equal(plugin.queueReceivedItemsForDevelopment(4, [{ item: 540100015 }]), false);
    assert.equal(plugin.nextItemIndex, 2);

    const saved = DataManager.makeSaveContents();
    DataManager.extractSaveContents(saved);
    assert.equal(plugin.nextItemIndex, 2);
    assert.deepEqual(plugin.pendingItems().map(entry => entry.item.item), [540100015, 540200007]);
    plugin.acknowledgePendingItemForDevelopment(0);
    assert.deepEqual(plugin.pendingItems().map(entry => entry.index), [1]);
});

test("Credits completes a bound seed on any day, excluding cheat mode", () => {
    const previousDay = currentDay;
    const previousCheatMode = cheatMode;
    try {
        for (const day of [1, 7, 14, 15, 16]) {
            DataManager.setupNewGame();
            currentDay = day;
            cheatMode = false;
            $gameMap.setup(168);
            assert.equal(plugin.goalCompleted, false, "an unbound save has no AP goal");

            plugin.bindIdentityForDevelopment(`ending-day-${day}`, 0, 1);
            $gameMap.setup(172);
            assert.equal(plugin.goalCompleted, false, "entering an ending route is not completion");
            cheatMode = true;
            $gameMap.setup(168);
            assert.equal(plugin.goalCompleted, false, "cheat Credits must not complete the seed");
            cheatMode = false;
            $gameMap.setup(168);
            assert.equal(plugin.goalCompleted, true, `Credits must count on day ${day}`);

            const saved = DataManager.makeSaveContents();
            DataManager.setupNewGame();
            DataManager.extractSaveContents(saved);
            assert.equal(plugin.goalCompleted, true, "completion survives save/load");
        }
    } finally {
        currentDay = previousDay;
        cheatMode = previousCheatMode;
        DataManager.setupNewGame();
    }
});

test("WebSocket handshake replays offline checks and rejects another seed", () => {
    class FakeWebSocket {
        static instances = [];
        constructor(url) {
            this.url = url;
            this.readyState = 1;
            this.sent = [];
            FakeWebSocket.instances.push(this);
        }
        send(payload) { this.sent.push(...JSON.parse(payload)); }
        close() { this.readyState = 3; this.onclose?.(); }
        server(...packets) { this.onmessage({ data: JSON.stringify(packets) }); }
    }
    const options = {
        url: "ws://localhost:38281",
        name: "Tester",
        password: "",
        uuid: "test-uuid",
        locationIds: {
            ...plugin.developmentData().locationIds,
            map023_event041_baseball_bat: 50001,
            map024_event007_padlock_key: 50004,
            map031_event030_hoodie: 50002,
            map074_event003_elevator_freak: 50003,
        },
        WebSocketClass: FakeWebSocket,
        autoReconnect: false,
    };
    DataManager.setupNewGame();
    plugin.connectForDevelopment(options);
    const socket = FakeWebSocket.instances.at(-1);
    socket.server({ cmd: "RoomInfo", seed_name: "seed-A" });
    assert.equal(socket.sent[0].cmd, "Connect");
    assert.equal(socket.sent[0].items_handling, 7);
    socket.server({ cmd: "Connected", team: 0, slot: 2, checked_locations: [], slot_data: sliceSlotData });
    assert.equal(plugin.connectionState, "connected");

    currentEvent = { _eventId: 41, _pageIndex: 0 };
    new FakeInterpreter(23, 41, 0, 7, 127, [15, 0, 0, 1, false])
        .command127([15, 0, 0, 1, false]);
    assert.deepEqual(socket.sent.at(-1), { cmd: "LocationChecks", locations: [50001] });
    socket.server({ cmd: "ReceivedItems", index: 0, items: [{ item: 540100015 }] });
    assert.deepEqual(plugin.pendingItems().map(entry => entry.index), [0]);
    socket.close();
    assert.equal(plugin.connectionState, "disconnected");
    assert.equal(plugin.active, true);

    currentEvent = { _eventId: 30, _pageIndex: 0 };
    new FakeInterpreter(31, 30, 0, 4, 128, [7, 0, 0, 1, false])
        .command128([7, 0, 0, 1, false]);
    assert.equal(socket.sent.length, 2);

    const saved = DataManager.makeSaveContents();
    DataManager.extractSaveContents(saved);
    assert.equal(plugin.active, true);
    plugin.connectForDevelopment(options);
    const reconnect = FakeWebSocket.instances.at(-1);
    reconnect.server({ cmd: "RoomInfo", seed_name: "seed-A" });
    reconnect.server({ cmd: "Connected", team: 0, slot: 2, checked_locations: [], slot_data: sliceSlotData });
    assert.deepEqual(reconnect.sent.at(-1), { cmd: "LocationChecks", locations: [50001, 50002] });
    reconnect.server({ cmd: "ReceivedItems", index: 0, items: [{ item: 540100015 }] });
    assert.deepEqual(plugin.pendingItems().map(entry => entry.index), [0]);

    plugin.connectForDevelopment(options);
    const wrongSeed = FakeWebSocket.instances.at(-1);
    wrongSeed.server({ cmd: "RoomInfo", seed_name: "seed-B" });
    assert.equal(plugin.connectionState, "error");
    assert.match(plugin.connectionError, /seed differs/);
    assert.deepEqual(wrongSeed.sent, []);
    assert.equal(plugin.active, true);

    DataManager.setupNewGame();
    plugin.connectForDevelopment(options);
    const serverChecked = FakeWebSocket.instances.at(-1);
    serverChecked.server({ cmd: "RoomInfo", seed_name: "seed-C" });
    serverChecked.server({ cmd: "Connected", team: 0, slot: 2, checked_locations: [50002], slot_data: sliceSlotData });
    assert.deepEqual(plugin.checkedKeys(), ["map031_event030_hoodie"]);
    serverChecked.server({ cmd: "ReceivedItems", index: 2, items: [{ item: 1003 }] });
    assert.deepEqual(serverChecked.sent.slice(-2), [
        { cmd: "Sync" },
        { cmd: "LocationChecks", locations: [50002] },
    ]);
    serverChecked.close();

    currentDay = 7;
    cheatMode = true;
    $gameMap.setup(168);
    assert.equal(plugin.goalCompleted, false);
    cheatMode = false;
    $gameMap.setup(168);
    assert.equal(plugin.goalCompleted, true);
    assert.deepEqual(serverChecked.sent.at(-1), { cmd: "LocationChecks", locations: [50002] });
    const goalSave = DataManager.makeSaveContents();
    DataManager.extractSaveContents(goalSave);
    assert.equal(plugin.goalCompleted, true);
    plugin.connectForDevelopment(options);
    const goalReconnect = FakeWebSocket.instances.at(-1);
    goalReconnect.server({ cmd: "RoomInfo", seed_name: "seed-C" });
    goalReconnect.server({ cmd: "Connected", team: 0, slot: 2, checked_locations: [], slot_data: sliceSlotData });
    assert.deepEqual(goalReconnect.sent.slice(-2), [
        { cmd: "StatusUpdate", status: 30 }, { cmd: "Say", text: "!release" },
    ]);

    plugin.connectForDevelopment(options);
    const wrongSlot = FakeWebSocket.instances.at(-1);
    wrongSlot.server({ cmd: "RoomInfo", seed_name: "seed-C" });
    wrongSlot.server({ cmd: "Connected", team: 0, slot: 3, checked_locations: [], slot_data: sliceSlotData });
    assert.equal(plugin.connectionState, "error");
    assert.match(plugin.connectionError, /slot differs/);
    assert.equal(plugin.active, true);

    DataManager.setupNewGame();
    plugin.connectForDevelopment(options);
    const wrongWorld = FakeWebSocket.instances.at(-1);
    wrongWorld.server({ cmd: "RoomInfo", seed_name: "seed-D" });
    wrongWorld.server({ cmd: "Connected", team: 0, slot: 2, checked_locations: [],
        slot_data: { development_slice: false } });
    assert.match(plugin.connectionError, /Incompatible/);
    assert.equal(plugin.identity(), null);
    assert.equal(plugin.active, false);

    const scheduled = [];
    const retryOptions = {
        ...options,
        autoReconnect: true,
        setTimeout(callback, delay) {
            scheduled.push({ callback, delay, cancelled: false });
            return scheduled.length - 1;
        },
        clearTimeout(id) { scheduled[id].cancelled = true; },
    };
    DataManager.setupNewGame();
    plugin.connectForDevelopment(retryOptions);
    const first = FakeWebSocket.instances.at(-1);
    first.server({ cmd: "RoomInfo", seed_name: "seed-E" });
    first.server({ cmd: "Connected", team: 0, slot: 2, checked_locations: [],
        slot_data: sliceSlotData });
    first.close();
    assert.equal(plugin.connectionState, "disconnected");
    assert.equal(scheduled.at(-1).delay, 1000);
    scheduled.at(-1).callback();
    const retry = FakeWebSocket.instances.at(-1);
    assert.notEqual(retry, first);
    retry.server({ cmd: "RoomInfo", seed_name: "seed-E" });
    retry.server({ cmd: "Connected", team: 0, slot: 2, checked_locations: [],
        slot_data: sliceSlotData });
    assert.equal(plugin.connectionState, "connected");
    retry.close();
    const cancelledRetry = scheduled.at(-1);
    const countBeforeReset = FakeWebSocket.instances.length;
    DataManager.setupNewGame();
    assert.equal(cancelledRetry.cancelled, true);
    cancelledRetry.callback();
    assert.equal(FakeWebSocket.instances.length, countBeforeReset);
});

test("ending release waits for server acknowledgement and respects release restrictions", () => {
    class FakeWebSocket {
        constructor() { this.readyState = 1; this.sent = []; FakeWebSocket.last = this; }
        send(payload) { this.sent.push(...JSON.parse(payload)); }
        close() { this.readyState = 3; this.onclose?.(); }
        server(...packets) { this.onmessage({ data: JSON.stringify(packets) }); }
    }
    const options = { url: "ws://localhost:38281", name: "Tester", uuid: "release-test",
        WebSocketClass: FakeWebSocket, autoReconnect: false };
    const allIds = Object.values(plugin.developmentData().locationIds);
    try {
        for (const permission of [0, 1, 2, 6, 7]) {
            DataManager.setupNewGame();
            currentDay = 15;
            cheatMode = false;
            plugin.connectForDevelopment(options);
            const socket = FakeWebSocket.last;
            socket.server({ cmd: "RoomInfo", seed_name: "release-test", permissions: { release: permission } });
            socket.server({ cmd: "Connected", team: 0, slot: 1, checked_locations: [], slot_data: sliceSlotData });
            assert.equal(socket.sent.length, 1, "connecting must not release an unfinished game");
            $gameMap.setup(172);
            assert.equal(plugin.goalCompleted, false);
            $gameMap.setup(168);
            assert.deepEqual(socket.sent.slice(-2), [
                { cmd: "StatusUpdate", status: 30 }, { cmd: "Say", text: "!release" },
            ]);
            assert.equal(plugin.checkedKeys().length, 0, "release cannot invent local checks");
            assert.match(plugin.goalReleaseSummary(), permission === 0 ? /host must allow/ : /Waiting/);
            $gameMap.setup(168);
            assert.equal(socket.sent.length, 3, "repeated Credits must not repeat release");
            if (permission === 0) {
                socket.server({ cmd: "RoomUpdate", permissions: { release: 2 } });
                assert.deepEqual(socket.sent.slice(-2), [
                    { cmd: "StatusUpdate", status: 30 }, { cmd: "Say", text: "!release" },
                ], "retry if host enables release after goal");
            }
            socket.server({ cmd: "RoomUpdate", checked_locations: allIds });
            assert.equal(plugin.checkedKeys().length, allIds.length);
            assert.match(plugin.goalReleaseSummary(), /acknowledged all checks/);
            socket.close();
            assert.match(plugin.goalReleaseSummary(), /Reconnect/);
            const save = DataManager.makeSaveContents();
            DataManager.extractSaveContents(save);
            plugin.connectForDevelopment(options);
            const reconnect = FakeWebSocket.last;
            reconnect.server({ cmd: "RoomInfo", seed_name: "release-test", permissions: { release: permission } });
            reconnect.server({ cmd: "Connected", team: 0, slot: 1, checked_locations: allIds, slot_data: sliceSlotData });
            assert.equal(reconnect.sent.some(packet => packet.cmd === "Say"), false,
                "no release request when server already acknowledged all checks");
            assert.deepEqual(reconnect.sent.at(-1), { cmd: "StatusUpdate", status: 30 });
        }
    } finally {
        DataManager.setupNewGame();
        currentDay = 1;
    }
});

test("received equipment grants once and full inventory keeps delivery pending", () => {
    DataManager.setupNewGame();
    plugin.bindIdentityForDevelopment("seed-A", 0, 2);
    globalThis.$dataWeapons = { 15: { kind: "weapon", id: 15 } };
    globalThis.$dataArmors = { 7: { kind: "armor", id: 7 } };
    const counts = new Map();
    let weaponCapacity = 1;
    globalThis.$gameParty = {
        numItems(item) { return counts.get(item) || 0; },
        maxItems(item) { return item.kind === "weapon" ? weaponCapacity : 99; },
        gainItem(item, amount) { counts.set(item, Math.min(this.maxItems(item), this.numItems(item) + amount)); },
    };
    const definitions = {
        540100015: { kind: "weapon", id: 15 },
        540200007: { kind: "armor", id: 7 },
    };
    plugin.configureItemDefinitionsForDevelopment(definitions);
    plugin.queueReceivedItemsForDevelopment(0, [
        { item: 540100015 }, { item: 540100015 }, { item: 540200007 },
    ]);
    plugin.deliverPendingForDevelopment();
    assert.equal(counts.get($dataWeapons[15]), 1);
    assert.equal(counts.get($dataArmors[7]), 1);
    assert.deepEqual(plugin.pendingItems().map(entry => entry.index), [1]);

    const saved = DataManager.makeSaveContents();
    DataManager.extractSaveContents(saved);
    weaponCapacity = 2;
    plugin.deliverPendingForDevelopment();
    assert.equal(counts.get($dataWeapons[15]), 2);
    assert.deepEqual(plugin.pendingItems().map(entry => entry.index), []);
    plugin.queueReceivedItemsForDevelopment(0, [
        { item: 540100015 }, { item: 540100015 }, { item: 540200007 },
    ]);
    assert.deepEqual(plugin.pendingItems().map(entry => entry.index), []);
});

test("Elevator Freak victory check and received access stay independent", () => {
    const pages = [
        { conditions: { switch1Valid: false } },
        { conditions: { switch1Valid: true, switch1Id: 115 } },
    ];
    const victoryParams = [115, 115, 0];
    DataManager.setupNewGame();
    switchValues.delete(115);
    plugin.bindIdentityForDevelopment("seed-elevator", 0, 2);
    plugin.activateForDevelopment();
    currentEvent = new FakeEvent(74, 3, pages);
    assert.equal(currentEvent.meetsConditions(pages[1]), false);
    new FakeInterpreter(74, 3, 0, 3, 121, victoryParams).command121(victoryParams);
    assert.equal(plugin.elevatorFreakDefeated, true);
    assert.equal($gameSwitches.value(115), false);
    assert.equal(currentEvent.meetsConditions(pages[1]), true);
    assert.equal($gameMap.refreshRequested, true);
    assert.deepEqual(plugin.checkedKeys(), ["map074_event003_elevator_freak"]);

    const afterBoss = DataManager.makeSaveContents();
    DataManager.extractSaveContents(afterBoss);
    assert.equal(plugin.elevatorFreakDefeated, true);
    assert.equal(currentEvent.meetsConditions(pages[1]), true);
    plugin.configureItemDefinitionsForDevelopment(plugin.developmentData().itemDefinitions);
    plugin.queueReceivedItemsForDevelopment(0, [{ item: 540300115 }]);
    plugin.deliverPendingForDevelopment();
    assert.equal($gameSwitches.value(115), true);
    assert.deepEqual(plugin.pendingItems(), []);

    DataManager.setupNewGame();
    switchValues.delete(115);
    plugin.bindIdentityForDevelopment("seed-elevator-early", 0, 2);
    plugin.activateForDevelopment();
    plugin.configureItemDefinitionsForDevelopment(plugin.developmentData().itemDefinitions);
    plugin.queueReceivedItemsForDevelopment(0, [{ item: 540300115 }]);
    plugin.deliverPendingForDevelopment();
    currentEvent = new FakeEvent(74, 3, pages);
    assert.equal($gameSwitches.value(115), true);
    assert.equal(currentEvent.meetsConditions(pages[1]), false);
    new FakeInterpreter(74, 3, 0, 3, 121, victoryParams).command121(victoryParams);
    assert.equal(currentEvent.meetsConditions(pages[1]), true);
});

test("normal rollover waits for explicit day advance and runs vanilla newDay", () => {
    DataManager.setupNewGame();
    currentDay = 7;
    commonEventCalls.length = 0;
    reservedCommonEvents.length = 0;
    const dayIncrement = [15, 15, 1, 0, 1];
    const timePasses = $dataCommonEvents[4].list;
    timePasses.length = 136;
    timePasses[59] = { code: 122, parameters: dayIncrement };
    timePasses[78] = { code: 122, parameters: dayIncrement };
    timePasses[135] = { code: 117, parameters: [6] };
    const interpreter = new FakeInterpreter(3, 1, 0, 59, 122, dayIncrement);
    interpreter._list = timePasses;

    interpreter.command122(dayIncrement);
    assert.equal(currentDay, 8); // Vanilla behavior before the AP save is bound.
    assert.throws(() => plugin.bindIdentityForDevelopment("too-late", 0, 2), /not eligible/);
    DataManager.setupNewGame();
    currentDay = 7;
    plugin.bindIdentityForDevelopment("seed-day", 0, 2);
    plugin.activateForDevelopment();
    interpreter.command122(dayIncrement);
    assert.equal(currentDay, 7);
    assert.equal(plugin.pendingDayRollover, true);
    const pendingSave = DataManager.makeSaveContents();
    DataManager.extractSaveContents(pendingSave);
    assert.equal(plugin.pendingDayRollover, true);

    interpreter._index = 135;
    interpreter.command117([6]);
    assert.equal(plugin.dayHold, true);
    assert.deepEqual(commonEventCalls, []);
    const anotherTimeCall = new FakeInterpreter(3, 1, 0, 0, 117, [4]);
    variableValues.set(19, 480);
    variableValues.set(116, 40);
    anotherTimeCall.command117([4]);
    assert.deepEqual(commonEventCalls, []);
    assert.equal($gameVariables.value(19), 0);
    assert.equal($gameVariables.value(116), 0);

    const heldSave = DataManager.makeSaveContents();
    DataManager.extractSaveContents(heldSave);
    assert.equal(plugin.dayHold, true);
    const menu = new FakeMenuWindow();
    menu.addOriginalCommands();
    assert.deepEqual(menu.commands.map(command => command.symbol),
        ["loaConnect", "loaStatus", "loaNextDay"]);
    const menuScene = new FakeSceneMenu();
    menuScene.createCommandWindow();
    variableValues.set(19, 1000); // An action may queue time without calling TimePasses yet.
    variableValues.set(116, 25);
    menuScene._commandWindow.handlers.loaNextDay();
    assert.equal(menuScene.popped, true);
    assert.equal(currentDay, 8);
    assert.equal(plugin.dayHold, false);
    assert.equal($gameVariables.value(19), 0);
    assert.equal($gameVariables.value(116), 0);
    assert.deepEqual(reservedCommonEvents, [6]);
    assert.throws(() => plugin.advanceDayForDevelopment(), /No bound Archipelago day hold/);
    reservedCommonEvents.length = 0;
    const normalMenu = new FakeMenuWindow();
    normalMenu.addOriginalCommands();
    assert.deepEqual(normalMenu.commands.map(command => command.symbol),
        ["loaConnect", "loaStatus"]);

    const cheatDayWrite = new FakeInterpreter(3, 31, 0, 36, 122, dayIncrement);
    cheatDayWrite.command122(dayIncrement);
    assert.equal(currentDay, 9); // Different source keeps its own vanilla behavior.

    DataManager.setupNewGame();
    currentDay = 15;
    reservedCommonEvents.length = 0;
    plugin.bindIdentityForDevelopment("seed-final-day", 0, 2);
    plugin.activateForDevelopment();
    interpreter._index = 59;
    interpreter.command122(dayIncrement);
    interpreter._index = 135;
    interpreter.command117([6]);
    assert.equal(plugin.dayHold, true);
    const finalDayMenu = new FakeMenuWindow();
    finalDayMenu.addOriginalCommands();
    assert.deepEqual(finalDayMenu.commands.map(command => command.symbol),
        ["loaConnect", "loaStatus"]);
    assert.throws(() => plugin.advanceDayForDevelopment(), /final supported/);
    assert.equal(currentDay, 15);
    assert.deepEqual(reservedCommonEvents, []);
});

test("long actions stop at the native 04:00 newDay boundary", () => {
    DataManager.setupNewGame();
    const caller = new FakeInterpreter(3, 66, 0, 78, 117, [4]);
    variableValues.set(16, 23);
    variableValues.set(17, 40);
    variableValues.set(19, 480);
    variableValues.set(116, 30);
    caller.command117([4]);
    assert.equal($gameVariables.value(19), 480); // Inactive game stays vanilla.
    plugin.bindIdentityForDevelopment("clock-limit", 0, 1);
    plugin.activateForDevelopment();
    caller.command117([4]);
    assert.equal($gameVariables.value(19), 260);
    assert.equal($gameVariables.value(116), 0);
    variableValues.set(16, 3);
    variableValues.set(17, 45);
    variableValues.set(19, 20);
    caller.command117([4]);
    assert.equal($gameVariables.value(19), 15);
    variableValues.set(16, 4);
    variableValues.set(17, 0);
    variableValues.set(19, 30);
    caller.command117([4]);
    assert.equal($gameVariables.value(19), 30); // An ordinary new morning.
    variableValues.clear();
});

test("planetarium solution checks once and access arrives separately", () => {
    DataManager.setupNewGame();
    switchValues.set(699, false);
    plugin.bindIdentityForDevelopment("planetarium", 0, 1);
    plugin.activateForDevelopment();
    const params = [699, 699, 0];
    const source = new FakeInterpreter(345, 12, 0, 216, 121, params);
    $dataCommonEvents[64] = { list: source._list };
    currentEvent = null;
    for (let i = 0; i < 9; i++) variableValues.set(771 + i, i + 1);
    source.command121(params);
    source.command121(params);
    assert.deepEqual(plugin.checkedKeys(), ["planetarium_access"]);
    assert.equal($gameSwitches.value(699), false);
    assert.equal(DataManager.makeSaveContents().lookOutsideArchipelago.elevatorFreakDefeated, false);
    plugin.configureItemDefinitionsForDevelopment(plugin.developmentData().itemDefinitions);
    plugin.queueReceivedItemsForDevelopment(0, [{ item: 540300699 }]);
    plugin.deliverPendingForDevelopment();
    assert.equal($gameSwitches.value(699), true);
    source.command121(params);
    assert.equal($gameSwitches.value(699), true);
});

test("planetarium hook requires the original common event and all nine sockets", () => {
    const params = [699, 699, 0];
    for (const invalid of ["copied-list", "socket", "build", "inactive"]) {
        DataManager.setupNewGame();
        switchValues.set(699, false);
        if (invalid !== "inactive") plugin.activateForDevelopment();
        const source = new FakeInterpreter(345, 12, 0, 216, 121, params);
        $dataCommonEvents[64] = { list: source._list };
        for (let i = 0; i < 9; i++) variableValues.set(771 + i, i + 1);
        if (invalid === "copied-list") source._list = structuredClone(source._list);
        if (invalid === "socket") variableValues.set(779, 0);
        const version = $dataSystem.versionId;
        if (invalid === "build") $dataSystem.versionId++;
        try {
            source.command121(params);
            assert.deepEqual(plugin.checkedKeys(), [], invalid);
            assert.equal($gameSwitches.value(699), true, invalid);
        } finally {
            $dataSystem.versionId = version;
        }
    }
    variableValues.clear();
});

test("menu connection uses entered server and slot and exposes connection status", () => {
    class MenuSocket {
        static instances = [];
        constructor(url) {
            this.url = url;
            this.readyState = 1;
            this.sent = [];
            MenuSocket.instances.push(this);
        }
        send(payload) { this.sent.push(...JSON.parse(payload)); }
        close() { this.readyState = 3; this.onclose?.(); }
        server(...packets) { this.onmessage({ data: JSON.stringify(packets) }); }
    }
    DataManager.setupNewGame();
    const entries = ["ws://localhost:38281", "Look Tester", ""];
    const alerts = [];
    globalThis.prompt = () => entries.shift();
    globalThis.alert = message => alerts.push(message);
    globalThis.WebSocket = MenuSocket;
    const scene = new FakeSceneMenu();
    scene.createCommandWindow();
    scene._commandWindow.handlers.loaConnect();
    assert.equal(scene._commandWindow.activated, true);
    const socket = MenuSocket.instances.at(-1);
    assert.equal(socket.url, "ws://localhost:38281");
    socket.server({ cmd: "RoomInfo", seed_name: "menu-seed" });
    assert.equal(socket.sent[0].name, "Look Tester");
    assert.equal(socket.sent[0].password, "");
    assert.match(socket.sent[0].uuid, /^lookoutside-/);
    socket.server({ cmd: "Connected", team: 0, slot: 2, checked_locations: [],
        slot_data: sliceSlotData });
    scene._commandWindow.handlers.loaStatus();
    assert.match(alerts.at(-1), /Archipelago: connected/);
    assert.match(alerts.at(-1), /menu-seed, team 0, slot 2/);
    socket.close();
});

test("Padlock Key pickup becomes a check and the received key can be consumed", () => {
    DataManager.setupNewGame();
    inventory.length = 0;
    plugin.bindIdentityForDevelopment("seed-key", 0, 2);
    plugin.activateForDevelopment();
    currentEvent = { _eventId: 7, _pageIndex: 0 };
    const pickup = new FakeInterpreter(24, 7, 0, 6, 126, [301, 0, 0, 1]);
    pickup.command126([301, 0, 0, 1]);
    assert.deepEqual(plugin.checkedKeys(), ["map024_event007_padlock_key"]);
    assert.deepEqual(inventory, []);

    const key = { kind: "item", id: 301 };
    globalThis.$dataItems = { 301: key };
    let keyCount = 0;
    globalThis.$gameParty = {
        numItems(item) { return item === key ? keyCount : 0; },
        maxItems() { return 99; },
        gainItem(item, amount) { if (item === key) keyCount += amount; },
    };
    plugin.configureItemDefinitionsForDevelopment(plugin.developmentData().itemDefinitions);
    plugin.queueReceivedItemsForDevelopment(0, [{ item: 540000301 }]);
    plugin.deliverPendingForDevelopment();
    assert.equal(keyCount, 1);
    assert.deepEqual(plugin.pendingItems(), []);
    $gameParty.gainItem(key, -1);
    assert.equal(keyCount, 0);
});

test("five additional apartment pickups become checks with no vanilla grant", () => {
    DataManager.setupNewGame();
    inventory.length = 0;
    plugin.activateForDevelopment();
    const registry = require("../apworld/lookoutside/vertical_slice.json");
    const added = registry.locations.filter(location => [
        "map031_event009_frying_pan", "map032_event009_mop",
        "map033_event007_baseball_cap", "map034_event025_tank_top",
        "map035_event011_carving_fork",
    ].includes(location.key));
    assert.equal(added.length, 5);
    for (const location of added) {
        const params = [location.reward_database_id, 0, 0, 1, false];
        const source = new FakeInterpreter(location.map_id, location.event_id,
            location.page, location.command_index, location.command_code, params);
        currentEvent = { _eventId: location.event_id, _pageIndex: location.page };
        source[`command${location.command_code}`](params);
    }
    assert.deepEqual(plugin.checkedKeys(), added.map(location => location.key));
    assert.deepEqual(inventory, []);
});

test("five Landlord hub variants share one Basement Key check", () => {
    const registry = require("../apworld/lookoutside/vertical_slice.json");
    const location = registry.locations.find(row => row.key === "landlords_hell_basement_key");
    assert.equal(location.source_variants.length, 4);
    const variants = [location, ...location.source_variants];
    const pages = [
        { conditions: { switch1Valid: false } },
        { conditions: { switch1Valid: false, itemValid: true, itemId: 303 } },
    ];
    for (const variant of variants) {
        DataManager.setupNewGame();
        inventory.length = 0;
        plugin.bindIdentityForDevelopment("seed-basement", 0, 2);
        plugin.activateForDevelopment();
        currentEvent = new FakeEvent(variant.map_id, variant.event_id, pages);
        assert.equal(currentEvent.meetsConditions(pages[1]), false);
        const params = [303, 0, 0, 1];
        new FakeInterpreter(variant.map_id, variant.event_id, 0,
            variant.command_index, 126, params).command126(params);
        assert.deepEqual(plugin.checkedKeys(), ["landlords_hell_basement_key"]);
        assert.equal(currentEvent.meetsConditions(pages[1]), true);
        assert.deepEqual(inventory, []);
    }
    DataManager.setupNewGame();
    plugin.bindIdentityForDevelopment("seed-basement-early", 0, 2);
    plugin.activateForDevelopment();
    const key = { name: "Basement Key" };
    globalThis.$dataItems = { 303: key };
    let keyCount = 0;
    globalThis.$gameParty = {
        numItems(item) { return item === key ? keyCount : 0; },
        maxItems() { return 99; },
        gainItem(item, amount) { if (item === key) keyCount += amount; },
    };
    plugin.configureItemDefinitionsForDevelopment(plugin.developmentData().itemDefinitions);
    plugin.queueReceivedItemsForDevelopment(0, [{ item: 540000303 }]);
    plugin.deliverPendingForDevelopment();
    assert.equal(keyCount, 1);
    currentEvent = new FakeEvent(184, 1, pages);
    assert.equal(currentEvent.meetsConditions(pages[1]), false);
});

test("every registered fixed pickup suppresses its reward and substitutes its notice", () => {
    DataManager.setupNewGame();
    plugin.activateForDevelopment();
    inventory.length = 0;
    messages.length = 0;
    const registry = require("../apworld/lookoutside/vertical_slice.json");
    const pickups = registry.locations.filter(location =>
        location.reward_kind !== "switch" && !location.source_variants && !location.battle_drop && !location.troop_id);
    for (const location of pickups) {
        const messageCount = messages.length;
        const params = [location.reward_database_id, 0, 0, 1, false];
        const source = new FakeInterpreter(location.map_id, location.event_id,
            location.page, location.command_index, location.command_code, params);
        if (location.common_event_id !== undefined) {
            $dataCommonEvents[location.common_event_id] = {list: source._list};
            for (const condition of location.required_variables || []) {
                variableValues.set(condition.id, condition.values?.[0] ?? condition.value);
            }
        }
        currentEvent = { _eventId: location.event_id, _pageIndex: location.page };
        source[`command${location.command_code}`](params);
        assert.equal(plugin.checkedKeys().at(-1), location.key, location.name);
        assert.deepEqual(inventory, [], location.name);

        if (location.message_index === undefined) {
            assert.equal(messages.length, messageCount + 1, location.name);
            assert.equal(messages.at(-1), "Archipelago location checked.", location.name);
            continue;
        }

        const text = new FakeInterpreter(location.map_id, location.event_id,
            location.page, location.message_index - 1, 101, []);
        text._list[location.message_index] = {
            code: 401, parameters: [location.message_text],
        };
        if (location.common_event_id !== undefined) {
            $dataCommonEvents[location.common_event_id] = {list: text._list};
        }
        text.command101([]);
        assert.equal(messages.at(-1),
            location.ap_message || "Archipelago location checked.", location.name);
    }
    assert.equal(plugin.checkedKeys().length, pickups.length);
    plugin.deactivate();
});

test("Joel's alternate sources complete one resolution group with guarded, deduplicated rewards", () => {
    const oldParty = globalThis.$gameParty;
    const oldTroops = globalThis.$dataTroops;
    const oldTroopId = BattleManager._troopId;
    const location = require("../apworld/lookoutside/vertical_slice.json").locations
        .find(row => row.key === "joel_peaceful_door_knob");
    const resolution = [location.key, "joel_resolution_toothy_whip"];
    const params = [310, 0, 0, 1];
    const interpreter = new FakeInterpreter(32, 0, 1, 52, 126, params);
    const list = interpreter._list;
    list[53] = { code: 101, parameters: [] };
    list[54] = { code: 401, parameters: [location.message_text] };
    let inBattle = true;
    globalThis.$gameParty = { inBattle: () => inBattle };
    globalThis.$dataTroops = { 26: { pages: [null, { list }] } };
    try {
        DataManager.setupNewGame();
        plugin.activateForDevelopment();
        currentEvent = null;
        variableValues.set(107, 8);
        BattleManager.setup(26);
        inventory.length = 0;
        interpreter.command126(params);
        interpreter.command126(params);
        assert.deepEqual(plugin.checkedKeys(), resolution);
        assert.deepEqual(inventory, []);
        messages.length = 0;
        interpreter._index = 53;
        interpreter.command101([]);
        assert.deepEqual(messages, [location.ap_message]);
        assert.equal(list[54].parameters[0], location.message_text);

        DataManager.setupNewGame();
        plugin.activateForDevelopment();
        interpreter._index = 52;
        variableValues.set(107, 7);
        interpreter.command126(params);
        assert.deepEqual(plugin.checkedKeys(), resolution, "Native Attack fall-through also resolves the group");
        assert.deepEqual(inventory, []);
        DataManager.setupNewGame();
        plugin.activateForDevelopment();
        variableValues.set(107, 6);
        interpreter.command126(params);
        variableValues.set(107, 8);
        inBattle = false;
        interpreter.command126(params);
        inBattle = true;
        BattleManager.setup(27);
        interpreter.command126(params);
        BattleManager.setup(26);
        interpreter._list = structuredClone(list);
        interpreter.command126(params);
        interpreter._list = list;
        plugin.deactivate();
        interpreter.command126(params);
        plugin.activateForDevelopment();
        assert.deepEqual(plugin.checkedKeys(), []);
        for (let page = 0; page < 4; page++) {
            currentEvent = { _eventId: 7, _pageIndex: page };
            new FakeInterpreter(32, 7, page, page < 2 ? 9 : 8, 126, params).command126(params);
        }
        assert.deepEqual(inventory, Array.from({ length: 5 }, () => ["item", 310]));
        assert.deepEqual(plugin.checkedKeys(), resolution);
    } finally {
        globalThis.$gameParty = oldParty;
        globalThis.$dataTroops = oldTroops;
        BattleManager._troopId = oldTroopId;
        plugin.deactivate();
    }
});

test("peaceful troop quest terminals require the original dialogue and outcome state", () => {
    const oldParty = globalThis.$gameParty;
    const oldTroops = globalThis.$dataTroops;
    const oldTroopId = BattleManager._troopId;
    const families = require("../apworld/lookoutside/vertical_slice.json").quest_families
        .filter(row => row.terminals.some(terminal => terminal.troop_id));
    assert.ok(families.some(family => family.key === "sybil_resolution"));
    try {
        for (const family of families) for (const terminal of family.terminals.filter(row => row.troop_id)) {
          for (const variant of ["valid", "clone", "wrong_troop", "wrong_state", "outside_battle", "inactive"]) {
            if (variant === "wrong_state" && !terminal.required_variables?.length) continue;
            DataManager.setupNewGame();
            if (variant !== "inactive") plugin.activateForDevelopment();
            currentEvent = null;
            const interpreter = new FakeInterpreter(terminal.map_id, 0, terminal.page,
                terminal.command_index, terminal.command_code, terminal.parameters);
            globalThis.$dataTroops = { [terminal.troop_id]: { pages: [] } };
            $dataTroops[terminal.troop_id].pages[terminal.page] = { list: interpreter._list };
            globalThis.$gameParty = { inBattle: () => variant !== "outside_battle" };
            BattleManager.setup(variant === "wrong_troop" ? 999 : terminal.troop_id);
            for (const condition of terminal.required_variables || []) {
                variableValues.set(condition.id, variant === "wrong_state" ? 0 : (condition.values?.[0] ?? condition.value));
            }
            if (variant === "clone") interpreter._list = structuredClone(interpreter._list);
            interpreter["command" + terminal.command_code](terminal.parameters);
            interpreter["command" + terminal.command_code](terminal.parameters);
            assert.deepEqual(plugin.checkedKeys(), variant === "valid" ? (terminal.location_keys || family.location_keys) : [], variant);
            if (family.key === "benjamin_playtime" && terminal.troop_id === 27) {
                assert.equal($gameVariables.value(110), 5, "Native completion runs even outside AP scope");
            }
          }
        }
    } finally {
        globalThis.$gameParty = oldParty;
        globalThis.$dataTroops = oldTroops;
        BattleManager._troopId = oldTroopId;
        plugin.deactivate();
    }
});

test("Mutt's free and paid shop stock both stay vanilla", () => {
    DataManager.setupNewGame();
    plugin.activateForDevelopment();
    inventory.length = 0;
    const freeParams = [100, 0, 0, 1, false];
    currentEvent = { _eventId: 4, _pageIndex: 0 };
    new FakeInterpreter(56, 4, 0, 7, 127, freeParams).command127(freeParams);
    assert.deepEqual(plugin.checkedKeys(), []);
    assert.deepEqual(inventory, [["weapon", 100]]);

    currentEvent = { _eventId: 4, _pageIndex: 1 };
    new FakeInterpreter(56, 4, 1, 20, 127, freeParams).command127(freeParams);
    assert.deepEqual(inventory, [["weapon", 100], ["weapon", 100]]);
    assert.deepEqual(plugin.checkedKeys(), []);
    plugin.deactivate();
});

test("alternate Pistol pages share a check and rifle ammunition remains vanilla", () => {
    DataManager.setupNewGame();
    plugin.activateForDevelopment();
    inventory.length = 0;
    const pistolParams = [115, 0, 0, 1, false];
    for (const page of [0, 3]) {
        currentEvent = { _eventId: 30, _pageIndex: page };
        new FakeInterpreter(7, 30, page, 4, 128, pistolParams)
            .command128(pistolParams);
    }
    assert.deepEqual(plugin.checkedKeys(), ["map007_event030_complex"]);
    assert.deepEqual(inventory, []);

    currentEvent = { _eventId: 24, _pageIndex: 0 };
    const bulletParams = [183, 0, 0, 12];
    new FakeInterpreter(34, 24, 0, 15, 126, bulletParams)
        .command126(bulletParams);
    const rifleParams = [132, 0, 0, 1, false];
    new FakeInterpreter(34, 24, 0, 27, 128, rifleParams)
        .command128(rifleParams);
    assert.deepEqual(inventory, [["item", 183]]);
    assert.deepEqual(plugin.checkedKeys(), [
        "map007_event030_complex", "map034_event024_complex",
    ]);
    plugin.deactivate();
});

test("a two-item safe sends both checks and preserves each cash branch", () => {
    const registry = require("../apworld/lookoutside/vertical_slice.json");
    const pickups = registry.locations.filter(row => row.map_id === 73 && row.event_id === 8);
    assert.equal(pickups.length, 2);
    for (const notice of [pickups[0], ...pickups[0].message_variants]) {
        DataManager.setupNewGame();
        plugin.activateForDevelopment();
        inventory.length = 0;
        messages.length = 0;
        goldAmount = 0;
        currentEvent = { _eventId: 8, _pageIndex: 0 };
        for (const location of pickups) {
            const params = [location.reward_database_id, 0, 0, 1, false];
            new FakeInterpreter(73, 8, 0, location.command_index, 128, params)
                .command128(params);
        }
        const text = new FakeInterpreter(73, 8, 0, notice.message_index - 1, 101, []);
        text._list[notice.message_index] = { code: 401, parameters: [notice.message_text] };
        text.command101([]);
        const cashParams = [0, 0, notice.cash_amount];
        new FakeInterpreter(73, 8, 0, notice.message_index + 1, 125, cashParams)
            .command125(cashParams);
        assert.deepEqual(plugin.checkedKeys(), pickups.map(row => row.key));
        assert.deepEqual(inventory, []);
        assert.equal(goldAmount, notice.cash_amount);
        assert.deepEqual(messages, [notice.ap_message]);
    }
    plugin.deactivate();
});

test("all valid Roach Leadership resolutions reconcile only their two reward checks", () => {
    const registry = require("../apworld/lookoutside/vertical_slice.json");
    const family = registry.quest_families.find(row => row.key === "roach_leadership");
    for (const terminal of family.terminals) {
        DataManager.setupNewGame();
        inventory.length = 0;
        messages.length = 0;
        variableValues.clear();
        const reported = [];
        plugin.activateForDevelopment(key => reported.push(key));
        currentEvent = { _eventId: 121, _pageIndex: 2 };
        const selected = registry.locations.find(row => row.quest_family === family.key &&
            row.consumed_variable.value === terminal.parameters[4]);
        if (selected) {
            const params = [selected.reward_database_id, 0, 0, 1, false];
            new FakeInterpreter(3, 121, 2, selected.command_index, 128, params)
                .command128(params);
            assert.deepEqual(plugin.checkedKeys(), [selected.key]);
        } else {
            assert.deepEqual(plugin.checkedKeys(), []);
        }
        const resolution = new FakeInterpreter(3, 121, 2, terminal.command_index,
            122, terminal.parameters);
        resolution.command122(terminal.parameters);
        resolution.command122(terminal.parameters);
        assert.deepEqual([...plugin.checkedKeys()].sort(), [...family.location_keys].sort());
        assert.equal(reported.length, 2);
        assert.equal($gameVariables.value(899), terminal.parameters[4]);
        assert.deepEqual(inventory, []);
        assert.deepEqual(messages,
            ["Archipelago: remaining Roach Leadership checks completed."]);
        const saved = DataManager.makeSaveContents();
        DataManager.extractSaveContents(saved);
        assert.deepEqual([...plugin.checkedKeys()].sort(), [...family.location_keys].sort());
    }
    DataManager.setupNewGame();
    plugin.activateForDevelopment();
    const terminal = family.terminals[0];
    currentEvent = { _eventId: 121, _pageIndex: 1 };
    new FakeInterpreter(3, 121, 1, terminal.command_index, 122, terminal.parameters)
        .command122(terminal.parameters);
    assert.deepEqual(plugin.checkedKeys(), []);
    plugin.deactivate();
    currentEvent = { _eventId: 121, _pageIndex: 2 };
    new FakeInterpreter(3, 121, 2, terminal.command_index, 122, terminal.parameters)
        .command122(terminal.parameters);
    assert.deepEqual(plugin.checkedKeys(), []);
});

test("Leigh's quest checks the ring on either outcome without changing her choice", () => {
    const registry = require("../apworld/lookoutside/vertical_slice.json");
    const family = registry.quest_families.find(row => row.key === "leighs_call");
    const location = registry.locations.find(row => row.key === "leighs_call_ring");
    for (const terminal of family.terminals) {
        DataManager.setupNewGame();
        plugin.activateForDevelopment();
        inventory.length = 0;
        messages.length = 0;
        currentEvent = { _eventId: 1, _pageIndex: 0 };
        if (terminal.parameters[4] === 102) {
            const params = [283, 0, 0, 1, false];
            new FakeInterpreter(434, 1, 0, location.command_index, 128, params)
                .command128(params);
        }
        new FakeInterpreter(434, 1, 0, terminal.command_index, 122, terminal.parameters)
            .command122(terminal.parameters);
        assert.deepEqual(plugin.checkedKeys(), [location.key]);
        assert.equal($gameVariables.value(900), terminal.parameters[4]);
        assert.deepEqual(inventory, []);
        assert.equal(messages.length, terminal.parameters[4] === 101 ? 1 : 0);
    }
    plugin.deactivate();
});

test("Nestor's late common-event resolution requires the original command list", () => {
    const original = $dataCommonEvents[183];
    const params = [448, 448, 0];
    const source = new FakeInterpreter(94, 40, 0, 10, 121, params);
    $dataCommonEvents[183] = { list: source._list };
    try {
        DataManager.setupNewGame();
        plugin.activateForDevelopment();
        currentEvent = null;
        const unrelated = new FakeInterpreter(94, 40, 0, 10, 121, params);
        unrelated.command121(params);
        assert.deepEqual(plugin.checkedKeys(), [], "Matching values on another list must stay vanilla");
        source.command121([448, 448, 1]);
        assert.deepEqual(plugin.checkedKeys(), [], "Different parameters must not resolve Nestor");
        source.command121(params);
        assert.deepEqual(plugin.checkedKeys(), ["simple_key_drop_153"]);
        const saved = DataManager.makeSaveContents();
        DataManager.extractSaveContents(saved);
        source.command121(params);
        assert.deepEqual(plugin.checkedKeys(), ["simple_key_drop_153"], "Reload/replay must not duplicate the check");
        DataManager.setupNewGame();
        source.command121(params);
        assert.deepEqual(plugin.checkedKeys(), [], "Inactive play must remain vanilla");
    } finally {
        $dataCommonEvents[183] = original;
        plugin.deactivate();
    }
});

test("reviewed guaranteed drops check only on victory and preserve unrelated loot", () => {
    const registry = require("../apworld/lookoutside/vertical_slice.json");
    const locations = registry.locations.filter(row => row.battle_drop);
    assert.ok(locations.length > 0);
    for (const location of locations) {
        const resolution = registry.quest_families.find(family => family.key === location.quest_family && family.resolve_on_acquisition);
        const expected = resolution ? resolution.location_keys : [location.key];
        for (const source of [location, ...(location.source_variants || [])]) {
            DataManager.setupNewGame();
            plugin.activateForDevelopment();
            const drop = location.battle_drop;
            const rare = { kind: 3, dataId: 232, denominator: 3 };
            const drops = Array.from({ length: drop.drop_index + 1 }, () =>
                ({ kind: 0, dataId: 1, denominator: 1 }));
            drops[drop.drop_index] = { kind: drop.kind, dataId: location.reward_database_id, denominator: 1 };
            drops.push(rare);
            battleHarness.configure(source.battle_parameters[1], [{ id: drop.enemy_id,
                drops }]);
            currentEvent = { _eventId: source.event_id, _pageIndex: source.page };
            const interpreter = new FakeInterpreter(source.map_id, source.event_id, source.page,
                source.command_index, 301, source.battle_parameters);
            interpreter.command301(source.battle_parameters);
            assert.deepEqual(plugin.checkedKeys(), []);
            assert.equal(BattleManager.members[0].makeDropItems().length, 2, "Preview remains vanilla");
            assert.deepEqual(plugin.checkedKeys(), []);
            assert.equal(BattleManager.processVictory(true), true, "Quiet victory argument is preserved");
            assert.deepEqual(plugin.checkedKeys(), expected);
            assert.deepEqual(battleHarness.trace.granted, [$dataArmors[232]]);
            assert.deepEqual(battleHarness.trace.endings, [0]);
            interpreter.command301(source.battle_parameters);
            BattleManager.processVictory();
            assert.deepEqual(plugin.checkedKeys(), expected, "Replay must not report a second check");
            assert.deepEqual(battleHarness.trace.displayed, [$dataArmors[232]]);
        }
    }
    plugin.deactivate();
});

test("drop hooks leave friendly kills, other encounters, escapes, and inactive sessions vanilla", () => {
    const location = require("../apworld/lookoutside/vertical_slice.json").locations.find(row => row.battle_drop);
    function configure(enemyId = location.battle_drop.enemy_id, troop = location.battle_parameters[1]) {
        battleHarness.configure(troop, [{ id: enemyId,
            drops: [{ kind: 2, dataId: location.reward_database_id, denominator: 1 }] }]);
    }
    function begin(overrides = {}) {
        const source = { ...location, ...overrides };
        currentEvent = { _eventId: source.event_id, _pageIndex: source.page };
        const interpreter = new FakeInterpreter(source.map_id, source.event_id, source.page,
            source.command_index, 301, source.battle_parameters);
        interpreter.command301(source.battle_parameters);
        return interpreter;
    }
    for (const overrides of [{ map_id: 999 }, { page: 99 }, { command_index: 99 }]) {
        DataManager.setupNewGame();
        plugin.activateForDevelopment();
        configure();
        begin(overrides);
        BattleManager.processVictory();
        assert.deepEqual(plugin.checkedKeys(), []);
        assert.equal(battleHarness.trace.granted.length, 1);
    }
    for (const result of [1, 2]) {
        DataManager.setupNewGame();
        plugin.activateForDevelopment();
        configure();
        begin();
        BattleManager.endBattle(result);
        assert.deepEqual(plugin.checkedKeys(), []);
        BattleManager.setup(location.battle_parameters[1]);
        BattleManager.processVictory();
        assert.deepEqual(plugin.checkedKeys(), []);
        assert.equal(battleHarness.trace.granted.length, 1, "Battle context must not leak after escape/loss");
    }
    DataManager.setupNewGame();
    plugin.activateForDevelopment();
    configure(14, 117);
    begin({ map_id: 132, event_id: 2, page: 1, command_index: 4,
        battle_parameters: [0, 117, true, false] });
    BattleManager.processVictory();
    assert.deepEqual(plugin.checkedKeys(), []);
    assert.equal(battleHarness.trace.granted.length, 1, "Even matching weapon types on Eugene stay vanilla");
    configure();
    begin();
    DataManager.setupNewGame();
    plugin.activateForDevelopment();
    BattleManager.processVictory();
    assert.deepEqual(plugin.checkedKeys(), []);
    assert.equal(battleHarness.trace.granted.length, 1, "New game clears any pending battle context");
    plugin.deactivate();
    configure();
    begin();
    BattleManager.processVictory();
    assert.deepEqual(plugin.checkedKeys(), []);
    assert.equal(battleHarness.trace.granted.length, 1);
});

test("Rat King and Straitjacket alternate outcomes reconcile without consuming vanilla supplies", () => {
    const registry = require("../apworld/lookoutside/vertical_slice.json");
    for (const key of ["map092_event045_quest_pickup", "map430_event016_quest_pickup"]) {
        const family = registry.quest_families.find(row => row.key === key);
        for (const terminal of family.terminals) {
            DataManager.setupNewGame();
            plugin.activateForDevelopment();
            currentEvent = { _eventId: terminal.event_id, _pageIndex: terminal.page };
            const interpreter = new FakeInterpreter(terminal.map_id, terminal.event_id, terminal.page,
                terminal.command_index, terminal.command_code, terminal.parameters);
            interpreter[`command${terminal.command_code}`](terminal.parameters);
            interpreter[`command${terminal.command_code}`](terminal.parameters);
            assert.deepEqual(plugin.checkedKeys(), [key]);
        }
    }
    inventory.length = 0;
    // Lumpy's alternate Cheese Man and every Ambrose consumable remain ordinary grants.
    new FakeInterpreter(430, 16, 2, 7, 126, [142, 0, 0, 1]).command126([142, 0, 0, 1]);
    currentEvent = { _eventId: 9, _pageIndex: 0 };
    const ambrose = registry.locations.find(row => row.key === "map442_event009_quest_pickup");
    for (const command of ambrose.vanilla_bundle) {
        new FakeInterpreter(442, 9, 0, command.command_index, 126, command.parameters)
            .command126(command.parameters);
    }
    assert.equal(inventory.length, 17);
    assert.ok(inventory.every(([kind]) => kind === "item"));
    plugin.deactivate();
});

test("boss salvage checks without Audrey and deduplicates every alternate encounter page", () => {
    const registry = require("../apworld/lookoutside/vertical_slice.json");
    const locations = registry.locations.filter(row => row.boss_salvage);
    assert.equal(locations.length, 9);
    for (const location of locations) {
        for (const audreyPresent of [false, true]) {
            DataManager.setupNewGame();
            plugin.activateForDevelopment();
            inventory.length = 0;
            const family = registry.quest_families.find(row => row.key === location.quest_family);
            for (const source of [location, ...(location.source_variants || [])]) {
                currentEvent = { _eventId: source.event_id, _pageIndex: source.page };
                if (audreyPresent) {
                    const params = [location.reward_database_id, 0, 0, 1, false];
                    new FakeInterpreter(source.map_id, source.event_id, source.page,
                        source.command_index, 128, params).command128(params);
                }
                const terminal = family.terminals.find(row => row.event_id === source.event_id &&
                    row.page === source.page);
                const resolution = new FakeInterpreter(source.map_id, source.event_id, source.page,
                    terminal.command_index, 412, []);
                assert.equal(resolution.command412([]), true);
                resolution.command412([]);
                assert.deepEqual(plugin.checkedKeys(), [location.key]);
                assert.deepEqual(inventory, []);
            }
        }
    }
    DataManager.setupNewGame();
    plugin.activateForDevelopment();
    const location = locations[0];
    currentEvent = { _eventId: location.event_id, _pageIndex: location.page };
    new FakeInterpreter(location.map_id, location.event_id, location.page,
        location.boss_salvage.terminal_index + 1, 412, []).command412([]);
    assert.deepEqual(plugin.checkedKeys(), []);
    $dataSystem.versionId++;
    new FakeInterpreter(location.map_id, location.event_id, location.page,
        location.boss_salvage.terminal_index, 412, []).command412([]);
    assert.deepEqual(plugin.checkedKeys(), []);
    $dataSystem.versionId--;
    plugin.deactivate();
    const params = [location.reward_database_id, 0, 0, 1, false];
    new FakeInterpreter(location.map_id, location.event_id, location.page,
        location.command_index, 128, params).command128(params);
    new FakeInterpreter(location.map_id, location.event_id, location.page,
        location.boss_salvage.terminal_index, 412, []).command412([]);
    assert.deepEqual(inventory, [["armor", location.reward_database_id]]);
    assert.deepEqual(plugin.checkedKeys(), []);
});

test("each Wilhelmina reward choice reconciles the family and retains the defeated switch", () => {
    const registry = require("../apworld/lookoutside/vertical_slice.json");
    const family = registry.quest_families.find(row => row.key === "wilhelmina_reward");
    const locations = registry.locations.filter(row => row.quest_family === family.key);
    assert.equal(locations.length, 5);
    for (const selected of locations) {
        DataManager.setupNewGame();
        plugin.activateForDevelopment();
        inventory.length = 0;
        switchValues.delete(1135);
        currentEvent = { _eventId: 2, _pageIndex: 1 };
        const params = [selected.reward_database_id, 0, 0, 1, false];
        new FakeInterpreter(169, 2, 1, selected.command_index, selected.command_code, params)
            [`command${selected.command_code}`](params);
        assert.deepEqual(plugin.checkedKeys(), [selected.key]);
        const terminal = family.terminals[0];
        const resolved = new FakeInterpreter(169, 2, 1, terminal.command_index, 121, terminal.parameters);
        resolved.command121(terminal.parameters);
        resolved.command121(terminal.parameters);
        assert.deepEqual([...plugin.checkedKeys()].sort(), [...family.location_keys].sort());
        assert.equal($gameSwitches.value(1135), true);
        assert.deepEqual(inventory, []);
    }
    plugin.deactivate();
});

test("deadline warnings distinguish expiring pickups from recoverable quests and persist offline checks", () => {
    DataManager.setupNewGame();
    currentDay = 3;
    variableValues.set(16, 12);
    switchValues.delete(1062);
    plugin.bindIdentityForDevelopment("calendar-deadlines", 0, 1);
    plugin.activateForDevelopment();
    const pending = plugin.remainingDeadlines();
    assert.equal(pending.length, 8);
    assert.ok(pending.every(entry => !entry.atRisk));
    assert.ok(pending.every(entry => !/joel|benjamin|madison|clint/i.test(entry.key)));
    pending[0].name = "Changed by caller";
    assert.notEqual(plugin.remainingDeadlines()[0].name, "Changed by caller");

    currentEvent = { _eventId: 30, _pageIndex: 0 };
    new FakeInterpreter(31, 30, 0, 4, 128, [7, 0, 0, 1, false])
        .command128([7, 0, 0, 1, false]);
    assert.equal(plugin.remainingDeadlines().length, 7);
    const save = DataManager.makeSaveContents();
    DataManager.setupNewGame();
    DataManager.extractSaveContents(save);
    assert.equal(plugin.remainingDeadlines().length, 7);
    assert.ok(!plugin.remainingDeadlines().some(entry => entry.key === "map031_event030_hoodie"));

    currentDay = 4;
    variableValues.set(16, 11);
    assert.ok(plugin.remainingDeadlines().every(entry => !entry.atRisk));
    variableValues.set(16, 12);
    assert.ok(plugin.remainingDeadlines().every(entry => entry.atRisk));
    variableValues.set(16, 4);
    switchValues.set(1062, true);
    assert.ok(plugin.remainingDeadlines().every(entry => entry.atRisk));
    switchValues.delete(1062);
    currentDay = 9;
    assert.ok(plugin.remainingDeadlines().every(entry => entry.atRisk), "Later reopening is a different map");
    plugin.deactivate();
    assert.deepEqual(plugin.remainingDeadlines(), []);
    DataManager.setupNewGame();
    currentDay = 1;
});
