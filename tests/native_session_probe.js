"use strict";

// Uses the staged game's native compressed save files, not an in-memory copy.
module.exports = async function nativeSessionProbe() {
    const assert = require("assert").strict, fs = require("fs"), ap = LookOutsideArchipelago;
    const oldUpdate = SceneManager.updateScene, oldPush = SceneManager.push;
    const oldAlert = globalThis.alert, oldSocket = globalThis.WebSocket;
    const path = require("path");
    assert.ok(path.resolve(StorageManager.fileDirectoryPath()).startsWith(path.resolve(process.cwd()) + path.sep));
    let scenarios = 0, sockets = 0, saveScreens = 0, loadAlerts = 0;
    SceneManager.updateScene = () => {};
    SceneManager.push = scene => { assert.equal(scene, Scene_Save); saveScreens++; };
    globalThis.alert = text => { assert.match(text, /save|Save/); loadAlerts++; };
    globalThis.WebSocket = class { constructor() { sockets++; throw new Error("Offline probe must not connect"); } };
    function setup(mid = 3, bind = true) {
        DataManager.setupNewGame(); $gameMessage.clear();
        $gameSwitches.setValue(401, true); $gameVariables.setValue(213, 2);
        $dataMap = JSON.parse(fs.readFileSync(`data/Map${String(mid).padStart(3, "0")}.json`, "utf8"));
        DataManager.onLoad($dataMap); $gameMap.setup(mid); $gamePlayer.clearTransferInfo();
        if (bind) { ap.bindIdentityForDevelopment("native-session", 0, 1); ap.activateForDevelopment(); }
    }
    async function roundTrip() {
        $gameSystem.onBeforeSave();
        await DataManager.saveGame(98);
        await DataManager.loadGame(98);
    }
    function source(eid, pg, index) {
        const it = new Game_Interpreter(); it.setup($dataMap.events[eid].pages[pg].list, eid); it._index = index;
        return it;
    }
    try {
        setup();
        const bat = $dataWeapons[15], capacity = $gameParty.maxItems(bat);
        $gameParty.gainItem(bat, capacity);
        ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
        ap.queueReceivedItemsForDevelopment(0, [{item: 540100015}]); ap.deliverPendingForDevelopment();
        assert.equal(ap.pendingItems().length, 1);
        await roundTrip();
        assert.equal(ap.connectionState, "disconnected"); assert.equal(ap.pendingItems().length, 1);
        $gameParty.loseItem(bat, 1); ap.deliverPendingForDevelopment(); ap.deliverPendingForDevelopment();
        assert.equal($gameParty.numItems(bat), capacity); assert.equal(ap.pendingItems().length, 0);
        assert.equal(ap.nextItemIndex, 1); assert.equal(sockets, 0);
        await roundTrip(); ap.queueReceivedItemsForDevelopment(0, [{item: 540100015}]);
        assert.equal(ap.pendingItems().length, 0); scenarios++;

        const good = JsonEx.stringify(DataManager.makeSaveContents());
        for (const mutation of [
            c => c.lookOutsideArchipelago.schema = 6,
            c => c.lookOutsideArchipelago.compatibility.registryVersion++,
            c => delete c.lookOutsideArchipelago.compatibility,
            c => c.lookOutsideArchipelago.pendingItems = [{index: 0, item: {item: 999999}}],
        ]) {
            const bad = JsonEx.parse(good); mutation(bad); bad.variables.setValue(501, 12345);
            await StorageManager.saveObject("file99", bad);
            const bytes = fs.readFileSync(StorageManager.filePath("file99"));
            await assert.rejects(DataManager.loadGame(99), /Unsupported|differs/);
            assert.equal(ap.active, false); assert.notEqual($gameVariables.value(501), 12345);
            assert.throws(() => DataManager.makeSaveContents(), /Unsupported|differs/);
            assert.deepEqual(fs.readFileSync(StorageManager.filePath("file99")), bytes);
            Scene_Load.prototype.onLoadFailure.call({activateListWindow() {}});
            scenarios++;
        }
        for (const field of ["versionId", "gameId"]) {
            const object = field === "gameId" ? $dataSystem.advanced : $dataSystem;
            object[field]++;
            try { await assert.rejects(DataManager.loadGame(98), /audited build/); }
            finally { object[field]--; }
            scenarios++;
        }
        await DataManager.loadGame(98); assert.equal(ap.active, true);

        setup(23, false); source(41, 0, 7).executeCommand();
        assert.equal($gameParty.numItems(bat), 1); await roundTrip();
        assert.throws(() => ap.bindIdentityForDevelopment("late", 0, 1), /not eligible/);
        assert.equal(ap.identity(), null); scenarios++;
        setup(3, false); const vanilla = DataManager.makeSaveContents(); delete vanilla.lookOutsideArchipelagoStart;
        await StorageManager.saveObject("file99", vanilla); await DataManager.loadGame(99);
        assert.throws(() => ap.bindIdentityForDevelopment("legacy", 0, 1), /not eligible/); scenarios++;
        setup(3, false); await roundTrip(); ap.bindIdentityForDevelopment("pristine", 0, 1); scenarios++;

        // Native permitted save points: bed's Sleeping CE9 and Sybil's conversation.
        // Reach the real save commands directly, skipping preceding story presentation.
        for (const point of ["bed", "sybil"]) {
            setup();
            let it = $gameMap._interpreter;
            if (point === "bed") {
                it.setup($dataMap.events[66].pages[0].list, 66); it._index = 77; it.executeCommand();
                it = it._childInterpreter; assert.equal(it._list, $dataCommonEvents[9].list); it._index = 226;
            } else { it.setup($dataMap.events[65].pages[1].list, 65); it._index = 13; }
            it.executeCommand(); await roundTrip();
            const root = $gameMap._interpreter;
            const loaded = point === "bed" ? root._childInterpreter : root;
            const canonical = point === "bed" ? $dataCommonEvents[9].list : $dataMap.events[65].pages[1].list;
            assert.notEqual(loaded._list, canonical, "Disk serialization must reconstruct the command array");
            loaded.executeCommand(); assert.equal(loaded._list, canonical);
            // A subsequent shared pickup still checks once and never gives the vanilla reward.
            $gameVariables.setValue(496, 3); source(88, 0, 24).executeCommand();
            assert.ok(ap.checkedKeys().includes("home_bookshelf_screamatorium"));
            assert.equal($gameParty.numItems($dataItems[423]), 0);
            scenarios++;
        }
        assert.equal(saveScreens, 2);

        // Focused continuation fixtures also cover a pending clock write and
        // reward; these are deliberately not claimed as ordinary save points.
        for (const kind of ["clock", "reward", "changed-list", "bare-copy"]) {
            setup(); $gameVariables.setValue(15, 7); $gameVariables.setValue(496, 3);
            const root = $gameMap._interpreter;
            const canonical = kind === "clock" ? $dataCommonEvents[4].list : $dataMap.events[88].pages[0].list;
            root.setup(kind === "bare-copy" ? JsonEx.parse(JsonEx.stringify(canonical)) : canonical, kind === "clock" ? 0 : 88);
            root._index = kind === "clock" ? 59 : 24;
            await roundTrip();
            const loaded = $gameMap._interpreter;
            if (kind === "changed-list") {
                loaded._list[0].parameters.push("changed");
                assert.throws(() => loaded.executeCommand(), /Cannot safely resume/);
                assert.equal($gameParty.numItems($dataItems[423]), 0);
            } else {
                loaded.executeCommand();
                if (kind === "clock") {
                    assert.equal($gameVariables.value(15), 7); assert.equal(ap.pendingDayRollover, true);
                } else {
                    assert.equal(ap.checkedKeys().includes("home_bookshelf_screamatorium"), kind === "reward");
                    assert.equal($gameParty.numItems($dataItems[423]), kind === "bare-copy" ? 1 : 0);
                }
            }
            scenarios++;
        }
        return {scenarios, nativeSavePoints: saveScreens, loadAlerts, socketsCreated: sockets,
            nativeCompressedDiskSaves: true};
    } finally {
        SceneManager.updateScene = oldUpdate; SceneManager.push = oldPush;
        globalThis.alert = oldAlert; globalThis.WebSocket = oldSocket;
        DataManager.setupNewGame();
    }
};
