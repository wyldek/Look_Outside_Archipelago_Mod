"use strict";

module.exports = function nativeCharacterResolutionProbe() {
    const assert = require("assert").strict;
    const fs = require("fs");
    const ap = LookOutsideArchipelago;
    const groups = {
        frederic: ["frederic_painters_key", "frederic_canvas_bag", "frederic_paint_palette"],
        jasper: ["jasper_apartment_key", "ritual_roof_key", "ritual_dark_robes"],
        pierre: ["pierre_clown_drawing", "pierre_old_mail", "pierre_clown_wig"],
        benjamin: ["benjamin_game", "benjamin_pendant"],
        shadow: ["shadow_tongue", "map006_event040_complex", "map006_event040_quest_item"],
        clint: ["clint_rags", "clint_tooth_knife"],
        madison: ["madison_tooth_hammer"],
    };
    const originalPush = SceneManager.push;
    SceneManager.push = function(scene) {
        if (scene !== Scene_Battle) return originalPush.call(this, scene);
    };
    let battles = 0, dialogue = 0, saves = 0;
    function setup(active, mid, tid) {
        DataManager.setupNewGame();
        $gameMessage.clear();
        $gamePlayer.clearTransferInfo();
        $dataMap = JSON.parse(fs.readFileSync(`data/Map${String(mid).padStart(3, "0")}.json`, "utf8"));
        DataManager.onLoad($dataMap);
        $gameMap.setup(mid);
        $gameVariables.setValue(15, 2);
        if (active) {
            ap.bindIdentityForDevelopment("character-resolutions", 0, 1);
            ap.activateForDevelopment();
        }
        if (tid) {
            BattleManager.setup(tid, true, true);
            $gameParty.onBattleStart();
        }
    }
    function expect(keys) {
        assert.deepEqual([...ap.checkedKeys()].sort(), [...keys].sort());
    }
    function run(list, eid, start, end, choose = () => 0, before = () => {}) {
        const original = JSON.stringify(list);
        const interpreter = new Game_Interpreter();
        interpreter.setup(list, eid);
        interpreter._index = start;
        let steps = 0;
        while (interpreter._index <= end && interpreter.currentCommand()) {
            assert.ok(steps++ < 1800, "Character dialogue did not terminate");
            const code = interpreter.currentCommand().code;
            before(interpreter._index);
            if ([0, 101, 102, 111, 118, 119, 121, 122, 123, 125, 126, 127, 128, 311, 313,
                340, 402, 404, 411, 412, 601, 602, 603, 604].includes(code)) {
                interpreter.executeCommand();
                if ($gameMessage.isChoice()) $gameMessage.onChoice(choose($gameMessage.choices()));
                $gameMessage.clear();
            } else interpreter._index++;
            if (code === 340) break;
        }
        assert.equal(JSON.stringify(list), original);
        return interpreter;
    }
    function battle(mid, eid, page, index, result) {
        const list = $dataMap.events[eid].pages[page].list;
        const interpreter = new Game_Interpreter();
        interpreter.setup(list, eid);
        interpreter._index = index;
        interpreter.executeCommand();
        for (const enemy of $gameTroop.members()) enemy.setHp(0);
        if (result === 0) BattleManager.processVictory(true);
        else BattleManager.endBattle(result);
        // Preserve the real battle callback's branch result when resuming.
        const resume = new Game_Interpreter();
        resume.setup(list, eid);
        resume._index = index + 1;
        resume._branch = interpreter._branch;
        while (resume.currentCommand() && resume._index < list.length - 1) {
            const code = resume.currentCommand().code;
            if ([0, 101, 111, 121, 122, 123, 126, 128, 311, 313, 411, 412,
                601, 602, 603, 604].includes(code)) {
                resume.executeCommand();
                $gameMessage.clear();
            } else resume._index++;
        }
    }
    try {
        // Reaching the bag is an intermediate milestone, not the palette finale.
        for (const active of [false, true]) {
            setup(active, 96, 327);
            $gameVariables.setValue(305, 0);
            run($dataTroops[327].pages[0].list, 0, 73, 104);
            expect(active ? groups.frederic.slice(0, 1) : []);
            $gameVariables.setValue(305, 2);
            run($dataTroops[327].pages[0].list, 0, 164, 180);
            expect(active ? groups.frederic.slice(0, 2) : []);
            assert.equal($gameSwitches.value(233), true);
            assert.equal($gameSwitches.value(188), !active);
            $gameVariables.setValue(305, 4);
            $gameVariables.setValue(306, 0);
            run($dataTroops[327].pages[0].list, 0, 221, 236);
            expect(active ? groups.frederic : []);
            assert.equal($gameParty.numItems($dataArmors[271]), active ? 0 : 1);
            if (active) {
                $gameParty.onBattleEnd();
                DataManager.extractSaveContents(JsonEx.parse(JsonEx.stringify(DataManager.makeSaveContents())));
                expect(groups.frederic);
                // A later native gift must not duplicate its vanilla reward.
                BattleManager.setup(327, true, false);
                $gameParty.onBattleStart();
                $gameVariables.setValue(305, 5);
                run($dataTroops[327].pages[0].list, 0, 230, 232);
                expect(groups.frederic);
                assert.equal($gameParty.numItems($dataArmors[271]), 0);
                saves++;
            }
            dialogue++;
        }
        for (const active of [false, true]) for (const page of [0, 1, 2]) {
            for (const result of [0, 1, 2]) for (const alreadyOwned of [false, true]) {
                setup(active, 96);
                $gameSwitches.setValue(233, alreadyOwned);
                $gameSwitches.setValue(188, alreadyOwned);
                battle(96, 12, page, 3, result);
                expect(active && result === 0 ? groups.frederic : []);
                assert.equal($gameParty.numItems($dataItems[341]), !active && !alreadyOwned && result === 0 ? 1 : 0);
                assert.equal($gameSwitches.value(188), alreadyOwned || (!active && result === 0));
                assert.equal($gameVariables.value(305), result === 0 ? 99 : 0);
                battles++;
            }
        }
        for (const active of [false, true]) for (const choice of [0, 1]) {
            setup(active, 65, 124);
            run($dataTroops[124].pages[0].list, 0, 588, 600, () => choice);
            expect(active && choice === 0 ? groups.jasper : []);
            assert.equal($gameSwitches.value(206), choice === 0);
            assert.equal($gameParty.numItems($dataItems[314]), !active && choice === 0 ? 1 : 0);
            dialogue++;
        }
        for (const active of [false, true]) for (const result of [0, 1, 2]) {
            setup(active, 65);
            battle(65, 9, 0, 3, result);
            expect(active && result === 0 ? groups.jasper : []);
            assert.equal($gameSwitches.value(172), result === 0);
            battles++;
        }
        for (const active of [false, true]) for (const answer of [0, 1, 2, 3, 4, 5]) {
            setup(active, 356, 19);
            run($dataTroops[19].pages[5].list, 0, 0, 101, () => answer);
            expect(active ? groups.pierre : []);
            assert.equal($gameVariables.value(617), 20);
            assert.equal($gameParty.numItems($dataArmors[52]), active ? 0 : 1);
            dialogue++;
        }
        for (const active of [false, true]) for (const state of [11, 16]) for (const result of [0, 1, 2]) {
            setup(active, 356);
            $gameVariables.setValue(617, state);
            battle(356, 2, 1, 3, result);
            expect(active && (result !== 1 || state === 16) ? groups.pierre : []);
            assert.equal($gameVariables.value(617), result === 2 || (result === 1 && state === 16) ? 17 : state);
            battles++;
        }
        for (const active of [false, true]) for (const page of [0, 1, 2, 4, 5]) for (const result of [0, 1, 2]) {
            setup(active, 33);
            battle(33, 2, page, 2, result);
            expect(active && result === 0 ? groups.benjamin : []);
            battles++;
        }
        for (const active of [false, true]) for (const state of [0, 5]) for (const approach of [0, 1]) {
            setup(active, 435, 742);
            $gameVariables.setValue(110, state);
            run($dataTroops[742].pages[0].list, 0, 0, 236, choices => choices[0] === "Yes." ? approach : 0,
                index => { if (index === 236) expect([]); });
            expect(active ? groups.benjamin : []);
            dialogue++;
        }
        for (const active of [false, true]) for (const result of [0, 1, 2]) {
            setup(active, 435);
            battle(435, 4, 0, 2, result);
            expect(active && result === 0 ? groups.benjamin : []);
            battles++;
        }
        for (const active of [false, true]) for (const page of [3, 4, 5, 6, 7]) {
            setup(active, 6);
            $gameSwitches.setValue(161, true);
            $gameVariables.setValue(155, (page - 3) * 2);
            const list = $dataMap.events[40].pages[page].list;
            run(list, 40, 0, list.length - 1);
            expect(active ? groups.shadow : []);
            assert.equal($gameParty.numItems($dataWeapons[85]), !active && page === 3 ? 1 : 0);
            assert.equal($gameParty.numItems($dataItems[360]), !active && page === 7 ? 1 : 0);
            assert.equal($gameParty.numItems($dataItems[8]), page === 4 ? 1 : page === 5 ? 3 : 0);
            assert.equal($gameSelfSwitches.value([6, 40, "A"]), true);
            dialogue++;
        }
        for (const active of [false, true]) for (const choice of [0, 1, 2]) for (const keep of [0, 1]) {
            setup(active, 6, 18);
            $gameVariables.setValue(150, 10);
            run($dataTroops[18].pages[0].list, 0, 685, 739, choices => choices.length === 3 ? choice : keep);
            expect(active ? groups.shadow : []);
            assert.equal($gameVariables.value(150), choice === 0 && keep === 0 ? 20 : 10);
            dialogue++;
        }
        for (const state of [1, 3, 5, 7]) {
            setup(true, 6, 18);
            $gameVariables.setValue(150, state);
            run($dataTroops[18].pages[0].list, 0, 739, 739);
            expect([]);
            dialogue++;
        }
        for (const [mid, eid, page, index, key] of [
            [56, 26, 2, 2, "mutt_vending_key"], [189, 18, 0, 1, "tickle_drawing"],
        ]) for (const active of [false, true]) for (const result of [0, 1, 2]) {
            setup(active, mid);
            battle(mid, eid, page, index, result);
            expect(active && result === 0 ? [key] : []);
            battles++;
        }
        for (const active of [false, true]) {
            setup(active, 189);
            $gameSwitches.setValue(672, true);
            run($dataMap.events[18].pages[0].list, 18, 9, 27);
            expect(active ? ["tickle_drawing"] : []);
            assert.equal($gameSwitches.value(661), true);
            dialogue++;
        }
        for (const [mid, eid, pages, group, dropKind, dropId] of [
            [6, 27, [0, 1], "clint", "armor", 2],
            [31, 35, [0, 1], "clint", null, null],
            [435, 1, [0, 1], "clint", "weapon", 217],
            [34, 20, [0, 1, 3], "madison", null, null],
            [435, 3, [0, 1], "madison", "weapon", 221],
        ]) for (const page of pages) for (const active of [false, true]) for (const result of [0, 1, 2]) {
            setup(active, mid);
            battle(mid, eid, page, 1, result);
            expect(active && result === 0 ? groups[group] : []);
            if (dropKind) {
                const item = (dropKind === "armor" ? $dataArmors : $dataWeapons)[dropId];
                assert.equal($gameParty.numItems(item), !active && result === 0 ? 1 : 0);
            }
            assert.equal($gameSwitches.value(group === "clint" ? 545 : 543), result === 0);
            battles++;
        }
        return { battles, dialogue, saves };
    } finally {
        SceneManager.push = originalPush;
        $gameMessage.clear();
        $gameParty.onBattleEnd();
    }
};
