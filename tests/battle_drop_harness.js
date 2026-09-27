"use strict";

// Minimal vanilla reward sequence shared by protocol and interception tests.
module.exports = function installBattleHarness() {
    const battles = new Map();
    const enemies = new Map();
    const trace = { granted: [], displayed: [], endings: [] };
    const kindNames = { 1: "item", 2: "weapon", 3: "armor" };
    function itemObject(kind, id) {
        const field = { 1: "$dataItems", 2: "$dataWeapons", 3: "$dataArmors" }[kind];
        globalThis[field] ||= {};
        return globalThis[field][id] ||= { kind: kindNames[kind], id };
    }
    class GameEnemy {
        constructor(id) { this.id = id; }
        enemyId() { return this.id; }
        enemy() { return enemies.get(this.id); }
        itemObject(kind, id) { return itemObject(kind, id); }
        makeDropItems() {
            // Supply chosen rolls so tests can guarantee that unrelated random loot survives.
            return this.enemy().rolledDrops.map(drop => this.itemObject(drop.kind, drop.dataId));
        }
    }
    globalThis.Game_Enemy = GameEnemy;
    globalThis.BattleManager = {
        setup(troopId) {
            this._troopId = troopId;
            this.members = (battles.get(troopId) || []).map(id => new GameEnemy(id));
        },
        processVictory(quiet = false) {
            this._rewards = { items: this.members.flatMap(enemy => enemy.makeDropItems()) };
            if (!quiet) trace.displayed.push(...this._rewards.items);
            this.gainDropItems();
            this.endBattle(0);
            return quiet;
        },
        gainDropItems() { trace.granted.push(...this._rewards.items); },
        endBattle(result) { trace.endings.push(result); },
    };
    globalThis.$gameTroop = { troop() { return { id: BattleManager._troopId }; } };
    return {
        trace,
        configure(troopId, definitions) {
            battles.set(troopId, definitions.map(enemy => enemy.id));
            for (const enemy of definitions) {
                enemies.set(enemy.id, { dropItems: enemy.drops,
                    rolledDrops: enemy.rolledDrops || enemy.drops.filter(drop => drop.kind > 0) });
            }
            trace.granted.length = 0;
            trace.displayed.length = 0;
            trace.endings.length = 0;
        },
    };
};
