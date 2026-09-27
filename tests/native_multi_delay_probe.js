"use strict";

// Registry74 seed171: A's Deep Basement Creature sends Rose to B.
// Controlled day/event fixtures, not a complete chronological playthrough.
module.exports = async function nativeMultiDelayProbe(url) {
    const assert = require("assert").strict, fs = require("fs"), ap = LookOutsideArchipelago;
    const oldUpdate = SceneManager.updateScene;
    const peerItems = [], peerChecks = new Set();
    let peer, peerConnected = false;
    const wait = predicate => new Promise((resolve, reject) => {
        const started = Date.now();
        const timer = setInterval(() => {
            if (predicate()) { clearInterval(timer); resolve(); }
            else if (Date.now() - started > 10000) { clearInterval(timer); reject(new Error(`Multiworld timeout: ${ap.connectionError}`)); }
        }, 20);
    });
    function loadMap(id) {
        $dataMap = JSON.parse(fs.readFileSync(`data/Map${String(id).padStart(3, "0")}.json`, "utf8"));
        DataManager.onLoad($dataMap); $gameMap.setup(id); $gamePlayer.clearTransferInfo();
    }
    const options = {url, name: "LookOutside_B", uuid: "native-delay-B", autoReconnect: false};
    try {
        SceneManager.updateScene = () => {};
        DataManager.setupNewGame(); $gameMessage.clear();
        $gameSwitches.setValue(401, true); $gameVariables.setValue(213, 2); loadMap(272);
        ap.connectForDevelopment(options);
        await wait(() => ap.connectionState === "connected");
        assert.equal(ap.checkedKeys().length, 0); assert.equal(ap.nextItemIndex, 0);
        peer = new WebSocket(url);
        peer.onmessage = event => {
            for (const packet of JSON.parse(event.data)) {
                if (packet.cmd === "RoomInfo") peer.send(JSON.stringify([{cmd: "Connect", game: "Look Outside",
                    name: "LookOutside_A", uuid: "native-delay-A", password: "", items_handling: 7,
                    version: {major: 0, minor: 6, build: 7, class: "Version"}, tags: [], slot_data: true}]));
                if (packet.cmd === "Connected") peerConnected = true;
                if (packet.cmd === "ReceivedItems") packet.items.forEach((item, i) => peerItems[packet.index + i] = item);
                for (const id of packet.checked_locations || []) peerChecks.add(id);
            }
        };
        await wait(() => peerConnected);

        // Execute the native HourPassed Day7 / 10:00 earthquake condition.
        $gameVariables.setValue(15, 7); $gameVariables.setValue(16, 10);
        const hour = new Game_Interpreter(); hour.setup($dataCommonEvents[5].list, 0); hour._index = 334;
        for (let i = 0; i < 4; i++) hour.executeCommand();
        assert.equal($gameSwitches.value(1097), true);
        assert.equal($gameParty.numItems($dataItems[360]), 0);
        peer.send(JSON.stringify([{cmd: "LocationChecks", locations: [591000017]}]));
        await wait(() => ap.pendingItems().some(entry => entry.item.item === 540000360));
        ap.deliverPendingForDevelopment();
        assert.equal($gameParty.numItems($dataItems[360]), 1);
        const gate = new Game_Interpreter(); gate.setup($dataMap.events[7].pages[0].list, 7);
        gate.executeCommand(); gate.executeCommand();
        assert.equal($gamePlayer._newMapId, 399, "Late Rose must not reopen Charan's old pit");
        assert.equal(ap.checkedKeys().length, 0);

        $gameSystem.onBeforeSave(); await DataManager.saveGame(98); await DataManager.loadGame(98);
        assert.equal(ap.connectionState, "disconnected");
        $gameVariables.setValue(15, 15); $gameVariables.setValue(899, 2);
        loadMap(3);
        const door = new Game_Interpreter(); door.setup($dataMap.events[9].pages[2].list, 9); door._index = 10;
        door.executeCommand(); assert.equal($gamePlayer._newMapId, 172);
        loadMap(172);
        const ending = new Game_Interpreter(); ending.setup($dataMap.events[1].pages[0].list, 1); ending._index = 154;
        assert.equal(ending.currentCommand().code, 201); ending.executeCommand();
        assert.equal($gamePlayer._newMapId, 168); loadMap(168);
        assert.equal(ap.goalCompleted, true);
        $gameSystem.onBeforeSave(); await DataManager.saveGame(98); await DataManager.loadGame(98);
        assert.equal(ap.goalCompleted, true); assert.equal(ap.connectionState, "disconnected");
        ap.connectForDevelopment(options);
        await wait(() => ap.checkedKeys().length === 273 && peerItems.filter(Boolean).length > 0);
        assert.equal($gameVariables.value(899), 2); assert.equal($gameSwitches.value(1097), true);
        assert.equal($gameParty.numItems($dataItems[360]), 1);
        assert.equal(peerChecks.size, 1, "B's release must not collect unchecked A locations");
        assert.match(ap.goalReleaseSummary(), /acknowledged all checks/);
        return {seed: 171, delayedItem: "Rose", receivedAfterNativeDeadline: true,
            nativeDestinationAfterDeadline: 399, offlineEndingReload: true,
            releasedChecks: ap.checkedKeys().length, itemsSentToOtherPlayer: peerItems.filter(Boolean).length,
            otherPlayerChecks: peerChecks.size, nativeQuestStagesUnchanged: true};
    } finally {
        peer?.close(); DataManager.setupNewGame(); SceneManager.updateScene = oldUpdate;
    }
};
