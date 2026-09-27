"use strict";

// Probe only a project-local staged game started with --remote-debugging-port.
const assert = require("node:assert/strict");
const registry = require("../apworld/lookoutside/vertical_slice.json");

async function main() {
    const port = Number(process.argv[2] || 9223);
    const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    const page = targets.find(target => target.type === "page" && target.title === "lookOutside");
    if (!page) throw new Error("Staged Look Outside page was not found");
    const socket = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
        socket.onopen = resolve;
        socket.onerror = reject;
    });
    let serial = 0;
    const pending = new Map();
    socket.onmessage = event => {
        const response = JSON.parse(event.data);
        const entry = pending.get(response.id);
        if (!entry) return;
        pending.delete(response.id);
        if (response.error || response.result?.exceptionDetails) {
            entry.reject(new Error(JSON.stringify(response.error || response.result.exceptionDetails)));
        } else {
            entry.resolve(response.result.result.value);
        }
    };
    function evaluate(expression) {
        return new Promise((resolve, reject) => {
            const id = ++serial;
            pending.set(id, { resolve, reject });
            socket.send(JSON.stringify({ id, method: "Runtime.evaluate",
                params: { expression, returnByValue: true, awaitPromise: true } }));
        });
    }
    try {
        if (!await evaluate("Boolean($dataSystem && $dataSystem.boat)")) {
            await evaluate("DataManager.loadDatabase(); true");
        }
        for (let attempt = 0; attempt < 100; attempt++) {
            if (await evaluate("Boolean($dataSystem && $dataSystem.boat)")) break;
            if (attempt === 99) {
                const status = await evaluate(`({ ready: document.readyState,
                    dataSystem: typeof $dataSystem,
                    mainScript: Array.from(document.scripts).map(x => x.src).slice(-4),
                    plugins: PluginManager._scripts?.slice(-4),
                    databaseFiles: DataManager._databaseFiles?.length,
                    graphicsFrames: Graphics.frameCount,
                    errorUrl: DataManager._errorUrl,
                    scene: SceneManager._scene?.constructor?.name,
                    message: document.body?.innerText?.slice(0, 300) })`);
                throw new Error(`Staged game database did not finish loading: ${JSON.stringify(status)}`);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        const setup = await evaluate(`(() => {
            process.env.LOA_DEV_MODE = "1";
            // Synthetic probe outcomes must never update the user's Steam stats.
            globalThis.setAchievement = () => {};
            globalThis.setGamestat = () => {};
            DataManager._globalInfo ||= [];
            DataManager.setupNewGame();
            $dataTemplateEvents ||= [];
            $dataMap = JSON.parse(require("fs").readFileSync("data/Map023.json", "utf8"));
            DataManager.onLoad($dataMap);
            $gameMap.setup(23);
            const event = $gameMap.event(41);
            return { plugin: LookOutsideArchipelago.booted, pageIndex: event._pageIndex,
                mapId: $gameMap.mapId(), version: $dataSystem.versionId };
        })()`);
        assert.deepEqual(setup, { plugin: true, pageIndex: 0,
            mapId: 23, version: 74642914 });

        if (process.argv[3] === "ending-warnings") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_ending_warnings_probe").toString()})()`)));
            return;
        }
        if (process.argv[3] === "bookshelf") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_bookshelf_probe").toString()})()`)));
            return;
        }
        if (process.argv[3] === "late-resolutions") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_late_resolutions_probe").toString()})()`)));
            return;
        }
        if (process.argv[3] === "first-gifts") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_first_gifts_probe").toString()})()`)));
            return;
        }
        if (process.argv[3] === "car-trunk") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_car_trunk_probe").toString()})()`)));
            return;
        }
        if (process.argv[3] === "reusable-gifts") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_reusable_gifts_probe").toString()})()`)));
            return;
        }
        if (process.argv[3] === "fixed-collectibles") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_fixed_collectibles_probe").toString()})(${JSON.stringify(registry.locations.filter(r => [591000040, 591000041, 591000042].includes(r.ap_id)))})`)));
            return;
        }
        if (process.argv[3] === "home-quests") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_home_quests_probe").toString()})()`)));
            return;
        }
        if (process.argv[3] === "access-routes") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_access_routes_probe").toString()})()`)));
            return;
        }
        if (process.argv[3] === "sybil") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_sybil_probe").toString()})()`)));
            return;
        }
        if (process.argv[3] === "rat-freak") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_rat_freak_probe").toString()})()`)));
            return;
        }
        if (process.argv[3] === "calendar") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_calendar_probe").toString()})()`)));
            return;
        }
        if (process.argv[3] === "characters") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_character_resolution_probe").toString()})()`)));
            return;
        }
        if (process.argv[3] === "keys") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_simple_keys_probe").toString()})(${JSON.stringify(registry.locations.filter(row => row.simple_key_source))})`)));
            return;
        }
        if (process.argv[3] === "power") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_power_probe").toString()})()`)));
            return;
        }
        if (process.argv[3] === "discs") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_disc_probe").toString()})()`)));
            return;
        }
        if (process.argv[3] === "flesh-routes") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_flesh_routes_probe").toString()})()`)));
            return;
        }
        if (process.argv[3] === "key-budget") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_key_budget_probe").toString()})()`)));
            return;
        }
        if (process.argv[3] === "juicebox") {
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_juicebox_probe").toString()})()`)));
            return;
        }
        if (process.argv[3] === "menu") {
            const slotData = { development_slice: true, difficulty: "normal",
                registry_version: registry.registry_version, audited_game_id: registry.audited_game_id,
                audited_version_id: registry.audited_version_id };
            console.log(JSON.stringify(await evaluate(`(${require("../tests/native_menu_probe").toString()})(${JSON.stringify(slotData)})`)));
            return;
        }

        const pickup = await evaluate(`(() => {
            LookOutsideArchipelago.bindIdentityForDevelopment("runtime-probe", 0, 1);
            LookOutsideArchipelago.activateForDevelopment();
            const list = $dataMap.events[41].pages[0].list;
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, 41);
            interpreter._index = 5;
            interpreter.command101(list[5].parameters);
            const text = $gameMessage._texts.at(-1);
            interpreter._index = 7;
            interpreter.command127(list[7].parameters);
            return { text, checks: LookOutsideArchipelago.checkedKeys(),
                baseballBats: $gameParty.numItems($dataWeapons[15]),
                originalText: list[6].parameters[0] };
        })()`);
        assert.equal(pickup.text, "This pickup is an Archipelago location.");
        assert.deepEqual(pickup.checks, ["map023_event041_baseball_bat"]);
        assert.equal(pickup.baseballBats, 0);
        assert.equal(pickup.originalText, "Find a \\C[3]{Baseball Bat}\\C[0].");

        const keyPickup = await evaluate(`(() => {
            $gameMessage.clear();
            $gameSwitches.setValue(94, true);
            $dataMap = JSON.parse(require("fs").readFileSync("data/Map024.json", "utf8"));
            DataManager.onLoad($dataMap);
            $gameMap.setup(24);
            const event = $gameMap.event(7);
            const list = $dataMap.events[7].pages[0].list;
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, 7);
            interpreter._index = 5;
            interpreter.command123(list[5].parameters);
            interpreter._index = 6;
            interpreter.command126(list[6].parameters);
            interpreter._index = 7;
            interpreter.command101(list[7].parameters);
            return { pageIndex: event._pageIndex, text: $gameMessage._texts.at(-1),
                checks: LookOutsideArchipelago.checkedKeys(),
                padlockKeys: $gameParty.numItems($dataItems[301]) };
        })()`);
        assert.equal(keyPickup.pageIndex, 0);
        assert.equal(keyPickup.text, "Archipelago location checked.");
        assert.deepEqual(keyPickup.checks, ["map023_event041_baseball_bat",
            "map024_event007_padlock_key"]);
        assert.equal(keyPickup.padlockKeys, 0);

        const addedPickup = await evaluate(`(() => {
            $gameMessage.clear();
            $dataMap = JSON.parse(require("fs").readFileSync("data/Map035.json", "utf8"));
            DataManager.onLoad($dataMap);
            $gameMap.setup(35);
            const list = $dataMap.events[11].pages[0].list;
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, 11);
            interpreter._index = 4;
            interpreter.command101(list[4].parameters);
            const text = $gameMessage._texts.at(-1);
            interpreter._index = 6;
            interpreter.command127(list[6].parameters);
            return { text, checks: LookOutsideArchipelago.checkedKeys(),
                carvingForks: $gameParty.numItems($dataWeapons[42]) };
        })()`);
        assert.equal(addedPickup.text, "Archipelago location checked.");
        assert.equal(addedPickup.checks.at(-1), "map035_event011_carving_fork");
        assert.equal(addedPickup.carvingForks, 0);

        const earlyConsumedPickup = await evaluate(`(() => {
            $gameMessage.clear();
            $dataMap = JSON.parse(require("fs").readFileSync("data/Map299.json", "utf8"));
            DataManager.onLoad($dataMap);
            $gameMap.setup(299);
            const event = $gameMap.event(7);
            const list = $dataMap.events[7].pages[0].list;
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, 7);
            interpreter._index = 4;
            interpreter.command123(list[4].parameters);
            $gameMap.refresh();
            const pageAfterSwitch = event._pageIndex;
            interpreter._index = 5;
            interpreter.command127(list[5].parameters);
            interpreter._index = 6;
            interpreter.command101(list[6].parameters);
            return { pageAfterSwitch, text: $gameMessage._texts.at(-1),
                lastCheck: LookOutsideArchipelago.checkedKeys().at(-1),
                fryingPans: $gameParty.numItems($dataWeapons[17]) };
        })()`);
        assert.equal(earlyConsumedPickup.pageAfterSwitch, 1);
        assert.equal(earlyConsumedPickup.text, "Archipelago location checked.");
        assert.equal(earlyConsumedPickup.lastCheck, "map299_event007");
        assert.equal(earlyConsumedPickup.fryingPans, 0);

        const silentPickup = await evaluate(`(() => {
            $gameMessage.clear();
            $dataMap = JSON.parse(require("fs").readFileSync("data/Map372.json", "utf8"));
            DataManager.onLoad($dataMap);
            $gameMap.setup(372);
            const list = $dataMap.events[31].pages[0].list;
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, 31);
            interpreter.command127(list[0].parameters);
            return { text: $gameMessage._texts.at(-1),
                lastCheck: LookOutsideArchipelago.checkedKeys().at(-1),
                poolCues: $gameParty.numItems($dataWeapons[44]) };
        })()`);
        assert.equal(silentPickup.text, "Archipelago location checked.");
        assert.equal(silentPickup.lastCheck, "map372_event031");
        assert.equal(silentPickup.poolCues, 0);

        const cafePickup = await evaluate(`(() => {
            $gameMessage.clear();
            $gameSwitches.setValue(301, true);
            $gameSwitches.setValue(317, true);
            $dataMap = JSON.parse(require("fs").readFileSync("data/Map056.json", "utf8"));
            DataManager.onLoad($dataMap);
            $gameMap.setup(56);
            const event = $gameMap.event(4);
            const freeList = $dataMap.events[4].pages[0].list;
            const free = new Game_Interpreter();
            free.setup(freeList, 4);
            const checksBefore = LookOutsideArchipelago.checkedKeys().length;
            free._index = 7;
            free.command127(freeList[7].parameters);
            const afterFree = $gameParty.numItems($dataWeapons[100]);
            $gameSelfSwitches.setValue([56, 4, 'A'], true);
            $gameMap.refresh();
            const shopPage = event._pageIndex;
            const paidList = $dataMap.events[4].pages[1].list;
            const paid = new Game_Interpreter();
            paid.setup(paidList, 4);
            paid._index = 20;
            paid.command127(paidList[20].parameters);
            return { checksAdded: LookOutsideArchipelago.checkedKeys().length - checksBefore,
                afterFree, shopPage,
                afterPaid: $gameParty.numItems($dataWeapons[100]) };
        })()`);
        assert.equal(cafePickup.checksAdded, 0);
        assert.equal(cafePickup.afterFree, 1);
        assert.equal(cafePickup.shopPage, 1);
        assert.equal(cafePickup.afterPaid, 2);

        const pistolVariant = await evaluate(`(() => {
            $gameMessage.clear();
            $gameSwitches.setValue(8, true);
            $gameSwitches.setValue(1106, true);
            $dataMap = JSON.parse(require("fs").readFileSync("data/Map007.json", "utf8"));
            DataManager.onLoad($dataMap);
            $gameMap.setup(7);
            const page = $gameMap.event(30)._pageIndex;
            const list = $dataMap.events[30].pages[3].list;
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, 30);
            interpreter._index = 4;
            interpreter.command128(list[4].parameters);
            interpreter._index = 6;
            interpreter.command101(list[6].parameters);
            return { page, check: LookOutsideArchipelago.checkedKeys().at(-1),
                text: $gameMessage._texts.slice(),
                pistols: $gameParty.numItems($dataArmors[115]) };
        })()`);
        assert.equal(pistolVariant.page, 3);
        assert.equal(pistolVariant.check, "map007_event030_complex");
        assert.equal(pistolVariant.text[0], "Archipelago location checked.");
        assert.equal(pistolVariant.pistols, 0);

        const rifleAmmo = await evaluate(`(() => {
            $gameMessage.clear();
            $dataMap = JSON.parse(require("fs").readFileSync("data/Map034.json", "utf8"));
            DataManager.onLoad($dataMap);
            $gameMap.setup(34);
            const list = $dataMap.events[24].pages[0].list;
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, 24);
            interpreter._index = 5;
            interpreter.command101(list[5].parameters);
            const text = $gameMessage._texts.at(-1);
            interpreter._index = 15;
            interpreter.command126(list[15].parameters);
            interpreter._index = 27;
            interpreter.command128(list[27].parameters);
            return { text, check: LookOutsideArchipelago.checkedKeys().at(-1),
                bullets: $gameParty.numItems($dataItems[183]),
                rifles: $gameParty.numItems($dataArmors[132]) };
        })()`);
        assert.equal(rifleAmmo.text,
            "Archipelago location checked. Rifle Bullets received.");
        assert.equal(rifleAmmo.check, "map034_event024_complex");
        assert.equal(rifleAmmo.bullets, 12);
        assert.equal(rifleAmmo.rifles, 0);

        const safePickup = await evaluate(`(() => {
            $gameMessage.clear();
            $dataMap = JSON.parse(require("fs").readFileSync("data/Map073.json", "utf8"));
            DataManager.onLoad($dataMap);
            $gameMap.setup(73);
            const list = $dataMap.events[8].pages[0].list;
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, 8);
            interpreter._index = 2;
            interpreter.command117(list[2].parameters);
            const lock = interpreter._childInterpreter;
            lock._index = 50;
            lock.command123(lock._list[50].parameters);
            $gameMap.refresh();
            const consumedPage = $gameMap.event(8)._pageIndex;
            for (const index of [5, 6]) {
                interpreter._index = index;
                interpreter.command128(list[index].parameters);
            }
            interpreter._index = 19;
            interpreter.command101(list[19].parameters);
            const goldBefore = $gameParty.gold();
            interpreter._index = 21;
            interpreter.command125(list[21].parameters);
            return { consumedPage, text: $gameMessage._texts.at(-1),
                checks: LookOutsideArchipelago.checkedKeys().slice(-2),
                goldReceived: $gameParty.gold() - goldBefore,
                dressShoes: $gameParty.numItems($dataArmors[83]),
                topHats: $gameParty.numItems($dataArmors[54]) };
        })()`);
        assert.equal(safePickup.consumedPage, 1);
        assert.equal(safePickup.text, "2 Archipelago locations checked. $60 received.");
        assert.deepEqual(safePickup.checks, ["map073_event008_safe_83", "map073_event008_safe_54"]);
        assert.equal(safePickup.goldReceived, 60);
        assert.equal(safePickup.dressShoes, 0);
        assert.equal(safePickup.topHats, 0);

        const roachResolutions = await evaluate(`(() => {
            const outcomes = [];
            for (const [rewardIndex, terminalIndex] of [[51, 59], [69, 79], [null, 91]]) {
                DataManager.setupNewGame();
                LookOutsideArchipelago.bindIdentityForDevelopment("runtime-roaches", 0, 1);
                LookOutsideArchipelago.activateForDevelopment();
                $gameVariables.setValue(899, 5);
                $gameSwitches.setValue(1096, true);
                $dataMap = JSON.parse(require("fs").readFileSync("data/Map003.json", "utf8"));
                DataManager.onLoad($dataMap);
                $gameMap.setup(3);
                const beforePage = $gameMap.event(121)._pageIndex;
                const list = $dataMap.events[121].pages[2].list;
                const interpreter = new Game_Interpreter();
                interpreter.setup(list, 121);
                if (rewardIndex !== null) {
                    interpreter._index = rewardIndex;
                    interpreter.command128(list[rewardIndex].parameters);
                }
                interpreter._index = terminalIndex;
                interpreter.command122(list[terminalIndex].parameters);
                $gameMap.refresh();
                outcomes.push({ beforePage, afterPage: $gameMap.event(121)._pageIndex,
                    value: $gameVariables.value(899),
                    checks: LookOutsideArchipelago.checkedKeys().sort(),
                    crowns: $gameParty.numItems($dataArmors[330]),
                    sashes: $gameParty.numItems($dataArmors[331]) });
            }
            return outcomes;
        })()`);
        assert.deepEqual(roachResolutions.map(outcome => outcome.value), [101, 102, 100]);
        for (const outcome of roachResolutions) {
            assert.equal(outcome.beforePage, 2);
            assert.equal(outcome.afterPage, 3);
            assert.deepEqual(outcome.checks, ["roach_leadership_crown", "roach_leadership_sash"]);
            assert.equal(outcome.crowns, 0);
            assert.equal(outcome.sashes, 0);
        }

        const wilhelminaResolution = await evaluate(`(() => {
            DataManager.setupNewGame();
            LookOutsideArchipelago.bindIdentityForDevelopment("runtime-wilhelmina", 0, 1);
            LookOutsideArchipelago.activateForDevelopment();
            $gameSwitches.setValue(1133, true);
            $gameSwitches.setValue(1134, true);
            $dataMap = JSON.parse(require("fs").readFileSync("data/Map169.json", "utf8"));
            DataManager.onLoad($dataMap);
            $gameMap.setup(169);
            const beforePage = $gameMap.event(2)._pageIndex;
            const list = $dataMap.events[2].pages[1].list;
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, 2);
            interpreter._index = 107;
            interpreter.command127(list[107].parameters);
            const checksBeforeTerminal = LookOutsideArchipelago.checkedKeys().length;
            interpreter._index = 156;
            interpreter.command121(list[156].parameters);
            $gameMap.refresh();
            return { beforePage, afterPage: $gameMap.event(2)._pageIndex,
                defeated: $gameSwitches.value(1135), checksBeforeTerminal,
                checks: LookOutsideArchipelago.checkedKeys().sort(),
                swords: $gameParty.numItems($dataWeapons[158]) };
        })()`);
        assert.equal(wilhelminaResolution.beforePage, 1);
        assert.equal(wilhelminaResolution.afterPage, 2);
        assert.equal(wilhelminaResolution.defeated, true);
        assert.equal(wilhelminaResolution.checksBeforeTerminal, 1);
        assert.deepEqual(wilhelminaResolution.checks, ["wilhelmina_reward_book", "wilhelmina_reward_gun",
            "wilhelmina_reward_hammer", "wilhelmina_reward_spear", "wilhelmina_reward_sword"]);
        assert.equal(wilhelminaResolution.swords, 0);

        const questPickups = await evaluate(`(() => {
            function load(mid, eid, page, seed) {
                DataManager.setupNewGame();
                LookOutsideArchipelago.bindIdentityForDevelopment(seed, 0, 1);
                LookOutsideArchipelago.activateForDevelopment();
                $dataMap = JSON.parse(require("fs").readFileSync(
                    "data/Map" + String(mid).padStart(3, "0") + ".json", "utf8"));
                DataManager.onLoad($dataMap);
                $gameMap.setup(mid);
                const interpreter = new Game_Interpreter();
                interpreter.setup($dataMap.events[eid].pages[page].list, eid);
                return interpreter;
            }
            function run(interpreter, index) {
                interpreter._index = index;
                $gameMessage.clear();
                interpreter.executeCommand();
            }
            const rats = [];
            for (const restored of [false, true]) {
                const interpreter = load(92, 45, 2, "runtime-rat");
                $gameSelfSwitches.setValue([92, 45, "B"], true);
                $gameSwitches.setValue(659, restored);
                interpreter._index = 8;
                while (interpreter._index <= 20) {
                    $gameMessage.clear();
                    if (!interpreter.executeCommand()) throw new Error("Rat resolution stalled");
                }
                $gameMap.refresh();
                rats.push({ checks: LookOutsideArchipelago.checkedKeys(),
                    crowns: $gameParty.numItems($dataArmors[42]), page: $gameMap.event(45)._pageIndex });
            }
            const jackets = [];
            for (const lumpy of [false, true]) {
                const interpreter = load(430, 16, lumpy ? 2 : 1, "runtime-jacket");
                $gameSwitches.setValue(1003, lumpy);
                run(interpreter, lumpy ? 7 : 4);
                run(interpreter, lumpy ? 8 : 5);
                $gameMap.refresh();
                jackets.push({ checks: LookOutsideArchipelago.checkedKeys(),
                    jackets: $gameParty.numItems($dataArmors[337]),
                    cheeseMen: $gameParty.numItems($dataItems[142]), page: $gameMap.event(16)._pageIndex });
            }
            let interpreter = load(6, 25, 1, "runtime-card");
            $gameVariables.setValue(741, 1);
            // Native branch consumes the quest card before the reward. A second visit skips it.
            for (let visit = 0; visit < 2; visit++) {
                run(interpreter, 135); // the paid snack stays vanilla
                interpreter._index = 138;
                while (interpreter._index <= 144) {
                    $gameMessage.clear();
                    if (!interpreter.executeCommand()) throw new Error("Card branch stalled");
                }
            }
            const card = { checks: LookOutsideArchipelago.checkedKeys(), state: $gameVariables.value(741),
                cards: $gameParty.numItems($dataArmors[71]), snacks: $gameParty.numItems($dataItems[21]) };
            interpreter = load(433, 9, 2, "runtime-shears");
            $gameVariables.setValue(869, 18);
            run(interpreter, 11);
            run(interpreter, 39);
            $gameMap.refresh();
            const shears = { checks: LookOutsideArchipelago.checkedKeys(), state: $gameVariables.value(869),
                shears: $gameParty.numItems($dataWeapons[165]), page: $gameMap.event(9)._pageIndex };
            interpreter = load(442, 9, 0, "runtime-ambrose");
            const supplies = [];
            for (let index = 15; index <= 32; index++) {
                run(interpreter, index);
                if (index < 31) supplies.push($gameParty.numItems($dataItems[interpreter._list[index].parameters[0]]));
            }
            $gameMap.refresh();
            const ambrose = { checks: LookOutsideArchipelago.checkedKeys(), supplies,
                pipes: $gameParty.numItems($dataArmors[297]), page: $gameMap.event(9)._pageIndex };
            return { rats, jackets, card, shears, ambrose };
        })()`);
        for (const rat of questPickups.rats) {
            assert.deepEqual(rat, { checks: ["map092_event045_quest_pickup"], crowns: 0, page: 3 });
        }
        for (const [index, jacket] of questPickups.jackets.entries()) {
            assert.deepEqual(jacket, { checks: ["map430_event016_quest_pickup"],
                jackets: 0, cheeseMen: index, page: 3 });
        }
        assert.deepEqual(questPickups.card, { checks: ["map006_event025_quest_pickup"],
            state: 2, cards: 0, snacks: 2 });
        assert.deepEqual(questPickups.shears, { checks: ["map433_event009_quest_pickup"],
            state: 100, shears: 0, page: 3 });
        assert.deepEqual(questPickups.ambrose, { checks: ["map442_event009_quest_pickup"],
            supplies: Array(16).fill(1), pipes: 0, page: 1 });

        const bossSalvage = await evaluate(`(() => {
            const locations = ${JSON.stringify(registry.locations.filter(row => row.boss_salvage))};
            const outcomes = [];
            for (const location of locations) {
                for (const source of [location, ...(location.source_variants || [])]) {
                    for (const [battleResult, audreyPresent, apActive] of
                        [[0, false, true], [0, true, true], [1, false, true],
                         [1, true, true], [2, true, true], [0, true, false]]) {
                        DataManager.setupNewGame();
                        if (apActive) {
                            LookOutsideArchipelago.bindIdentityForDevelopment("runtime-salvage", 0, 1);
                            LookOutsideArchipelago.activateForDevelopment();
                        }
                        if (audreyPresent) $gameParty.addActor(22);
                        else $gameParty.removeActor(22);
                        $dataMap = JSON.parse(require("fs").readFileSync(
                            "data/Map" + String(source.map_id).padStart(3, "0") + ".json", "utf8"));
                        DataManager.onLoad($dataMap);
                        const conditions = $dataMap.events[source.event_id].pages[source.page].conditions;
                        for (const n of [1, 2]) {
                            if (conditions["switch" + n + "Valid"])
                                $gameSwitches.setValue(conditions["switch" + n + "Id"], true);
                        }
                        if (conditions.selfSwitchValid) $gameSelfSwitches.setValue(
                            [source.map_id, source.event_id, conditions.selfSwitchCh], true);
                        $gameMap.setup(source.map_id);
                        const beforePage = $gameMap.event(source.event_id)._pageIndex;
                        const list = $dataMap.events[source.event_id].pages[source.page].list;
                        const proof = source.boss_salvage;
                        const battleIndent = list[proof.battle_index].indent;
                        const winEnd = list.findIndex((command, index) =>
                            index > proof.battle_index + 1 && command.indent <= battleIndent);
                        const interpreter = new Game_Interpreter();
                        interpreter.setup(list, source.event_id);
                        interpreter._branch[battleIndent] = battleResult;
                        interpreter._index = proof.battle_index + 1;
                        // Use the real interpreter's victory and actor branching. Combat is
                        // simulated; unrelated camera, sound, movement and scripts are omitted.
                        while (interpreter._index < winEnd) {
                            const command = list[interpreter._index];
                            if ([0, 101, 111, 121, 123, 128, 412, 601].includes(command.code)) {
                                $gameMessage.clear();
                                if (!interpreter.executeCommand()) throw new Error("Salvage command stalled");
                            } else interpreter._index++;
                        }
                        $gameMap.refresh();
                        outcomes.push({ key: location.key, sourcePage: source.page, beforePage,
                            battleResult, audreyPresent, apActive,
                            checks: LookOutsideArchipelago.checkedKeys(),
                            armorCount: $gameParty.numItems($dataArmors[location.reward_database_id]),
                            consumedPage: $gameMap.event(proof.consumed_event_id)._pageIndex,
                            expectedConsumedPage: proof.consumed_page });
                    }
                }
            }
            return outcomes;
        })()`);
        for (const outcome of bossSalvage) {
            assert.equal(outcome.beforePage, outcome.sourcePage);
            assert.deepEqual(outcome.checks,
                outcome.apActive && outcome.battleResult === 0 ? [outcome.key] : []);
            assert.equal(outcome.armorCount,
                !outcome.apActive && outcome.battleResult === 0 && outcome.audreyPresent ? 1 : 0);
            if (outcome.battleResult === 0)
                assert.equal(outcome.consumedPage, outcome.expectedConsumedPage);
        }

        const bossDrops = await evaluate(`(() => {
            const locations = ${JSON.stringify(registry.locations.filter(row => row.battle_drop && !row.advanced_drop && row.quest_family !== "joel_resolution"))};
            const families = ${JSON.stringify(registry.quest_families)};
            const outcomes = [];
            const originalPush = SceneManager.push;
            const originalRandom = Math.random;
            SceneManager.push = function(scene) {
                if (scene !== Scene_Battle) return originalPush.call(this, scene);
            };
            function prepare(source, activate) {
                DataManager.setupNewGame();
                if (activate) {
                    LookOutsideArchipelago.bindIdentityForDevelopment("runtime-boss-drops", 0, 1);
                    LookOutsideArchipelago.activateForDevelopment();
                }
                $dataMap = JSON.parse(require("fs").readFileSync(
                    "data/Map" + String(source.map_id).padStart(3, "0") + ".json", "utf8"));
                DataManager.onLoad($dataMap);
                $gameMap.setup(source.map_id);
                const list = $dataMap.events[source.event_id].pages[source.page].list;
                const interpreter = new Game_Interpreter();
                interpreter.setup(list, source.event_id);
                interpreter._index = source.command_index;
                interpreter.executeCommand();
                return interpreter;
            }
            try {
                for (const location of locations) {
                    for (const source of [location, ...(location.source_variants || [])]) {
                        for (const [active, result, roll] of
                            [[true, 0, 0], [true, 0, 0.99], [false, 0, 0], [true, 1, 0], [true, 2, 0]]) {
                            const interpreter = prepare(source, active);
                            for (const enemy of $gameTroop.members()) enemy.setHp(0);
                            Math.random = () => roll;
                            if (result === 0) BattleManager.processVictory(true);
                            else BattleManager.endBattle(result);
                            Math.random = originalRandom;
                            let consumedPage = null;
                            if (result === 0 && source.battle_completion) {
                                interpreter._index = source.battle_completion.command_index;
                                interpreter.executeCommand();
                                $gameMap.refresh();
                                consumedPage = $gameMap.event(source.event_id)._pageIndex;
                            }
                            const database = { item: $dataItems, weapon: $dataWeapons, armor: $dataArmors }[location.reward_kind];
                            const sourceKeys = locations.filter(other =>
                                [other, ...(other.source_variants || [])].some(variant =>
                                    ["map_id", "event_id", "page", "command_index"].every(field =>
                                        variant[field] === source[field]))).map(other => other.key);
                            const expectedKeys = [...new Set(sourceKeys.flatMap(key => {
                                const family = families.find(row => row.resolve_on_acquisition && row.location_keys.includes(key));
                                return family ? family.location_keys : [key];
                            }))].sort();
                            outcomes.push({ key: location.key, active, result, roll,
                                checks: LookOutsideArchipelago.checkedKeys().sort(), expectedKeys,
                                rewardCount: $gameParty.numItems(database[location.reward_database_id]),
                                consumedPage, expectedConsumedPage: source.battle_completion?.consumed_page ?? null,
                                isGuardian: location.battle_drop.enemy_id === 228,
                                chanceArmor: $gameParty.numItems($dataArmors[232]) });
                        }
                    }
                }
                prepare({ map_id: 132, event_id: 2, page: 1, command_index: 4 }, true);
                for (const enemy of $gameTroop.members()) enemy.setHp(0);
                Math.random = () => 0;
                BattleManager.processVictory(true);
                const friendly = { checks: LookOutsideArchipelago.checkedKeys(),
                    hoodies: $gameParty.numItems($dataArmors[7]),
                    handguns: $gameParty.numItems($dataArmors[119]),
                    keys: $gameParty.numItems($dataItems[377]) };
                return { outcomes, friendly };
            } finally {
                SceneManager.push = originalPush;
                Math.random = originalRandom;
            }
        })()`);
        for (const outcome of bossDrops.outcomes) {
            assert.deepEqual(outcome.checks, outcome.active && outcome.result === 0 ? outcome.expectedKeys : []);
            assert.equal(outcome.rewardCount, !outcome.active && outcome.result === 0 ? 1 : 0);
            if (outcome.result === 0) assert.equal(outcome.consumedPage, outcome.expectedConsumedPage);
            assert.equal(outcome.chanceArmor, outcome.isGuardian && outcome.result === 0 && outcome.roll === 0 ? 1 : 0);
        }
        assert.deepEqual(bossDrops.friendly, { checks: [], hoodies: 1, handguns: 1, keys: 1 });

        const questItemScenarios = await evaluate(`(() => {
            const locations = ${JSON.stringify(registry.locations.filter(row => row.reviewed_item_pickup && !row.troop_id))};
            const results = [];
            for (const location of locations) for (const source of [location, ...(location.source_variants || [])]) {
                for (const active of [false, true]) {
                    DataManager.setupNewGame();
                    $gameMessage.clear();
                    if (active) LookOutsideArchipelago.activateForDevelopment();
                    if (location.difficulty_alternatives) {
                        $gameSwitches.setValue(8, source.map_id === 302);
                    }
                    $dataMap = JSON.parse(require("fs").readFileSync(
                        "data/Map" + String(source.map_id).padStart(3, "0") + ".json", "utf8"));
                    DataManager.onLoad($dataMap);
                    const conditions = $dataMap.events[source.event_id].pages[source.page].conditions;
                    if (conditions.variableValid) $gameVariables.setValue(conditions.variableId, conditions.variableValue);
                    for (const n of [1, 2]) {
                        if (conditions["switch" + n + "Valid"]) $gameSwitches.setValue(conditions["switch" + n + "Id"], true);
                    }
                    $gameMap.setup(source.map_id);
                    const event = $gameMap.event(source.event_id);
                    const beforePage = event._pageIndex;
                    const list = $dataMap.events[source.event_id].pages[source.page].list;
                    const originalList = JSON.stringify(list);
                    const interpreter = new Game_Interpreter();
                    interpreter.setup(list, source.event_id);
                    interpreter._index = source.command_index;
                    interpreter.command126(list[source.command_index].parameters);
                    const state = [];
                    for (const effect of source.native_effects) {
                        interpreter._index = effect.command_index;
                        interpreter["command" + effect.command_code](effect.parameters);
                        if (effect.command_code === 117 && effect.parameters[0] === 297) {
                            // Finish the story counter in the actual child interpreter;
                            // narrative message waits are skipped by this automated probe.
                            const child = interpreter._childInterpreter;
                            child._index = child._list.findLastIndex(c => c.code === 122);
                            child.command122(child._list[child._index].parameters);
                            state.push({ id: 975, value: $gameVariables.value(975), expected: 1 });
                        } else if (effect.command_code === 122) {
                            state.push({ id: effect.parameters[0], value: $gameVariables.value(effect.parameters[0]),
                                expected: effect.parameters[4] });
                        } else if (effect.command_code === 121) {
                            state.push({ id: effect.parameters[0], value: $gameSwitches.value(effect.parameters[0]),
                                expected: effect.parameters[2] === 0 });
                        }
                    }
                    $gameMap.refresh();
                    const notices = [];
                    for (const notice of [source, ...(location.message_variants || [])]) {
                        $gameMessage.clear();
                        interpreter._index = notice.message_index - 1;
                        interpreter.command101(list[interpreter._index].parameters);
                        const expected = [active ? notice.ap_message || location.ap_message ||
                            "Archipelago location checked." : notice.message_text];
                        for (let i = notice.message_index + 1; list[i]?.code === 401; i++) {
                            expected.push(list[i].parameters[0]);
                        }
                        notices.push({ text: $gameMessage._texts.slice(), expected });
                    }
                    results.push({ key: location.key, active, beforePage, expectedPage: source.page, afterPage: event._pageIndex,
                        checks: LookOutsideArchipelago.checkedKeys(),
                        items: $gameParty.numItems($dataItems[location.reward_database_id]),
                        unchanged: JSON.stringify(list) === originalList, state, notices });
                }
            }
            return results;
        })()`);
        for (const result of questItemScenarios) {
            assert.equal(result.beforePage, result.expectedPage, result.key);
            assert.equal(result.afterPage, result.expectedPage + 1, result.key);
            const expected = result.key === "map006_event040_quest_item" ?
                [result.key, "shadow_tongue", "map006_event040_complex"] : [result.key];
            assert.deepEqual(result.checks, result.active ? expected : [], result.key);
            assert.equal(result.items, result.active ? 0 : 1, result.key);
            assert.equal(result.unchanged, true, result.key);
            for (const state of result.state) assert.equal(state.value, state.expected, result.key);
            for (const notice of result.notices) assert.deepEqual(notice.text, notice.expected, result.key);
        }

        const npcGifts = await evaluate(`(() => {
            const locations = ${JSON.stringify(registry.locations.filter(row => row.troop_id && row.reviewed_item_pickup && row.key !== "joel_peaceful_door_knob" && row.troop_consumption && row.troop_consumption.type !== "map_switch"))};
            const results = [];
            for (const location of locations) for (const active of [false, true]) {
                DataManager.setupNewGame();
                $gameMessage.clear();
                if (active) {
                    LookOutsideArchipelago.bindIdentityForDevelopment("npc-gift-probe", 0, 1);
                    LookOutsideArchipelago.activateForDevelopment();
                }
                $dataMap = JSON.parse(require("fs").readFileSync(
                    "data/Map" + String(location.map_id).padStart(3, "0") + ".json", "utf8"));
                DataManager.onLoad($dataMap);
                $gameMap.setup(location.map_id);
                BattleManager.setup(location.troop_id, true, false);
                $gameParty.onBattleStart();
                const proof = location.troop_consumption;
                $gameVariables.setValue(proof.variable_id, proof.required_value);
                const list = $dataTroops[location.troop_id].pages[location.page].list;
                const original = JSON.stringify(list);
                const interpreter = new Game_Interpreter();
                interpreter.setup(list, 0);
                function refreshChoiceGate() {
                    if (location.key === "mutt_vending_key") {
                        interpreter._index = 27;
                        while (interpreter._index <= 31) interpreter.executeCommand();
                    }
                }
                function shownChoices() {
                    const choices = [];
                    Window_ChoiceList.prototype.makeCommandList.call({
                        addCommand(name) { choices.push(name); }, updatePlacement() {},
                        updateBackground() {}, placeCancelButton() {}, createContents() {},
                    });
                    return choices;
                }
                refreshChoiceGate();
                interpreter._index = proof.guard_index;
                const texts = [];
                let choiceVisible = null;
                const last = Math.max(...proof.consumed_writes);
                while (interpreter._index <= last) {
                    const command = interpreter.currentCommand();
                    if ([0, 101, 102, 111, 121, 122, 126, 402, 404, 411, 412].includes(command.code)) {
                        interpreter.executeCommand();
                        texts.push(...$gameMessage._texts);
                        if ($gameMessage.isChoice()) {
                            choiceVisible = shownChoices().includes(proof.choice_text.split("]))").at(-1));
                            $gameMessage.onChoice(proof.choice_index);
                        }
                        $gameMessage.clear();
                    } else interpreter._index++;
                }
                refreshChoiceGate();
                interpreter._index = proof.guard_index;
                interpreter.executeCommand();
                const guardSkipped = proof.type === "choice"
                    ? !shownChoices().includes(proof.choice_text.split("]))").at(-1))
                    : interpreter._index > location.command_index;
                $gameMessage.clear();
                const result = { key: location.key, active, checks: LookOutsideArchipelago.checkedKeys(),
                    items: $gameParty.numItems($dataItems[location.reward_database_id]),
                    consumed: $gameVariables.value(proof.variable_id) === proof.consumed_value,
                    guardSkipped, choiceVisible,
                    apNotice: texts.includes("Archipelago location checked."),
                    unchanged: original === JSON.stringify(list) };
                if (location.key === "frederic_canvas_bag") {
                    result.bagAccessAfterCheck = $gameSwitches.value(188);
                    result.storyAdvanced = $gameSwitches.value(233);
                    if (active) {
                        LookOutsideArchipelago.configureItemDefinitionsForDevelopment(
                            LookOutsideArchipelago.developmentData().itemDefinitions);
                        LookOutsideArchipelago.queueReceivedItemsForDevelopment(0, [{ item: 540000341 }]);
                        LookOutsideArchipelago.deliverPendingForDevelopment();
                        result.bagAccessAfterDelivery = $gameSwitches.value(188);
                        result.bagsDelivered = $gameParty.numItems($dataItems[341]);
                        // Replaying the source effect must preserve already delivered access.
                        $gameVariables.setValue(305, 2);
                        interpreter._index = 168;
                        interpreter.executeCommand();
                        result.earlierAccessPreserved = $gameSwitches.value(188);
                    }
                }
                results.push(result);
                $gameParty.onBattleEnd();
            }
            return results;
        })()`);
        for (const result of npcGifts) {
            const expected = result.key === "frederic_canvas_bag" ?
                ["frederic_canvas_bag", "frederic_painters_key"] : [result.key];
            assert.deepEqual([...result.checks].sort(), result.active ? expected.sort() : []);
            assert.equal(result.items, result.active ? 0 : 1);
            assert.equal(result.consumed, true);
            assert.equal(result.guardSkipped, true);
            if (result.choiceVisible !== null) assert.equal(result.choiceVisible, true);
            assert.equal(result.apNotice, result.active);
            assert.equal(result.unchanged, true);
            if (result.key === "frederic_canvas_bag") {
                assert.equal(result.bagAccessAfterCheck, !result.active);
                assert.equal(result.storyAdvanced, true);
                if (result.active) {
                    assert.equal(result.bagAccessAfterDelivery, true);
                    assert.equal(result.bagsDelivered, 1);
                    assert.equal(result.earlierAccessPreserved, true);
                }
            }
        }

        const ritualGifts = await evaluate(`(() => {
            const results = [];
            for (const active of [false, true]) for (const choice of [0, 1]) {
                DataManager.setupNewGame();
                $gameMessage.clear();
                if (active) LookOutsideArchipelago.activateForDevelopment();
                $dataMap = JSON.parse(require("fs").readFileSync("data/Map065.json", "utf8"));
                DataManager.onLoad($dataMap);
                $gameMap.setup(65);
                BattleManager.setup(124, true, false);
                $gameParty.onBattleStart();
                const list = $dataTroops[124].pages[0].list;
                const original = JSON.stringify(list);
                const interpreter = new Game_Interpreter();
                interpreter.setup(list, 0);
                interpreter._index = 588;
                const texts = [];
                for (let step = 0; step < 40 && interpreter._index < 604; step++) {
                    const command = interpreter.currentCommand();
                    if ([0, 101, 102, 119, 121, 126, 128, 402, 404].includes(command.code)) {
                        interpreter.executeCommand();
                        texts.push(...$gameMessage._texts);
                        if ($gameMessage.isChoice()) $gameMessage.onChoice(choice);
                        $gameMessage.clear();
                    } else interpreter._index++;
                }
                $gameMap.refresh();
                results.push({ active, choice, checks: LookOutsideArchipelago.checkedKeys(),
                    key: $gameParty.numItems($dataItems[314]), robes: $gameParty.numItems($dataArmors[23]),
                    consumed: $gameSwitches.value(206), page: $gameMap.event(9)._pageIndex,
                    apNotice: texts.includes("2 Archipelago locations checked."),
                    unchanged: original === JSON.stringify(list) });
                $gameParty.onBattleEnd();
            }
            return results;
        })()`);
        for (const result of ritualGifts) {
            const ready = result.choice === 0;
            assert.deepEqual(result.checks, result.active && ready ?
                ["jasper_apartment_key", "ritual_roof_key", "ritual_dark_robes"] : []);
            assert.equal(result.key, !result.active && ready ? 1 : 0);
            assert.equal(result.robes, !result.active && ready ? 1 : 0);
            assert.equal(result.consumed, ready);
            assert.equal(result.page, ready ? 2 : 0);
            assert.equal(result.apNotice, result.active && ready);
            assert.equal(result.unchanged, true);
        }

        const peacefulQuestScenarios = await evaluate(`(() => {
            const results = [];
            function prepare(troop, map, active) {
                DataManager.setupNewGame();
                $gameMessage.clear();
                if (active) LookOutsideArchipelago.activateForDevelopment();
                $dataMap = JSON.parse(require("fs").readFileSync("data/Map" + String(map).padStart(3, "0") + ".json", "utf8"));
                DataManager.onLoad($dataMap);
                $gameMap.setup(map);
                BattleManager.setup(troop, true, false);
                $gameParty.onBattleStart();
                const interpreter = new Game_Interpreter();
                interpreter.setup($dataTroops[troop].pages[0].list, 0);
                return interpreter;
            }
            function run(interpreter, end, choice) {
                for (let step = 0; step < 250 && interpreter._index <= end; step++) {
                    const command = interpreter.currentCommand();
                    if ([0, 101, 102, 111, 118, 119, 121, 122, 126, 128, 402, 403, 404, 411, 412].includes(command.code)) {
                        const index = interpreter._index;
                        interpreter.executeCommand();
                        if ($gameMessage.isChoice()) $gameMessage.onChoice(index === 452 ? choice : 0);
                        $gameMessage.clear();
                    } else interpreter._index++;
                }
            }
            for (const active of [false, true]) for (const choice of [0, 1]) {
                const interpreter = prepare(18, 6, active);
                const original = JSON.stringify(interpreter._list);
                $gameVariables.setValue(150, 4);
                interpreter._index = 426;
                run(interpreter, 557, choice);
                const result = { kind: "shadow", active, choice, checks: LookOutsideArchipelago.checkedKeys(),
                    tongues: $gameParty.numItems($dataItems[350]), relation: $gameVariables.value(152),
                    state: $gameVariables.value(150), unchanged: original === JSON.stringify(interpreter._list) };
                interpreter._index = 426;
                interpreter.executeCommand();
                result.repeatSkipped = interpreter._index === 557;
                results.push(result);
                $gameParty.onBattleEnd();
            }
            for (const active of [false, true]) for (const points of [-1, 0, 3, 5]) {
                const interpreter = prepare(27, 33, active);
                const original = JSON.stringify(interpreter._list);
                $gameVariables.setValue(110, 4);
                $gameVariables.setValue(111, points);
                interpreter._index = 600;
                run(interpreter, 635, 0);
                const result = { kind: "benjamin", active, points, checks: LookOutsideArchipelago.checkedKeys(),
                    games: $gameParty.numItems($dataItems[420]), pendants: $gameParty.numItems($dataArmors[103]),
                    candy: $gameParty.numItems($dataItems[26]), chocolate: $gameParty.numItems($dataItems[22]),
                    state: $gameVariables.value(110), unchanged: original === JSON.stringify(interpreter._list) };
                interpreter._index = 40;
                interpreter.executeCommand();
                interpreter.executeCommand();
                result.repeatSkipped = interpreter._index >= 648;
                results.push(result);
                $gameParty.onBattleEnd();
            }
            return results;
        })()`);
        for (const result of peacefulQuestScenarios) {
            assert.equal(result.unchanged, true);
            assert.equal(result.repeatSkipped, true, JSON.stringify(result));
            assert.equal(result.state, 5);
            if (result.kind === "shadow") {
                assert.deepEqual(result.checks, result.active ? ["shadow_tongue"] : []);
                assert.equal(result.tongues, !result.active && result.choice === 0 ? 1 : 0);
                assert.equal(result.relation, result.choice === 0 ? 2 : -1);
            } else {
                assert.deepEqual(result.checks.sort(), result.active ? ["benjamin_game", "benjamin_pendant"] : []);
                assert.equal(result.games, !result.active && result.points >= 5 ? 1 : 0);
                assert.equal(result.pendants, !result.active && result.points >= 3 ? 1 : 0);
                assert.equal(result.candy, result.points >= 0 ? 5 : 0);
                assert.equal(result.chocolate, result.points >= 0 ? 1 : 0);
            }
        }

        const joelDialogue = await evaluate(`(() => {
            const results = [];
            for (const active of [false, true]) for (const choice of [0, 1, 2]) {
                DataManager.setupNewGame();
                $gameMessage.clear();
                if (active) LookOutsideArchipelago.activateForDevelopment();
                $dataMap = JSON.parse(require("fs").readFileSync("data/Map032.json", "utf8"));
                DataManager.onLoad($dataMap);
                $gameMap.setup(32);
                BattleManager.setup(26, true, false);
                $gameParty.onBattleStart();
                $gameVariables.setValue(107, 6);
                $gameTroop.members()[0].addState(8);
                const list = $dataTroops[26].pages[1].list;
                const original = JSON.stringify(list);
                const interpreter = new Game_Interpreter();
                interpreter.setup(list, 0);
                const texts = [];
                let reachedAbort = false;
                for (let step = 0; step < 100; step++) {
                    const command = interpreter.currentCommand();
                    if (!command) break;
                    if (command.code === 340) { reachedAbort = true; break; }
                    // Run native branch, choice, variable, reward, and message commands.
                    // Combat animations, waits, and the forced hug attack are skipped.
                    if ([0, 101, 102, 111, 118, 119, 122, 126, 402, 403, 404, 411, 412].includes(command.code)) {
                        interpreter.executeCommand();
                        texts.push(...$gameMessage._texts);
                        if ($gameMessage.isChoice()) $gameMessage.onChoice(choice);
                        $gameMessage.clear();
                    } else interpreter._index++;
                }
                results.push({ active, choice, reachedAbort, state: $gameVariables.value(107),
                    checks: LookOutsideArchipelago.checkedKeys(), knobs: $gameParty.numItems($dataItems[310]),
                    apNotice: texts.includes("Archipelago: Joel Resolution complete (2 checks)."),
                    unchanged: original === JSON.stringify(list) });
                $gameParty.onBattleEnd();
            }
            const kills = [];
            for (let page = 0; page < 4; page++) {
                DataManager.setupNewGame();
                LookOutsideArchipelago.activateForDevelopment();
                $dataMap = JSON.parse(require("fs").readFileSync("data/Map032.json", "utf8"));
                DataManager.onLoad($dataMap);
                $gameMap.setup(32);
                const list = $dataMap.events[7].pages[page].list;
                const interpreter = new Game_Interpreter();
                interpreter.setup(list, 7);
                interpreter._index = page < 2 ? 9 : 8;
                interpreter.command126(list[interpreter._index].parameters);
                kills.push({ checks: LookOutsideArchipelago.checkedKeys(),
                    knobs: $gameParty.numItems($dataItems[310]) });
            }
            return { results, kills };
        })()`);
        for (const result of joelDialogue.results) {
            const checked = result.active;
            assert.equal(result.reachedAbort, true);
            assert.equal(result.state, result.choice === 2 ? 7 : 8);
            assert.deepEqual(result.checks, checked ? ["joel_peaceful_door_knob", "joel_resolution_toothy_whip"] : []);
            assert.equal(result.knobs, checked ? 0 : 1);
            assert.equal(result.apNotice, checked);
            assert.equal(result.unchanged, true);
        }
        for (const result of joelDialogue.kills) assert.deepEqual(result,
            { checks: ["joel_peaceful_door_knob", "joel_resolution_toothy_whip"], knobs: 0 });

        const sharedKey = await evaluate(`(() => {
            DataManager.setupNewGame();
            LookOutsideArchipelago.bindIdentityForDevelopment("runtime-basement-key", 0, 1);
            LookOutsideArchipelago.activateForDevelopment();
            $gameParty.gainItem($dataItems[303], 1);
            $dataMap = JSON.parse(require("fs").readFileSync("data/Map184.json", "utf8"));
            DataManager.onLoad($dataMap);
            $gameMap.setup(184);
            const event = $gameMap.event(1);
            const beforePage = event._pageIndex;
            const list = $dataMap.events[1].pages[0].list;
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, 1);
            interpreter._index = 4;
            interpreter.command126(list[4].parameters);
            $gameMap.refresh();
            const afterPage = event._pageIndex;
            $gameMessage.clear();
            interpreter._index = 5;
            interpreter.command101(list[5].parameters);
            const pickupText = $gameMessage._texts.at(-1);
            $dataMap = JSON.parse(require("fs").readFileSync("data/Map130.json", "utf8"));
            DataManager.onLoad($dataMap);
            $gameMap.setup(130);
            return { beforePage, afterPage, pickupText,
                alternatePage: $gameMap.event(11)._pageIndex,
                keyCount: $gameParty.numItems($dataItems[303]),
                checks: LookOutsideArchipelago.checkedKeys() };
        })()`);
        assert.equal(sharedKey.beforePage, 0);
        assert.equal(sharedKey.afterPage, 1);
        assert.equal(sharedKey.pickupText, "Archipelago location checked.");
        assert.equal(sharedKey.alternatePage, 1);
        assert.equal(sharedKey.keyCount, 1);
        assert.deepEqual(sharedKey.checks, ["landlords_hell_basement_key"]);

        const calendar = await evaluate(`(() => {
            const list = $dataCommonEvents[4].list;
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, 0);
            $gameVariables.setValue(15, 7);
            const before = $gameVariables.value(15);
            interpreter._index = 59;
            interpreter.command122(list[59].parameters);
            const afterRollover = $gameVariables.value(15);
            interpreter._index = 135;
            interpreter.command117(list[135].parameters);
            return { before, afterRollover, dayHold: LookOutsideArchipelago.dayHold };
        })()`);
        assert.equal(calendar.afterRollover, calendar.before);
        assert.equal(calendar.dayHold, true);
        const finalDay = await evaluate(`(() => {
            DataManager.setupNewGame();
            LookOutsideArchipelago.bindIdentityForDevelopment("runtime-final-day", 0, 1);
            LookOutsideArchipelago.activateForDevelopment();
            const list = $dataCommonEvents[4].list;
            const interpreter = new Game_Interpreter();
            interpreter.setup(list, 0);
            $gameVariables.setValue(15, 15);
            interpreter._index = 59;
            interpreter.command122(list[59].parameters);
            interpreter._index = 135;
            interpreter.command117(list[135].parameters);
            let advanceError = null;
            try {
                LookOutsideArchipelago.advanceDayForDevelopment();
            } catch (error) {
                advanceError = error.message;
            }
            return { day: $gameVariables.value(15),
                held: LookOutsideArchipelago.dayHold, advanceError };
        })()`);
        assert.equal(finalDay.day, 15);
        assert.equal(finalDay.held, true);
        assert.match(finalDay.advanceError, /final supported/);
        const nativeCalendar = await evaluate(`(${require("../tests/native_calendar_probe").toString()})()`);
        const remainingQuestItems = await evaluate(`(${require("../tests/native_quest_item_probe").toString()})(
            ${JSON.stringify(registry.locations.filter(row => row.reviewed_quest_reward))})`);
        const planetarium = await evaluate(`(${require("../tests/native_planetarium_probe").toString()})()`);
        const transformations = await evaluate(`(${require("../tests/native_transformations_probe").toString()})()`);
        const lateGifts = await evaluate(`(${require("../tests/native_late_gifts_probe").toString()})()`);
        const portrait = await evaluate(`(${require("../tests/native_portrait_probe").toString()})(${JSON.stringify(registry.locations.find(row => row.portrait_key))})`);
        const advancedDrops = await evaluate(`(${require("../tests/native_advanced_drops_probe").toString()})(${JSON.stringify(registry.locations.filter(row => row.advanced_drop))})`);
        const power = await evaluate(`(${require("../tests/native_power_probe").toString()})()`);
        const joelResolution = await evaluate(`(${require("../tests/native_joel_resolution_probe").toString()})()`);
        const characterResolution = await evaluate(`(${require("../tests/native_character_resolution_probe").toString()})()`);
        const friendlyLockedRooms = await evaluate(`(${require("../tests/native_friendly_locked_probe").toString()})()`);
        const nativeMenu = await evaluate(`(${require("../tests/native_menu_probe").toString()})(${JSON.stringify({
            development_slice: true, difficulty: "normal", registry_version: registry.registry_version,
            audited_game_id: registry.audited_game_id, audited_version_id: registry.audited_version_id,
        })})`);
        console.log(JSON.stringify({ setup, pickup, keyPickup, addedPickup,
            earlyConsumedPickup, silentPickup, cafePickup, pistolVariant, rifleAmmo, safePickup,
            roachResolutions, wilhelminaResolution, questPickups, bossSalvageScenarios: bossSalvage.length,
            bossDropScenarios: bossDrops.outcomes.length, friendlyDrops: bossDrops.friendly,
            questItemScenarios: questItemScenarios.length,
            npcGiftScenarios: npcGifts.length,
            ritualGiftScenarios: ritualGifts.length,
            peacefulQuestScenarios: peacefulQuestScenarios.length,
            joelDialogue,
            sharedKey, calendar, finalDay, nativeCalendar, remainingQuestItems, planetarium, transformations, lateGifts, portrait, advancedDrops, power, joelResolution, characterResolution, friendlyLockedRooms, nativeMenu }));
    } finally {
        socket.close();
    }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
