"use strict";

module.exports = async function nativeMenuProbe(slotData) {
    const assert = require("assert").strict;
    const ap = LookOutsideArchipelago;
    const originalSocket = globalThis.WebSocket;
    const preferencesKey = "lookOutsideArchipelagoConnection";
    const originalPreferences = localStorage.getItem(preferencesKey);
    const fs = require("fs");
    const sockets = [];
    const originalUpdateScene = SceneManager.updateScene;
    let scenarios = 0;
    class TestSocket {
        constructor(url) { this.url = url; this.readyState = 1; this.sent = []; sockets.push(this); }
        send(text) { this.sent.push(...JSON.parse(text)); }
        close() { this.readyState = 3; this.onclose?.(); }
        server(packet) { this.onmessage({ data: JSON.stringify([packet]) }); }
    }
    const waitForRefresh = () => new Promise(resolve => setTimeout(resolve, 450));
    function menu() {
        const scene = new Scene_Menu();
        scene.create();
        scene.popped = false;
        scene.popScene = () => { scene.popped = true; };
        return scene;
    }
    const dialog = () => document.querySelector("#loa-ap-dialog");
    const control = selector => dialog().querySelector(selector);
    function submit(url, name = "Menu Test", password = "") {
        control("#loa-ap-url").value = url;
        control("#loa-ap-name").value = name;
        control("#loa-ap-password").value = password;
        control("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
    try {
        // Isolate the menu fixture from the currently displayed title/map scene
        // while the dialog's asynchronous status refresh is being exercised.
        SceneManager.updateScene = () => {};
        globalThis.WebSocket = TestSocket;
        localStorage.removeItem(preferencesKey);
        DataManager.setupNewGame();
        $gameMessage.clear();
        $dataMap = JSON.parse(fs.readFileSync("data/Map003.json", "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(3);
        // The normal menu opens after the apartment's arrival events finish.
        for (const event of $gameMap.events()) event.clearStartingFlag();
        let scene = menu();
        scene._commandWindow.callHandler("loaConnect");
        assert.ok(dialog().open);
        assert.equal(scene._commandWindow.active, false);
        assert.ok(["loa-ap-name", "loa-ap-url"].includes(document.activeElement.id), "A connection field must receive focus");
        assert.equal(control("#loa-ap-password").type, "password");
        document.activeElement.dispatchEvent(new KeyboardEvent("keydown", {
            key: "x", keyCode: 88, bubbles: true,
        }));
        assert.ok(!Input._currentState.escape, "Typing in the dialog leaked into the game");
        scenarios++;

        submit("https://example.invalid:38281");
        assert.equal(sockets.length, 0);
        assert.match(control(".loa-error").textContent, /connection settings/);
        scenarios++;

        submit("localhost:38304", " Menu Test ", "local-probe-password");
        const socket = sockets.at(-1);
        assert.equal(socket.url, "ws://localhost:38304");
        socket.server({ cmd: "RoomInfo", seed_name: "native-menu-probe" });
        assert.equal(socket.sent[0].name, "Menu Test");
        assert.equal(socket.sent[0].password, "local-probe-password");
        socket.server({ cmd: "Connected", team: 0, slot: 1, checked_locations: [], slot_data: slotData });
        await waitForRefresh();
        assert.equal(ap.connectionState, "connected");
        assert.match(control(".loa-status").textContent, /Archipelago: connected/);
        assert.match(control(".loa-status").textContent, /native-menu-probe/);
        assert.equal(control("#loa-ap-password").value, "");
        assert.deepEqual(JSON.parse(localStorage.getItem(preferencesKey)), {
            url: "ws://localhost:38304", name: "Menu Test",
        });
        scenarios++;

        const items = [{ item: 540100015 }, { item: 540000301 }];
        socket.server({ cmd: "ReceivedItems", index: 0, items });
        ap.deliverPendingForDevelopment();
        ap.presentItemsForDevelopment();
        assert.match(document.querySelector("#loa-ap-receipt").textContent, /Baseball Bat\nPadlock Key/);
        await waitForRefresh();
        assert.equal(control(".loa-recent").hidden, false);
        assert.equal(control(".loa-recent div").textContent, "Padlock Key\nBaseball Bat");
        socket.server({ cmd: "ReceivedItems", index: 0, items });
        ap.deliverPendingForDevelopment();
        document.querySelector("#loa-ap-receipt").expiresAt = 0;
        ap.presentItemsForDevelopment();
        assert.equal(document.querySelector("#loa-ap-receipt"), null, "Replay showed a second delivery notice");
        assert.equal($gameParty.numItems($dataWeapons[15]), 1);
        scenarios++;

        $gameParty.gainItem($dataWeapons[15], 98);
        socket.server({ cmd: "ReceivedItems", index: 2, items: [items[0]] });
        ap.deliverPendingForDevelopment();
        ap.presentItemsForDevelopment();
        assert.equal(ap.pendingItems().length, 1);
        assert.equal(document.querySelector("#loa-ap-receipt"), null, "Undelivered item showed a receipt");
        $gameParty.gainItem($dataWeapons[15], -1);
        ap.deliverPendingForDevelopment();
        ap.presentItemsForDevelopment();
        assert.equal(ap.pendingItems().length, 0);
        assert.match(document.querySelector("#loa-ap-receipt").textContent, /Baseball Bat/);
        scenarios++;

        submit("ws://bad:invalid-port");
        assert.equal(ap.connectionState, "connected");
        assert.equal(socket.readyState, 1, "Invalid settings disconnected the working session");
        assert.equal(sockets.length, 1);
        globalThis.WebSocket = class { constructor() { throw new Error("Probe socket failure"); } };
        submit("ws://localhost:38304");
        assert.equal(ap.connectionState, "connected");
        assert.equal(socket.readyState, 1);
        assert.match(control(".loa-error").textContent, /Probe socket failure/);
        globalThis.WebSocket = TestSocket;
        scenarios++;

        control(".loa-disconnect").click();
        assert.equal(ap.connectionState, "disconnected");
        assert.ok(ap.active);
        assert.equal(ap.identity().seedName, "native-menu-probe");
        control(".loa-close").click();
        assert.equal(dialog(), null);
        assert.equal(scene._commandWindow.active, true);
        scenarios++;

        scene._commandWindow.callHandler("loaStatus");
        assert.equal(control("#loa-ap-name").value, "Menu Test");
        assert.equal(control("#loa-ap-password").value, "");
        control("#loa-ap-name").dispatchEvent(new KeyboardEvent("keydown", {
            key: "Escape", keyCode: 27, bubbles: true, cancelable: true,
        }));
        assert.equal(dialog(), null);
        assert.equal(scene._commandWindow.active, true);
        scenarios++;

        $gameVariables.setValue(15, 3);
        $gameVariables.setValue(16, 4);
        const interpreter = new Game_Interpreter();
        interpreter.setup($dataCommonEvents[4].list, 0);
        interpreter._index = 59;
        interpreter.command122([15, 15, 1, 0, 1]);
        interpreter._index = 135;
        interpreter.command117([6]);
        assert.ok(ap.dayHold);
        scene = menu();
        scene._commandWindow.callHandler("loaNextDay");
        assert.equal(document.activeElement, control(".loa-close"));
        assert.equal(control(".loa-deadlines").hidden, false);
        assert.equal(control(".loa-deadlines").open, true);
        assert.match(control(".loa-description").textContent, /Vanilla quest deadlines still apply/);
        assert.match(control(".loa-description").textContent, /unfinished quests do not advance afterward/);
        assert.match(control(".loa-deadlines summary").textContent, /not a complete list/);
        const actionBounds = control(".loa-actions").getBoundingClientRect();
        assert.ok(actionBounds.top >= 0 && actionBounds.bottom <= innerHeight,
            "Day-advance actions must remain visible with the expanded warning");
        assert.match(control(".loa-deadlines div").textContent, /8 unchecked/);
        assert.match(control(".loa-deadlines div").textContent, /noon on Day 4/);
        assert.match(control(".loa-deadlines div").textContent, /Jawbone Club/);
        assert.doesNotMatch(control(".loa-deadlines div").textContent, /Joel Resolution|Benjamin|Madison/);
        control(".loa-close").click();
        assert.equal($gameVariables.value(15), 3);
        assert.ok(ap.dayHold);
        assert.equal(scene.popped, false);
        scenarios++;

        scene._commandWindow.callHandler("loaNextDay");
        for (const event of $gameMap.events()) event.clearStartingFlag();
        control("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        assert.equal($gameVariables.value(15), 4, JSON.stringify({ error: dialog()?.querySelector(".loa-error").textContent,
            eventRunning: $gameMap.isEventRunning(), reserved: $gameTemp._commonEventQueue }));
        assert.equal(ap.dayHold, false);
        assert.equal(scene.popped, true);
        assert.equal(dialog(), null);
        assert.ok($gameTemp.isCommonEventReserved());
        $gameTemp.clearCommonEventReservation();
        scenarios++;

        $gameVariables.setValue(16, 12);
        scene = menu();
        scene._commandWindow.callHandler("loaStatus");
        assert.match(control(".loa-deadlines div").textContent, /Access may already be lost/);
        control(".loa-close").click();
        scenarios++;

        DataManager.setupNewGame();
        scene = menu();
        scene._commandWindow.callHandler("loaConnect");
        DataManager.setupNewGame();
        assert.equal(dialog(), null, "New game left the previous save's dialog open");
        scenarios++;
        return { scenarios };
    } finally {
        DataManager.setupNewGame();
        globalThis.WebSocket = originalSocket;
        SceneManager.updateScene = originalUpdateScene;
        if (originalPreferences === null) localStorage.removeItem(preferencesKey);
        else localStorage.setItem(preferencesKey, originalPreferences);
    }
};
