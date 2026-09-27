"use strict";

module.exports = function nativeLateResolutionsProbe() {
    const assert = require("assert").strict, fs = require("fs"), ap = LookOutsideArchipelago;
    const gifts = [
        {tid: 347, page: 1, mid: 187, start: 0, end: 41, kind: "weapon", id: 96, key: "jean_pierre_greatsword"},
        {tid: 348, page: 1, mid: 187, start: 0, end: 44, kind: "armor", id: 245, key: "sylvain_elegant_cap"},
        {tid: 349, page: 1, mid: 187, start: 0, end: 23, kind: "armor", id: 243, key: "claire_breastplate"},
        {tid: 615, page: 7, mid: 86, start: 0, end: 19, kind: "weapon", id: 209, key: "darryl_legs"},
        {tid: 655, page: 0, mid: 56, start: 0, end: 105, kind: "armor", id: 289, key: "spider_husk_heart"}
    ];
    const fungus = gifts.slice(0, 3).map(r => r.key).sort();
    let scenarios = 0;
    function map(mid) {
        $dataMap = JSON.parse(fs.readFileSync(`data/Map${String(mid).padStart(3, "0")}.json`, "utf8"));
        DataManager.onLoad($dataMap); $gameMap.setup(mid);
    }
    function setup(active, g) {
        DataManager.setupNewGame(); $gameMessage.clear(); $gamePlayer.clearTransferInfo();
        $gameSwitches.setValue(401, true); $gameVariables.setValue(213, 2); map(g.mid);
        if (active) {
            ap.bindIdentityForDevelopment("late-resolutions", 0, 1); ap.activateForDevelopment();
            ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
        }
        BattleManager.setup(g.tid, true, false); $gameParty.onBattleStart();
    }
    function run(list, start, end, eid = 0, outcome, battleIndent = 0) {
        const before = JSON.stringify(list), it = new Game_Interpreter(), messages = [];
        it.setup(list, eid); it._index = start;
        if (outcome !== undefined) it._branch[battleIndent] = outcome;
        let steps = 0;
        while (it.currentCommand() && it._index <= end) {
            assert.ok(steps++ < 700, "Resolution event did not finish");
            const code = it.currentCommand().code;
            if (code === 340) break;
            if ([0, 101, 102, 111, 118, 119, 121, 122, 123, 126, 127, 128, 333,
                 402, 404, 411, 412, 601, 602, 604].includes(code) ||
                (code === 355 && list === $dataCommonEvents[196].list)) {
                it.executeCommand(); messages.push(...$gameMessage._texts);
                if ($gameMessage.isChoice()) $gameMessage.onChoice(0);
                $gameMessage.clear();
            } else it._index++;
        }
        assert.equal(JSON.stringify(list), before);
        return messages;
    }
    function gift(g) { return run($dataTroops[g.tid].pages[g.page].list, g.start, g.end); }
    function object(g) { return (g.kind === "weapon" ? $dataWeapons : $dataArmors)[g.id]; }
    function receive(g) {
        ap.queueReceivedItemsForDevelopment(0, [{item: (g.kind === "weapon" ? 540100000 : 540200000) + g.id}]);
        ap.deliverPendingForDevelopment(); assert.equal(ap.pendingItems().length, 0);
    }
    function reload() {
        DataManager.extractSaveContents(JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents())));
        ap.configureItemDefinitionsForDevelopment(ap.developmentData().itemDefinitions);
    }
    function checked(keys) { assert.deepEqual(ap.checkedKeys().sort(), keys.slice().sort()); }
    for (const g of gifts.slice(0, 3)) for (const active of [false, true]) for (const papineau of [false, true]) {
        setup(active, g);
        if (papineau) $gameParty.addActor(13);
        $gameTroop.members()[0].addState(1);
        const text = gift(g);
        checked(active ? [g.key] : []);
        assert.equal($gameParty.numItems(object(g)), !active && (papineau || g.tid === 349) ? 1 : 0);
        assert.equal(text.includes("Archipelago location checked."), active, "Alternate rescue notice stayed vanilla");
        if (active) { receive(g); reload(); receive(g); assert.equal($gameParty.numItems(object(g)), 1); }
        scenarios++;
    }
    // Exposing the illusion with Ernest or defeating its Mother closes all unreached rescues.
    for (const active of [false, true]) for (const route of ["mother", "ernest", "no-ernest"]) {
        setup(active, gifts[0]); $gameParty.onBattleEnd();
        if (route === "mother") {
            map(127); run($dataMap.events[2].pages[1].list, 2, 10, 2);
        } else {
            map(83); $gameVariables.setValue(637, 1); $gameVariables.setValue(634, 1);
            if (route === "ernest") $gameParty.addActor(26);
            run($dataMap.events[25].pages[0].list, 0, 16, 25);
        }
        checked(active && route !== "no-ernest" ? fungus : []);
        assert.equal($gameSwitches.value(199), route !== "no-ernest");
        scenarios++;
    }
    // Receiving originals early/late leaves the original CE196 conversion intact.
    for (const g of gifts.slice(0, 3)) for (const early of [false, true]) {
        setup(true, g); $gameTroop.members()[0].addState(1);
        if (early) receive(g);
        gift(g); if (!early) receive(g);
        $gameParty.onBattleEnd();
        run($dataCommonEvents[196].list, 0, 17);
        const changedId = {96: 97, 245: 246, 243: 244}[g.id];
        const changed = (g.kind === "weapon" ? $dataWeapons : $dataArmors)[changedId];
        assert.equal($gameParty.numItems(object(g)), 0); assert.equal($gameParty.numItems(changed), 1);
        reload(); receive(g); run($dataCommonEvents[196].list, 0, 17);
        assert.equal($gameParty.numItems(object(g)), 0); assert.equal($gameParty.numItems(changed), 1);
        checked([g.key]); scenarios++;
    }
    for (const active of [false, true]) for (const patient of [false, true]) for (const page of [0, 1]) {
        const g = gifts[3]; setup(active, g); $gameSwitches.setValue(995, patient);
        gift(g);
        assert.equal($gameParty.numItems(object(g)), !active && patient ? 1 : 0);
        checked(active && patient ? [g.key] : []);
        $gameParty.onBattleEnd(); run($dataMap.events[104].pages[page].list, 2, 13, 104, 0);
        checked(active ? [g.key] : []); assert.equal($gameSwitches.value(831), true);
        scenarios++;
    }
    for (const active of [false, true]) for (const page of [0, 1]) {
        setup(active, gifts[3]); $gameParty.onBattleEnd();
        run($dataMap.events[104].pages[page].list, 2, 13, 104, 1);
        checked([]); assert.equal($gameSwitches.value(831), false); scenarios++;
    }
    for (const active of [false, true]) for (const gender of [0, 1, 2, 3]) {
        const g = gifts[4]; setup(active, g); $gameVariables.setValue(874, 25); $gameVariables.setValue(875, gender);
        gift(g); gift(g); checked(active ? [g.key] : []);
        assert.equal($gameParty.numItems(object(g)), active ? 0 : 1);
        assert.equal($gameVariables.value(874), 26);
        if (active) { receive(g); reload(); receive(g); assert.equal($gameParty.numItems(object(g)), 1); }
        scenarios++;
    }
    for (const active of [false, true]) for (const outcome of [0, 1]) {
        setup(active, gifts[4]); $gameParty.onBattleEnd(); map(351);
        run($dataMap.events[7].pages[0].list, 5, 11, 7, outcome);
        checked(active && outcome === 0 ? [gifts[4].key] : []);
        assert.equal($gameSwitches.value(1083), outcome === 0); scenarios++;
    }
    for (const g of gifts.slice(3)) {
        setup(true, g); receive(g);
        assert.equal($gameVariables.value(874), 0); assert.equal($gameSwitches.value(831), false);
        $gameSwitches.setValue(995, true); $gameVariables.setValue(874, 25);
        gift(g); reload(); receive(g);
        assert.equal($gameParty.numItems(object(g)), 1); checked([g.key]); scenarios++;
    }
    for (const g of gifts) for (const guard of ["clone", "wrong-troop", "wrong-build"]) {
        setup(true, g); $gameParty.addActor(13); $gameTroop.members()[0].addState(1);
        $gameSwitches.setValue(995, true); $gameVariables.setValue(874, 25);
        let list = $dataTroops[g.tid].pages[g.page].list;
        if (guard === "clone") list = JSON.parse(JSON.stringify(list));
        if (guard === "wrong-troop") {
            BattleManager.setup(g.tid === 347 ? 348 : 347, true, false); $gameTroop.members()[0].addState(1);
        }
        const version = $dataSystem.versionId;
        try {
            if (guard === "wrong-build") $dataSystem.versionId++;
            run(list, g.start, g.end); checked([]);
            assert.equal($gameParty.numItems(object(g)), 1);
        } finally { $dataSystem.versionId = version; }
        scenarios++;
    }
    return {scenarios, rescues: 12, illusionResolution: 6, nativeTransformations: 6,
            darrylVictories: 8, darrylEscapes: 4, huskGifts: 8, huskCombat: 4, earlyDelivery: 2, sourceGuards: 15};
};
