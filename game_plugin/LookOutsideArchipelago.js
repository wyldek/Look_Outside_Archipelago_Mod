/*:
 * @target MZ
 * @plugindesc Archipelago integration for Look Outside (development build).
 * @author Look Outside Archipelago contributors
 *
 * @help
 * Development bootstrap. No randomization occurs until an AP session is
 * activated. The current source matches are a vertical slice only.
 */

(() => {
    "use strict";

    const pluginName = "LookOutsideArchipelago";
    const auditedBuild = Object.freeze({ gameId: 51778622, versionId: 74642914 });
    const developmentRegistryVersion = 74;
    if (globalThis.LookOutsideArchipelago) {
        throw new Error(`${pluginName} loaded more than once`);
    }
    // BEGIN GENERATED DEVELOPMENT REGISTRY
    // Source data generated from the active APWorld registry.
    const sourceSignatures = Object.freeze([
        Object.freeze({
    "key": "roach_leadership_crown",
    "mapId": 3,
    "eventId": 121,
    "pageIndex": 2,
    "commandIndex": 51,
    "commandCode": 128,
    "databaseId": 330,
    "apId": 530312102,
    "messageIndex": 50,
    "originalMessage": "You receive \\C[3]{Papier-Maché Crown}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "roach_leadership_sash",
    "mapId": 3,
    "eventId": 121,
    "pageIndex": 2,
    "commandIndex": 69,
    "commandCode": 128,
    "databaseId": 331,
    "apId": 530312152,
    "messageIndex": 68,
    "originalMessage": "You receive \\C[3]{Official Sash}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map006_event013",
    "mapId": 6,
    "eventId": 13,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 300,
    "apId": 530601300,
    "messageIndex": 9,
    "originalMessage": "You find \\C[3]{Apartment 33 Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map006_event025_quest_pickup",
    "mapId": 6,
    "eventId": 25,
    "pageIndex": 1,
    "commandIndex": 142,
    "commandCode": 128,
    "databaseId": 71,
    "apId": 530602501,
    "messageIndex": 144,
    "originalMessage": "\\..\\..\\.. Got \\C[3]{Four Of Spades}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map006_event040_complex",
    "mapId": 6,
    "eventId": 40,
    "pageIndex": 3,
    "commandIndex": 6,
    "commandCode": 127,
    "databaseId": 85,
    "apId": 530604003,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Kitchen Knife}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map006_event040_quest_item",
    "mapId": 6,
    "eventId": 40,
    "pageIndex": 7,
    "commandIndex": 7,
    "commandCode": 126,
    "databaseId": 360,
    "apId": 530604007,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{Rose}\\C[00]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map007_event001_quest_item",
    "mapId": 7,
    "eventId": 1,
    "pageIndex": 0,
    "commandIndex": 2,
    "commandCode": 126,
    "databaseId": 302,
    "apId": 530700100,
    "messageIndex": 1,
    "originalMessage": "Find \\C[03]{Apartment 21 Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map007_event030_complex",
    "mapId": 7,
    "eventId": 30,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 115,
    "apId": 530703000,
    "messageIndex": 7,
    "originalMessage": "You find a \\C[3]{Pistol}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map007_event030_complex",
    "mapId": 7,
    "eventId": 30,
    "pageIndex": 3,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 115,
    "apId": 530703000,
    "messageIndex": 7,
    "originalMessage": "You find a \\C[3]{Pistol}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map010_event016_quest_item",
    "mapId": 10,
    "eventId": 16,
    "pageIndex": 0,
    "commandIndex": 11,
    "commandCode": 126,
    "databaseId": 427,
    "apId": 531001600,
    "messageIndex": 10,
    "originalMessage": "Find \\C[03]{Space Truckerz}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map011_event004",
    "mapId": 11,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 8,
    "apId": 531100400,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{Broom}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map011_event009_safe_94",
    "mapId": 11,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 94,
    "apId": 531100900,
    "messageIndex": 9,
    "originalMessage": "Inside you find...\\.\\. \\C[3]$200\\C[0] in cash and \\C[3]{Jade Earrings}\\C[0].",
    "apMessage": "Archipelago location checked. $200 received.",
    "messageVariants": [
        {
            "messageIndex": 15,
            "originalMessage": "Inside you find...\\.\\. \\C[3]$60\\C[0] in cash and \\C[3]{Jade Earrings}\\C[0].",
            "apMessage": "Archipelago location checked. $60 received."
        },
        {
            "messageIndex": 20,
            "originalMessage": "Inside you find...\\.\\. \\C[3]$120\\C[0] in cash and \\C[3]{Jade Earrings}\\C[0].",
            "apMessage": "Archipelago location checked. $120 received."
        }
    ]
}),
        Object.freeze({
    "key": "map016_event003_quest_item",
    "mapId": 16,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 2,
    "commandCode": 126,
    "databaseId": 376,
    "apId": 531600300,
    "resolutionFamily": "dan_resolution",
    "messageIndex": 4,
    "originalMessage": "Receive \\C[3]{NeoDuo}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map023_event041_baseball_bat",
    "mapId": 23,
    "eventId": 41,
    "pageIndex": 0,
    "commandIndex": 7,
    "commandCode": 127,
    "databaseId": 15,
    "apId": 532304100,
    "messageIndex": 6,
    "originalMessage": "Find a \\C[3]{Baseball Bat}\\C[0].",
    "apMessage": "This pickup is an Archipelago location."
}),
        Object.freeze({
    "key": "map024_event003_complex",
    "mapId": 24,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 11,
    "commandCode": 127,
    "databaseId": 85,
    "apId": 532400301,
    "messageIndex": 10,
    "originalMessage": "Find a \\C[03]{Kitchen Knife}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map024_event007_padlock_key",
    "mapId": 24,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 126,
    "databaseId": 301,
    "apId": 532400700,
    "messageIndex": 8,
    "originalMessage": "You find a \\C[03]{Padlock Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map030_event010",
    "mapId": 30,
    "eventId": 10,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 127,
    "databaseId": 44,
    "apId": 533001000,
    "messageIndex": 5,
    "originalMessage": "You find \\C[03]{Pool Cue}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map031_event009_frying_pan",
    "mapId": 31,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 17,
    "apId": 533100900,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Frying Pan}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map031_event030_hoodie",
    "mapId": 31,
    "eventId": 30,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 7,
    "apId": 533103000,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Hoodie}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map032_event009_mop",
    "mapId": 32,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 25,
    "apId": 533200900,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Mop}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map033_event007_baseball_cap",
    "mapId": 33,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 48,
    "apId": 533300700,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Baseball Cap}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map034_event019",
    "mapId": 34,
    "eventId": 19,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 126,
    "databaseId": 311,
    "apId": 533401900,
    "messageIndex": 6,
    "originalMessage": "You find \\C[03]{Army Guy Figure}.",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map034_event024_complex",
    "mapId": 34,
    "eventId": 24,
    "pageIndex": 0,
    "commandIndex": 27,
    "commandCode": 128,
    "databaseId": 132,
    "apId": 533402400,
    "messageIndex": 6,
    "originalMessage": "Inside you find...\\.\\. an old \\C[03]{Rifle}\\C[00] and some \\C[03]{Rifle Bullets}\\C[0]!",
    "apMessage": "Archipelago location checked. Rifle Bullets received."
}),
        Object.freeze({
    "key": "map034_event025_tank_top",
    "mapId": 34,
    "eventId": 25,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 6,
    "apId": 533402500,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{Tank Top}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map035_event011_carving_fork",
    "mapId": 35,
    "eventId": 11,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 127,
    "databaseId": 42,
    "apId": 533501100,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Carving Fork}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map036_event005",
    "mapId": 36,
    "eventId": 5,
    "pageIndex": 1,
    "commandIndex": 6,
    "commandCode": 126,
    "databaseId": 324,
    "apId": 533600501,
    "messageIndex": 5,
    "originalMessage": "Find \\C[3]{Earth Disc}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map038_event003",
    "mapId": 38,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 127,
    "databaseId": 19,
    "apId": 533800300,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Golf Club}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map038_event004_quest_item",
    "mapId": 38,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 11,
    "commandCode": 126,
    "databaseId": 412,
    "apId": 533800400,
    "messageIndex": 10,
    "originalMessage": "Find \\C[03]{Wizards Hell: Arcane Tears}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map039_event005",
    "mapId": 39,
    "eventId": 5,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 73,
    "apId": 533900500,
    "messageIndex": 7,
    "originalMessage": "You find \\C[03]{Glasses}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map039_event007_quest_item",
    "mapId": 39,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 20,
    "commandCode": 126,
    "databaseId": 334,
    "apId": 533900700,
    "messageIndex": 23,
    "originalMessage": "You find a \\C[03]{Guinea Pig}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map042_event009",
    "mapId": 42,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 80,
    "apId": 534200900,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Plastic Gloves}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map052_event005_quest_item",
    "mapId": 52,
    "eventId": 5,
    "pageIndex": 0,
    "commandIndex": 12,
    "commandCode": 126,
    "databaseId": 422,
    "apId": 535200500,
    "messageIndex": 11,
    "originalMessage": "Find \\C[03]{Myrmidon XII}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map053_event002",
    "mapId": 53,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 126,
    "databaseId": 335,
    "apId": 535300200,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Blank VHS Tape}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map053_event008_safe_101",
    "mapId": 53,
    "eventId": 8,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 128,
    "databaseId": 101,
    "apId": 535300800,
    "messageIndex": 8,
    "originalMessage": "Inside you find...\\.\\. \\C[3]$240 \\C[0]in cash and a \\C[3]{Copper Bangle}\\C[0].",
    "apMessage": "Archipelago location checked. $240 received.",
    "messageVariants": [
        {
            "messageIndex": 14,
            "originalMessage": "Inside you find...\\.\\. \\C[4]$200\\C[0] in cash and a \\C[3]{Copper Bangle}\\C[0].",
            "apMessage": "Archipelago location checked. $200 received."
        },
        {
            "messageIndex": 19,
            "originalMessage": "Inside you find...\\.\\. \\C[3]$160\\C[0] in cash and a \\C[3]{Copper Bangle}\\C[0].",
            "apMessage": "Archipelago location checked. $160 received."
        }
    ]
}),
        Object.freeze({
    "key": "map055_event039_quest_item",
    "mapId": 55,
    "eventId": 39,
    "pageIndex": 0,
    "commandIndex": 11,
    "commandCode": 126,
    "databaseId": 323,
    "apId": 535503900,
    "messageIndex": 13,
    "originalMessage": "Find \\C[03]{Venus Disc}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map058_event004_quest_item",
    "mapId": 58,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 328,
    "apId": 535800400,
    "messageIndex": 12,
    "originalMessage": "You find \\C[03]{Uranus Disc}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map058_event004_quest_item",
    "mapId": 302,
    "eventId": 16,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 328,
    "apId": 535800400,
    "messageIndex": 12,
    "originalMessage": "You find \\C[03]{Uranus Disc}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map060_event011_complex",
    "mapId": 60,
    "eventId": 11,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 128,
    "databaseId": 157,
    "apId": 536001100,
    "messageIndex": 8,
    "originalMessage": "Find \\C[03]{Acid Sprayer}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map061_event006_quest_item",
    "mapId": 61,
    "eventId": 6,
    "pageIndex": 0,
    "commandIndex": 11,
    "commandCode": 126,
    "databaseId": 434,
    "apId": 536100600,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Ratavia Figure}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map064_event011",
    "mapId": 64,
    "eventId": 11,
    "pageIndex": 0,
    "commandIndex": 12,
    "commandCode": 128,
    "databaseId": 25,
    "apId": 536401100,
    "messageIndex": 11,
    "originalMessage": "You find \\C[03]{Old Uniform}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map068_event008",
    "mapId": 68,
    "eventId": 8,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 74,
    "apId": 536800800,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{Claymore}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map069_event006",
    "mapId": 69,
    "eventId": 6,
    "pageIndex": 0,
    "commandIndex": 9,
    "commandCode": 128,
    "databaseId": 9,
    "apId": 536900600,
    "messageIndex": 11,
    "originalMessage": "Find \\C[03]{Denim Vest}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map069_event010",
    "mapId": 69,
    "eventId": 10,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 5,
    "apId": 536901000,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{T-Shirt}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map069_event021_quest_item",
    "mapId": 69,
    "eventId": 21,
    "pageIndex": 0,
    "commandIndex": 7,
    "commandCode": 126,
    "databaseId": 438,
    "apId": 536902100,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{Cerulean Figure}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map071_event005_quest_item",
    "mapId": 71,
    "eventId": 5,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 126,
    "databaseId": 317,
    "apId": 537100500,
    "messageIndex": 14,
    "originalMessage": "Find \\C[03]{Stationery}\\C[00].",
    "apMessage": "Archipelago location checked.",
    "messageVariants": [
        {
            "messageIndex": 9,
            "originalMessage": "Find \\C[3]{Stationery}\\C[0]. Wasn't the \\C[14]strange voice in the pipe\\C[0] looking",
            "apMessage": "Archipelago location checked. Was the voice in the pipe asking"
        }
    ]
}),
        Object.freeze({
    "key": "map071_event022",
    "mapId": 71,
    "eventId": 22,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 321,
    "apId": 537102200,
    "messageIndex": 12,
    "originalMessage": "You find \\C[03]{Sun Disc}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map071_event024",
    "mapId": 71,
    "eventId": 24,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 126,
    "databaseId": 389,
    "apId": 537102400,
    "messageIndex": 7,
    "originalMessage": "Receive \\C[3]{Cell Phone}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map072_event003_quest_item",
    "mapId": 72,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 11,
    "commandCode": 126,
    "databaseId": 327,
    "apId": 537200300,
    "messageIndex": 13,
    "originalMessage": "You find \\C[03]{Saturn Disc}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map072_event005_complex",
    "mapId": 72,
    "eventId": 5,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 199,
    "apId": 537200500,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Silver Magnum}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map073_event008_safe_83",
    "mapId": 73,
    "eventId": 8,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 128,
    "databaseId": 83,
    "apId": 537300800,
    "messageIndex": 9,
    "originalMessage": "Inside you find...\\.\\. \\C[3]$120 \\C[0]in cash, a \\C[3]{Top Hat}\\C[0] and \\C[3]{Dress Shoes}\\C[0].",
    "apMessage": "2 Archipelago locations checked. $120 received.",
    "messageVariants": [
        {
            "messageIndex": 15,
            "originalMessage": "Inside you find...\\.\\. \\C[3]$80 \\C[0]in cash, a \\C[3]{Top Hat}\\C[0] and \\C[3]{Dress Shoes}\\C[0].",
            "apMessage": "2 Archipelago locations checked. $80 received."
        },
        {
            "messageIndex": 20,
            "originalMessage": "Inside you find...\\.\\. \\C[3]$60 \\C[0]in cash, a \\C[3]{Top Hat}\\C[0] and \\C[3]{Dress Shoes}\\C[0].",
            "apMessage": "2 Archipelago locations checked. $60 received."
        }
    ]
}),
        Object.freeze({
    "key": "map073_event008_safe_54",
    "mapId": 73,
    "eventId": 8,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 54,
    "apId": 537300850,
    "messageIndex": 9,
    "originalMessage": "Inside you find...\\.\\. \\C[3]$120 \\C[0]in cash, a \\C[3]{Top Hat}\\C[0] and \\C[3]{Dress Shoes}\\C[0].",
    "apMessage": "2 Archipelago locations checked. $120 received.",
    "messageVariants": [
        {
            "messageIndex": 15,
            "originalMessage": "Inside you find...\\.\\. \\C[3]$80 \\C[0]in cash, a \\C[3]{Top Hat}\\C[0] and \\C[3]{Dress Shoes}\\C[0].",
            "apMessage": "2 Archipelago locations checked. $80 received."
        },
        {
            "messageIndex": 20,
            "originalMessage": "Inside you find...\\.\\. \\C[3]$60 \\C[0]in cash, a \\C[3]{Top Hat}\\C[0] and \\C[3]{Dress Shoes}\\C[0].",
            "apMessage": "2 Archipelago locations checked. $60 received."
        }
    ]
}),
        Object.freeze({
    "key": "map074_event003_elevator_freak",
    "mapId": 74,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 3,
    "commandCode": 121,
    "databaseId": 115,
    "apId": 537400300
}),
        Object.freeze({
    "key": "map077_event004",
    "mapId": 77,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 81,
    "apId": 537700400,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{Combat Knife}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map077_event005",
    "mapId": 77,
    "eventId": 5,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 19,
    "apId": 537700500,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{Flak Jacket}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map077_event007_complex",
    "mapId": 77,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 204,
    "apId": 537700700,
    "messageIndex": 6,
    "originalMessage": "You find \\C[03]{SMG Special}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map080_event003",
    "mapId": 80,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 74,
    "apId": 538000300,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Claymore}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map081_event003",
    "mapId": 81,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 105,
    "apId": 538100300,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Lapis Band}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map085_event024_quest_item",
    "mapId": 85,
    "eventId": 24,
    "pageIndex": 0,
    "commandIndex": 12,
    "commandCode": 126,
    "databaseId": 435,
    "apId": 538502400,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Musk Figure}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "boss_salvage_353",
    "mapId": 86,
    "eventId": 14,
    "pageIndex": 3,
    "commandIndex": 17,
    "commandCode": 128,
    "databaseId": 353,
    "apId": 538601403,
    "messageIndex": 16,
    "originalMessage": "She has found \\C[4]{Demon Plating}\\C[0]",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "boss_salvage_351",
    "mapId": 86,
    "eventId": 58,
    "pageIndex": 3,
    "commandIndex": 17,
    "commandCode": 128,
    "databaseId": 351,
    "apId": 538605803,
    "messageIndex": 16,
    "originalMessage": "She has found \\C[4]{Chrome Finish Plating}\\C[0]",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map086_event060_complex",
    "mapId": 86,
    "eventId": 60,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 153,
    "apId": 538606000,
    "messageIndex": 8,
    "originalMessage": "Find \\C[03]{Flamethrower}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "boss_salvage_352",
    "mapId": 86,
    "eventId": 101,
    "pageIndex": 1,
    "commandIndex": 13,
    "commandCode": 128,
    "databaseId": 352,
    "apId": 538610101,
    "messageIndex": 12,
    "originalMessage": "She has found \\C[4]{Chobham Armor}\\C[0]",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map086_event106",
    "mapId": 86,
    "eventId": 106,
    "pageIndex": 3,
    "commandIndex": 5,
    "commandCode": 126,
    "databaseId": 395,
    "apId": 538610603,
    "messageIndex": 7,
    "originalMessage": "You find \\C[3]{Iris Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map087_event021_quest_item",
    "mapId": 87,
    "eventId": 21,
    "pageIndex": 1,
    "commandIndex": 11,
    "commandCode": 126,
    "databaseId": 306,
    "apId": 538702101,
    "messageIndex": 13,
    "originalMessage": "Find \\C[03]{Janitor Key Ring}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map089_event009_quest_item",
    "mapId": 89,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 12,
    "commandCode": 126,
    "databaseId": 436,
    "apId": 538900900,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Jacket Figure}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map090_event005",
    "mapId": 90,
    "eventId": 5,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 127,
    "databaseId": 25,
    "apId": 539000500,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Mop}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map090_event006",
    "mapId": 90,
    "eventId": 6,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 127,
    "databaseId": 8,
    "apId": 539000600,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Broom}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map090_event007",
    "mapId": 90,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 80,
    "apId": 539000700,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Plastic Gloves}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map090_event008",
    "mapId": 90,
    "eventId": 8,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 43,
    "apId": 539000800,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Gas Mask}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map090_event011_quest_item",
    "mapId": 90,
    "eventId": 11,
    "pageIndex": 0,
    "commandIndex": 12,
    "commandCode": 126,
    "databaseId": 437,
    "apId": 539001100,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Lute Figure}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map092_event045_quest_pickup",
    "mapId": 92,
    "eventId": 45,
    "pageIndex": 2,
    "commandIndex": 11,
    "commandCode": 128,
    "databaseId": 42,
    "apId": 539204502,
    "messageIndex": 13,
    "originalMessage": "You receive \\C[3]{Rusty Crown}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map096_event007",
    "mapId": 96,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 77,
    "apId": 539600700,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Machete}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map097_event009",
    "mapId": 97,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 12,
    "apId": 539700900,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Bottle}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map097_event049_quest_item",
    "mapId": 97,
    "eventId": 49,
    "pageIndex": 0,
    "commandIndex": 14,
    "commandCode": 126,
    "databaseId": 416,
    "apId": 539704900,
    "messageIndex": 13,
    "originalMessage": "You find \\C[03]{Honko's Grand Journey}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map098_event002",
    "mapId": 98,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 9,
    "commandCode": 127,
    "databaseId": 8,
    "apId": 539800200,
    "messageIndex": 12,
    "originalMessage": "Find \\C[03]{Broom}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map098_event014_quest_item",
    "mapId": 98,
    "eventId": 14,
    "pageIndex": 0,
    "commandIndex": 12,
    "commandCode": 126,
    "databaseId": 433,
    "apId": 539801400,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Dustin Figure}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map100_event013",
    "mapId": 100,
    "eventId": 13,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 68,
    "apId": 540001300,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Chef's Knife}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map100_event014",
    "mapId": 100,
    "eventId": 14,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 36,
    "apId": 540001400,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Rolling Pin}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map100_event016_quest_item",
    "mapId": 100,
    "eventId": 16,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 126,
    "databaseId": 318,
    "apId": 540001600,
    "messageIndex": 13,
    "originalMessage": "Find \\C[03]{Fountain Pen}\\C[0].",
    "apMessage": "Archipelago location checked.",
    "messageVariants": [
        {
            "messageIndex": 8,
            "originalMessage": "Find \\C[03]{Fountain Pen}\\C[0]. Wasn't that \\C[14]weird voice in the pipe\\C[0] asking",
            "apMessage": "Archipelago location checked. Wasn't the voice in the pipe asking"
        }
    ]
}),
        Object.freeze({
    "key": "map102_event009",
    "mapId": 102,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 126,
    "databaseId": 305,
    "apId": 540200900,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Child Barrier Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map102_event010",
    "mapId": 102,
    "eventId": 10,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 13,
    "apId": 540201000,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Trench Coat}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map102_event013",
    "mapId": 102,
    "eventId": 13,
    "pageIndex": 0,
    "commandIndex": 9,
    "commandCode": 128,
    "databaseId": 9,
    "apId": 540201300,
    "messageIndex": 12,
    "originalMessage": "Find \\C[03]{Denim Jacket}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map106_event002_quest_item",
    "mapId": 106,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 9,
    "commandCode": 126,
    "databaseId": 325,
    "apId": 540600200,
    "messageIndex": 12,
    "originalMessage": "Find \\C[03]{Mars Disc}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map106_event011_complex",
    "mapId": 106,
    "eventId": 11,
    "pageIndex": 3,
    "commandIndex": 5,
    "commandCode": 127,
    "databaseId": 112,
    "apId": 540601103,
    "messageIndex": 8,
    "originalMessage": "You receive \\C[03]{Rat Claws}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map107_event001_complex",
    "mapId": 107,
    "eventId": 1,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 128,
    "databaseId": 100,
    "apId": 540700100,
    "messageIndex": 14,
    "originalMessage": "Find \\C[03]{Odd Necklace}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map109_event007",
    "mapId": 109,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 31,
    "apId": 540900700,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Metal Bat}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map109_event012_safe_95",
    "mapId": 109,
    "eventId": 12,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 128,
    "databaseId": 95,
    "apId": 540901200,
    "messageIndex": 8,
    "originalMessage": "Inside you find...\\.\\. \\C[3]$320 \\C[0]in cash and a \\C[3]{Gold Locket}\\C[0].",
    "apMessage": "Archipelago location checked. $320 received.",
    "messageVariants": [
        {
            "messageIndex": 14,
            "originalMessage": "Inside you find...\\.\\. \\C[4]$160\\C[0] in cash and a \\C[3]{Gold Locket}\\C[0].",
            "apMessage": "Archipelago location checked. $160 received."
        },
        {
            "messageIndex": 19,
            "originalMessage": "Inside you find...\\.\\. \\C[3]$240\\C[0] in cash and a \\C[3]{Gold Locket}\\C[0].",
            "apMessage": "Archipelago location checked. $240 received."
        }
    ]
}),
        Object.freeze({
    "key": "map110_event010",
    "mapId": 110,
    "eventId": 10,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 126,
    "databaseId": 330,
    "apId": 541001000,
    "messageIndex": 5,
    "originalMessage": "You find \\C[03]{Pluto Disc}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map110_event014",
    "mapId": 110,
    "eventId": 14,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 126,
    "databaseId": 331,
    "apId": 541001400,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Void Disc}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map115_event011",
    "mapId": 115,
    "eventId": 11,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 126,
    "databaseId": 344,
    "apId": 541501100,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Crumpled Manuscript}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map117_event007",
    "mapId": 117,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 126,
    "databaseId": 345,
    "apId": 541700700,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Clean Manuscript}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map119_event010",
    "mapId": 119,
    "eventId": 10,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 10,
    "apId": 541901000,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Windbreaker Jacket}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map119_event014_safe_102",
    "mapId": 119,
    "eventId": 14,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 102,
    "apId": 541901400,
    "messageIndex": 9,
    "originalMessage": "Inside you find...\\.\\. \\C[3]$200\\C[0] in cash and a \\C[3]{Silver Bracelet}\\C[0].",
    "apMessage": "Archipelago location checked. $200 received.",
    "messageVariants": [
        {
            "messageIndex": 15,
            "originalMessage": "Inside you find...\\.\\. \\C[3]$60\\C[0] in cash and a \\C[3]{Silver Bracelet}\\C[0].",
            "apMessage": "Archipelago location checked. $60 received."
        },
        {
            "messageIndex": 20,
            "originalMessage": "Inside you find...\\.\\. \\C[3]$120\\C[0] in cash and a \\C[3]{Silver Bracelet}\\C[0].",
            "apMessage": "Archipelago location checked. $120 received."
        }
    ]
}),
        Object.freeze({
    "key": "map121_event010",
    "mapId": 121,
    "eventId": 10,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 127,
    "databaseId": 50,
    "apId": 542101000,
    "messageIndex": 5,
    "originalMessage": "You find \\C[03]{Spade}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map122_event009_quest_item",
    "mapId": 122,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 12,
    "commandCode": 126,
    "databaseId": 411,
    "apId": 542200900,
    "messageIndex": 11,
    "originalMessage": "You find \\C[03]{Wake the Blood Knight}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map122_event010",
    "mapId": 122,
    "eventId": 10,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 126,
    "databaseId": 322,
    "apId": 542201000,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{Mercury Disc}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map124_event010",
    "mapId": 124,
    "eventId": 10,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 127,
    "databaseId": 27,
    "apId": 542401000,
    "messageIndex": 5,
    "originalMessage": "You find \\C[03]{Hammer}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map126_event002_quest_item",
    "mapId": 126,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 20,
    "commandCode": 126,
    "databaseId": 430,
    "apId": 542600200,
    "messageIndex": 22,
    "originalMessage": "You find \\C[03]{Unlabeled Cartridge}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "boss_salvage_354",
    "mapId": 127,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 18,
    "commandCode": 128,
    "databaseId": 354,
    "apId": 542700300,
    "messageIndex": 17,
    "originalMessage": "She has found \\C[4]{Fungus Fibers}\\C[0]",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "boss_salvage_354",
    "mapId": 127,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 18,
    "commandCode": 128,
    "databaseId": 354,
    "apId": 542700300,
    "messageIndex": 17,
    "originalMessage": "She has found \\C[4]{Fungus Fibers}\\C[0]",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "boss_salvage_354",
    "mapId": 127,
    "eventId": 24,
    "pageIndex": 0,
    "commandIndex": 17,
    "commandCode": 128,
    "databaseId": 354,
    "apId": 542700300,
    "messageIndex": 16,
    "originalMessage": "She has found \\C[4]{Fungus Fibers}\\C[0]",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "boss_salvage_354",
    "mapId": 127,
    "eventId": 24,
    "pageIndex": 1,
    "commandIndex": 17,
    "commandCode": 128,
    "databaseId": 354,
    "apId": 542700300,
    "messageIndex": 16,
    "originalMessage": "She has found \\C[4]{Fungus Fibers}\\C[0]",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "boss_salvage_354",
    "mapId": 127,
    "eventId": 26,
    "pageIndex": 0,
    "commandIndex": 17,
    "commandCode": 128,
    "databaseId": 354,
    "apId": 542700300,
    "messageIndex": 16,
    "originalMessage": "She has found \\C[4]{Fungus Fibers}\\C[0]",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "boss_salvage_354",
    "mapId": 127,
    "eventId": 26,
    "pageIndex": 1,
    "commandIndex": 17,
    "commandCode": 128,
    "databaseId": 354,
    "apId": 542700300,
    "messageIndex": 16,
    "originalMessage": "She has found \\C[4]{Fungus Fibers}\\C[0]",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "boss_salvage_357",
    "mapId": 130,
    "eventId": 9,
    "pageIndex": 1,
    "commandIndex": 18,
    "commandCode": 128,
    "databaseId": 357,
    "apId": 543000901,
    "messageIndex": 17,
    "originalMessage": "She has found \\C[4]{Tank Guns}\\C[0]",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map136_event007",
    "mapId": 136,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 126,
    "databaseId": 297,
    "apId": 543600700,
    "messageIndex": 7,
    "originalMessage": "You fid a \\C[03]{Midnight Zone Valve}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map137_event006",
    "mapId": 137,
    "eventId": 6,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 126,
    "databaseId": 296,
    "apId": 543700600,
    "messageIndex": 7,
    "originalMessage": "You fid a \\C[03]{Twilight Zone Valve}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map138_event006",
    "mapId": 138,
    "eventId": 6,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 126,
    "databaseId": 298,
    "apId": 543800600,
    "messageIndex": 7,
    "originalMessage": "You fid a \\C[03]{Abyssal Zone Valve}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map140_event010",
    "mapId": 140,
    "eventId": 10,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 126,
    "databaseId": 396,
    "apId": 544001000,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Rebreather}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map147_event008",
    "mapId": 147,
    "eventId": 8,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 126,
    "databaseId": 299,
    "apId": 544700800,
    "messageIndex": 7,
    "originalMessage": "You fid a \\C[03]{Hadal Zone Valve}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map149_event052",
    "mapId": 149,
    "eventId": 52,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 263,
    "apId": 544905200,
    "messageIndex": 7,
    "originalMessage": "Find \\C[3]{Hadal Trident}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "boss_salvage_364",
    "mapId": 152,
    "eventId": 6,
    "pageIndex": 0,
    "commandIndex": 13,
    "commandCode": 128,
    "databaseId": 364,
    "apId": 545200600,
    "messageIndex": 12,
    "originalMessage": "She has found \\C[4]{Jousting Lance}\\C[0]",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "boss_salvage_364",
    "mapId": 152,
    "eventId": 6,
    "pageIndex": 1,
    "commandIndex": 13,
    "commandCode": 128,
    "databaseId": 364,
    "apId": 545200600,
    "messageIndex": 12,
    "originalMessage": "She has found \\C[4]{Jousting Lance}\\C[0]",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map181_event003",
    "mapId": 181,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 326,
    "apId": 548100300,
    "messageIndex": 12,
    "originalMessage": "Find \\C[03]{Jupiter Disc}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "landlords_hell_basement_key",
    "mapId": 184,
    "eventId": 1,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 126,
    "databaseId": 303,
    "apId": 548400100,
    "messageIndex": 6,
    "originalMessage": "You find a rusty old \\C[03]{Basement Key}\\C[00].",
    "apMessage": "Archipelago location checked.",
    "sharedConsumedPage": 1
}),
        Object.freeze({
    "key": "landlords_hell_basement_key",
    "mapId": 130,
    "eventId": 11,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 126,
    "databaseId": 303,
    "apId": 548400100,
    "messageIndex": 6,
    "originalMessage": "Find a rusty, old \\C[03]{Basement Key}\\C[00].",
    "apMessage": "Archipelago location checked.",
    "sharedConsumedPage": 1
}),
        Object.freeze({
    "key": "landlords_hell_basement_key",
    "mapId": 204,
    "eventId": 22,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 126,
    "databaseId": 303,
    "apId": 548400100,
    "messageIndex": 6,
    "originalMessage": "You find a rusty old \\C[03]{Basement Key}\\C[00].",
    "apMessage": "Archipelago location checked.",
    "sharedConsumedPage": 1
}),
        Object.freeze({
    "key": "landlords_hell_basement_key",
    "mapId": 205,
    "eventId": 26,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 126,
    "databaseId": 303,
    "apId": 548400100,
    "messageIndex": 6,
    "originalMessage": "You find a rusty old \\C[03]{Basement Key}\\C[00].",
    "apMessage": "Archipelago location checked.",
    "sharedConsumedPage": 1
}),
        Object.freeze({
    "key": "landlords_hell_basement_key",
    "mapId": 206,
    "eventId": 13,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 126,
    "databaseId": 303,
    "apId": 548400100,
    "messageIndex": 6,
    "originalMessage": "You find a rusty old \\C[03]{Basement Key}\\C[00].",
    "apMessage": "Archipelago location checked.",
    "sharedConsumedPage": 1
}),
        Object.freeze({
    "key": "map187_event035_quest_item",
    "mapId": 187,
    "eventId": 35,
    "pageIndex": 0,
    "commandIndex": 9,
    "commandCode": 126,
    "databaseId": 329,
    "apId": 548703500,
    "messageIndex": 11,
    "originalMessage": "Find \\C[03]{Neptune Disc}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map188_event015",
    "mapId": 188,
    "eventId": 15,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 126,
    "databaseId": 304,
    "apId": 548801500,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Store Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map194_event032",
    "mapId": 194,
    "eventId": 32,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 91,
    "apId": 549403200,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{Vintage Sneakers}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map201_event063",
    "mapId": 201,
    "eventId": 63,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 126,
    "databaseId": 395,
    "apId": 550106300,
    "messageIndex": 5,
    "originalMessage": "You find \\C[3]{Iris Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map203_event038_quest_item",
    "mapId": 203,
    "eventId": 38,
    "pageIndex": 0,
    "commandIndex": 12,
    "commandCode": 126,
    "databaseId": 415,
    "apId": 550303800,
    "messageIndex": 11,
    "originalMessage": "You find \\C[03]{Catafalque}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "boss_salvage_356",
    "mapId": 207,
    "eventId": 22,
    "pageIndex": 3,
    "commandIndex": 11,
    "commandCode": 128,
    "databaseId": 356,
    "apId": 550702203,
    "messageIndex": 10,
    "originalMessage": "She has found \\C[4]{Tank Tracks}\\C[0]",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map208_event018",
    "mapId": 208,
    "eventId": 18,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 15,
    "apId": 550801800,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{Baseball Bat}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map209_event004_complex",
    "mapId": 209,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 23,
    "commandCode": 128,
    "databaseId": 273,
    "apId": 550900400,
    "messageIndex": 22,
    "originalMessage": "Find \\I[147]\\C[03]{War Medal}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map219_event032",
    "mapId": 219,
    "eventId": 32,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 72,
    "apId": 551903200,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{Fireman's Axe}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map230_event003_complex",
    "mapId": 230,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 208,
    "apId": 553000300,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{War Rifle}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "boss_salvage_365",
    "mapId": 233,
    "eventId": 11,
    "pageIndex": 2,
    "commandIndex": 11,
    "commandCode": 128,
    "databaseId": 365,
    "apId": 553301102,
    "messageIndex": 10,
    "originalMessage": "She has found \\C[4]{Cope Cage}\\C[0]",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map234_event002_quest_item",
    "mapId": 234,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 11,
    "commandCode": 126,
    "databaseId": 418,
    "apId": 553400200,
    "messageIndex": 10,
    "originalMessage": "You find \\C[03]{Wraithscourge}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map237_event009_complex",
    "mapId": 237,
    "eventId": 9,
    "pageIndex": 3,
    "commandIndex": 9,
    "commandCode": 128,
    "databaseId": 186,
    "apId": 553700903,
    "messageIndex": 11,
    "originalMessage": "Find \\C[03]{Cowboy Hat}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map238_event006_complex",
    "mapId": 238,
    "eventId": 6,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 136,
    "apId": 553800600,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Hunting Shotgun}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map240_event043",
    "mapId": 240,
    "eventId": 43,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 50,
    "apId": 554004300,
    "messageIndex": 6,
    "originalMessage": "You find \\C[03]{Spade}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map255_event003",
    "mapId": 255,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 25,
    "apId": 555500300,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{Mop}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map255_event005",
    "mapId": 255,
    "eventId": 5,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 85,
    "apId": 555500500,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{Rubber Boots}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map255_event006",
    "mapId": 255,
    "eventId": 6,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 57,
    "apId": 555500600,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{Hard Hat}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map255_event007",
    "mapId": 255,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 80,
    "apId": 555500700,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{Plastic Gloves}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map256_event017",
    "mapId": 256,
    "eventId": 17,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 67,
    "apId": 555601700,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Indigo Hockey Mask}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map257_event012",
    "mapId": 257,
    "eventId": 12,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 14,
    "apId": 555701200,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{Padded Jacket}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map258_event017_safe_104",
    "mapId": 258,
    "eventId": 17,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 128,
    "databaseId": 104,
    "apId": 555801700,
    "messageIndex": 8,
    "originalMessage": "Inside you find...\\.\\. \\C[3]$160 \\C[0]in cash and a \\C[3]{Gold Bracelet}\\C[0].",
    "apMessage": "Archipelago location checked. $160 received.",
    "messageVariants": [
        {
            "messageIndex": 14,
            "originalMessage": "Inside you find...\\.\\. \\C[4]$120\\C[0] in cash and a \\C[3]{Gold Bracelet}\\C[0].",
            "apMessage": "Archipelago location checked. $120 received."
        },
        {
            "messageIndex": 19,
            "originalMessage": "Inside you find...\\.\\. \\C[3]$80\\C[0] in cash and a \\C[3]{Gold Bracelet}\\C[0].",
            "apMessage": "Archipelago location checked. $80 received."
        }
    ]
}),
        Object.freeze({
    "key": "boss_salvage_355",
    "mapId": 270,
    "eventId": 6,
    "pageIndex": 1,
    "commandIndex": 26,
    "commandCode": 128,
    "databaseId": 355,
    "apId": 557000601,
    "messageIndex": 25,
    "originalMessage": "She has found \\C[4]{Leather Skin}\\C[0]",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "boss_salvage_355",
    "mapId": 270,
    "eventId": 6,
    "pageIndex": 2,
    "commandIndex": 26,
    "commandCode": 128,
    "databaseId": 355,
    "apId": 557000601,
    "messageIndex": 25,
    "originalMessage": "She has found \\C[4]{Leather Skin}\\C[0]",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map271_event006",
    "mapId": 271,
    "eventId": 6,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 127,
    "databaseId": 116,
    "apId": 557100600,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Hockey Stick}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map273_event005",
    "mapId": 273,
    "eventId": 5,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 53,
    "apId": 557300500,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Trilby}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map275_event004",
    "mapId": 275,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 127,
    "databaseId": 83,
    "apId": 557500400,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Scalpel}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map275_event007_safe_96",
    "mapId": 275,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 128,
    "databaseId": 96,
    "apId": 557500700,
    "messageIndex": 8,
    "originalMessage": "Inside you find...\\.\\. \\C[3]$160 \\C[0]in cash and a \\C[3]{Gold Ring}\\C[0].",
    "apMessage": "Archipelago location checked. $160 received.",
    "messageVariants": [
        {
            "messageIndex": 14,
            "originalMessage": "Inside you find...\\.\\. \\C[4]$120\\C[0] in cash and a \\C[3]{Gold Ring}\\C[0].",
            "apMessage": "Archipelago location checked. $120 received."
        },
        {
            "messageIndex": 19,
            "originalMessage": "Inside you find...\\.\\. \\C[3]$80\\C[0] in cash and a \\C[3]{Gold Ring}\\C[0].",
            "apMessage": "Archipelago location checked. $80 received."
        }
    ]
}),
        Object.freeze({
    "key": "map276_event005",
    "mapId": 276,
    "eventId": 5,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 68,
    "apId": 557600500,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Chef's Knife}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map277_event004_quest_item",
    "mapId": 277,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 12,
    "commandCode": 126,
    "databaseId": 378,
    "apId": 557700400,
    "messageIndex": 11,
    "originalMessage": "Find \\C[03]{Shrunken Head}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map280_event006",
    "mapId": 280,
    "eventId": 6,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 128,
    "databaseId": 293,
    "apId": 558000600,
    "messageIndex": 13,
    "originalMessage": "Find \\C[03]{Patchwork Boots}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map281_event002",
    "mapId": 281,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 127,
    "databaseId": 133,
    "apId": 558100200,
    "messageIndex": 8,
    "originalMessage": "Find \\C[03]{Patchwork Club}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map282_event002",
    "mapId": 282,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 128,
    "databaseId": 291,
    "apId": 558200200,
    "messageIndex": 8,
    "originalMessage": "Find \\C[03]{Patchwork Hat}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map283_event003",
    "mapId": 283,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 294,
    "apId": 558300300,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Needle Gloves}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map284_event004",
    "mapId": 284,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 128,
    "databaseId": 292,
    "apId": 558400400,
    "messageIndex": 8,
    "originalMessage": "Find \\C[03]{Patchwork Jacket}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map285_event010",
    "mapId": 285,
    "eventId": 10,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 127,
    "databaseId": 70,
    "apId": 558501000,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Cleaver}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map285_event012",
    "mapId": 285,
    "eventId": 12,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 127,
    "databaseId": 25,
    "apId": 558501200,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Mop}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map286_event023",
    "mapId": 286,
    "eventId": 23,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 21,
    "apId": 558602300,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{A Studded Jacket}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map286_event026",
    "mapId": 286,
    "eventId": 26,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 91,
    "apId": 558602600,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Vintage Sneakers}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map287_event027",
    "mapId": 287,
    "eventId": 27,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 62,
    "apId": 558702700,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Motorcycle Helmet}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map290_event006",
    "mapId": 290,
    "eventId": 6,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 70,
    "apId": 559000600,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Cleaver}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map291_event006",
    "mapId": 291,
    "eventId": 6,
    "pageIndex": 0,
    "commandIndex": 9,
    "commandCode": 128,
    "databaseId": 49,
    "apId": 559100600,
    "messageIndex": 12,
    "originalMessage": "Find \\C[03]{Cowboy Hat}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map296_event006",
    "mapId": 296,
    "eventId": 6,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 276,
    "apId": 559600600,
    "messageIndex": 5,
    "originalMessage": "Find \\I[147]\\C[03]{Headphones}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map297_event004",
    "mapId": 297,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 66,
    "apId": 559700400,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Old Axe}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map297_event005",
    "mapId": 297,
    "eventId": 5,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 126,
    "databaseId": 364,
    "apId": 559700500,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Electronic Car Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map298_event007_quest_item",
    "mapId": 298,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 12,
    "commandCode": 126,
    "databaseId": 424,
    "apId": 559800700,
    "messageIndex": 11,
    "originalMessage": "You find \\C[03]{Frogit About it}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map299_event007",
    "mapId": 299,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 127,
    "databaseId": 17,
    "apId": 559900700,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Frying Pan}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map300_event004",
    "mapId": 300,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 12,
    "apId": 560000400,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Winter Coat}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map308_event001",
    "mapId": 308,
    "eventId": 1,
    "pageIndex": 0,
    "commandIndex": 12,
    "commandCode": 127,
    "databaseId": 141,
    "apId": 560800100,
    "messageIndex": 14,
    "originalMessage": "Find \\C[3]{Hellsword}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map334_event009",
    "mapId": 334,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 85,
    "apId": 563400900,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Rubber Boots}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map339_event012",
    "mapId": 339,
    "eventId": 12,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 127,
    "databaseId": 211,
    "apId": 563901200,
    "messageIndex": 7,
    "originalMessage": "Find \\C[3]{Azure Greatsword}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map348_event005",
    "mapId": 348,
    "eventId": 5,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 126,
    "databaseId": 395,
    "apId": 564800500,
    "messageIndex": 5,
    "originalMessage": "You find \\C[3]{Iris Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map352_event014",
    "mapId": 352,
    "eventId": 14,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 127,
    "databaseId": 77,
    "apId": 565201400,
    "messageIndex": 5,
    "originalMessage": "You find \\C[03]{Machete}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map352_event015",
    "mapId": 352,
    "eventId": 15,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 86,
    "apId": 565201500,
    "messageIndex": 5,
    "originalMessage": "You find \\C[03]{Clogs}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map355_event035",
    "mapId": 355,
    "eventId": 35,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 127,
    "databaseId": 52,
    "apId": 565503500,
    "messageIndex": 7,
    "originalMessage": "Found \\C[3]{Pitchfork}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map355_event036",
    "mapId": 355,
    "eventId": 36,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 127,
    "databaseId": 206,
    "apId": 565503600,
    "messageIndex": 7,
    "originalMessage": "Found \\C[3]{Snake Whip}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map359_event003_quest_item",
    "mapId": 359,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 126,
    "databaseId": 385,
    "apId": 565900300,
    "messageIndex": 6,
    "originalMessage": "Find \\C[03]{Apt 35 Keys}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map360_event004",
    "mapId": 360,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 126,
    "databaseId": 386,
    "apId": 566000400,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Telescope Pieces}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map378_event003",
    "mapId": 378,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 52,
    "apId": 567800300,
    "messageIndex": 7,
    "originalMessage": "Find \\C[3]{Pitchfork}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map380_event003_quest_item",
    "mapId": 380,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 392,
    "apId": 568000300,
    "messageIndex": 12,
    "originalMessage": "Find \\C[03]{Old Photograph}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map393_event012",
    "mapId": 393,
    "eventId": 12,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 126,
    "databaseId": 395,
    "apId": 569301200,
    "messageIndex": 5,
    "originalMessage": "You find \\C[3]{Iris Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map401_event007_quest_item",
    "mapId": 401,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 393,
    "apId": 570100700,
    "messageIndex": 12,
    "originalMessage": "Find \\C[03]{Wrapped Painting}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map406_event002_quest_item",
    "mapId": 406,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 390,
    "apId": 570600200,
    "messageIndex": 12,
    "originalMessage": "Find \\C[03]{Last Will}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map406_event016",
    "mapId": 406,
    "eventId": 16,
    "pageIndex": 0,
    "commandIndex": 0,
    "commandCode": 126,
    "databaseId": 656,
    "apId": 570601600
}),
        Object.freeze({
    "key": "map408_event010",
    "mapId": 408,
    "eventId": 10,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 128,
    "databaseId": 277,
    "apId": 570801000,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Biting Boots}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map415_event006",
    "mapId": 415,
    "eventId": 6,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 127,
    "databaseId": 241,
    "apId": 571500600,
    "messageIndex": 5,
    "originalMessage": "You find \\C[03]{Ocular Tetherblade}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map421_event004",
    "mapId": 421,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 127,
    "databaseId": 246,
    "apId": 572100400,
    "messageIndex": 5,
    "originalMessage": "You find \\C[03]{Goblin Claws}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map424_event008",
    "mapId": 424,
    "eventId": 8,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 126,
    "databaseId": 395,
    "apId": 572400800,
    "messageIndex": 5,
    "originalMessage": "You find \\C[3]{Iris Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map426_event001",
    "mapId": 426,
    "eventId": 1,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 126,
    "databaseId": 395,
    "apId": 572600100,
    "messageIndex": 5,
    "originalMessage": "You find \\C[3]{Iris Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map429_event001",
    "mapId": 429,
    "eventId": 1,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 126,
    "databaseId": 395,
    "apId": 572900100,
    "messageIndex": 5,
    "originalMessage": "You find \\C[3]{Iris Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map430_event016_quest_pickup",
    "mapId": 430,
    "eventId": 16,
    "pageIndex": 1,
    "commandIndex": 4,
    "commandCode": 128,
    "databaseId": 337,
    "apId": 573001601,
    "messageIndex": 1,
    "originalMessage": "There is a jacket on the floor.",
    "apMessage": "An Archipelago location is on the floor."
}),
        Object.freeze({
    "key": "map433_event009_quest_pickup",
    "mapId": 433,
    "eventId": 9,
    "pageIndex": 2,
    "commandIndex": 11,
    "commandCode": 127,
    "databaseId": 165,
    "apId": 573300902,
    "resolutionFamily": "hellen_resolution",
    "messageIndex": 10,
    "originalMessage": "Receive \\C[3]{Hellen's Shears}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "leighs_call_ring",
    "mapId": 434,
    "eventId": 1,
    "pageIndex": 0,
    "commandIndex": 61,
    "commandCode": 128,
    "databaseId": 283,
    "apId": 573400100,
    "messageIndex": 63,
    "originalMessage": "Find \\C[3]{Martin's Ring}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map436_event008",
    "mapId": 436,
    "eventId": 8,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 128,
    "databaseId": 220,
    "apId": 573600800,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Jaw Revolver}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map436_event010",
    "mapId": 436,
    "eventId": 10,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 128,
    "databaseId": 224,
    "apId": 573601000,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Tooth Rifle}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map436_event011",
    "mapId": 436,
    "eventId": 11,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 127,
    "databaseId": 219,
    "apId": 573601100,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Tooth Scimitar}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map439_event009",
    "mapId": 439,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 0,
    "commandCode": 126,
    "databaseId": 652,
    "apId": 573900900
}),
        Object.freeze({
    "key": "map439_event010",
    "mapId": 439,
    "eventId": 10,
    "pageIndex": 0,
    "commandIndex": 0,
    "commandCode": 126,
    "databaseId": 653,
    "apId": 573901000
}),
        Object.freeze({
    "key": "map440_event012",
    "mapId": 440,
    "eventId": 12,
    "pageIndex": 0,
    "commandIndex": 0,
    "commandCode": 126,
    "databaseId": 654,
    "apId": 574001200
}),
        Object.freeze({
    "key": "map441_event005",
    "mapId": 441,
    "eventId": 5,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 376,
    "apId": 574100500,
    "messageIndex": 5,
    "originalMessage": "Find \\C[3]{Ftblhelmt}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map442_event007",
    "mapId": 442,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 0,
    "commandCode": 126,
    "databaseId": 653,
    "apId": 574200700
}),
        Object.freeze({
    "key": "map442_event009_quest_pickup",
    "mapId": 442,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 31,
    "commandCode": 128,
    "databaseId": 297,
    "apId": 574200900,
    "messageIndex": 14,
    "originalMessage": "You \\C[5]fi\\C[20]nd {AAAAA\\C[10]AAAAAAAAAAAA\\C[18]AAAAAAAAAAAAAAAAAAAAAAAAAMBROS}\\C[0]",
    "apMessage": "Archipelago location checked. Ambrose's other supplies received."
}),
        Object.freeze({
    "key": "map443_event008",
    "mapId": 443,
    "eventId": 8,
    "pageIndex": 0,
    "commandIndex": 0,
    "commandCode": 126,
    "databaseId": 653,
    "apId": 574300800
}),
        Object.freeze({
    "key": "map443_event013",
    "mapId": 443,
    "eventId": 13,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 374,
    "apId": 574301300,
    "messageIndex": 5,
    "originalMessage": "Find \\C[3]{Vnage ucky tieakeRs}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map444_event002",
    "mapId": 444,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 0,
    "commandCode": 126,
    "databaseId": 655,
    "apId": 574400200
}),
        Object.freeze({
    "key": "map446_event004",
    "mapId": 446,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 0,
    "commandCode": 126,
    "databaseId": 651,
    "apId": 574600400
}),
        Object.freeze({
    "key": "map448_event006",
    "mapId": 448,
    "eventId": 6,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 128,
    "databaseId": 375,
    "apId": 574800600,
    "messageIndex": 5,
    "originalMessage": "Find \\C[3]{RmyJcket}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map450_event004",
    "mapId": 450,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 127,
    "databaseId": 230,
    "apId": 575000400,
    "messageIndex": 5,
    "originalMessage": "Find \\C[3]{Me[ttal Ba2t}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map456_event001_quest_item",
    "mapId": 456,
    "eventId": 1,
    "pageIndex": 0,
    "commandIndex": 11,
    "commandCode": 126,
    "databaseId": 391,
    "apId": 575600100,
    "messageIndex": 13,
    "originalMessage": "Find \\C[03]{Old Tape}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map457_event008",
    "mapId": 457,
    "eventId": 8,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 127,
    "databaseId": 72,
    "apId": 575700800,
    "messageIndex": 5,
    "originalMessage": "Find \\C[03]{Fireman's Axe}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map465_event002",
    "mapId": 465,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 127,
    "databaseId": 196,
    "apId": 576500200,
    "messageIndex": 6,
    "originalMessage": "Find \\C[12]{Voidblade}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "wilhelmina_reward_sword",
    "mapId": 169,
    "eventId": 2,
    "pageIndex": 1,
    "commandIndex": 107,
    "commandCode": 127,
    "databaseId": 158,
    "apId": 590000100,
    "messageIndex": 109,
    "originalMessage": "Find \\C[3]{Spellsword}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "wilhelmina_reward_spear",
    "mapId": 169,
    "eventId": 2,
    "pageIndex": 1,
    "commandIndex": 118,
    "commandCode": 127,
    "databaseId": 156,
    "apId": 590000101,
    "messageIndex": 120,
    "originalMessage": "Find \\C[3]{Spear of the Word}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "wilhelmina_reward_hammer",
    "mapId": 169,
    "eventId": 2,
    "pageIndex": 1,
    "commandIndex": 129,
    "commandCode": 127,
    "databaseId": 154,
    "apId": 590000102,
    "messageIndex": 131,
    "originalMessage": "Find \\C[3]{Wordsmith's Hammer}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "wilhelmina_reward_gun",
    "mapId": 169,
    "eventId": 2,
    "pageIndex": 1,
    "commandIndex": 137,
    "commandCode": 128,
    "databaseId": 213,
    "apId": 590000103,
    "messageIndex": 139,
    "originalMessage": "Find \\C[3]{Babylon Typewriter}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "wilhelmina_reward_book",
    "mapId": 169,
    "eventId": 2,
    "pageIndex": 1,
    "commandIndex": 145,
    "commandCode": 128,
    "databaseId": 290,
    "apId": 590000104,
    "messageIndex": 147,
    "originalMessage": "Find \\C[3]{Tome of Words}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "boss_drop_184_10",
    "mapId": 86,
    "eventId": 101,
    "pageIndex": 1,
    "commandIndex": 2,
    "commandCode": 301,
    "databaseId": 10,
    "apId": 591000001,
    "battleDrop": {
        "enemyId": 184,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            184,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_189_10",
    "mapId": 86,
    "eventId": 58,
    "pageIndex": 3,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 10,
    "apId": 591000002,
    "battleDrop": {
        "enemyId": 189,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            188,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_228_56",
    "mapId": 127,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 56,
    "apId": 591000003,
    "battleDrop": {
        "enemyId": 228,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            208,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_228_56",
    "mapId": 127,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 56,
    "apId": 591000003,
    "battleDrop": {
        "enemyId": 228,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            208,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_228_56",
    "mapId": 127,
    "eventId": 24,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 56,
    "apId": 591000003,
    "battleDrop": {
        "enemyId": 228,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            208,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_228_56",
    "mapId": 127,
    "eventId": 24,
    "pageIndex": 1,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 56,
    "apId": 591000003,
    "battleDrop": {
        "enemyId": 228,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            208,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_228_56",
    "mapId": 127,
    "eventId": 26,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 56,
    "apId": 591000003,
    "battleDrop": {
        "enemyId": 228,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            208,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_228_56",
    "mapId": 127,
    "eventId": 26,
    "pageIndex": 1,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 56,
    "apId": 591000003,
    "battleDrop": {
        "enemyId": 228,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            208,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_100_41",
    "mapId": 92,
    "eventId": 45,
    "pageIndex": 1,
    "commandIndex": 4,
    "commandCode": 301,
    "databaseId": 41,
    "apId": 591000010,
    "battleDrop": {
        "enemyId": 100,
        "dropIndex": 2,
        "kind": 3,
        "parameters": [
            0,
            111,
            true,
            true
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_164_48",
    "mapId": 269,
    "eventId": 13,
    "pageIndex": 0,
    "commandIndex": 2,
    "commandCode": 301,
    "databaseId": 48,
    "apId": 591000011,
    "battleDrop": {
        "enemyId": 164,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            164,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_164_48",
    "mapId": 269,
    "eventId": 13,
    "pageIndex": 1,
    "commandIndex": 2,
    "commandCode": 301,
    "databaseId": 48,
    "apId": 591000011,
    "battleDrop": {
        "enemyId": 164,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            164,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_267_347",
    "mapId": 158,
    "eventId": 8,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 347,
    "apId": 591000012,
    "battleDrop": {
        "enemyId": 267,
        "dropIndex": 0,
        "kind": 3,
        "parameters": [
            0,
            322,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_421_116",
    "mapId": 202,
    "eventId": 18,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 116,
    "apId": 591000013,
    "battleDrop": {
        "enemyId": 421,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            413,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_421_116",
    "mapId": 202,
    "eventId": 18,
    "pageIndex": 1,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 116,
    "apId": 591000013,
    "battleDrop": {
        "enemyId": 421,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            413,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_423_145",
    "mapId": 201,
    "eventId": 34,
    "pageIndex": 3,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 145,
    "apId": 591000014,
    "battleDrop": {
        "enemyId": 423,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            232,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_619_260",
    "mapId": 50,
    "eventId": 11,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 260,
    "apId": 591000015,
    "battleDrop": {
        "enemyId": 619,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            614,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_619_260",
    "mapId": 50,
    "eventId": 11,
    "pageIndex": 1,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 260,
    "apId": 591000015,
    "battleDrop": {
        "enemyId": 619,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            614,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_619_44",
    "mapId": 50,
    "eventId": 11,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 44,
    "apId": 591000016,
    "battleDrop": {
        "enemyId": 619,
        "dropIndex": 1,
        "kind": 3,
        "parameters": [
            0,
            614,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_619_44",
    "mapId": 50,
    "eventId": 11,
    "pageIndex": 1,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 44,
    "apId": 591000016,
    "battleDrop": {
        "enemyId": 619,
        "dropIndex": 1,
        "kind": 3,
        "parameters": [
            0,
            614,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_824_377",
    "mapId": 445,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 377,
    "apId": 591000017,
    "battleDrop": {
        "enemyId": 824,
        "dropIndex": 0,
        "kind": 3,
        "parameters": [
            0,
            765,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_21_3",
    "mapId": 35,
    "eventId": 20,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 301,
    "databaseId": 3,
    "apId": 591000018,
    "battleDrop": {
        "enemyId": 21,
        "dropIndex": 1,
        "kind": 3,
        "parameters": [
            0,
            21,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_226_288",
    "mapId": 127,
    "eventId": 2,
    "pageIndex": 1,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 288,
    "apId": 591000019,
    "battleDrop": {
        "enemyId": 226,
        "dropIndex": 1,
        "kind": 3,
        "parameters": [
            0,
            215,
            false,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_707_366",
    "mapId": 353,
    "eventId": 21,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 366,
    "apId": 591000020,
    "battleDrop": {
        "enemyId": 707,
        "dropIndex": 0,
        "kind": 3,
        "parameters": [
            0,
            644,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_707_366",
    "mapId": 353,
    "eventId": 21,
    "pageIndex": 1,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 366,
    "apId": 591000020,
    "battleDrop": {
        "enemyId": 707,
        "dropIndex": 0,
        "kind": 3,
        "parameters": [
            0,
            644,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_708_367",
    "mapId": 353,
    "eventId": 19,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 367,
    "apId": 591000021,
    "battleDrop": {
        "enemyId": 708,
        "dropIndex": 0,
        "kind": 3,
        "parameters": [
            0,
            645,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_708_367",
    "mapId": 353,
    "eventId": 19,
    "pageIndex": 1,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 367,
    "apId": 591000021,
    "battleDrop": {
        "enemyId": 708,
        "dropIndex": 0,
        "kind": 3,
        "parameters": [
            0,
            645,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_709_369",
    "mapId": 35,
    "eventId": 28,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 369,
    "apId": 591000022,
    "battleDrop": {
        "enemyId": 709,
        "dropIndex": 0,
        "kind": 3,
        "parameters": [
            0,
            646,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_709_369",
    "mapId": 35,
    "eventId": 28,
    "pageIndex": 1,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 369,
    "apId": 591000022,
    "battleDrop": {
        "enemyId": 709,
        "dropIndex": 0,
        "kind": 3,
        "parameters": [
            0,
            646,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_710_368",
    "mapId": 23,
    "eventId": 57,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 368,
    "apId": 591000023,
    "battleDrop": {
        "enemyId": 710,
        "dropIndex": 0,
        "kind": 3,
        "parameters": [
            0,
            647,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_710_368",
    "mapId": 23,
    "eventId": 57,
    "pageIndex": 1,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 368,
    "apId": 591000023,
    "battleDrop": {
        "enemyId": 710,
        "dropIndex": 0,
        "kind": 3,
        "parameters": [
            0,
            647,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_821_228",
    "mapId": 449,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 11,
    "commandCode": 301,
    "databaseId": 228,
    "apId": 591000024,
    "battleDrop": {
        "enemyId": 821,
        "dropIndex": 1,
        "kind": 3,
        "parameters": [
            0,
            764,
            false,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_28_143",
    "mapId": 34,
    "eventId": 13,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 301,
    "databaseId": 143,
    "apId": 591000030,
    "battleDrop": {
        "enemyId": 28,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            24,
            true,
            true
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_450_135",
    "mapId": 270,
    "eventId": 6,
    "pageIndex": 1,
    "commandIndex": 3,
    "commandCode": 301,
    "databaseId": 135,
    "apId": 591000031,
    "battleDrop": {
        "enemyId": 450,
        "dropIndex": 1,
        "kind": 2,
        "parameters": [
            0,
            441,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_450_135",
    "mapId": 270,
    "eventId": 6,
    "pageIndex": 2,
    "commandIndex": 3,
    "commandCode": 301,
    "databaseId": 135,
    "apId": 591000031,
    "battleDrop": {
        "enemyId": 450,
        "dropIndex": 1,
        "kind": 2,
        "parameters": [
            0,
            441,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_889_275",
    "mapId": 463,
    "eventId": 5,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 275,
    "apId": 591000032,
    "battleDrop": {
        "enemyId": 889,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            746,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_293_280",
    "mapId": 70,
    "eventId": 57,
    "pageIndex": 0,
    "commandIndex": 61,
    "commandCode": 301,
    "databaseId": 280,
    "apId": 591000040,
    "resolutionFamily": "high_five_resolution",
    "battleDrop": {
        "enemyId": 293,
        "dropIndex": 0,
        "kind": 1,
        "parameters": [
            0,
            225,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_293_280",
    "mapId": 70,
    "eventId": 57,
    "pageIndex": 1,
    "commandIndex": 62,
    "commandCode": 301,
    "databaseId": 280,
    "apId": 591000040,
    "resolutionFamily": "high_five_resolution",
    "battleDrop": {
        "enemyId": 293,
        "dropIndex": 0,
        "kind": 1,
        "parameters": [
            0,
            225,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_293_280",
    "mapId": 70,
    "eventId": 58,
    "pageIndex": 0,
    "commandIndex": 41,
    "commandCode": 301,
    "databaseId": 280,
    "apId": 591000040,
    "resolutionFamily": "high_five_resolution",
    "battleDrop": {
        "enemyId": 293,
        "dropIndex": 0,
        "kind": 1,
        "parameters": [
            0,
            225,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_293_280",
    "mapId": 70,
    "eventId": 58,
    "pageIndex": 1,
    "commandIndex": 41,
    "commandCode": 301,
    "databaseId": 280,
    "apId": 591000040,
    "resolutionFamily": "high_five_resolution",
    "battleDrop": {
        "enemyId": 293,
        "dropIndex": 0,
        "kind": 1,
        "parameters": [
            0,
            225,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_293_280",
    "mapId": 70,
    "eventId": 59,
    "pageIndex": 0,
    "commandIndex": 24,
    "commandCode": 301,
    "databaseId": 280,
    "apId": 591000040,
    "resolutionFamily": "high_five_resolution",
    "battleDrop": {
        "enemyId": 293,
        "dropIndex": 0,
        "kind": 1,
        "parameters": [
            0,
            225,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_293_280",
    "mapId": 70,
    "eventId": 59,
    "pageIndex": 1,
    "commandIndex": 24,
    "commandCode": 301,
    "databaseId": 280,
    "apId": 591000040,
    "resolutionFamily": "high_five_resolution",
    "battleDrop": {
        "enemyId": 293,
        "dropIndex": 0,
        "kind": 1,
        "parameters": [
            0,
            225,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_293_280",
    "mapId": 70,
    "eventId": 60,
    "pageIndex": 0,
    "commandIndex": 23,
    "commandCode": 301,
    "databaseId": 280,
    "apId": 591000040,
    "resolutionFamily": "high_five_resolution",
    "battleDrop": {
        "enemyId": 293,
        "dropIndex": 0,
        "kind": 1,
        "parameters": [
            0,
            225,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_293_280",
    "mapId": 70,
    "eventId": 60,
    "pageIndex": 1,
    "commandIndex": 23,
    "commandCode": 301,
    "databaseId": 280,
    "apId": 591000040,
    "resolutionFamily": "high_five_resolution",
    "battleDrop": {
        "enemyId": 293,
        "dropIndex": 0,
        "kind": 1,
        "parameters": [
            0,
            225,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_293_280",
    "mapId": 70,
    "eventId": 71,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 301,
    "databaseId": 280,
    "apId": 591000040,
    "resolutionFamily": "high_five_resolution",
    "battleDrop": {
        "enemyId": 293,
        "dropIndex": 0,
        "kind": 1,
        "parameters": [
            0,
            225,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_293_280",
    "mapId": 70,
    "eventId": 71,
    "pageIndex": 1,
    "commandIndex": 4,
    "commandCode": 301,
    "databaseId": 280,
    "apId": 591000040,
    "resolutionFamily": "high_five_resolution",
    "battleDrop": {
        "enemyId": 293,
        "dropIndex": 0,
        "kind": 1,
        "parameters": [
            0,
            225,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_415_379",
    "mapId": 197,
    "eventId": 17,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000041,
    "battleDrop": {
        "enemyId": 415,
        "dropIndex": 0,
        "kind": 1,
        "parameters": [
            0,
            407,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_415_379",
    "mapId": 197,
    "eventId": 17,
    "pageIndex": 1,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000041,
    "battleDrop": {
        "enemyId": 415,
        "dropIndex": 0,
        "kind": 1,
        "parameters": [
            0,
            407,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 189,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 192,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 193,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 194,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 195,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 196,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 197,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 198,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 199,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 200,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 201,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 202,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 203,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 219,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 241,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 242,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 243,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 244,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 245,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 246,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 247,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 248,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 249,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 250,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 251,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 252,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 253,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 254,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 0,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "boss_drop_424_379",
    "mapId": 256,
    "eventId": 10,
    "pageIndex": 2,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 379,
    "apId": 591000042,
    "battleDrop": {
        "enemyId": 424,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            206,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "joel_peaceful_door_knob",
    "mapId": 32,
    "eventId": 7,
    "pageIndex": 1,
    "commandIndex": 52,
    "commandCode": 126,
    "databaseId": 310,
    "apId": 592000001,
    "resolutionFamily": "joel_resolution",
    "troopId": 26,
    "requiredVariables": [
        {
            "id": 107,
            "values": [
                7,
                8
            ]
        }
    ],
    "messageIndex": 54,
    "originalMessage": "You receive a \\C[03]{Door Knob}\\C[00].",
    "apMessage": "Archipelago: Joel Resolution complete (2 checks)."
}),
        Object.freeze({
    "key": "joel_peaceful_door_knob",
    "mapId": 32,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 9,
    "commandCode": 126,
    "databaseId": 310,
    "apId": 592000001,
    "resolutionFamily": "joel_resolution",
    "messageIndex": 11,
    "originalMessage": "You find \\C[3]{Door Knob}\\C[0].",
    "apMessage": "Archipelago: Joel Resolution complete (2 checks)."
}),
        Object.freeze({
    "key": "joel_peaceful_door_knob",
    "mapId": 32,
    "eventId": 7,
    "pageIndex": 1,
    "commandIndex": 9,
    "commandCode": 126,
    "databaseId": 310,
    "apId": 592000001,
    "resolutionFamily": "joel_resolution",
    "messageIndex": 11,
    "originalMessage": "You find \\C[3]{Door Knob}\\C[0].",
    "apMessage": "Archipelago: Joel Resolution complete (2 checks)."
}),
        Object.freeze({
    "key": "joel_peaceful_door_knob",
    "mapId": 32,
    "eventId": 7,
    "pageIndex": 2,
    "commandIndex": 8,
    "commandCode": 126,
    "databaseId": 310,
    "apId": 592000001,
    "resolutionFamily": "joel_resolution",
    "messageIndex": 10,
    "originalMessage": "You find \\C[3]{Door Knob}\\C[0].",
    "apMessage": "Archipelago: Joel Resolution complete (2 checks)."
}),
        Object.freeze({
    "key": "joel_peaceful_door_knob",
    "mapId": 32,
    "eventId": 7,
    "pageIndex": 3,
    "commandIndex": 8,
    "commandCode": 126,
    "databaseId": 310,
    "apId": 592000001,
    "resolutionFamily": "joel_resolution",
    "messageIndex": 10,
    "originalMessage": "You find \\C[3]{Door Knob}\\C[0].",
    "apMessage": "Archipelago: Joel Resolution complete (2 checks)."
}),
        Object.freeze({
    "key": "pierre_clown_drawing",
    "mapId": 356,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 309,
    "commandCode": 126,
    "databaseId": 347,
    "apId": 592000010,
    "troopId": 19,
    "requiredVariables": [
        {
            "id": 617,
            "value": 11
        }
    ],
    "messageIndex": 308,
    "originalMessage": "Receive \\C[10]{Clown Drawing}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "frederic_painters_key",
    "mapId": 96,
    "eventId": 12,
    "pageIndex": 0,
    "commandIndex": 95,
    "commandCode": 126,
    "databaseId": 293,
    "apId": 592000011,
    "troopId": 327,
    "requiredVariables": [
        {
            "id": 305,
            "value": 0
        }
    ]
}),
        Object.freeze({
    "key": "frederic_canvas_bag",
    "mapId": 96,
    "eventId": 12,
    "pageIndex": 0,
    "commandIndex": 170,
    "commandCode": 126,
    "databaseId": 341,
    "apId": 592000012,
    "troopId": 327,
    "requiredVariables": [
        {
            "id": 305,
            "value": 2
        }
    ],
    "deferredSwitches": [
        {
            "commandIndex": 168,
            "id": 188
        }
    ],
    "messageIndex": 172,
    "originalMessage": "Receive \\C[3]{Canvas Carry Bag}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "frederic_canvas_bag",
    "mapId": 96,
    "eventId": 12,
    "pageIndex": 0,
    "commandIndex": 8,
    "commandCode": 126,
    "databaseId": 341,
    "apId": 592000012,
    "deferredSwitches": [
        {
            "commandIndex": 9,
            "id": 188
        }
    ],
    "messageIndex": 7,
    "originalMessage": "Find \\C[3]{Canvas Carry Bag}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "frederic_canvas_bag",
    "mapId": 96,
    "eventId": 12,
    "pageIndex": 1,
    "commandIndex": 8,
    "commandCode": 126,
    "databaseId": 341,
    "apId": 592000012,
    "deferredSwitches": [
        {
            "commandIndex": 10,
            "id": 188
        }
    ],
    "messageIndex": 7,
    "originalMessage": "Got \\C[3]{Canvas Carry Bag}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "frederic_canvas_bag",
    "mapId": 96,
    "eventId": 12,
    "pageIndex": 2,
    "commandIndex": 8,
    "commandCode": 126,
    "databaseId": 341,
    "apId": 592000012,
    "deferredSwitches": [
        {
            "commandIndex": 10,
            "id": 188
        }
    ],
    "messageIndex": 7,
    "originalMessage": "Got \\C[3]{Canvas Carry Bag}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "jasper_apartment_key",
    "mapId": 65,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 258,
    "commandCode": 126,
    "databaseId": 384,
    "apId": 592000013,
    "troopId": 124,
    "requiredVariables": [
        {
            "id": 595,
            "value": 7
        }
    ],
    "messageIndex": 260,
    "originalMessage": "Receive \\C[3]{Stained Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "mutt_vending_key",
    "mapId": 56,
    "eventId": 26,
    "pageIndex": 0,
    "commandIndex": 106,
    "commandCode": 126,
    "databaseId": 371,
    "apId": 592000014,
    "troopId": 155,
    "requiredVariables": [
        {
            "id": 759,
            "value": 1
        }
    ],
    "messageIndex": 105,
    "originalMessage": "Receive \\C[3]{Vending Machine Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "ritual_roof_key",
    "mapId": 65,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 597,
    "commandCode": 126,
    "databaseId": 314,
    "apId": 592000020,
    "troopId": 124,
    "messageIndex": 594,
    "originalMessage": "Receive \\C[3]{Roof Access Key}\\C[0] and \\C[3]{Dark Robes}\\C[0].",
    "apMessage": "2 Archipelago locations checked."
}),
        Object.freeze({
    "key": "ritual_dark_robes",
    "mapId": 65,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 598,
    "commandCode": 128,
    "databaseId": 23,
    "apId": 592000021,
    "troopId": 124,
    "messageIndex": 594,
    "originalMessage": "Receive \\C[3]{Roof Access Key}\\C[0] and \\C[3]{Dark Robes}\\C[0].",
    "apMessage": "2 Archipelago locations checked."
}),
        Object.freeze({
    "key": "shadow_tongue",
    "mapId": 6,
    "eventId": 40,
    "pageIndex": 0,
    "commandIndex": 458,
    "commandCode": 126,
    "databaseId": 350,
    "apId": 592000030,
    "troopId": 18,
    "requiredVariables": [
        {
            "id": 150,
            "value": 5
        }
    ],
    "messageIndex": 460,
    "originalMessage": "You receive a \\C[03]{Tongue}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "benjamin_game",
    "mapId": 33,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 610,
    "commandCode": 126,
    "databaseId": 420,
    "apId": 592000031,
    "troopId": 27,
    "requiredVariables": [
        {
            "id": 110,
            "value": 4
        }
    ],
    "messageIndex": 613,
    "originalMessage": "You get \\C[03]{Kill To Shoot}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "benjamin_pendant",
    "mapId": 33,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 620,
    "commandCode": 128,
    "databaseId": 103,
    "apId": 592000032,
    "troopId": 27,
    "requiredVariables": [
        {
            "id": 110,
            "value": 4
        }
    ],
    "messageIndex": 622,
    "originalMessage": "You get \\C[03]{Teeth Pendant}\\C[00].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map069_event056_quest_reward",
    "mapId": 69,
    "eventId": 56,
    "pageIndex": 0,
    "commandIndex": 15,
    "commandCode": 126,
    "databaseId": 373,
    "apId": 592000040
}),
        Object.freeze({
    "key": "map094_event009_quest_reward",
    "mapId": 94,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 333,
    "commandCode": 126,
    "databaseId": 316,
    "apId": 592000041,
    "messageIndex": 332,
    "originalMessage": "Receive \\C[03]{Love Letter}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map115_event002_quest_reward",
    "mapId": 115,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 9,
    "commandCode": 126,
    "databaseId": 346,
    "apId": 592000042,
    "messageIndex": 11,
    "originalMessage": "You find \\C[3]{Loose Manuscript}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map115_event002_quest_reward",
    "mapId": 115,
    "eventId": 2,
    "pageIndex": 1,
    "commandIndex": 9,
    "commandCode": 126,
    "databaseId": 346,
    "apId": 592000042,
    "messageIndex": 11,
    "originalMessage": "You find \\C[3]{Loose Manuscript}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "map367_event001_quest_reward",
    "mapId": 367,
    "eventId": 1,
    "pageIndex": 1,
    "commandIndex": 7,
    "commandCode": 126,
    "databaseId": 388,
    "apId": 592000043,
    "messageIndex": 9,
    "originalMessage": "Find \\C[10]{Small Red Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "planetarium_access",
    "mapId": 345,
    "eventId": 12,
    "pageIndex": 0,
    "commandIndex": 216,
    "commandCode": 121,
    "databaseId": 699,
    "apId": 592000050,
    "commonEventId": 64,
    "requiredVariables": [
        {
            "id": 771,
            "value": 1
        },
        {
            "id": 772,
            "value": 2
        },
        {
            "id": 773,
            "value": 3
        },
        {
            "id": 774,
            "value": 4
        },
        {
            "id": 775,
            "value": 5
        },
        {
            "id": 776,
            "value": 6
        },
        {
            "id": 777,
            "value": 7
        },
        {
            "id": 778,
            "value": 8
        },
        {
            "id": 779,
            "value": 9
        }
    ]
}),
        Object.freeze({
    "key": "pierre_old_mail",
    "mapId": 3,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 74,
    "commandCode": 126,
    "databaseId": 285,
    "apId": 592000060,
    "troopId": 80,
    "requiredVariables": [
        {
            "id": 617,
            "value": 7
        }
    ],
    "messageIndex": 76,
    "originalMessage": "Receive \\C[3]{Old Mail}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "tickle_drawing",
    "mapId": 189,
    "eventId": 18,
    "pageIndex": 0,
    "commandIndex": 424,
    "commandCode": 126,
    "databaseId": 367,
    "apId": 592000061,
    "troopId": 415,
    "requiredVariables": [
        {
            "id": 524,
            "value": 6
        }
    ],
    "messageIndex": 428,
    "originalMessage": "You receive \\C[3]{Tickle's Gift}!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 119,
    "eventId": 13,
    "pageIndex": 0,
    "commandIndex": 126,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "troopId": 332,
    "requiredVariables": [
        {
            "id": 313,
            "value": 0
        }
    ],
    "messageIndex": 128,
    "originalMessage": "Receive the \\C[3]{Stained Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 42,
    "eventId": 6,
    "pageIndex": 1,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 96,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 96,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 96,
    "eventId": 3,
    "pageIndex": 2,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 119,
    "eventId": 13,
    "pageIndex": 0,
    "commandIndex": 13,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 15,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 119,
    "eventId": 13,
    "pageIndex": 1,
    "commandIndex": 13,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 15,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 119,
    "eventId": 13,
    "pageIndex": 2,
    "commandIndex": 13,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 15,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 119,
    "eventId": 13,
    "pageIndex": 4,
    "commandIndex": 13,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 15,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 119,
    "eventId": 13,
    "pageIndex": 5,
    "commandIndex": 13,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 15,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 119,
    "eventId": 15,
    "pageIndex": 0,
    "commandIndex": 13,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 15,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 119,
    "eventId": 15,
    "pageIndex": 1,
    "commandIndex": 13,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 15,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 119,
    "eventId": 16,
    "pageIndex": 0,
    "commandIndex": 13,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 15,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 119,
    "eventId": 16,
    "pageIndex": 1,
    "commandIndex": 13,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 15,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 217,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 217,
    "eventId": 7,
    "pageIndex": 1,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 217,
    "eventId": 7,
    "pageIndex": 2,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 217,
    "eventId": 8,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 217,
    "eventId": 8,
    "pageIndex": 1,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 217,
    "eventId": 8,
    "pageIndex": 2,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 236,
    "eventId": 16,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 236,
    "eventId": 16,
    "pageIndex": 1,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 236,
    "eventId": 16,
    "pageIndex": 2,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 236,
    "eventId": 18,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 236,
    "eventId": 18,
    "pageIndex": 1,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 236,
    "eventId": 19,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 236,
    "eventId": 19,
    "pageIndex": 1,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 236,
    "eventId": 19,
    "pageIndex": 2,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 237,
    "eventId": 14,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 237,
    "eventId": 14,
    "pageIndex": 1,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "green_portrait_stained_key",
    "mapId": 237,
    "eventId": 14,
    "pageIndex": 2,
    "commandIndex": 10,
    "commandCode": 126,
    "databaseId": 294,
    "apId": 592000070,
    "requiredVariables": [
        {
            "id": 313,
            "value": 99
        }
    ],
    "requiredSwitches": [
        {
            "id": 186,
            "value": false
        }
    ],
    "messageIndex": 12,
    "originalMessage": "Got the \\C[3]{Stained key}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "power_restoration",
    "mapId": 369,
    "eventId": 24,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 121,
    "databaseId": 987,
    "apId": 592000080,
    "messageIndex": 1,
    "originalMessage": "The main fuse box of the building. Restore power?",
    "apMessage": "The main fuse box. Complete its Archipelago check?"
}),
        Object.freeze({
    "key": "joel_resolution_toothy_whip",
    "mapId": 435,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 215,
    "apId": 592000090,
    "resolutionFamily": "joel_resolution",
    "battleDrop": {
        "enemyId": 742,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            741,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "joel_resolution_toothy_whip",
    "mapId": 435,
    "eventId": 2,
    "pageIndex": 1,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 215,
    "apId": 592000090,
    "resolutionFamily": "joel_resolution",
    "battleDrop": {
        "enemyId": 742,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            741,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "frederic_paint_palette",
    "mapId": 96,
    "eventId": 12,
    "pageIndex": 0,
    "commandIndex": 230,
    "commandCode": 128,
    "databaseId": 271,
    "apId": 592000091,
    "troopId": 327,
    "requiredVariables": [
        {
            "id": 305,
            "value": 5
        }
    ],
    "messageIndex": 232,
    "originalMessage": "Got \\C[3]{Paint Palette}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "pierre_clown_wig",
    "mapId": 356,
    "eventId": 2,
    "pageIndex": 5,
    "commandIndex": 94,
    "commandCode": 128,
    "databaseId": 52,
    "apId": 592000092,
    "troopId": 19,
    "requiredVariables": [
        {
            "id": 617,
            "value": 20
        }
    ],
    "messageIndex": 93,
    "originalMessage": "Receive \\C[10]{Clown Wig and Nose}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "clint_rags",
    "mapId": 6,
    "eventId": 27,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 2,
    "apId": 592000100,
    "resolutionFamily": "clint_resolution",
    "battleDrop": {
        "enemyId": 29,
        "dropIndex": 0,
        "kind": 3,
        "parameters": [
            0,
            25,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "clint_rags",
    "mapId": 6,
    "eventId": 27,
    "pageIndex": 1,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 2,
    "apId": 592000100,
    "resolutionFamily": "clint_resolution",
    "battleDrop": {
        "enemyId": 29,
        "dropIndex": 0,
        "kind": 3,
        "parameters": [
            0,
            25,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "clint_tooth_knife",
    "mapId": 435,
    "eventId": 1,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 217,
    "apId": 592000101,
    "resolutionFamily": "clint_resolution",
    "battleDrop": {
        "enemyId": 737,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            737,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "clint_tooth_knife",
    "mapId": 435,
    "eventId": 1,
    "pageIndex": 1,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 217,
    "apId": 592000101,
    "resolutionFamily": "clint_resolution",
    "battleDrop": {
        "enemyId": 737,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            737,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "madison_tooth_hammer",
    "mapId": 435,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 221,
    "apId": 592000102,
    "resolutionFamily": "madison_resolution",
    "battleDrop": {
        "enemyId": 739,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            739,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "madison_tooth_hammer",
    "mapId": 435,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 221,
    "apId": 592000102,
    "resolutionFamily": "madison_resolution",
    "battleDrop": {
        "enemyId": 739,
        "dropIndex": 0,
        "kind": 2,
        "parameters": [
            0,
            739,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "simple_key_map025_event002",
    "mapId": 25,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 126,
    "databaseId": 320,
    "apId": 592000110,
    "messageIndex": 7,
    "originalMessage": "You find a \\C[03]{Simple Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "simple_key_map054_event039",
    "mapId": 54,
    "eventId": 39,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 126,
    "databaseId": 320,
    "apId": 592000111,
    "messageIndex": 7,
    "originalMessage": "You find a \\C[03]{Simple Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "simple_key_map061_event003",
    "mapId": 61,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 126,
    "databaseId": 320,
    "apId": 592000112,
    "messageIndex": 5,
    "originalMessage": "Got \\C[03]{Simple Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "simple_key_map089_event002",
    "mapId": 89,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 126,
    "databaseId": 320,
    "apId": 592000113,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Simple Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "simple_key_map099_event017",
    "mapId": 99,
    "eventId": 17,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 126,
    "databaseId": 320,
    "apId": 592000114,
    "messageIndex": 7,
    "originalMessage": "Find \\C[03]{Simple Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "simple_key_map272_event004",
    "mapId": 272,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 126,
    "databaseId": 320,
    "apId": 592000115,
    "messageIndex": 7,
    "originalMessage": "You find a \\C[03]{Simple Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "simple_key_map291_event019",
    "mapId": 291,
    "eventId": 19,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 126,
    "databaseId": 320,
    "apId": 592000116,
    "messageIndex": 7,
    "originalMessage": "You find a \\C[03]{Simple Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "simple_key_map303_event023",
    "mapId": 303,
    "eventId": 23,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 126,
    "databaseId": 320,
    "apId": 592000117,
    "messageIndex": 7,
    "originalMessage": "You find a \\C[03]{Simple Key}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "simple_key_drop_130",
    "mapId": 355,
    "eventId": 43,
    "pageIndex": 0,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 320,
    "apId": 592000118,
    "battleDrop": {
        "enemyId": 130,
        "dropIndex": 0,
        "kind": 1,
        "parameters": [
            0,
            78,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "simple_key_drop_130",
    "mapId": 355,
    "eventId": 43,
    "pageIndex": 1,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 320,
    "apId": 592000118,
    "battleDrop": {
        "enemyId": 130,
        "dropIndex": 0,
        "kind": 1,
        "parameters": [
            0,
            78,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "simple_key_drop_130",
    "mapId": 355,
    "eventId": 43,
    "pageIndex": 2,
    "commandIndex": 1,
    "commandCode": 301,
    "databaseId": 320,
    "apId": 592000118,
    "battleDrop": {
        "enemyId": 130,
        "dropIndex": 0,
        "kind": 1,
        "parameters": [
            0,
            78,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "simple_key_drop_153",
    "mapId": 94,
    "eventId": 11,
    "pageIndex": 1,
    "commandIndex": 7,
    "commandCode": 301,
    "databaseId": 320,
    "apId": 592000119,
    "resolutionFamily": "nestor_key_resolution",
    "battleDrop": {
        "enemyId": 153,
        "dropIndex": 1,
        "kind": 1,
        "parameters": [
            0,
            555,
            true,
            false
        ]
    }
}),
        Object.freeze({
    "key": "scout_radio",
    "mapId": 180,
    "eventId": 12,
    "pageIndex": 0,
    "commandIndex": 43,
    "commandCode": 126,
    "databaseId": 156,
    "apId": 592000120,
    "troopId": 295,
    "requiredVariables": [
        {
            "id": 355,
            "value": 0
        }
    ],
    "messageIndex": 45,
    "originalMessage": "Receive \\C[3]{Radio}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "bright_frederic_jar",
    "mapId": 218,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 223,
    "commandCode": 126,
    "databaseId": 4,
    "apId": 592000121,
    "resolutionFamily": "bright_frederic_resolution",
    "troopId": 334,
    "requiredVariables": [
        {
            "id": 320,
            "values": [
                1,
                5,
                6
            ]
        }
    ],
    "messageIndex": 226,
    "originalMessage": "Receive \\C[3]{Medic-in-a-jar}\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "car_trunk_shotgun",
    "mapId": 86,
    "eventId": 59,
    "pageIndex": 0,
    "commandIndex": 31,
    "commandCode": 128,
    "databaseId": 140,
    "apId": 592000130,
    "commonEventId": 60,
    "requiredVariables": [
        {
            "id": 1,
            "value": 86
        }
    ],
    "messageIndex": 36,
    "originalMessage": "Find \\C[3]Shotgun\\C[0] and 12x \\C[3]{Shotgun Shell}\\C[0].",
    "apMessage": "Archipelago location checked. Find 12x \\C[3]{Shotgun Shell}\\C[0]."
}),
        Object.freeze({
    "key": "minesweeper_first_detector",
    "mapId": 240,
    "eventId": 13,
    "pageIndex": 0,
    "commandIndex": 12,
    "commandCode": 127,
    "databaseId": 122,
    "apId": 592000140,
    "troopId": 294,
    "requiredVariables": [
        {
            "id": 354,
            "value": 0
        }
    ],
    "messageIndex": 14,
    "originalMessage": "Receive \\C[3]{Metal Detector}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "comatus_whisperblade",
    "mapId": 438,
    "eventId": 3,
    "pageIndex": 12,
    "commandIndex": 14,
    "commandCode": 127,
    "databaseId": 201,
    "apId": 592000141,
    "troopId": 207,
    "requiredSwitches": [
        {
            "id": 1174,
            "value": false
        }
    ],
    "messageIndex": 16,
    "originalMessage": "Receive \\C[3]{Whisperblade}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "jean_pierre_greatsword",
    "mapId": 187,
    "eventId": 15,
    "pageIndex": 1,
    "commandIndex": 25,
    "commandCode": 127,
    "databaseId": 96,
    "apId": 592000150,
    "troopId": 347,
    "messageIndex": 27,
    "originalMessage": "Receive \\C[3]{Greatsword}\\C[0].",
    "apMessage": "Archipelago location checked.",
    "messageVariants": [
        {
            "messageIndex": 39,
            "originalMessage": "Receive \\C[3]{Greatsword}\\C[0].",
            "apMessage": "Archipelago location checked."
        }
    ]
}),
        Object.freeze({
    "key": "sylvain_elegant_cap",
    "mapId": 187,
    "eventId": 22,
    "pageIndex": 1,
    "commandIndex": 26,
    "commandCode": 128,
    "databaseId": 245,
    "apId": 592000151,
    "troopId": 348,
    "messageIndex": 28,
    "originalMessage": "Receive \\C[3]{Elegant Cap}\\C[0].",
    "apMessage": "Archipelago location checked.",
    "messageVariants": [
        {
            "messageIndex": 42,
            "originalMessage": "Receive \\C[3]{Elegant Cap}\\C[0].",
            "apMessage": "Archipelago location checked."
        }
    ]
}),
        Object.freeze({
    "key": "claire_breastplate",
    "mapId": 187,
    "eventId": 24,
    "pageIndex": 1,
    "commandIndex": 21,
    "commandCode": 128,
    "databaseId": 243,
    "apId": 592000152,
    "troopId": 349,
    "messageIndex": 23,
    "originalMessage": "Receive \\C[3]{Ornate Breastplate}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "darryl_legs",
    "mapId": 86,
    "eventId": 104,
    "pageIndex": 7,
    "commandIndex": 10,
    "commandCode": 127,
    "databaseId": 209,
    "apId": 592000153,
    "resolutionFamily": "darryl_resolution",
    "troopId": 615,
    "messageIndex": 12,
    "originalMessage": "Receive \\C[3]{Antenniform Legs}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "spider_husk_heart",
    "mapId": 56,
    "eventId": 41,
    "pageIndex": 0,
    "commandIndex": 52,
    "commandCode": 128,
    "databaseId": 289,
    "apId": 592000154,
    "resolutionFamily": "spider_husk_resolution",
    "troopId": 655,
    "requiredVariables": [
        {
            "id": 874,
            "value": 26
        }
    ],
    "messageIndex": 54,
    "originalMessage": "You receive \\C[3]{Beating Heart}\\C[0].",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "home_bookshelf_screamatorium",
    "mapId": 3,
    "eventId": 88,
    "pageIndex": 0,
    "commandIndex": 24,
    "commandCode": 126,
    "databaseId": 423,
    "apId": 592000160,
    "requiredVariables": [
        {
            "id": 496,
            "value": 3
        }
    ],
    "messageIndex": 23,
    "originalMessage": "Find \\C[3]Screamatorium\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
        Object.freeze({
    "key": "home_bookshelf_screamatorium",
    "mapId": 3,
    "eventId": 89,
    "pageIndex": 0,
    "commandIndex": 24,
    "commandCode": 126,
    "databaseId": 423,
    "apId": 592000160,
    "requiredVariables": [
        {
            "id": 496,
            "value": 3
        }
    ],
    "messageIndex": 23,
    "originalMessage": "Find \\C[3]Screamatorium\\C[0]!",
    "apMessage": "Archipelago location checked."
}),
    ]);
    const developmentLocationIds = Object.freeze(Object.fromEntries(
        sourceSignatures.map(source => [source.key, source.apId])
    ));
    const developmentItemDefinitions = Object.freeze({
        540000004: Object.freeze({"kind": "item", "id": 4, "name": "Medic-in-a-jar"}),
        540000156: Object.freeze({"kind": "item", "id": 156, "name": "Radio", "deliverySwitches": [394]}),
        540000280: Object.freeze({"kind": "item", "id": 280, "name": "Watch"}),
        540000285: Object.freeze({"kind": "item", "id": 285, "name": "Old Mail"}),
        540000293: Object.freeze({"kind": "item", "id": 293, "name": "Painter's Key"}),
        540000294: Object.freeze({"kind": "item", "id": 294, "name": "Stained Key"}),
        540000296: Object.freeze({"kind": "item", "id": 296, "name": "Twilight Valve"}),
        540000297: Object.freeze({"kind": "item", "id": 297, "name": "Midnight Valve"}),
        540000298: Object.freeze({"kind": "item", "id": 298, "name": "Abyssal Valve"}),
        540000299: Object.freeze({"kind": "item", "id": 299, "name": "Hadal Valve"}),
        540000300: Object.freeze({"kind": "item", "id": 300, "name": "Apt. 33 Key"}),
        540000301: Object.freeze({"kind": "item", "id": 301, "name": "Padlock Key"}),
        540000302: Object.freeze({"kind": "item", "id": 302, "name": "Apt. 21 Key"}),
        540000303: Object.freeze({"kind": "item", "id": 303, "name": "Basement Key"}),
        540000304: Object.freeze({"kind": "item", "id": 304, "name": "Store Key"}),
        540000305: Object.freeze({"kind": "item", "id": 305, "name": "Child Barrier Key"}),
        540000306: Object.freeze({"kind": "item", "id": 306, "name": "Janitor Key Ring"}),
        540000310: Object.freeze({"kind": "item", "id": 310, "name": "Door Knob"}),
        540000311: Object.freeze({"kind": "item", "id": 311, "name": "Army Guy Figure"}),
        540000314: Object.freeze({"kind": "item", "id": 314, "name": "Roof Access Key"}),
        540000316: Object.freeze({"kind": "item", "id": 316, "name": "Love Letter"}),
        540000317: Object.freeze({"kind": "item", "id": 317, "name": "Stationery"}),
        540000318: Object.freeze({"kind": "item", "id": 318, "name": "Fountain Pen"}),
        540000320: Object.freeze({"kind": "item", "id": 320, "name": "Simple Keys (3)", "amount": 3}),
        540000321: Object.freeze({"kind": "item", "id": 321, "name": "Sun Disc"}),
        540000322: Object.freeze({"kind": "item", "id": 322, "name": "Mercury Disc"}),
        540000323: Object.freeze({"kind": "item", "id": 323, "name": "Venus Disc"}),
        540000324: Object.freeze({"kind": "item", "id": 324, "name": "Earth Disc"}),
        540000325: Object.freeze({"kind": "item", "id": 325, "name": "Mars Disc"}),
        540000326: Object.freeze({"kind": "item", "id": 326, "name": "Jupiter Disc"}),
        540000327: Object.freeze({"kind": "item", "id": 327, "name": "Saturn Disc"}),
        540000328: Object.freeze({"kind": "item", "id": 328, "name": "Uranus Disc"}),
        540000329: Object.freeze({"kind": "item", "id": 329, "name": "Neptune Disc"}),
        540000330: Object.freeze({"kind": "item", "id": 330, "name": "Pluto Disc"}),
        540000331: Object.freeze({"kind": "item", "id": 331, "name": "Void Disc"}),
        540000334: Object.freeze({"kind": "item", "id": 334, "name": "Guinea Pig"}),
        540000335: Object.freeze({"kind": "item", "id": 335, "name": "Blank VHS tape"}),
        540000341: Object.freeze({"kind": "item", "id": 341, "name": "Canvas Carry Bag", "deliverySwitches": [188]}),
        540000344: Object.freeze({"kind": "item", "id": 344, "name": "Crumpled Manuscript"}),
        540000345: Object.freeze({"kind": "item", "id": 345, "name": "Clean Manuscript"}),
        540000346: Object.freeze({"kind": "item", "id": 346, "name": "Loose Manuscript"}),
        540000347: Object.freeze({"kind": "item", "id": 347, "name": "Clown Drawing"}),
        540000350: Object.freeze({"kind": "item", "id": 350, "name": "Tongue"}),
        540000360: Object.freeze({"kind": "item", "id": 360, "name": "Rose"}),
        540000364: Object.freeze({"kind": "item", "id": 364, "name": "Electronic Key"}),
        540000367: Object.freeze({"kind": "item", "id": 367, "name": "Tickle's Gift"}),
        540000371: Object.freeze({"kind": "item", "id": 371, "name": "Vending Machine Key"}),
        540000373: Object.freeze({"kind": "item", "id": 373, "name": "Laundry"}),
        540000376: Object.freeze({"kind": "item", "id": 376, "name": "NeoDuo"}),
        540000378: Object.freeze({"kind": "item", "id": 378, "name": "Shrunken Head"}),
        540000379: Object.freeze({"kind": "item", "id": 379, "name": "Plumbing Tools"}),
        540000384: Object.freeze({"kind": "item", "id": 384, "name": "Jasper's Key"}),
        540000385: Object.freeze({"kind": "item", "id": 385, "name": "Apt. 35 Key"}),
        540000386: Object.freeze({"kind": "item", "id": 386, "name": "Telescope Pieces"}),
        540000388: Object.freeze({"kind": "item", "id": 388, "name": "Small Red Key"}),
        540000389: Object.freeze({"kind": "item", "id": 389, "name": "Phone"}),
        540000390: Object.freeze({"kind": "item", "id": 390, "name": "Last Will"}),
        540000391: Object.freeze({"kind": "item", "id": 391, "name": "Old Tape"}),
        540000392: Object.freeze({"kind": "item", "id": 392, "name": "Old Photograph"}),
        540000393: Object.freeze({"kind": "item", "id": 393, "name": "Wrapped Painting"}),
        540000395: Object.freeze({"kind": "item", "id": 395, "name": "Iris Key"}),
        540000396: Object.freeze({"kind": "item", "id": 396, "name": "Rebreather"}),
        540000411: Object.freeze({"kind": "item", "id": 411, "name": "Wake the Blood Knight"}),
        540000412: Object.freeze({"kind": "item", "id": 412, "name": "Wizards Hell: Arcane Tears"}),
        540000415: Object.freeze({"kind": "item", "id": 415, "name": "Catafalque"}),
        540000416: Object.freeze({"kind": "item", "id": 416, "name": "Honko's Grand Journey"}),
        540000418: Object.freeze({"kind": "item", "id": 418, "name": "Wraithscourge"}),
        540000420: Object.freeze({"kind": "item", "id": 420, "name": "Kill to Shoot"}),
        540000422: Object.freeze({"kind": "item", "id": 422, "name": "Myrmidon XII"}),
        540000423: Object.freeze({"kind": "item", "id": 423, "name": "Screamatorium"}),
        540000424: Object.freeze({"kind": "item", "id": 424, "name": "Frogit About It"}),
        540000427: Object.freeze({"kind": "item", "id": 427, "name": "Space Truckerz"}),
        540000430: Object.freeze({"kind": "item", "id": 430, "name": "Unlabeled Cartridge"}),
        540000433: Object.freeze({"kind": "item", "id": 433, "name": "Dustin Figure"}),
        540000434: Object.freeze({"kind": "item", "id": 434, "name": "Ratavia Figure"}),
        540000435: Object.freeze({"kind": "item", "id": 435, "name": "Musk Figure"}),
        540000436: Object.freeze({"kind": "item", "id": 436, "name": "Jacket Figure"}),
        540000437: Object.freeze({"kind": "item", "id": 437, "name": "Lute Figure"}),
        540000438: Object.freeze({"kind": "item", "id": 438, "name": "Cerulean Figure"}),
        540000651: Object.freeze({"kind": "item", "id": 651, "name": "green key"}),
        540000652: Object.freeze({"kind": "item", "id": 652, "name": "red key"}),
        540000653: Object.freeze({"kind": "item", "id": 653, "name": "yellow key"}),
        540000654: Object.freeze({"kind": "item", "id": 654, "name": "blue key"}),
        540000655: Object.freeze({"kind": "item", "id": 655, "name": "white key"}),
        540000656: Object.freeze({"kind": "item", "id": 656, "name": "Black Keys (2)", "amount": 2}),
        540100008: Object.freeze({"kind": "weapon", "id": 8, "name": "Broom"}),
        540100010: Object.freeze({"kind": "weapon", "id": 10, "name": "Nightstick"}),
        540100012: Object.freeze({"kind": "weapon", "id": 12, "name": "Bottle"}),
        540100015: Object.freeze({"kind": "weapon", "id": 15, "name": "Baseball Bat"}),
        540100017: Object.freeze({"kind": "weapon", "id": 17, "name": "Frying Pan"}),
        540100019: Object.freeze({"kind": "weapon", "id": 19, "name": "Golf Club"}),
        540100025: Object.freeze({"kind": "weapon", "id": 25, "name": "Mop"}),
        540100027: Object.freeze({"kind": "weapon", "id": 27, "name": "Hammer"}),
        540100031: Object.freeze({"kind": "weapon", "id": 31, "name": "Metal Bat"}),
        540100036: Object.freeze({"kind": "weapon", "id": 36, "name": "Rolling Pin"}),
        540100042: Object.freeze({"kind": "weapon", "id": 42, "name": "Carving Fork"}),
        540100044: Object.freeze({"kind": "weapon", "id": 44, "name": "Pool Cue"}),
        540100048: Object.freeze({"kind": "weapon", "id": 48, "name": "Dagger"}),
        540100050: Object.freeze({"kind": "weapon", "id": 50, "name": "Spade"}),
        540100052: Object.freeze({"kind": "weapon", "id": 52, "name": "Pitchfork"}),
        540100056: Object.freeze({"kind": "weapon", "id": 56, "name": "Spear"}),
        540100066: Object.freeze({"kind": "weapon", "id": 66, "name": "Old Axe"}),
        540100068: Object.freeze({"kind": "weapon", "id": 68, "name": "Chef's Knife"}),
        540100070: Object.freeze({"kind": "weapon", "id": 70, "name": "Cleaver"}),
        540100072: Object.freeze({"kind": "weapon", "id": 72, "name": "Fireman's Axe"}),
        540100074: Object.freeze({"kind": "weapon", "id": 74, "name": "Claymore"}),
        540100077: Object.freeze({"kind": "weapon", "id": 77, "name": "Machete"}),
        540100081: Object.freeze({"kind": "weapon", "id": 81, "name": "Combat Knife"}),
        540100083: Object.freeze({"kind": "weapon", "id": 83, "name": "Scalpel"}),
        540100085: Object.freeze({"kind": "weapon", "id": 85, "name": "Kitchen Knife"}),
        540100096: Object.freeze({"kind": "weapon", "id": 96, "name": "Greatsword"}),
        540100112: Object.freeze({"kind": "weapon", "id": 112, "name": "Rat Claws"}),
        540100116: Object.freeze({"kind": "weapon", "id": 116, "name": "Hockey Stick"}),
        540100122: Object.freeze({"kind": "weapon", "id": 122, "name": "Metal Detector"}),
        540100133: Object.freeze({"kind": "weapon", "id": 133, "name": "Patchwork Club"}),
        540100135: Object.freeze({"kind": "weapon", "id": 135, "name": "Great Needle"}),
        540100141: Object.freeze({"kind": "weapon", "id": 141, "name": "Hellsword"}),
        540100143: Object.freeze({"kind": "weapon", "id": 143, "name": "Jawbone Club"}),
        540100145: Object.freeze({"kind": "weapon", "id": 145, "name": "Furnace Edge"}),
        540100154: Object.freeze({"kind": "weapon", "id": 154, "name": "Wordsmith's Hammer"}),
        540100156: Object.freeze({"kind": "weapon", "id": 156, "name": "Spear of the Word"}),
        540100158: Object.freeze({"kind": "weapon", "id": 158, "name": "Spellsword"}),
        540100165: Object.freeze({"kind": "weapon", "id": 165, "name": "Stained Shears"}),
        540100196: Object.freeze({"kind": "weapon", "id": 196, "name": "Voidblade"}),
        540100201: Object.freeze({"kind": "weapon", "id": 201, "name": "Whisperblade"}),
        540100206: Object.freeze({"kind": "weapon", "id": 206, "name": "Snake Whip"}),
        540100209: Object.freeze({"kind": "weapon", "id": 209, "name": "Antenniform Legs"}),
        540100211: Object.freeze({"kind": "weapon", "id": 211, "name": "Azure Greatsword"}),
        540100215: Object.freeze({"kind": "weapon", "id": 215, "name": "Toothy Whip"}),
        540100217: Object.freeze({"kind": "weapon", "id": 217, "name": "Tooth Knife"}),
        540100219: Object.freeze({"kind": "weapon", "id": 219, "name": "Tooth Scimitar"}),
        540100221: Object.freeze({"kind": "weapon", "id": 221, "name": "Tooth Hammer"}),
        540100230: Object.freeze({"kind": "weapon", "id": 230, "name": "Me[ttal Ba2t"}),
        540100241: Object.freeze({"kind": "weapon", "id": 241, "name": "Ocular Tetherblade"}),
        540100246: Object.freeze({"kind": "weapon", "id": 246, "name": "Goblin's Claws"}),
        540100260: Object.freeze({"kind": "weapon", "id": 260, "name": "Electroclaw"}),
        540100263: Object.freeze({"kind": "weapon", "id": 263, "name": "Hadal Trident"}),
        540100275: Object.freeze({"kind": "weapon", "id": 275, "name": "Slime Spear"}),
        540200002: Object.freeze({"kind": "armor", "id": 2, "name": "Rags"}),
        540200003: Object.freeze({"kind": "armor", "id": 3, "name": "Polo Shirt"}),
        540200005: Object.freeze({"kind": "armor", "id": 5, "name": "T-Shirt"}),
        540200006: Object.freeze({"kind": "armor", "id": 6, "name": "Tank Top"}),
        540200007: Object.freeze({"kind": "armor", "id": 7, "name": "Hoodie"}),
        540200009: Object.freeze({"kind": "armor", "id": 9, "name": "Denim Vest"}),
        540200010: Object.freeze({"kind": "armor", "id": 10, "name": "Windbreaker Jacket"}),
        540200012: Object.freeze({"kind": "armor", "id": 12, "name": "Winter Coat"}),
        540200013: Object.freeze({"kind": "armor", "id": 13, "name": "Trench Coat"}),
        540200014: Object.freeze({"kind": "armor", "id": 14, "name": "Padded Jacket"}),
        540200019: Object.freeze({"kind": "armor", "id": 19, "name": "Flak Jacket"}),
        540200021: Object.freeze({"kind": "armor", "id": 21, "name": "Studded Jacket"}),
        540200023: Object.freeze({"kind": "armor", "id": 23, "name": "Dark Robes"}),
        540200025: Object.freeze({"kind": "armor", "id": 25, "name": "Old Uniform"}),
        540200041: Object.freeze({"kind": "armor", "id": 41, "name": "Giant Rat Skull"}),
        540200042: Object.freeze({"kind": "armor", "id": 42, "name": "Rusty Crown"}),
        540200043: Object.freeze({"kind": "armor", "id": 43, "name": "Gas Mask"}),
        540200044: Object.freeze({"kind": "armor", "id": 44, "name": "Shockskull"}),
        540200048: Object.freeze({"kind": "armor", "id": 48, "name": "Baseball Cap"}),
        540200049: Object.freeze({"kind": "armor", "id": 49, "name": "Cowboy Hat"}),
        540200052: Object.freeze({"kind": "armor", "id": 52, "name": "Clown Wig and Nose"}),
        540200053: Object.freeze({"kind": "armor", "id": 53, "name": "Trilby"}),
        540200054: Object.freeze({"kind": "armor", "id": 54, "name": "Top Hat"}),
        540200057: Object.freeze({"kind": "armor", "id": 57, "name": "Hard Hat"}),
        540200062: Object.freeze({"kind": "armor", "id": 62, "name": "Motorcycle Helmet"}),
        540200067: Object.freeze({"kind": "armor", "id": 67, "name": "Indigo Hockey Mask"}),
        540200071: Object.freeze({"kind": "armor", "id": 71, "name": "Four of Spades"}),
        540200073: Object.freeze({"kind": "armor", "id": 73, "name": "Glasses"}),
        540200080: Object.freeze({"kind": "armor", "id": 80, "name": "Plastic Gloves"}),
        540200083: Object.freeze({"kind": "armor", "id": 83, "name": "Dress Shoes"}),
        540200085: Object.freeze({"kind": "armor", "id": 85, "name": "Rubber Boots"}),
        540200086: Object.freeze({"kind": "armor", "id": 86, "name": "Clogs"}),
        540200091: Object.freeze({"kind": "armor", "id": 91, "name": "Vintage Sneakers"}),
        540200094: Object.freeze({"kind": "armor", "id": 94, "name": "Jade Earrings"}),
        540200095: Object.freeze({"kind": "armor", "id": 95, "name": "Golden Locket"}),
        540200096: Object.freeze({"kind": "armor", "id": 96, "name": "Gold Ring"}),
        540200100: Object.freeze({"kind": "armor", "id": 100, "name": "Odd Necklace"}),
        540200101: Object.freeze({"kind": "armor", "id": 101, "name": "Copper Bangle"}),
        540200102: Object.freeze({"kind": "armor", "id": 102, "name": "Silver Bracelet"}),
        540200103: Object.freeze({"kind": "armor", "id": 103, "name": "Teeth Pendant"}),
        540200104: Object.freeze({"kind": "armor", "id": 104, "name": "Gold Bracelet"}),
        540200105: Object.freeze({"kind": "armor", "id": 105, "name": "Lapis Band"}),
        540200115: Object.freeze({"kind": "armor", "id": 115, "name": "Pistol"}),
        540200132: Object.freeze({"kind": "armor", "id": 132, "name": "Old Rifle"}),
        540200136: Object.freeze({"kind": "armor", "id": 136, "name": "Hunting Shotgun"}),
        540200140: Object.freeze({"kind": "armor", "id": 140, "name": "Shotgun"}),
        540200153: Object.freeze({"kind": "armor", "id": 153, "name": "Flamethrower"}),
        540200157: Object.freeze({"kind": "armor", "id": 157, "name": "Acid Sprayer"}),
        540200186: Object.freeze({"kind": "armor", "id": 186, "name": "Cowboy Hat (Lucky)"}),
        540200199: Object.freeze({"kind": "armor", "id": 199, "name": "Silver Magnum"}),
        540200204: Object.freeze({"kind": "armor", "id": 204, "name": "SMG Special"}),
        540200208: Object.freeze({"kind": "armor", "id": 208, "name": "War Rifle"}),
        540200213: Object.freeze({"kind": "armor", "id": 213, "name": "Babylon Typewriter"}),
        540200220: Object.freeze({"kind": "armor", "id": 220, "name": "Jaw Revolver"}),
        540200224: Object.freeze({"kind": "armor", "id": 224, "name": "Tooth Rifle"}),
        540200228: Object.freeze({"kind": "armor", "id": 228, "name": "gun"}),
        540200243: Object.freeze({"kind": "armor", "id": 243, "name": "Ornate Breastplate"}),
        540200245: Object.freeze({"kind": "armor", "id": 245, "name": "Elegant Cap"}),
        540200271: Object.freeze({"kind": "armor", "id": 271, "name": "Paint Palette"}),
        540200273: Object.freeze({"kind": "armor", "id": 273, "name": "War Medal"}),
        540200276: Object.freeze({"kind": "armor", "id": 276, "name": "Headphones"}),
        540200277: Object.freeze({"kind": "armor", "id": 277, "name": "Biting"}),
        540200283: Object.freeze({"kind": "armor", "id": 283, "name": "Martin's Ring"}),
        540200288: Object.freeze({"kind": "armor", "id": 288, "name": "Mycelium Cloak"}),
        540200289: Object.freeze({"kind": "armor", "id": 289, "name": "Beating Heart"}),
        540200290: Object.freeze({"kind": "armor", "id": 290, "name": "Tome of Words"}),
        540200291: Object.freeze({"kind": "armor", "id": 291, "name": "Patchwork Hat"}),
        540200292: Object.freeze({"kind": "armor", "id": 292, "name": "Patchwork Jacket"}),
        540200293: Object.freeze({"kind": "armor", "id": 293, "name": "Patchwork Boots"}),
        540200294: Object.freeze({"kind": "armor", "id": 294, "name": "Needle Gloves"}),
        540200297: Object.freeze({"kind": "armor", "id": 297, "name": "Ambrose's Pipe"}),
        540200330: Object.freeze({"kind": "armor", "id": 330, "name": "Papier-Mach\u00e9 Crown"}),
        540200331: Object.freeze({"kind": "armor", "id": 331, "name": "Official Sash"}),
        540200337: Object.freeze({"kind": "armor", "id": 337, "name": "Straitjacket"}),
        540200347: Object.freeze({"kind": "armor", "id": 347, "name": "Sea Cucumber Loafers"}),
        540200351: Object.freeze({"kind": "armor", "id": 351, "name": "Chrome Finish"}),
        540200352: Object.freeze({"kind": "armor", "id": 352, "name": "Chobham Armor"}),
        540200353: Object.freeze({"kind": "armor", "id": 353, "name": "Demon Plating"}),
        540200354: Object.freeze({"kind": "armor", "id": 354, "name": "Fungus Fibers"}),
        540200355: Object.freeze({"kind": "armor", "id": 355, "name": "Rhinoceros Hide"}),
        540200356: Object.freeze({"kind": "armor", "id": 356, "name": "Tank Tracks"}),
        540200357: Object.freeze({"kind": "armor", "id": 357, "name": "Tank Gun"}),
        540200364: Object.freeze({"kind": "armor", "id": 364, "name": "Jousting Lance"}),
        540200365: Object.freeze({"kind": "armor", "id": 365, "name": "Cope Cage"}),
        540200366: Object.freeze({"kind": "armor", "id": 366, "name": "Dragon Head"}),
        540200367: Object.freeze({"kind": "armor", "id": 367, "name": "Dragon Body"}),
        540200368: Object.freeze({"kind": "armor", "id": 368, "name": "Dragon Feet"}),
        540200369: Object.freeze({"kind": "armor", "id": 369, "name": "Dragon Tail"}),
        540200374: Object.freeze({"kind": "armor", "id": 374, "name": "Vnage ucky tieakeRs"}),
        540200375: Object.freeze({"kind": "armor", "id": 375, "name": "RmyJcket"}),
        540200376: Object.freeze({"kind": "armor", "id": 376, "name": "Ftblhelmt"}),
        540200377: Object.freeze({"kind": "armor", "id": 377, "name": "Slime Boots"}),
        540300115: Object.freeze({"kind": "switch", "id": 115, "name": "Elevator Access"}),
        540300699: Object.freeze({"kind": "switch", "id": 699, "name": "Planetarium Door Access"}),
        540300987: Object.freeze({"kind": "switch", "id": 987, "name": "Power Restored"}),
    });
    const locationDeadlines = Object.freeze([
        Object.freeze({"key": "map031_event009_frying_pan", "name": "Apartment 32 - Frying Pan", "day": 4, "hour": 12, "closed_switch": 1062, "group": "Original teeth apartment", "description": "The entrance closes at noon on Day 4. The apartment that opens later does not contain these pickups."}),
        Object.freeze({"key": "map031_event030_hoodie", "name": "Apartment 32 - Hoodie", "day": 4, "hour": 12, "closed_switch": 1062, "group": "Original teeth apartment", "description": "The entrance closes at noon on Day 4. The apartment that opens later does not contain these pickups."}),
        Object.freeze({"key": "map032_event009_mop", "name": "Apartment 32 Bathroom - Mop", "day": 4, "hour": 12, "closed_switch": 1062, "group": "Original teeth apartment", "description": "The entrance closes at noon on Day 4. The apartment that opens later does not contain these pickups."}),
        Object.freeze({"key": "map033_event007_baseball_cap", "name": "Apartment 32 West Bedroom - Baseball Cap", "day": 4, "hour": 12, "closed_switch": 1062, "group": "Original teeth apartment", "description": "The entrance closes at noon on Day 4. The apartment that opens later does not contain these pickups."}),
        Object.freeze({"key": "map034_event019", "name": "Apartment 32 East Bedroom - Army Guy Figure", "day": 4, "hour": 12, "closed_switch": 1062, "group": "Original teeth apartment", "description": "The entrance closes at noon on Day 4. The apartment that opens later does not contain these pickups."}),
        Object.freeze({"key": "map034_event024_complex", "name": "Apartment 32 Safe - Old Rifle", "day": 4, "hour": 12, "closed_switch": 1062, "group": "Original teeth apartment", "description": "The entrance closes at noon on Day 4. The apartment that opens later does not contain these pickups."}),
        Object.freeze({"key": "map034_event025_tank_top", "name": "Apartment 32 East Bedroom - Tank Top", "day": 4, "hour": 12, "closed_switch": 1062, "group": "Original teeth apartment", "description": "The entrance closes at noon on Day 4. The apartment that opens later does not contain these pickups."}),
        Object.freeze({"key": "boss_drop_28_143", "name": "Baby Teeth - Jawbone Club", "day": 4, "hour": 12, "closed_switch": 1062, "group": "Original teeth apartment", "description": "The entrance closes at noon on Day 4. The apartment that opens later does not contain these pickups."}),
    ]);
    const questTerminals = Object.freeze([
        Object.freeze({
    "familyKey": "roach_leadership",
    "familyName": "Roach Leadership",
    "locationKeys": [
        "roach_leadership_crown",
        "roach_leadership_sash"
    ],
    "mapId": 3,
    "eventId": 121,
    "pageIndex": 2,
    "commandIndex": 59,
    "commandCode": 122,
    "parameters": [
        899,
        899,
        0,
        0,
        101
    ]
}),
        Object.freeze({
    "familyKey": "roach_leadership",
    "familyName": "Roach Leadership",
    "locationKeys": [
        "roach_leadership_crown",
        "roach_leadership_sash"
    ],
    "mapId": 3,
    "eventId": 121,
    "pageIndex": 2,
    "commandIndex": 79,
    "commandCode": 122,
    "parameters": [
        899,
        899,
        0,
        0,
        102
    ]
}),
        Object.freeze({
    "familyKey": "roach_leadership",
    "familyName": "Roach Leadership",
    "locationKeys": [
        "roach_leadership_crown",
        "roach_leadership_sash"
    ],
    "mapId": 3,
    "eventId": 121,
    "pageIndex": 2,
    "commandIndex": 91,
    "commandCode": 122,
    "parameters": [
        899,
        899,
        0,
        0,
        100
    ]
}),
        Object.freeze({
    "familyKey": "leighs_call",
    "familyName": "Leigh's Call",
    "locationKeys": [
        "leighs_call_ring"
    ],
    "mapId": 434,
    "eventId": 1,
    "pageIndex": 0,
    "commandIndex": 64,
    "commandCode": 122,
    "parameters": [
        900,
        900,
        0,
        0,
        102
    ]
}),
        Object.freeze({
    "familyKey": "leighs_call",
    "familyName": "Leigh's Call",
    "locationKeys": [
        "leighs_call_ring"
    ],
    "mapId": 434,
    "eventId": 1,
    "pageIndex": 0,
    "commandIndex": 83,
    "commandCode": 122,
    "parameters": [
        900,
        900,
        0,
        0,
        101
    ]
}),
        Object.freeze({
    "familyKey": "wilhelmina_reward",
    "familyName": "Wilhelmina",
    "locationKeys": [
        "wilhelmina_reward_sword",
        "wilhelmina_reward_spear",
        "wilhelmina_reward_hammer",
        "wilhelmina_reward_gun",
        "wilhelmina_reward_book"
    ],
    "mapId": 169,
    "eventId": 2,
    "pageIndex": 1,
    "commandIndex": 156,
    "commandCode": 121,
    "parameters": [
        1135,
        1135,
        0
    ]
}),
        Object.freeze({
    "familyKey": "boss_salvage_353",
    "familyName": "Demon Plating boss salvage",
    "locationKeys": [
        "boss_salvage_353"
    ],
    "mapId": 86,
    "eventId": 14,
    "pageIndex": 3,
    "commandIndex": 19,
    "commandCode": 412,
    "parameters": [],
    "message": "Archipelago: boss salvage checked."
}),
        Object.freeze({
    "familyKey": "boss_salvage_351",
    "familyName": "Chrome Finish boss salvage",
    "locationKeys": [
        "boss_salvage_351"
    ],
    "mapId": 86,
    "eventId": 58,
    "pageIndex": 3,
    "commandIndex": 19,
    "commandCode": 412,
    "parameters": [],
    "message": "Archipelago: boss salvage checked."
}),
        Object.freeze({
    "familyKey": "boss_salvage_352",
    "familyName": "Chobham Armor boss salvage",
    "locationKeys": [
        "boss_salvage_352"
    ],
    "mapId": 86,
    "eventId": 101,
    "pageIndex": 1,
    "commandIndex": 15,
    "commandCode": 412,
    "parameters": [],
    "message": "Archipelago: boss salvage checked."
}),
        Object.freeze({
    "familyKey": "boss_salvage_354",
    "familyName": "Fungus Fibers boss salvage",
    "locationKeys": [
        "boss_salvage_354"
    ],
    "mapId": 127,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 20,
    "commandCode": 412,
    "parameters": [],
    "message": "Archipelago: boss salvage checked."
}),
        Object.freeze({
    "familyKey": "boss_salvage_354",
    "familyName": "Fungus Fibers boss salvage",
    "locationKeys": [
        "boss_salvage_354"
    ],
    "mapId": 127,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 20,
    "commandCode": 412,
    "parameters": [],
    "message": "Archipelago: boss salvage checked."
}),
        Object.freeze({
    "familyKey": "boss_salvage_354",
    "familyName": "Fungus Fibers boss salvage",
    "locationKeys": [
        "boss_salvage_354"
    ],
    "mapId": 127,
    "eventId": 24,
    "pageIndex": 0,
    "commandIndex": 19,
    "commandCode": 412,
    "parameters": [],
    "message": "Archipelago: boss salvage checked."
}),
        Object.freeze({
    "familyKey": "boss_salvage_354",
    "familyName": "Fungus Fibers boss salvage",
    "locationKeys": [
        "boss_salvage_354"
    ],
    "mapId": 127,
    "eventId": 24,
    "pageIndex": 1,
    "commandIndex": 19,
    "commandCode": 412,
    "parameters": [],
    "message": "Archipelago: boss salvage checked."
}),
        Object.freeze({
    "familyKey": "boss_salvage_354",
    "familyName": "Fungus Fibers boss salvage",
    "locationKeys": [
        "boss_salvage_354"
    ],
    "mapId": 127,
    "eventId": 26,
    "pageIndex": 0,
    "commandIndex": 19,
    "commandCode": 412,
    "parameters": [],
    "message": "Archipelago: boss salvage checked."
}),
        Object.freeze({
    "familyKey": "boss_salvage_354",
    "familyName": "Fungus Fibers boss salvage",
    "locationKeys": [
        "boss_salvage_354"
    ],
    "mapId": 127,
    "eventId": 26,
    "pageIndex": 1,
    "commandIndex": 19,
    "commandCode": 412,
    "parameters": [],
    "message": "Archipelago: boss salvage checked."
}),
        Object.freeze({
    "familyKey": "boss_salvage_357",
    "familyName": "Tank Gun boss salvage",
    "locationKeys": [
        "boss_salvage_357"
    ],
    "mapId": 130,
    "eventId": 9,
    "pageIndex": 1,
    "commandIndex": 20,
    "commandCode": 412,
    "parameters": [],
    "message": "Archipelago: boss salvage checked."
}),
        Object.freeze({
    "familyKey": "boss_salvage_364",
    "familyName": "Jousting Lance boss salvage",
    "locationKeys": [
        "boss_salvage_364"
    ],
    "mapId": 152,
    "eventId": 6,
    "pageIndex": 0,
    "commandIndex": 15,
    "commandCode": 412,
    "parameters": [],
    "message": "Archipelago: boss salvage checked."
}),
        Object.freeze({
    "familyKey": "boss_salvage_364",
    "familyName": "Jousting Lance boss salvage",
    "locationKeys": [
        "boss_salvage_364"
    ],
    "mapId": 152,
    "eventId": 6,
    "pageIndex": 1,
    "commandIndex": 15,
    "commandCode": 412,
    "parameters": [],
    "message": "Archipelago: boss salvage checked."
}),
        Object.freeze({
    "familyKey": "boss_salvage_356",
    "familyName": "Tank Tracks boss salvage",
    "locationKeys": [
        "boss_salvage_356"
    ],
    "mapId": 207,
    "eventId": 22,
    "pageIndex": 3,
    "commandIndex": 13,
    "commandCode": 412,
    "parameters": [],
    "message": "Archipelago: boss salvage checked."
}),
        Object.freeze({
    "familyKey": "boss_salvage_365",
    "familyName": "Cope Cage boss salvage",
    "locationKeys": [
        "boss_salvage_365"
    ],
    "mapId": 233,
    "eventId": 11,
    "pageIndex": 2,
    "commandIndex": 13,
    "commandCode": 412,
    "parameters": [],
    "message": "Archipelago: boss salvage checked."
}),
        Object.freeze({
    "familyKey": "boss_salvage_355",
    "familyName": "Rhinoceros Hide boss salvage",
    "locationKeys": [
        "boss_salvage_355"
    ],
    "mapId": 270,
    "eventId": 6,
    "pageIndex": 1,
    "commandIndex": 28,
    "commandCode": 412,
    "parameters": [],
    "message": "Archipelago: boss salvage checked."
}),
        Object.freeze({
    "familyKey": "boss_salvage_355",
    "familyName": "Rhinoceros Hide boss salvage",
    "locationKeys": [
        "boss_salvage_355"
    ],
    "mapId": 270,
    "eventId": 6,
    "pageIndex": 2,
    "commandIndex": 28,
    "commandCode": 412,
    "parameters": [],
    "message": "Archipelago: boss salvage checked."
}),
        Object.freeze({
    "familyKey": "map092_event045_quest_pickup",
    "familyName": "Rat King Defeated - Rusty Crown",
    "locationKeys": [
        "map092_event045_quest_pickup"
    ],
    "mapId": 92,
    "eventId": 45,
    "pageIndex": 2,
    "commandIndex": 20,
    "commandCode": 121,
    "parameters": [
        133,
        133,
        0
    ],
    "message": "Archipelago: Rat King Defeated - Rusty Crown checked."
}),
        Object.freeze({
    "familyKey": "map430_event016_quest_pickup",
    "familyName": "Lumpy's Room - Straitjacket",
    "locationKeys": [
        "map430_event016_quest_pickup"
    ],
    "mapId": 430,
    "eventId": 16,
    "pageIndex": 1,
    "commandIndex": 5,
    "commandCode": 123,
    "parameters": [
        "A",
        0
    ],
    "message": "Archipelago: Lumpy's Room - Straitjacket checked."
}),
        Object.freeze({
    "familyKey": "map430_event016_quest_pickup",
    "familyName": "Lumpy's Room - Straitjacket",
    "locationKeys": [
        "map430_event016_quest_pickup"
    ],
    "mapId": 430,
    "eventId": 16,
    "pageIndex": 2,
    "commandIndex": 8,
    "commandCode": 123,
    "parameters": [
        "A",
        0
    ],
    "message": "Archipelago: Lumpy's Room - Straitjacket checked."
}),
        Object.freeze({
    "familyKey": "clint_resolution",
    "familyName": "Clint Resolution",
    "locationKeys": [
        "clint_rags",
        "clint_tooth_knife"
    ],
    "mapId": 6,
    "eventId": 27,
    "pageIndex": 0,
    "commandIndex": 7,
    "commandCode": 121,
    "parameters": [
        545,
        545,
        0
    ]
}),
        Object.freeze({
    "familyKey": "clint_resolution",
    "familyName": "Clint Resolution",
    "locationKeys": [
        "clint_rags",
        "clint_tooth_knife"
    ],
    "mapId": 6,
    "eventId": 27,
    "pageIndex": 1,
    "commandIndex": 7,
    "commandCode": 121,
    "parameters": [
        545,
        545,
        0
    ]
}),
        Object.freeze({
    "familyKey": "clint_resolution",
    "familyName": "Clint Resolution",
    "locationKeys": [
        "clint_rags",
        "clint_tooth_knife"
    ],
    "mapId": 31,
    "eventId": 35,
    "pageIndex": 0,
    "commandIndex": 7,
    "commandCode": 121,
    "parameters": [
        545,
        545,
        0
    ]
}),
        Object.freeze({
    "familyKey": "clint_resolution",
    "familyName": "Clint Resolution",
    "locationKeys": [
        "clint_rags",
        "clint_tooth_knife"
    ],
    "mapId": 31,
    "eventId": 35,
    "pageIndex": 1,
    "commandIndex": 7,
    "commandCode": 121,
    "parameters": [
        545,
        545,
        0
    ]
}),
        Object.freeze({
    "familyKey": "clint_resolution",
    "familyName": "Clint Resolution",
    "locationKeys": [
        "clint_rags",
        "clint_tooth_knife"
    ],
    "mapId": 435,
    "eventId": 1,
    "pageIndex": 0,
    "commandIndex": 7,
    "commandCode": 121,
    "parameters": [
        545,
        545,
        0
    ]
}),
        Object.freeze({
    "familyKey": "clint_resolution",
    "familyName": "Clint Resolution",
    "locationKeys": [
        "clint_rags",
        "clint_tooth_knife"
    ],
    "mapId": 435,
    "eventId": 1,
    "pageIndex": 1,
    "commandIndex": 7,
    "commandCode": 121,
    "parameters": [
        545,
        545,
        0
    ]
}),
        Object.freeze({
    "familyKey": "madison_resolution",
    "familyName": "Madison Resolution",
    "locationKeys": [
        "madison_tooth_hammer"
    ],
    "mapId": 34,
    "eventId": 20,
    "pageIndex": 0,
    "commandIndex": 7,
    "commandCode": 121,
    "parameters": [
        543,
        543,
        0
    ]
}),
        Object.freeze({
    "familyKey": "madison_resolution",
    "familyName": "Madison Resolution",
    "locationKeys": [
        "madison_tooth_hammer"
    ],
    "mapId": 34,
    "eventId": 20,
    "pageIndex": 1,
    "commandIndex": 7,
    "commandCode": 121,
    "parameters": [
        543,
        543,
        0
    ]
}),
        Object.freeze({
    "familyKey": "madison_resolution",
    "familyName": "Madison Resolution",
    "locationKeys": [
        "madison_tooth_hammer"
    ],
    "mapId": 34,
    "eventId": 20,
    "pageIndex": 3,
    "commandIndex": 7,
    "commandCode": 121,
    "parameters": [
        543,
        543,
        0
    ]
}),
        Object.freeze({
    "familyKey": "madison_resolution",
    "familyName": "Madison Resolution",
    "locationKeys": [
        "madison_tooth_hammer"
    ],
    "mapId": 435,
    "eventId": 3,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 121,
    "parameters": [
        543,
        543,
        0
    ]
}),
        Object.freeze({
    "familyKey": "madison_resolution",
    "familyName": "Madison Resolution",
    "locationKeys": [
        "madison_tooth_hammer"
    ],
    "mapId": 435,
    "eventId": 3,
    "pageIndex": 1,
    "commandIndex": 6,
    "commandCode": 121,
    "parameters": [
        543,
        543,
        0
    ]
}),
        Object.freeze({
    "familyKey": "joel_resolution",
    "familyName": "Joel Resolution",
    "locationKeys": [
        "joel_peaceful_door_knob",
        "joel_resolution_toothy_whip"
    ],
    "mapId": 32,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 346,
    "commandCode": 121,
    "parameters": [
        33,
        33,
        0
    ],
    "message": "Archipelago: Joel Resolution complete (2 checks).",
    "troopId": 26,
    "requiredVariables": [
        {
            "id": 107,
            "value": 20
        }
    ]
}),
        Object.freeze({
    "familyKey": "joel_resolution",
    "familyName": "Joel Resolution",
    "locationKeys": [
        "joel_peaceful_door_knob",
        "joel_resolution_toothy_whip"
    ],
    "mapId": 435,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 121,
    "parameters": [
        541,
        541,
        0
    ],
    "message": "Archipelago: Joel Resolution complete (2 checks)."
}),
        Object.freeze({
    "familyKey": "joel_resolution",
    "familyName": "Joel Resolution",
    "locationKeys": [
        "joel_peaceful_door_knob",
        "joel_resolution_toothy_whip"
    ],
    "mapId": 435,
    "eventId": 2,
    "pageIndex": 1,
    "commandIndex": 6,
    "commandCode": 121,
    "parameters": [
        541,
        541,
        0
    ],
    "message": "Archipelago: Joel Resolution complete (2 checks)."
}),
        Object.freeze({
    "familyKey": "pierre_mail_resolution",
    "familyName": "Pierre Resolution",
    "locationKeys": [
        "pierre_clown_drawing",
        "pierre_old_mail",
        "pierre_clown_wig"
    ],
    "mapId": 356,
    "eventId": 2,
    "pageIndex": 5,
    "commandIndex": 101,
    "commandCode": 340,
    "parameters": [],
    "troopId": 19,
    "requiredVariables": [
        {
            "id": 617,
            "value": 20
        }
    ]
}),
        Object.freeze({
    "familyKey": "pierre_mail_resolution",
    "familyName": "Pierre Resolution",
    "locationKeys": [
        "pierre_clown_drawing",
        "pierre_old_mail",
        "pierre_clown_wig"
    ],
    "mapId": 356,
    "eventId": 2,
    "pageIndex": 1,
    "commandIndex": 5,
    "commandCode": 123,
    "parameters": [
        "A",
        0
    ]
}),
        Object.freeze({
    "familyKey": "pierre_mail_resolution",
    "familyName": "Pierre Resolution",
    "locationKeys": [
        "pierre_clown_drawing",
        "pierre_old_mail",
        "pierre_clown_wig"
    ],
    "mapId": 356,
    "eventId": 2,
    "pageIndex": 1,
    "commandIndex": 13,
    "commandCode": 122,
    "parameters": [
        617,
        617,
        0,
        0,
        17
    ],
    "requiredVariables": [
        {
            "id": 617,
            "value": 16
        }
    ]
}),
        Object.freeze({
    "familyKey": "pierre_mail_resolution",
    "familyName": "Pierre Resolution",
    "locationKeys": [
        "pierre_clown_drawing",
        "pierre_old_mail",
        "pierre_clown_wig"
    ],
    "mapId": 356,
    "eventId": 2,
    "pageIndex": 1,
    "commandIndex": 45,
    "commandCode": 122,
    "parameters": [
        617,
        617,
        0,
        0,
        17
    ]
}),
        Object.freeze({
    "familyKey": "pierre_mail_resolution",
    "familyName": "Pierre Resolution",
    "locationKeys": [
        "pierre_old_mail"
    ],
    "mapId": 3,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 219,
    "commandCode": 122,
    "parameters": [
        51,
        51,
        0,
        0,
        0
    ],
    "message": "Archipelago: Pierre's mail visit resolved.",
    "troopId": 80,
    "requiredVariables": [
        {
            "id": 617,
            "values": [
                6,
                10
            ]
        }
    ]
}),
        Object.freeze({
    "familyKey": "frederic_resolution",
    "familyName": "Frederic Resolution",
    "locationKeys": [
        "frederic_painters_key",
        "frederic_canvas_bag",
        "frederic_paint_palette"
    ],
    "mapId": 96,
    "eventId": 12,
    "pageIndex": 0,
    "commandIndex": 229,
    "commandCode": 122,
    "parameters": [
        305,
        305,
        0,
        0,
        5
    ],
    "troopId": 327,
    "requiredVariables": [
        {
            "id": 305,
            "value": 4
        }
    ]
}),
        Object.freeze({
    "familyKey": "frederic_resolution",
    "familyName": "Frederic Resolution",
    "locationKeys": [
        "frederic_painters_key",
        "frederic_canvas_bag",
        "frederic_paint_palette"
    ],
    "mapId": 96,
    "eventId": 12,
    "pageIndex": 0,
    "commandIndex": 18,
    "commandCode": 122,
    "parameters": [
        305,
        305,
        0,
        0,
        99
    ]
}),
        Object.freeze({
    "familyKey": "frederic_resolution",
    "familyName": "Frederic Resolution",
    "locationKeys": [
        "frederic_painters_key",
        "frederic_canvas_bag",
        "frederic_paint_palette"
    ],
    "mapId": 96,
    "eventId": 12,
    "pageIndex": 1,
    "commandIndex": 18,
    "commandCode": 122,
    "parameters": [
        305,
        305,
        0,
        0,
        99
    ]
}),
        Object.freeze({
    "familyKey": "frederic_resolution",
    "familyName": "Frederic Resolution",
    "locationKeys": [
        "frederic_painters_key",
        "frederic_canvas_bag",
        "frederic_paint_palette"
    ],
    "mapId": 96,
    "eventId": 12,
    "pageIndex": 2,
    "commandIndex": 18,
    "commandCode": 122,
    "parameters": [
        305,
        305,
        0,
        0,
        99
    ]
}),
        Object.freeze({
    "familyKey": "frederic_resolution",
    "familyName": "Frederic Resolution",
    "locationKeys": [
        "frederic_painters_key",
        "frederic_canvas_bag"
    ],
    "mapId": 96,
    "eventId": 12,
    "pageIndex": 0,
    "commandIndex": 178,
    "commandCode": 122,
    "parameters": [
        305,
        305,
        0,
        0,
        3
    ],
    "troopId": 327,
    "requiredVariables": [
        {
            "id": 305,
            "value": 2
        }
    ]
}),
        Object.freeze({
    "familyKey": "jasper_resolution",
    "familyName": "Jasper Resolution",
    "locationKeys": [
        "jasper_apartment_key",
        "ritual_roof_key",
        "ritual_dark_robes"
    ],
    "mapId": 65,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 595,
    "commandCode": 121,
    "parameters": [
        206,
        206,
        0
    ],
    "troopId": 124
}),
        Object.freeze({
    "familyKey": "jasper_resolution",
    "familyName": "Jasper Resolution",
    "locationKeys": [
        "jasper_apartment_key",
        "ritual_roof_key",
        "ritual_dark_robes"
    ],
    "mapId": 65,
    "eventId": 9,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 121,
    "parameters": [
        172,
        172,
        0
    ]
}),
        Object.freeze({
    "familyKey": "benjamin_playtime",
    "familyName": "Benjamin Resolution",
    "locationKeys": [
        "benjamin_game",
        "benjamin_pendant"
    ],
    "mapId": 33,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 635,
    "commandCode": 122,
    "parameters": [
        110,
        110,
        0,
        0,
        5
    ],
    "troopId": 27,
    "requiredVariables": [
        {
            "id": 110,
            "value": 4
        }
    ]
}),
        Object.freeze({
    "familyKey": "benjamin_playtime",
    "familyName": "Benjamin Resolution",
    "locationKeys": [
        "benjamin_game",
        "benjamin_pendant"
    ],
    "mapId": 33,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 8,
    "commandCode": 121,
    "parameters": [
        542,
        542,
        0
    ]
}),
        Object.freeze({
    "familyKey": "benjamin_playtime",
    "familyName": "Benjamin Resolution",
    "locationKeys": [
        "benjamin_game",
        "benjamin_pendant"
    ],
    "mapId": 33,
    "eventId": 2,
    "pageIndex": 1,
    "commandIndex": 8,
    "commandCode": 121,
    "parameters": [
        542,
        542,
        0
    ]
}),
        Object.freeze({
    "familyKey": "benjamin_playtime",
    "familyName": "Benjamin Resolution",
    "locationKeys": [
        "benjamin_game",
        "benjamin_pendant"
    ],
    "mapId": 33,
    "eventId": 2,
    "pageIndex": 2,
    "commandIndex": 8,
    "commandCode": 121,
    "parameters": [
        542,
        542,
        0
    ]
}),
        Object.freeze({
    "familyKey": "benjamin_playtime",
    "familyName": "Benjamin Resolution",
    "locationKeys": [
        "benjamin_game",
        "benjamin_pendant"
    ],
    "mapId": 33,
    "eventId": 2,
    "pageIndex": 4,
    "commandIndex": 8,
    "commandCode": 121,
    "parameters": [
        542,
        542,
        0
    ]
}),
        Object.freeze({
    "familyKey": "benjamin_playtime",
    "familyName": "Benjamin Resolution",
    "locationKeys": [
        "benjamin_game",
        "benjamin_pendant"
    ],
    "mapId": 33,
    "eventId": 2,
    "pageIndex": 5,
    "commandIndex": 8,
    "commandCode": 121,
    "parameters": [
        542,
        542,
        0
    ]
}),
        Object.freeze({
    "familyKey": "benjamin_playtime",
    "familyName": "Benjamin Resolution",
    "locationKeys": [
        "benjamin_game",
        "benjamin_pendant"
    ],
    "mapId": 435,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 5,
    "commandCode": 121,
    "parameters": [
        542,
        542,
        0
    ]
}),
        Object.freeze({
    "familyKey": "benjamin_playtime",
    "familyName": "Benjamin Resolution",
    "locationKeys": [
        "benjamin_game",
        "benjamin_pendant"
    ],
    "mapId": 435,
    "eventId": 4,
    "pageIndex": 0,
    "commandIndex": 236,
    "commandCode": 340,
    "parameters": [],
    "troopId": 742
}),
        Object.freeze({
    "familyKey": "shadow_gift",
    "familyName": "Masked Shadow Resolution",
    "locationKeys": [
        "shadow_tongue",
        "map006_event040_complex",
        "map006_event040_quest_item"
    ],
    "mapId": 6,
    "eventId": 40,
    "pageIndex": 3,
    "commandIndex": 8,
    "commandCode": 123,
    "parameters": [
        "A",
        0
    ]
}),
        Object.freeze({
    "familyKey": "shadow_gift",
    "familyName": "Masked Shadow Resolution",
    "locationKeys": [
        "shadow_tongue",
        "map006_event040_complex",
        "map006_event040_quest_item"
    ],
    "mapId": 6,
    "eventId": 40,
    "pageIndex": 4,
    "commandIndex": 8,
    "commandCode": 123,
    "parameters": [
        "A",
        0
    ]
}),
        Object.freeze({
    "familyKey": "shadow_gift",
    "familyName": "Masked Shadow Resolution",
    "locationKeys": [
        "shadow_tongue",
        "map006_event040_complex",
        "map006_event040_quest_item"
    ],
    "mapId": 6,
    "eventId": 40,
    "pageIndex": 5,
    "commandIndex": 8,
    "commandCode": 123,
    "parameters": [
        "A",
        0
    ]
}),
        Object.freeze({
    "familyKey": "shadow_gift",
    "familyName": "Masked Shadow Resolution",
    "locationKeys": [
        "shadow_tongue",
        "map006_event040_complex",
        "map006_event040_quest_item"
    ],
    "mapId": 6,
    "eventId": 40,
    "pageIndex": 6,
    "commandIndex": 8,
    "commandCode": 123,
    "parameters": [
        "A",
        0
    ]
}),
        Object.freeze({
    "familyKey": "shadow_gift",
    "familyName": "Masked Shadow Resolution",
    "locationKeys": [
        "shadow_tongue",
        "map006_event040_complex",
        "map006_event040_quest_item"
    ],
    "mapId": 6,
    "eventId": 40,
    "pageIndex": 7,
    "commandIndex": 9,
    "commandCode": 123,
    "parameters": [
        "A",
        0
    ]
}),
        Object.freeze({
    "familyKey": "shadow_gift",
    "familyName": "Masked Shadow Resolution",
    "locationKeys": [
        "shadow_tongue"
    ],
    "mapId": 6,
    "eventId": 40,
    "pageIndex": 0,
    "commandIndex": 546,
    "commandCode": 404,
    "parameters": [],
    "message": "Archipelago: Shadow's tongue gift resolved.",
    "troopId": 18,
    "requiredVariables": [
        {
            "id": 150,
            "value": 5
        }
    ]
}),
        Object.freeze({
    "familyKey": "shadow_gift",
    "familyName": "Masked Shadow Resolution",
    "locationKeys": [
        "shadow_tongue",
        "map006_event040_complex",
        "map006_event040_quest_item"
    ],
    "mapId": 6,
    "eventId": 40,
    "pageIndex": 0,
    "commandIndex": 739,
    "commandCode": 340,
    "parameters": [],
    "troopId": 18,
    "requiredVariables": [
        {
            "id": 150,
            "values": [
                10,
                20
            ]
        }
    ]
}),
        Object.freeze({
    "familyKey": "mutt_resolution",
    "familyName": "Mutt Resolution",
    "locationKeys": [
        "mutt_vending_key"
    ],
    "mapId": 56,
    "eventId": 26,
    "pageIndex": 2,
    "commandIndex": 4,
    "commandCode": 121,
    "parameters": [
        317,
        317,
        0
    ]
}),
        Object.freeze({
    "familyKey": "tickle_resolution",
    "familyName": "Tickle Resolution",
    "locationKeys": [
        "tickle_drawing"
    ],
    "mapId": 189,
    "eventId": 18,
    "pageIndex": 0,
    "commandIndex": 3,
    "commandCode": 121,
    "parameters": [
        661,
        661,
        0
    ]
}),
        Object.freeze({
    "familyKey": "tickle_resolution",
    "familyName": "Tickle Resolution",
    "locationKeys": [
        "tickle_drawing"
    ],
    "mapId": 189,
    "eventId": 18,
    "pageIndex": 0,
    "commandIndex": 23,
    "commandCode": 121,
    "parameters": [
        661,
        661,
        0
    ]
}),
        Object.freeze({
    "familyKey": "nestor_key_resolution",
    "familyName": "Nestor Resolution",
    "locationKeys": [
        "simple_key_drop_153"
    ],
    "mapId": 94,
    "eventId": 11,
    "pageIndex": 1,
    "commandIndex": 9,
    "commandCode": 121,
    "parameters": [
        421,
        421,
        0
    ]
}),
        Object.freeze({
    "familyKey": "nestor_key_resolution",
    "familyName": "Nestor Resolution",
    "locationKeys": [
        "simple_key_drop_153"
    ],
    "mapId": 94,
    "eventId": 11,
    "pageIndex": 3,
    "commandIndex": 10,
    "commandCode": 121,
    "parameters": [
        448,
        448,
        0
    ]
}),
        Object.freeze({
    "familyKey": "nestor_key_resolution",
    "familyName": "Nestor Resolution",
    "locationKeys": [
        "simple_key_drop_153"
    ],
    "mapId": 94,
    "eventId": 40,
    "pageIndex": 0,
    "commandIndex": 10,
    "commandCode": 121,
    "parameters": [
        448,
        448,
        0
    ],
    "commonEventId": 183
}),
        Object.freeze({
    "familyKey": "juicebox_card_resolution",
    "familyName": "Juicebox Card Trick",
    "locationKeys": [
        "map006_event025_quest_pickup"
    ],
    "mapId": 2,
    "eventId": 48,
    "pageIndex": 0,
    "commandIndex": 638,
    "commandCode": 122,
    "parameters": [
        287,
        287,
        1,
        0,
        1
    ],
    "message": "Archipelago: Juicebox's card trick resolved.",
    "requiredVariables": [
        {
            "id": 287,
            "value": 6
        }
    ]
}),
        Object.freeze({
    "familyKey": "rat_freak_resolution",
    "familyName": "Rat Freak Resolution",
    "locationKeys": [
        "map106_event011_complex"
    ],
    "mapId": 106,
    "eventId": 11,
    "pageIndex": 0,
    "commandIndex": 4,
    "commandCode": 123,
    "parameters": [
        "C",
        0
    ],
    "message": "Archipelago: Rat Freak resolved."
}),
        Object.freeze({
    "familyKey": "rat_freak_resolution",
    "familyName": "Rat Freak Resolution",
    "locationKeys": [
        "map106_event011_complex"
    ],
    "mapId": 106,
    "eventId": 11,
    "pageIndex": 1,
    "commandIndex": 4,
    "commandCode": 123,
    "parameters": [
        "C",
        0
    ],
    "message": "Archipelago: Rat Freak resolved."
}),
        Object.freeze({
    "familyKey": "rat_freak_resolution",
    "familyName": "Rat Freak Resolution",
    "locationKeys": [
        "map106_event011_complex"
    ],
    "mapId": 106,
    "eventId": 11,
    "pageIndex": 3,
    "commandIndex": 6,
    "commandCode": 123,
    "parameters": [
        "D",
        0
    ],
    "message": "Archipelago: Rat Freak resolved."
}),
        Object.freeze({
    "familyKey": "sybil_resolution",
    "familyName": "Sybil Resolution",
    "locationKeys": [
        "map367_event001_quest_reward",
        "map348_event005"
    ],
    "mapId": 364,
    "eventId": 10,
    "pageIndex": 0,
    "commandIndex": 215,
    "commandCode": 121,
    "parameters": [
        5,
        5,
        0
    ],
    "message": "Archipelago: Sybil resolved (2 checks).",
    "troopId": 16
}),
        Object.freeze({
    "familyKey": "sybil_resolution",
    "familyName": "Sybil Resolution",
    "locationKeys": [
        "map367_event001_quest_reward",
        "map348_event005"
    ],
    "mapId": 367,
    "eventId": 1,
    "pageIndex": 1,
    "commandIndex": 10,
    "commandCode": 121,
    "parameters": [
        975,
        975,
        0
    ],
    "message": "Archipelago: Sybil resolved (2 checks)."
}),
        Object.freeze({
    "familyKey": "hellen_resolution",
    "familyName": "Hellen Resolution",
    "locationKeys": [
        "map433_event009_quest_pickup"
    ],
    "mapId": 6,
    "eventId": 1,
    "pageIndex": 0,
    "commandIndex": 40,
    "commandCode": 122,
    "parameters": [
        869,
        869,
        0,
        0,
        -1
    ],
    "commonEventId": 235,
    "requiredVariables": [
        {
            "id": 869,
            "value": 3
        }
    ]
}),
        Object.freeze({
    "familyKey": "hellen_resolution",
    "familyName": "Hellen Resolution",
    "locationKeys": [
        "map433_event009_quest_pickup"
    ],
    "mapId": 6,
    "eventId": 1,
    "pageIndex": 0,
    "commandIndex": 48,
    "commandCode": 122,
    "parameters": [
        869,
        869,
        0,
        0,
        -1
    ],
    "commonEventId": 235,
    "requiredVariables": [
        {
            "id": 869,
            "value": 3
        }
    ]
}),
        Object.freeze({
    "familyKey": "hellen_resolution",
    "familyName": "Hellen Resolution",
    "locationKeys": [
        "map433_event009_quest_pickup"
    ],
    "mapId": 433,
    "eventId": 9,
    "pageIndex": 2,
    "commandIndex": 39,
    "commandCode": 122,
    "parameters": [
        869,
        869,
        0,
        0,
        100
    ],
    "requiredVariables": [
        {
            "id": 869,
            "value": 18
        }
    ]
}),
        Object.freeze({
    "familyKey": "dan_resolution",
    "familyName": "Dan Resolution",
    "locationKeys": [
        "map016_event003_quest_item"
    ],
    "mapId": 6,
    "eventId": 1,
    "pageIndex": 0,
    "commandIndex": 54,
    "commandCode": 122,
    "parameters": [
        896,
        896,
        0,
        0,
        1
    ],
    "commonEventId": 237,
    "requiredVariables": [
        {
            "id": 896,
            "value": 0
        }
    ]
}),
        Object.freeze({
    "familyKey": "dan_resolution",
    "familyName": "Dan Resolution",
    "locationKeys": [
        "map016_event003_quest_item"
    ],
    "mapId": 6,
    "eventId": 1,
    "pageIndex": 0,
    "commandIndex": 62,
    "commandCode": 122,
    "parameters": [
        896,
        896,
        0,
        0,
        100
    ],
    "commonEventId": 237,
    "requiredVariables": [
        {
            "id": 896,
            "value": 10
        }
    ]
}),
        Object.freeze({
    "familyKey": "high_five_resolution",
    "familyName": "High Five Resolution",
    "locationKeys": [
        "boss_drop_293_280"
    ],
    "mapId": 70,
    "eventId": 57,
    "pageIndex": 1,
    "commandIndex": 51,
    "commandCode": 121,
    "parameters": [
        433,
        433,
        0
    ]
}),
        Object.freeze({
    "familyKey": "bright_frederic_resolution",
    "familyName": "Bright Frederic Resolution",
    "locationKeys": [
        "bright_frederic_jar"
    ],
    "mapId": 218,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 44,
    "commandCode": 122,
    "parameters": [
        320,
        320,
        0,
        0,
        5
    ],
    "message": "Archipelago: Bright Frederic resolved (1 check).",
    "troopId": 334,
    "requiredVariables": [
        {
            "id": 320,
            "value": 1
        }
    ]
}),
        Object.freeze({
    "familyKey": "bright_frederic_resolution",
    "familyName": "Bright Frederic Resolution",
    "locationKeys": [
        "bright_frederic_jar"
    ],
    "mapId": 218,
    "eventId": 2,
    "pageIndex": 0,
    "commandIndex": 3,
    "commandCode": 122,
    "parameters": [
        320,
        320,
        0,
        0,
        99
    ],
    "message": "Archipelago: Bright Frederic resolved (1 check)."
}),
        Object.freeze({
    "familyKey": "fungus_rescue_resolution",
    "familyName": "Fungus Rescue Resolution",
    "locationKeys": [
        "jean_pierre_greatsword"
    ],
    "mapId": 187,
    "eventId": 15,
    "pageIndex": 1,
    "commandIndex": 5,
    "commandCode": 121,
    "parameters": [
        497,
        497,
        0
    ],
    "message": "Archipelago: rescue checked.",
    "troopId": 347
}),
        Object.freeze({
    "familyKey": "fungus_rescue_resolution",
    "familyName": "Fungus Rescue Resolution",
    "locationKeys": [
        "sylvain_elegant_cap"
    ],
    "mapId": 187,
    "eventId": 22,
    "pageIndex": 1,
    "commandIndex": 8,
    "commandCode": 121,
    "parameters": [
        494,
        494,
        0
    ],
    "message": "Archipelago: rescue checked.",
    "troopId": 348
}),
        Object.freeze({
    "familyKey": "fungus_rescue_resolution",
    "familyName": "Fungus Rescue Resolution",
    "locationKeys": [
        "claire_breastplate"
    ],
    "mapId": 187,
    "eventId": 24,
    "pageIndex": 1,
    "commandIndex": 6,
    "commandCode": 121,
    "parameters": [
        495,
        495,
        0
    ],
    "message": "Archipelago: rescue checked.",
    "troopId": 349
}),
        Object.freeze({
    "familyKey": "fungus_rescue_resolution",
    "familyName": "Fungus Rescue Resolution",
    "locationKeys": [
        "jean_pierre_greatsword",
        "sylvain_elegant_cap",
        "claire_breastplate"
    ],
    "mapId": 127,
    "eventId": 2,
    "pageIndex": 1,
    "commandIndex": 7,
    "commandCode": 121,
    "parameters": [
        199,
        199,
        0
    ],
    "message": "Archipelago: fungus rescue rewards resolved."
}),
        Object.freeze({
    "familyKey": "fungus_rescue_resolution",
    "familyName": "Fungus Rescue Resolution",
    "locationKeys": [
        "jean_pierre_greatsword",
        "sylvain_elegant_cap",
        "claire_breastplate"
    ],
    "mapId": 83,
    "eventId": 25,
    "pageIndex": 0,
    "commandIndex": 9,
    "commandCode": 121,
    "parameters": [
        199,
        199,
        0
    ],
    "message": "Archipelago: fungus rescue rewards resolved."
}),
        Object.freeze({
    "familyKey": "darryl_resolution",
    "familyName": "Darryl Resolution",
    "locationKeys": [
        "darryl_legs"
    ],
    "mapId": 86,
    "eventId": 104,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 121,
    "parameters": [
        831,
        831,
        0
    ],
    "message": "Archipelago: Darryl resolved (1 check)."
}),
        Object.freeze({
    "familyKey": "darryl_resolution",
    "familyName": "Darryl Resolution",
    "locationKeys": [
        "darryl_legs"
    ],
    "mapId": 86,
    "eventId": 104,
    "pageIndex": 1,
    "commandIndex": 6,
    "commandCode": 121,
    "parameters": [
        831,
        831,
        0
    ],
    "message": "Archipelago: Darryl resolved (1 check)."
}),
        Object.freeze({
    "familyKey": "spider_husk_resolution",
    "familyName": "Spider Husk Resolution",
    "locationKeys": [
        "spider_husk_heart"
    ],
    "mapId": 351,
    "eventId": 7,
    "pageIndex": 0,
    "commandIndex": 6,
    "commandCode": 121,
    "parameters": [
        1083,
        1083,
        0
    ],
    "message": "Archipelago: Spider Husk resolved (1 check)."
}),
    ]);
    const endingChoices = Object.freeze([
    {
        "mapId": 113,
        "eventId": 4,
        "pageIndex": 0,
        "commandIndex": 5,
        "parameters": [
            [
                "Yes. Let's go.",
                "No. I need more time."
            ],
            -1,
            0,
            2,
            0
        ],
        "choices": [
            "Yes (no return).",
            "No. I need more time."
        ]
    },
    {
        "mapId": 169,
        "eventId": 2,
        "pageIndex": 1,
        "commandIndex": 53,
        "parameters": [
            [
                "Say the Word of Power.",
                "What is my reward?",
                "I won't say it."
            ],
            -1,
            0,
            2,
            0
        ],
        "choices": [
            "Say the Word (ending).",
            "What is my reward?",
            "I won't say it."
        ]
    },
    {
        "mapId": 169,
        "eventId": 2,
        "pageIndex": 1,
        "commandIndex": 75,
        "parameters": [
            [
                "Say the Word of Power.",
                "No."
            ],
            -1,
            0,
            2,
            0
        ],
        "choices": [
            "Say the Word (ending).",
            "No."
        ]
    },
    {
        "mapId": 362,
        "eventId": 3,
        "pageIndex": 0,
        "commandIndex": 6,
        "parameters": [
            [
                "Yes.",
                "No."
            ],
            -1,
            1,
            2,
            0
        ],
        "choices": [
            "Read (begin ending).",
            "No."
        ]
    }
]);
    // END GENERATED DEVELOPMENT REGISTRY

    const saveKey = "lookOutsideArchipelago";
    const saveSchema = 7;
    const eligibilityKey = "lookOutsideArchipelagoStart";
    let firstBindingEligible = false;
    let resumedInterpreters = new Set();
    let active = false;
    let checkHandler = null;
    let checkedKeys = new Set();
    let saveError = null;
    let hasApSaveState = false;
    let identity = null;
    let nextItemIndex = 0;
    let pendingItems = [];
    let connection = null;
    let connectionState = "disconnected";
    let connectionError = null;
    let itemDefinitions = null;
    let goalCompleted = false;
    let goalReporter = null;
    let serverReleasePermission = null;
    let serverMissingChecks = null;
    let elevatorFreakDefeated = false;
    let pendingDayRollover = false;
    let dayHold = false;
    let powerState = newPowerState();
    let reconnectTimer = null;
    let connectionGeneration = 0;
    let reconnectAttempt = 0;
    let lastServerUrl = "ws://localhost:38281";
    let lastSlotName = "";
    let clientUuid = null;
    let pendingBattleSources = [];
    let battleSources = [];
    let battleTroopId = null;
    let collectingVictoryDrops = false;
    let victoryDropChecks = new Map();
    let menuDialog = null;
    let recentDeliveries = [];
    let unshownDeliveries = [];
    let receiptToast = null;

    function newPowerState() {
        return { received: false, outageSeen: false, outageInProgress: false,
            puzzleRefreshPending: false, notices: [] };
    }

    function powerEnabled() {
        return active && globalThis.$dataSystem?.advanced?.gameId === auditedBuild.gameId &&
            globalThis.$dataSystem?.versionId === auditedBuild.versionId;
    }

    function isOutageCommand(context, index, code, params) {
        const command = context._list?.[context._index];
        return powerEnabled() && context._list === globalThis.$dataCommonEvents?.[16]?.list &&
            context._index === index && command?.code === code &&
            JSON.stringify(command.parameters) === JSON.stringify(params);
    }

    function isPowerRepairCommand(context, index, code, params) {
        const list = globalThis.$dataMap?.events?.[24]?.pages?.[0]?.list;
        return powerEnabled() && context._mapId === 369 && context._eventId === 24 &&
            list && context._list === list && context._index === index &&
            list[index]?.code === code && JSON.stringify(list[index].parameters) === JSON.stringify(params);
    }

    function restorePower(immediate = false) {
        if (!powerState.received || !powerState.outageSeen || powerState.outageInProgress) return;
        $gameSwitches.setValue(987, true);
        $gameSwitches.setValue(21, true);
        $gameSwitches.setValue(984, false);
        $gameSwitches.setValue(986, false);
        $gameVariables.setValue(737, 0); // Stop the outage's remaining flicker after restoration.
        powerState.puzzleRefreshPending = true;
        powerState.notices.push(immediate ? "outage-restored" : "restored");
        globalThis.$gameMap?.requestRefresh();
    }

    function finishPowerOutage() {
        if (!powerState.outageInProgress) return;
        powerState.outageInProgress = false;
        if (powerState.received) restorePower(true);
        else powerState.notices.push("outage");
    }

    function updatePowerPresentation() {
        if (!powerEnabled() || powerState.outageInProgress ||
            globalThis.$gameMessage?.isBusy?.() || globalThis.$gameMap?.isEventRunning?.()) return;
        if (powerState.puzzleRefreshPending && !globalThis.$gameTemp?.isCommonEventReserved?.()) {
            globalThis.$gameTemp?.reserveCommonEvent(64);
            powerState.puzzleRefreshPending = false;
        }
        if (!powerState.notices.length || !globalThis.$gameMessage?.add) return;
        const notice = powerState.notices.shift();
        const text = {
            received: "Archipelago: Power Restored received.\nIt will restore electricity when the outage occurs.",
            outage: "The building's power has gone out.\nReceive Power Restored through Archipelago to restore it.",
            "outage-restored": "The building's power cuts out.\nYour Power Restored item immediately brings it back.",
            restored: "Archipelago: Power Restored.\nElectricity has returned to the building.",
            checked: powerState.received ? "Archipelago: Main Fuse Box checked." :
                "Archipelago: Main Fuse Box checked.\nAwaiting the Power Restored item.",
        }[notice];
        $gameMessage.setFaceImage?.("", 0);
        $gameMessage.setSpeakerName?.("");
        $gameMessage.setBackground?.(0);
        $gameMessage.setPositionType?.(2);
        $gameMessage.add(text);
        if (notice === "restored" || notice === "outage-restored") {
            globalThis.AudioManager?.playSe({ name: "RestorePower", volume: 90, pitch: 100, pan: 0 });
        }
    }

    function resetBattleTracking() {
        pendingBattleSources = [];
        battleSources = [];
        battleTroopId = null;
        collectingVictoryDrops = false;
        victoryDropChecks = new Map();
    }

    function cancelReconnect() {
        if (reconnectTimer) {
            reconnectTimer.clear(reconnectTimer.id);
            reconnectTimer = null;
        }
    }

    function resetSession() {
        menuDialog?.close(false);
        recentDeliveries = [];
        unshownDeliveries = [];
        receiptToast?.remove();
        receiptToast = null;
        resetBattleTracking();
        connectionGeneration++;
        cancelReconnect();
        if (connection) {
            const oldConnection = connection;
            connection = null;
            oldConnection.close();
        }
        connection = null;
        connectionState = "disconnected";
        connectionError = null;
        reconnectAttempt = 0;
        itemDefinitions = null;
        goalCompleted = false;
        goalReporter = null;
        serverReleasePermission = null;
        serverMissingChecks = null;
        elevatorFreakDefeated = false;
        pendingDayRollover = false;
        dayHold = false;
        powerState = newPowerState();
        active = false;
        checkHandler = null;
        checkedKeys = new Set();
        saveError = null;
        hasApSaveState = false;
        identity = null;
        nextItemIndex = 0;
        pendingItems = [];
        firstBindingEligible = false;
        resumedInterpreters.clear();
    }

    function compatibilityStamp() {
        return { registryVersion: developmentRegistryVersion, gameId: auditedBuild.gameId,
            versionId: auditedBuild.versionId };
    }

    function compatibleStamp(stamp) {
        return stamp && Object.entries(compatibilityStamp()).every(([key, value]) => stamp[key] === value);
    }

    function rejectSave(saved, reason) {
        active = false;
        itemDefinitions = null;
        saveError = `${reason}. Load this save with its original matching mod/game version, or start a new Normal game. The save file has not been changed.`;
        throw new Error(saveError);
    }

    function restoreSession(saved, start, switches, present) {
        resetSession();
        firstBindingEligible = start?.schema === 1 && compatibleStamp(start.compatibility) && start.eligible === true &&
            globalThis.$dataSystem?.advanced?.gameId === auditedBuild.gameId &&
            globalThis.$dataSystem?.versionId === auditedBuild.versionId;
        if (!present) return;
        hasApSaveState = true;
        if (!saved || saved.schema !== saveSchema) rejectSave(saved, "Unsupported Archipelago save schema (older schemas lack compatibility metadata)");
        if (!compatibleStamp(saved.compatibility)) rejectSave(saved, "Archipelago save registry or audited build differs from this mod");
        if (globalThis.$dataSystem?.advanced?.gameId !== auditedBuild.gameId ||
            globalThis.$dataSystem?.versionId !== auditedBuild.versionId) rejectSave(saved, "Installed game build differs from audited build");
        if (switches?.value(8) || switches?.value(13)) rejectSave(saved, "This Archipelago version requires Normal difficulty");
        const validKeys = Array.isArray(saved.checkedKeys) &&
            saved.checkedKeys.every(key => Object.hasOwn(developmentLocationIds, key)) &&
            new Set(saved.checkedKeys).size === saved.checkedKeys.length;
        const validIdentity = saved.identity === null ||
            (saved.identity && typeof saved.identity.seedName === "string" && saved.identity.seedName &&
                Number.isSafeInteger(saved.identity.team) && saved.identity.team >= 0 &&
                Number.isSafeInteger(saved.identity.slot) && saved.identity.slot >= 1);
        const validItems = Number.isSafeInteger(saved.nextItemIndex) &&
            saved.nextItemIndex >= 0 && Array.isArray(saved.pendingItems) &&
            saved.pendingItems.every((entry, i) => entry && Number.isSafeInteger(entry.index) &&
                entry.index >= 0 && entry.index < saved.nextItemIndex &&
                (i === 0 || saved.pendingItems[i - 1].index < entry.index) && entry.item &&
                Number.isSafeInteger(entry.item.item) && Object.hasOwn(developmentItemDefinitions, entry.item.item));
        const validPower = saved.powerState &&
            ["received", "outageSeen", "outageInProgress", "puzzleRefreshPending"].every(
                key => typeof saved.powerState[key] === "boolean") &&
            (!saved.powerState.outageInProgress || saved.powerState.outageSeen) &&
            Array.isArray(saved.powerState.notices) && saved.powerState.notices.every(
                notice => ["received", "outage", "outage-restored", "restored", "checked"].includes(notice));
        if (!validKeys || !validIdentity || !validItems ||
            typeof saved.goalCompleted !== "boolean" ||
            typeof saved.elevatorFreakDefeated !== "boolean" ||
            typeof saved.pendingDayRollover !== "boolean" || typeof saved.dayHold !== "boolean" ||
            (saved.pendingDayRollover && saved.dayHold) || !validPower) {
            rejectSave(saved, "Unsupported Archipelago save state or unknown queued item");
        }
        checkedKeys = new Set(saved.checkedKeys);
        identity = saved.identity && { ...saved.identity };
        nextItemIndex = saved.nextItemIndex;
        pendingItems = saved.pendingItems.map(entry => ({ index: entry.index, item: { ...entry.item } }));
        active = identity !== null;
        itemDefinitions = developmentItemDefinitions;
        goalCompleted = saved.goalCompleted;
        elevatorFreakDefeated = saved.elevatorFreakDefeated;
        pendingDayRollover = saved.pendingDayRollover;
        dayHold = saved.dayHold;
        powerState = { ...saved.powerState, notices: saved.powerState.notices.slice() };
    }

    function saveSnapshot() {
        return {
            schema: saveSchema,
            compatibility: compatibilityStamp(),
            identity,
            checkedKeys: [...checkedKeys],
            nextItemIndex,
            pendingItems: pendingItems.map(entry => ({ index: entry.index, item: entry.item })),
            goalCompleted,
            elevatorFreakDefeated,
            pendingDayRollover,
            dayHold,
            powerState: { ...powerState, notices: powerState.notices.slice() },
        };
    }

    function isTimePassesCommand(interpreter, index, code, params) {
        const command = interpreter._list?.[interpreter._index];
        return interpreter._list === globalThis.$dataCommonEvents?.[4]?.list &&
            interpreter._index === index && command?.code === code &&
            Array.isArray(command.parameters) &&
            command.parameters.length === params.length &&
            params.every((value, offset) => command.parameters[offset] === value);
    }

    function calendarEnabled() {
        return active && identity &&
            globalThis.$dataSystem?.advanced?.gameId === auditedBuild.gameId &&
            globalThis.$dataSystem?.versionId === auditedBuild.versionId;
    }

    function clearHeldTime() {
        // Actions and battles queue elapsed minutes before calling TimePasses.
        // Discard that time during a hold so it cannot spill into the next day.
        $gameVariables.setValue(19, 0);
        $gameVariables.setValue(116, 0);
    }

    function limitTimeToRollover() {
        // HourPassed requests newDay at 04:00, four hours after the calendar
        // increment. Let the native hourly processing reach that boundary once.
        const hour = $gameVariables.value(16);
        const minute = $gameVariables.value(17);
        if (!Number.isInteger(hour) || hour < 0 || hour > 23 ||
            !Number.isInteger(minute) || minute < 0 || minute > 59) return;
        const untilRollover = ((28 - hour) % 24 || 24) * 60 - minute;
        const queued = $gameVariables.value(19) + Math.max(0, $gameVariables.value(116));
        if (queued > untilRollover) {
            $gameVariables.setValue(19, untilRollover);
            $gameVariables.setValue(116, 0);
        }
    }

    function isHomeDoorCommand(interpreter, pageIndex, index, code, params) {
        const event = globalThis.$gameMap?.event(9);
        const list = event?.event()?.pages?.[pageIndex]?.list;
        const command = list?.[index];
        return calendarEnabled() && interpreter._mapId === 3 && interpreter._eventId === 9 &&
            interpreter._list === list && interpreter._index === index &&
            command?.code === code && JSON.stringify(command.parameters) === JSON.stringify(params);
    }

    function advanceDayForDevelopment() {
        if (!active || !dayHold || !identity) throw new Error("No bound Archipelago day hold");
        if (globalThis.$dataSystem?.advanced?.gameId !== auditedBuild.gameId ||
            globalThis.$dataSystem?.versionId !== auditedBuild.versionId) {
            throw new Error("Installed game build differs from audited build");
        }
        if (globalThis.$gameMap?.isEventRunning?.() ||
            globalThis.$gameTemp?.isCommonEventReserved?.()) {
            throw new Error("Wait for the current game event to finish");
        }
        if (!globalThis.$dataCommonEvents?.[6]?.list ||
            !globalThis.$gameVariables?.setValue ||
            !globalThis.$gameTemp?.reserveCommonEvent) {
            throw new Error("Vanilla newDay event is unavailable");
        }
        const oldDay = $gameVariables.value(15);
        if (!Number.isSafeInteger(oldDay) || oldDay < 0) {
            throw new Error("Current day is invalid");
        }
        if (oldDay >= 15) {
            throw new Error("Day 15 is the final supported Archipelago day");
        }
        clearHeldTime();
        $gameVariables.setValue(15, oldDay + 1);
        $gameTemp.reserveCommonEvent(6);
        dayHold = false;
        pendingDayRollover = false;
        console.info(`[${pluginName}] advancing from Day ${oldDay} to Day ${oldDay + 1}`);
    }

    function connectionUuid() {
        if (clientUuid) return clientUuid;
        const key = "lookOutsideArchipelagoClientUuid";
        try {
            clientUuid = globalThis.localStorage?.getItem(key);
        } catch (_) {
            // Local storage can be unavailable in a restricted NW.js profile.
        }
        if (!clientUuid) {
            clientUuid = `lookoutside-${globalThis.crypto?.randomUUID?.() ||
                `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
            try {
                globalThis.localStorage?.setItem(key, clientUuid);
            } catch (_) {
                // The in-memory UUID remains valid for this game session.
            }
        }
        return clientUuid;
    }

    function connectFromMenu() {
        if (typeof globalThis.prompt !== "function") {
            throw new Error("Connection prompts are unavailable in this runtime");
        }
        const url = globalThis.prompt("Archipelago server (ws://host:port)", lastServerUrl);
        if (url === null) return;
        const name = globalThis.prompt("Archipelago slot name", lastSlotName);
        if (name === null) return;
        const password = globalThis.prompt("Server password (leave blank if none)", "");
        if (password === null) return;
        const trimmedUrl = url.trim();
        const trimmedName = name.trim();
        connectForDevelopment({
            url: trimmedUrl,
            name: trimmedName,
            password,
            uuid: connectionUuid(),
        });
        lastServerUrl = trimmedUrl;
        lastSlotName = trimmedName;
    }

    function connectionSummary() {
        const bound = identity
            ? `Seed: ${identity.seedName}, team ${identity.team}, slot ${identity.slot}`
            : "Save is not bound to an AP seed";
        return [
            `Archipelago: ${connectionState}`,
            bound,
            `Checks: ${checkedKeys.size} / ${Object.keys(developmentLocationIds).length}; pending items: ${pendingItems.length}`,
            dayHold ? `Day ${globalThis.$gameVariables?.value(15)} is held` : "Day is not held",
            dayHold && globalThis.$gameVariables?.value(15) >= 15
                ? "Day 15 is final. Finish an ending to release unfinished checks." : "",
            goalReleaseSummary(),
            connectionError || "",
        ].filter(Boolean).join("\n");
    }

    function goalReleaseSummary() {
        if (!identity) return "";
        if (goalCompleted && connectionState !== "connected") {
            return "Ending saved. Reconnect to report completion and release remaining checks.";
        }
        if (goalCompleted && serverMissingChecks === 0) {
            return "Goal complete. The server has acknowledged all checks.";
        }
        if (connectionState === "connected" && serverReleasePermission === 0) {
            return "This server disables release. The host must allow it to release unfinished checks after an ending.";
        }
        return goalCompleted ? "Goal complete. Waiting for the server to release remaining checks." : "";
    }

    function remainingDeadlines() {
        if (!active) return [];
        const day = globalThis.$gameVariables?.value(15) || 0;
        const hour = globalThis.$gameVariables?.value(16) || 0;
        return locationDeadlines.filter(entry => !checkedKeys.has(entry.key)).map(entry => ({
            ...entry,
            // The door closes when approached after noon. A player still inside
            // can finish collecting; report risk rather than declaring it lost.
            atRisk: day > entry.day || (day === entry.day && (hour >= entry.hour || dayHold)) ||
                !!globalThis.$gameSwitches?.value(entry.closed_switch),
        }));
    }

    function deadlineSummary(advance) {
        const remaining = remainingDeadlines();
        if (!remaining.length) return "";
        const day = globalThis.$gameVariables?.value(15) || 0;
        const relevant = advance ? remaining.filter(entry => entry.day <= day + 1) : remaining;
        if (!relevant.length) return "";
        const groups = new Map();
        for (const entry of relevant) {
            if (!groups.has(entry.group)) groups.set(entry.group, []);
            groups.get(entry.group).push(entry);
        }
        return Array.from(groups, ([name, entries]) => {
            const first = entries[0];
            const warning = first.atRisk ? "Access may already be lost. " : "";
            return `${name}: ${entries.length} unchecked\n${warning}${first.description}\n` +
                entries.map(entry => `• ${entry.name}`).join("\n");
        }).join("\n\n");
    }

    function recordDeliveryNotice(definition, fallbackName) {
        const name = definition.name || fallbackName || "Archipelago item";
        recentDeliveries.push(name);
        if (recentDeliveries.length > 50) recentDeliveries.shift();
        // Power restoration already has messages tied to its actual outage.
        if (definition.kind !== "switch" || definition.id !== 987) unshownDeliveries.push(name);
    }

    function updateDeliveryPresentation() {
        if (!active || !globalThis.document?.createElement) return;
        if (receiptToast && Date.now() >= receiptToast.expiresAt) {
            receiptToast.remove();
            receiptToast = null;
        }
        if (receiptToast || !unshownDeliveries.length || globalThis.$gameMessage?.isBusy?.() ||
            globalThis.$gameMap?.isEventRunning?.()) return;
        const names = unshownDeliveries.splice(0);
        const toast = document.createElement("div");
        toast.id = "loa-ap-receipt";
        toast.setAttribute("role", "status");
        toast.style.cssText = "position:fixed;right:16px;top:16px;max-width:min(340px,80vw);" +
            "padding:12px 16px;border:1px solid #d9b978;border-radius:6px;background:#191b20ee;" +
            "color:#eee8db;font:16px/1.4 sans-serif;white-space:pre-wrap;pointer-events:none;z-index:20;";
        toast.textContent = `Archipelago received\n${names.slice(0, 3).join("\n")}` +
            (names.length > 3 ? `\n+ ${names.length - 3} more (Archipelago Status)` : "");
        toast.expiresAt = Date.now() + 6000;
        document.body.append(toast);
        receiptToast = toast;
    }

    function disconnectFromServer() {
        connectionGeneration++;
        cancelReconnect();
        const socket = connection;
        connection = null;
        checkHandler = null;
        goalReporter = null;
        connectionState = "disconnected";
        connectionError = null;
        socket?.close();
        // A bound save keeps collecting checks and queued deliveries offline.
    }

    function showMenuDialog(scene, advance = false) {
        if (!globalThis.document?.createElement) return false;
        menuDialog?.close(false);
        const dialog = document.createElement("dialog");
        dialog.id = "loa-ap-dialog";
        dialog.setAttribute("aria-labelledby", "loa-ap-heading");
        dialog.innerHTML = `<style>
            #loa-ap-dialog { box-sizing: border-box; width: min(560px, 92vw); max-height: 90vh;
                overflow: auto; color: #eee8db; background: #191b20; border: 1px solid #807868;
                border-radius: 8px; padding: 22px; font: 16px/1.4 sans-serif; }
            #loa-ap-dialog::backdrop { background: #000b; }
            #loa-ap-dialog h2 { margin: 0 0 8px; font-size: 25px; }
            #loa-ap-dialog p { margin: 8px 0; }
            #loa-ap-dialog label { display: block; margin-top: 10px; }
            #loa-ap-dialog input { box-sizing: border-box; width: 100%; padding: 7px 10px;
                background: #0e1014; color: #fff; border: 1px solid #6b6f77; border-radius: 4px; font: inherit; }
            #loa-ap-dialog button { padding: 8px 15px; border: 1px solid #82858c; border-radius: 4px;
                font: inherit; color: #fff; background: #353941; cursor: pointer; }
            #loa-ap-dialog button[type=submit] { background: #6c5530; border-color: #d9b978; }
            #loa-ap-dialog button:disabled { opacity: .5; cursor: default; }
            #loa-ap-dialog :focus-visible { outline: 2px solid #f1cc82; outline-offset: 3px; }
            #loa-ap-dialog .loa-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px;
                position: sticky; bottom: 0; background: #191b20; padding-top: 8px; }
            #loa-ap-dialog .loa-status { margin-top: 12px; white-space: pre-wrap; overflow-wrap: anywhere; font-size: 15px; }
            #loa-ap-dialog .loa-error { color: #ffb9ad; min-height: 1.5em; }
            #loa-ap-dialog .loa-error:empty { display: none; }
            #loa-ap-dialog .loa-deadlines { margin-top: 12px; color: #f1cc82; }
            #loa-ap-dialog .loa-deadlines div { white-space: pre-wrap; font-size: 14px; margin-top: 8px; }
        </style><h2 id="loa-ap-heading"></h2><p class="loa-description"></p>
        <form><div class="loa-fields"></div><p class="loa-error" role="alert"></p>
        <div class="loa-status" role="status" aria-live="polite"></div>
        <details class="loa-recent" hidden><summary>Recent items (this session)</summary><div style="white-space:pre-wrap;font-size:14px"></div></details>
        <details class="loa-deadlines" hidden><summary>Tracked deadlines (not a complete list)</summary><div></div></details>
        <div class="loa-actions"><button type="submit"></button>
        <button type="button" class="loa-disconnect">Disconnect</button>
        <button type="button" class="loa-close">Close</button></div></form>`;
        const select = value => dialog.querySelector(value);
        const error = select(".loa-error");
        const status = select(".loa-status");
        const submit = select("button[type=submit]");
        const closeButton = select(".loa-close");
        const disconnect = select(".loa-disconnect");
        const recent = select(".loa-recent");
        const deadlines = select(".loa-deadlines");
        deadlines.open = advance;
        const fields = {};
        let timer;
        let closed = false;
        const blockGameInput = event => {
            // Stop RPG Maker's document keyboard handlers while retaining normal
            // browser editing, Tab navigation and form submission in this dialog.
            event.stopPropagation();
            if (event.type === "keydown" && event.key === "Escape") {
                event.preventDefault();
                close();
            }
        };
        const close = (reactivate = true) => {
            if (closed) return;
            closed = true;
            clearInterval(timer);
            for (const type of ["keydown", "keyup"]) dialog.removeEventListener(type, blockGameInput);
            dialog.close();
            dialog.remove();
            menuDialog = null;
            globalThis.Input?.clear();
            globalThis.TouchInput?.clear();
            if (reactivate) scene._commandWindow.activate();
        };
        menuDialog = { close };
        select("h2").textContent = advance ? "Go to Next Day" : "Archipelago";
        select(".loa-description").textContent = advance
            ? `Advance from Day ${$gameVariables.value(15)} to Day ${$gameVariables.value(15) + 1}? Vanilla quest deadlines still apply, and checks can become unavailable. You can keep exploring this day. Day 15 is final: unfinished quests do not advance afterward. Any ending requests release of remaining checks; the host must allow release.`
            : "Checks collected offline are sent when you reconnect. Vanilla quest deadlines still apply, including ones not listed below. Any ending requests release of remaining checks; the host must allow release.";
        submit.textContent = advance ? "Advance day" : "Connect";
        closeButton.textContent = advance ? "Keep exploring" : "Close";
        disconnect.hidden = advance;
        if (!advance) {
            try {
                const preferences = JSON.parse(globalThis.localStorage?.getItem("lookOutsideArchipelagoConnection") || "null");
                if (preferences && typeof preferences.url === "string" && typeof preferences.name === "string") {
                    lastServerUrl = preferences.url;
                    lastSlotName = preferences.name;
                }
            } catch (_) { /* Unavailable or corrupt preferences do not block connection. */ }
            for (const [key, title, type, value, placeholder] of [
                ["url", "Server", "text", lastServerUrl, "archipelago.gg:38281"],
                ["name", "Slot name", "text", lastSlotName, "Your player name"],
                ["password", "Password (optional)", "password", "", ""],
            ]) {
                const label = document.createElement("label");
                label.textContent = title;
                const input = document.createElement("input");
                input.id = `loa-ap-${key}`;
                input.type = type;
                input.value = value;
                input.placeholder = placeholder;
                input.autocomplete = "off";
                input.spellcheck = false;
                input.required = key !== "password";
                label.append(input);
                select(".loa-fields").append(label);
                fields[key] = input;
            }
        }
        const refresh = () => {
            const text = connectionSummary();
            if (status.textContent !== text) status.textContent = text;
            recent.hidden = advance || !recentDeliveries.length;
            const history = recentDeliveries.slice().reverse().join("\n");
            if (recent.lastElementChild.textContent !== history) recent.lastElementChild.textContent = history;
            const warnings = deadlineSummary(advance);
            deadlines.hidden = !warnings;
            if (deadlines.lastElementChild.textContent !== warnings) deadlines.lastElementChild.textContent = warnings;
            if (!advance) {
                submit.disabled = connectionState === "connecting";
                submit.textContent = connectionState === "connecting" ? "Connecting…" :
                    connectionState === "connected" ? "Reconnect" : "Connect";
                disconnect.disabled = !connection && !reconnectTimer;
            }
        };
        select("form").addEventListener("submit", event => {
            event.preventDefault();
            error.textContent = "";
            try {
                if (advance) {
                    advanceDayForDevelopment();
                    close(false);
                    scene.popScene();
                    return;
                }
                let url = fields.url.value.trim();
                if (!url.includes("://")) url = `ws://${url}`;
                const name = fields.name.value.trim();
                connectForDevelopment({ url, name, password: fields.password.value, uuid: connectionUuid() });
                lastServerUrl = url;
                lastSlotName = name;
                try {
                    globalThis.localStorage?.setItem("lookOutsideArchipelagoConnection", JSON.stringify({ url, name }));
                } catch (_) { /* Connection works without persistent preferences. */ }
                fields.password.value = "";
            } catch (failure) {
                error.textContent = failure.message;
            }
            refresh();
        });
        disconnect.addEventListener("click", () => { disconnectFromServer(); refresh(); });
        closeButton.addEventListener("click", () => close());
        dialog.addEventListener("cancel", event => { event.preventDefault(); close(); });
        for (const type of ["keydown", "keyup"]) dialog.addEventListener(type, blockGameInput);
        document.body.append(dialog);
        scene._commandWindow.deactivate?.();
        globalThis.Input?.clear();
        globalThis.TouchInput?.clear();
        dialog.showModal();
        (advance ? closeButton : fields.name.value ? fields.url : fields.name).focus();
        refresh();
        timer = setInterval(refresh, 400);
        return true;
    }

    function markGoalCompleted() {
        if (!identity || goalCompleted) return;
        goalCompleted = true;
        console.info(`[${pluginName}] Ending completed`);
        if (goalReporter) goalReporter();
    }

    function isNormalMode() {
        return !globalThis.$gameSwitches?.value(8) && !globalThis.$gameSwitches?.value(13);
    }

    function requireNormalMode() {
        if (!isNormalMode()) throw new Error("This Archipelago version requires Normal difficulty");
    }

    function bindIdentity(seedName, team, slot) {
        if (saveError) throw new Error(saveError);
        requireNormalMode();
        if (typeof seedName !== "string" || !seedName ||
            !Number.isSafeInteger(team) || team < 0 ||
            !Number.isSafeInteger(slot) || slot < 1) {
            throw new Error("Invalid Archipelago seed or slot identity");
        }
        const incoming = { seedName, team, slot };
        if (identity) {
            if (identity.seedName !== seedName || identity.team !== team || identity.slot !== slot) {
                throw new Error("Archipelago seed or slot differs from this save");
            }
        } else {
            requireFirstBindingEligibility();
            if (checkedKeys.size || nextItemIndex || pendingItems.length) {
                throw new Error("Cannot bind an unowned Archipelago save with existing progress");
            }
            identity = incoming;
            hasApSaveState = true;
        }
    }

    function requireFirstBindingEligibility() {
        if (!identity && !firstBindingEligible) {
            throw new Error("This save is not eligible for a first Archipelago connection. Start a new Normal game with this mod and connect before collecting randomized rewards, resolving their quests, or advancing a day.");
        }
    }

    function queueReceivedItems(startIndex, items) {
        if (!Number.isSafeInteger(startIndex) || startIndex < 0 || !Array.isArray(items) ||
            !items.every(item => item && Number.isSafeInteger(item.item))) {
            throw new Error("Invalid ReceivedItems packet");
        }
        if (startIndex > nextItemIndex) return false;
        const definitions = itemDefinitions || developmentItemDefinitions;
        if (items.some(item => !Object.hasOwn(definitions, item.item))) throw new Error("Unknown Archipelago item ID; use a matching APWorld and plugin");
        for (let offset = Math.max(0, nextItemIndex - startIndex); offset < items.length; offset++) {
            const item = items[offset];
            pendingItems.push({ index: startIndex + offset, item });
            nextItemIndex++;
        }
        return true;
    }

    function deliverPendingItems() {
        if (saveError || !itemDefinitions || !globalThis.$gameParty) return;
        for (const entry of [...pendingItems]) {
            const definition = itemDefinitions[entry.item.item];
            if (!definition) continue;
            if (definition.kind === "switch") {
                if (!globalThis.$gameSwitches) continue;
                try {
                    if (definition.id === 987) {
                        if (!powerState.received) {
                            powerState.received = true;
                            if (powerState.outageSeen) restorePower();
                            else powerState.notices.push("received");
                        }
                        pendingItems.splice(pendingItems.indexOf(entry), 1);
                        recordDeliveryNotice(definition);
                        continue;
                    }
                    $gameSwitches.setValue(definition.id, true);
                    if (!$gameSwitches.value(definition.id)) continue;
                    pendingItems.splice(pendingItems.indexOf(entry), 1);
                    recordDeliveryNotice(definition);
                    console.info(`[${pluginName}] delivered AP state ${entry.item.item}`);
                } catch (error) {
                    console.error(`[${pluginName}] state delivery failed`, error);
                }
                continue;
            }
            const database = definition.kind === "weapon" ? globalThis.$dataWeapons
                : definition.kind === "armor" ? globalThis.$dataArmors
                    : globalThis.$dataItems;
            const gameItem = database?.[definition.id];
            if (!gameItem) continue;
            try {
                const before = $gameParty.numItems(gameItem);
                const amount = definition.amount || 1;
                if (before + amount > $gameParty.maxItems(gameItem)) continue;
                $gameParty.gainItem(gameItem, amount, false);
                if ($gameParty.numItems(gameItem) === before + amount) {
                    for (const id of definition.deliverySwitches || []) $gameSwitches.setValue(id, true);
                    pendingItems.splice(pendingItems.indexOf(entry), 1);
                    recordDeliveryNotice(definition, amount > 1 ? `${gameItem.name} x${amount}` : gameItem.name);
                    console.info(`[${pluginName}] delivered AP item ${entry.item.item}`);
                }
            } catch (error) {
                console.error(`[${pluginName}] item delivery failed`, error);
            }
        }
    }

    function validateItemDefinitions(definitions) {
        if (!definitions || typeof definitions !== "object" ||
            Object.values(definitions).some(definition =>
                !definition || !["item", "weapon", "armor", "switch"].includes(definition.kind) ||
                !Number.isSafeInteger(definition.id) || definition.id < 1 ||
                (definition.amount !== undefined &&
                    (definition.kind === "switch" || !Number.isSafeInteger(definition.amount) ||
                     definition.amount < 1)))) {
            throw new Error("Invalid development item definitions");
        }
    }

    function configureItemDefinitions(definitions) {
        validateItemDefinitions(definitions);
        itemDefinitions = definitions;
    }

    function connectForDevelopment(options, isRetry = false) {
        requireNormalMode();
        if (saveError) throw new Error(saveError);
        requireFirstBindingEligibility();
        if (globalThis.$dataSystem?.advanced?.gameId !== auditedBuild.gameId ||
            globalThis.$dataSystem?.versionId !== auditedBuild.versionId) {
            throw new Error("Installed game build differs from audited build");
        }
        const WebSocketClass = options.WebSocketClass || globalThis.WebSocket;
        if (!WebSocketClass || !/^wss?:\/\//.test(options.url) ||
            typeof options.name !== "string" || !options.name ||
            typeof options.uuid !== "string" || !options.uuid) {
            throw new Error("Invalid Archipelago connection settings");
        }
        const serverUrl = new URL(options.url);
        if (!["ws:", "wss:"].includes(serverUrl.protocol) || !serverUrl.hostname ||
            serverUrl.username || serverUrl.password || serverUrl.hash) {
            throw new Error("Enter a WebSocket server address; use the password field for the server password");
        }
        const locationIds = options.locationIds || developmentLocationIds;
        const definitions = options.itemDefinitions || developmentItemDefinitions;
        validateItemDefinitions(definitions);
        if (!sourceSignatures.every(source => Number.isSafeInteger(locationIds[source.key]) &&
            locationIds[source.key] > 0) ||
            [...checkedKeys].some(key => !Number.isSafeInteger(locationIds[key]))) {
            throw new Error("Every development source needs an AP location ID");
        }
        const keyByLocationId = new Map(
            Object.entries(locationIds).map(([key, id]) => [id, key])
        );
        let roomSeedName = null;
        const serverCheckedIds = new Set();
        const socket = new WebSocketClass(options.url);
        connectionGeneration++;
        cancelReconnect();
        const oldConnection = connection;
        connection = null;
        oldConnection?.close();
        if (!isRetry) reconnectAttempt = 0;
        itemDefinitions = definitions;
        const generation = connectionGeneration;
        connection = socket;
        connectionState = "connecting";
        connectionError = null;
        serverReleasePermission = null;
        serverMissingChecks = null;

        function scheduleReconnect() {
            if (options.autoReconnect === false) return;
            const delay = Math.min(1000 * 2 ** Math.min(reconnectAttempt, 5), 30000);
            reconnectAttempt++;
            const schedule = options.setTimeout || globalThis.setTimeout;
            const clear = options.clearTimeout || globalThis.clearTimeout;
            const id = schedule(() => {
                reconnectTimer = null;
                if (generation === connectionGeneration) connectForDevelopment(options, true);
            }, delay);
            reconnectTimer = { id, clear };
        }

        function send(packets) {
            if (socket.readyState === 1) socket.send(JSON.stringify(packets));
        }
        function sendChecks(keys) {
            if (connectionState !== "connected" || !keys.length) return;
            const ids = keys.map(key => locationIds[key]);
            if (ids.some(id => !Number.isSafeInteger(id))) {
                fail("Saved check has no AP location ID");
                return;
            }
            send([{ cmd: "LocationChecks", locations: ids }]);
        }
        function acceptServerChecks(ids) {
            if (!Array.isArray(ids) || !ids.every(Number.isSafeInteger)) {
                throw new Error("Invalid checked_locations list");
            }
            for (const id of ids) {
                const key = keyByLocationId.get(id);
                if (key) {
                    checkedKeys.add(key);
                    serverCheckedIds.add(id);
                }
            }
            serverMissingChecks = keyByLocationId.size - serverCheckedIds.size;
        }
        function fail(message) {
            connectionError = message;
            connectionState = "error";
            active = identity !== null;
            checkHandler = null;
            goalReporter = null;
            socket.close();
        }
        socket.onmessage = event => {
            if (socket !== connection || connectionState === "error") return;
            let packets;
            try {
                packets = JSON.parse(event.data);
                if (!Array.isArray(packets)) throw new Error("Expected a packet list");
            } catch (error) {
                fail(`Invalid AP message: ${error.message}`);
                return;
            }
            for (const packet of packets) {
                if (connectionState === "error") break;
                try {
                    if (packet.cmd === "RoomInfo") {
                        roomSeedName = packet.seed_name;
                        serverReleasePermission = packet.permissions?.release ?? null;
                        if (typeof roomSeedName !== "string" || !roomSeedName) {
                            throw new Error("RoomInfo has no seed name");
                        }
                        if (identity && identity.seedName !== roomSeedName) {
                            throw new Error("Archipelago seed differs from this save");
                        }
                        send([{
                            cmd: "Connect",
                            password: options.password || "",
                            game: "Look Outside",
                            name: options.name,
                            uuid: options.uuid,
                            version: { major: 0, minor: 6, build: 7, class: "Version" },
                            items_handling: 7,
                            tags: [],
                            slot_data: true,
                        }]);
                    } else if (packet.cmd === "Connected") {
                        if (!roomSeedName) throw new Error("Connected before RoomInfo");
                        if (packet.slot_data?.development_slice !== true ||
                            packet.slot_data?.difficulty !== "normal" ||
                            packet.slot_data?.registry_version !== developmentRegistryVersion ||
                            packet.slot_data?.audited_game_id !== auditedBuild.gameId ||
                            packet.slot_data?.audited_version_id !== auditedBuild.versionId) {
                            throw new Error("Incompatible Look Outside slot data");
                        }
                        if (!Array.isArray(packet.checked_locations || []) ||
                            !(packet.checked_locations || []).every(Number.isSafeInteger)) {
                            throw new Error("Invalid checked_locations list");
                        }
                        bindIdentity(roomSeedName, packet.team, packet.slot);
                        acceptServerChecks(packet.checked_locations || []);
                        connectionState = "connected";
                        connectionError = null;
                        reconnectAttempt = 0;
                        active = true;
                        globalThis.$gameMap?.requestRefresh();
                        checkHandler = key => sendChecks([key]);
                        goalReporter = () => {
                            const packets = [{ cmd: "StatusUpdate", status: 30 }];
                            // AP handles these in order: goal first, then its normal
                            // release command. Retry after reconnect until acknowledged;
                            // never manufacture pickup checks or advance native quests.
                            if (serverMissingChecks !== 0) packets.push({ cmd: "Say", text: "!release" });
                            send(packets);
                        };
                        sendChecks([...checkedKeys]);
                        if (goalCompleted) goalReporter();
                    } else if (packet.cmd === "RoomUpdate") {
                        if (packet.permissions?.release !== undefined) {
                            serverReleasePermission = packet.permissions.release;
                            if (goalCompleted && serverMissingChecks !== 0) goalReporter?.();
                        }
                        if (connectionState === "connected" && packet.checked_locations) {
                            acceptServerChecks(packet.checked_locations);
                        }
                    } else if (packet.cmd === "ConnectionRefused") {
                        throw new Error(`Connection refused: ${(packet.errors || []).join(", ")}`);
                    } else if (packet.cmd === "ReceivedItems") {
                        if (connectionState !== "connected") continue;
                        if (!queueReceivedItems(packet.index, packet.items)) {
                            send([{ cmd: "Sync" }]);
                            sendChecks([...checkedKeys]);
                        }
                    }
                } catch (error) {
                    fail(error.message);
                }
            }
        };
        socket.onerror = () => {
            if (socket === connection && connectionState !== "error") {
                connectionError = "WebSocket error";
                socket.close();
            }
        };
        socket.onclose = () => {
            if (socket === connection) {
                if (connectionState !== "error") {
                    connectionState = "disconnected";
                    scheduleReconnect();
                }
                goalReporter = null;
                connection = null;
            }
        };
    }

    function matchingSource(interpreter, commandCode, params, enabled = active) {
        if (!enabled || !interpreter || !Array.isArray(params)) return null;
        if (globalThis.$dataSystem?.advanced?.gameId !== auditedBuild.gameId ||
            globalThis.$dataSystem?.versionId !== auditedBuild.versionId) return null;
        const command = interpreter._list?.[interpreter._index];
        if (!command || command.code !== commandCode ||
            !Array.isArray(command.parameters) ||
            command.parameters.some((value, index) => value !== params[index])) return null;
        if (commandCode === 121) {
            if (params.length !== 3 || params[0] !== params[1] || params[2] !== 0) return null;
        } else if (params[1] !== 0 || params[2] !== 0 || params[3] !== 1) {
            return null;
        }
        const event = globalThis.$gameMap?.event(interpreter._eventId);
        return sourceSignatures.find(source =>
            sourceContextMatches(interpreter, event, source) &&
            source.commandIndex === interpreter._index &&
            source.commandCode === commandCode &&
            source.databaseId === params[0]
        ) || null;
    }

    function sourcePageMatches(interpreter, event, source) {
        const originalPageList = globalThis.$dataMap?.events?.[source.eventId]
            ?.pages?.[source.pageIndex]?.list;
        return originalPageList
            ? interpreter._list === originalPageList
            : event?._pageIndex === source.pageIndex;
    }

    function sourceContextMatches(interpreter, event, source) {
        if (source.requiredSwitches?.some(condition =>
            $gameSwitches.value(condition.id) !== condition.value)) return false;
        if (source.requiredVariables?.some(condition =>
            condition.values ? !condition.values.includes(globalThis.$gameVariables?.value(condition.id)) :
                globalThis.$gameVariables?.value(condition.id) !== condition.value)) return false;
        if (source.commonEventId !== undefined) {
            const originalList = globalThis.$dataCommonEvents?.[source.commonEventId]?.list;
            return Boolean(originalList && interpreter._list === originalList);
        }
        if (source.troopId !== undefined) {
            const troop = globalThis.$gameTroop?.troop?.();
            const originalList = globalThis.$dataTroops?.[source.troopId]
                ?.pages?.[source.pageIndex]?.list;
            return Boolean(globalThis.$gameParty?.inBattle?.() && troop?.id === source.troopId &&
                originalList && interpreter._list === originalList);
        }
        return Boolean(event && source.mapId === interpreter._mapId &&
            source.eventId === interpreter._eventId && sourcePageMatches(interpreter, event, source));
    }

    function recordCheck(source, notifySilent = true) {
        if (checkedKeys.has(source.key)) return false;
        checkedKeys.add(source.key);
        if (source.sharedConsumedPage !== undefined) {
            globalThis.$gameMap?.requestRefresh();
        }
        console.info(`[${pluginName}] checked ${source.key}`);
        if (notifySilent && source.messageIndex === undefined) {
            globalThis.$gameMessage?.add("Archipelago location checked.");
        }
        if (checkHandler) {
            try {
                checkHandler(source.key);
            } catch (error) {
                console.error(`[${pluginName}] check handler failed`, error);
            }
        }
        return true;
    }

    function matchingQuestTerminal(interpreter, commandCode, params, enabled = active) {
        if (!enabled || globalThis.$dataSystem?.advanced?.gameId !== auditedBuild.gameId ||
            globalThis.$dataSystem?.versionId !== auditedBuild.versionId) return null;
        const command = interpreter._list?.[interpreter._index];
        const event = globalThis.$gameMap?.event(interpreter._eventId);
        if (command?.code !== commandCode || !Array.isArray(params) ||
            !Array.isArray(command.parameters) || command.parameters.length !== params.length ||
            command.parameters.some((value, index) => value !== params[index])) return null;
        return questTerminals.find(terminal => sourceContextMatches(interpreter, event, terminal) &&
            terminal.commandIndex === interpreter._index && terminal.commandCode === commandCode &&
            terminal.parameters.length === params.length &&
            terminal.parameters.every((value, index) => value === params[index])) || null;
    }

    function reconcileQuestTerminal(terminal, notify = true) {
        if (!terminal) return false;
        let reconciled = false;
        for (const key of terminal.locationKeys) {
            const source = sourceSignatures.find(candidate => candidate.key === key);
            if (source && recordCheck(source, false)) reconciled = true;
        }
        if (reconciled && notify) {
            globalThis.$gameMessage?.add(
                terminal.message || `Archipelago: remaining ${terminal.familyName} checks completed.`);
        }
        return reconciled;
    }

    function recordSourceCheck(source) {
        if (source.resolutionFamily) {
            const family = questTerminals.find(terminal => terminal.familyKey === source.resolutionFamily);
            // Scripted rewards already have their substituted acquisition text.
            return reconcileQuestTerminal(family, source.messageIndex === undefined);
        }
        return recordCheck(source);
    }

    function intercept(original, commandCode) {
        return function(params) {
            if (commandCode === 121 && active && Array.isArray(params) && params.length === 3 &&
                globalThis.$dataSystem?.advanced?.gameId === auditedBuild.gameId &&
                globalThis.$dataSystem?.versionId === auditedBuild.versionId) {
                const command = this._list?.[this._index];
                const event = globalThis.$gameMap?.event(this._eventId);
                if (command?.code === 121 && command.parameters?.length === 3 &&
                    command.parameters.every((value, index) => value === params[index]) &&
                    sourceSignatures.some(source => sourceContextMatches(this, event, source) &&
                        source.deferredSwitches?.some(effect => effect.commandIndex === this._index &&
                            params[0] === effect.id && params[1] === effect.id && params[2] === 0))) {
                    // The AP item grants access when delivered. Keep earlier ownership intact.
                    return true;
                }
            }
            const source = matchingSource(this, commandCode, params);
            if (!source) {
                const terminal = commandCode === 121
                    ? matchingQuestTerminal(this, commandCode, params) : null;
                const result = original.call(this, params);
                if (result) reconcileQuestTerminal(terminal);
                return result;
            }
            if (source.key === "map074_event003_elevator_freak") {
                elevatorFreakDefeated = true;
                globalThis.$gameMap?.requestRefresh();
            }
            const newlyChecked = recordSourceCheck(source);
            if (newlyChecked && source.key === "power_restoration") {
                globalThis.$gameMap?.requestRefresh();
                if (!powerState.notices.includes("checked")) powerState.notices.push("checked");
            }
            return true; // Let the event continue to its consumed self-switch.
        };
    }

    function isScoutInitialization(interpreter, index, code, expected, params) {
        if (!active || globalThis.$dataSystem?.advanced?.gameId !== auditedBuild.gameId ||
            globalThis.$dataSystem?.versionId !== auditedBuild.versionId ||
            !globalThis.$gameParty?.inBattle?.() || globalThis.$gameTroop?.troop?.()?.id !== 295 ||
            interpreter._list !== globalThis.$dataTroops?.[295]?.pages?.[0]?.list ||
            interpreter._index !== index) return false;
        const command = interpreter._list[index];
        return command?.code === code && JSON.stringify(command.parameters) === JSON.stringify(expected) &&
            JSON.stringify(params) === JSON.stringify(expected);
    }

    const interpreter = globalThis.Game_Interpreter?.prototype;
    if (!interpreter) throw new Error(`${pluginName} requires Game_Interpreter`);
    interpreter.command126 = intercept(interpreter.command126, 126);
    interpreter.command127 = intercept(interpreter.command127, 127);
    interpreter.command128 = intercept(interpreter.command128, 128);
    interpreter.command121 = intercept(interpreter.command121, 121);
    const interceptedCommand121 = interpreter.command121;
    interpreter.command121 = function(params) {
        // Radio signals follow the received item. Scout's original grant must
        // not enable them while its AP item is still elsewhere in the multiworld.
        if (isScoutInitialization(this, 48, 121, [394, 394, 0], params)) return true;
        if ([[11, [21, 21, 0]], [12, [984, 984, 1]], [13, [986, 986, 1]]].some(
            ([index, expected]) => JSON.stringify(params) === JSON.stringify(expected) &&
                isPowerRepairCommand(this, index, 121, expected))) return true;
        const outage = JSON.stringify(params) === JSON.stringify([21, 21, 1]) &&
            isOutageCommand(this, 26, 121, [21, 21, 1]);
        const result = interceptedCommand121.call(this, params);
        if (result && outage) {
            powerState.outageSeen = true;
            powerState.outageInProgress = true;
        }
        return result;
    };
    const originalCommand250 = interpreter.command250;
    if (originalCommand250) {
        interpreter.command250 = function(params) {
            const expected = [{ name: "RestorePower", volume: 90, pitch: 100, pan: 0 }];
            if (JSON.stringify(params) === JSON.stringify(expected) &&
                isPowerRepairCommand(this, 9, 250, expected)) return true;
            return originalCommand250.call(this, params);
        };
    }
    const originalCommand301 = interpreter.command301;
    interpreter.command301 = function(params) {
        const command = this._list?.[this._index];
        const event = globalThis.$gameMap?.event(this._eventId);
        const previous = pendingBattleSources;
        pendingBattleSources = [];
        if ((active || firstBindingEligible) && event && Array.isArray(params) && command?.code === 301 &&
            globalThis.$dataSystem?.advanced?.gameId === auditedBuild.gameId &&
            globalThis.$dataSystem?.versionId === auditedBuild.versionId &&
            command.parameters?.length === params.length &&
            command.parameters.every((value, index) => value === params[index])) {
            pendingBattleSources = sourceSignatures.filter(source => source.battleDrop &&
                source.mapId === this._mapId && source.eventId === this._eventId &&
                source.commandIndex === this._index && sourcePageMatches(this, event, source) &&
                source.battleDrop.parameters.length === params.length &&
                source.battleDrop.parameters.every((value, index) => value === params[index]));
        }
        try {
            return originalCommand301.call(this, params);
        } finally {
            pendingBattleSources = previous;
        }
    };

    const battleManager = globalThis.BattleManager;
    const enemyPrototype = globalThis.Game_Enemy?.prototype;
    if (battleManager && enemyPrototype) {
        const originalBattleSetup = battleManager.setup;
        battleManager.setup = function(troopId, ...args) {
            battleSources = [];
            battleTroopId = null;
            victoryDropChecks.clear();
            const result = originalBattleSetup.call(this, troopId, ...args);
            battleSources = pendingBattleSources.filter(source => source.battleDrop.parameters[1] === troopId);
            battleTroopId = troopId;
            return result;
        };
        const originalProcessVictory = battleManager.processVictory;
        battleManager.processVictory = function(...args) {
            collectingVictoryDrops = true;
            victoryDropChecks.clear();
            try {
                // Preserve the installed game's quietBattleEnd parameter and reward sequence.
                return originalProcessVictory.apply(this, args);
            } finally {
                resetBattleTracking();
            }
        };
        const originalMakeDropItems = enemyPrototype.makeDropItems;
        enemyPrototype.makeDropItems = function(...args) {
            const drops = originalMakeDropItems.apply(this, args);
            if (!collectingVictoryDrops || !battleSources.length ||
                globalThis.$dataSystem?.advanced?.gameId !== auditedBuild.gameId ||
                globalThis.$dataSystem?.versionId !== auditedBuild.versionId ||
                globalThis.$gameTroop?.troop()?.id !== battleTroopId) return drops;
            const filtered = drops.slice();
            for (const source of battleSources) {
                const definition = source.battleDrop;
                if (this.enemyId() !== definition.enemyId) continue;
                const drop = this.enemy().dropItems[definition.dropIndex];
                if (drop?.kind !== definition.kind || drop.dataId !== source.databaseId ||
                    drop.denominator !== 1) continue;
                const item = this.itemObject(definition.kind, source.databaseId);
                const index = filtered.indexOf(item);
                if (index < 0) continue;
                if (!active) {
                    if (!identity) firstBindingEligible = false;
                    continue; // The inactive game still receives its vanilla loot.
                }
                filtered.splice(index, 1);
                victoryDropChecks.set(source.key, source);
            }
            return filtered;
        };
        const originalGainDropItems = battleManager.gainDropItems;
        battleManager.gainDropItems = function(...args) {
            const result = originalGainDropItems.apply(this, args);
            if (active && collectingVictoryDrops) {
                for (const source of victoryDropChecks.values()) recordSourceCheck(source);
                victoryDropChecks.clear();
            }
            return result;
        };
        const originalEndBattle = battleManager.endBattle;
        battleManager.endBattle = function(...args) {
            try {
                return originalEndBattle.apply(this, args);
            } finally {
                resetBattleTracking();
            }
        };
    }
    const originalCommand123 = interpreter.command123;
    interpreter.command123 = function(params) {
        const terminal = matchingQuestTerminal(this, 123, params);
        const result = originalCommand123.call(this, params);
        if (result) reconcileQuestTerminal(terminal);
        return result;
    };
    // MZ normally treats End Branch as a no-op. It is reached after either
    // outcome of the Audrey condition, but skipped when the battle was escaped.
    const originalCommand412 = interpreter.command412;
    interpreter.command412 = function(params) {
        const terminal = matchingQuestTerminal(this, 412, params);
        const result = originalCommand412 ? originalCommand412.call(this, params) : true;
        if (result) reconcileQuestTerminal(terminal);
        return result;
    };
    const originalCommand404 = interpreter.command404;
    interpreter.command404 = function(params) {
        const terminal = matchingQuestTerminal(this, 404, params);
        const result = originalCommand404 ? originalCommand404.call(this, params) : true;
        if (result) reconcileQuestTerminal(terminal);
        return result;
    };
    const originalCommand340 = interpreter.command340;
    interpreter.command340 = function(params) {
        // Some peaceful quest finales end by aborting a dialogue battle.
        // Capture context while the native troop is still active.
        const terminal = matchingQuestTerminal(this, 340, params);
        const result = originalCommand340 ? originalCommand340.call(this, params) : true;
        if (result) reconcileQuestTerminal(terminal);
        return result;
    };
    const originalCommand122 = interpreter.command122;
    interpreter.command122 = function(params) {
        // An early Radio can already be charging when Scout is first met.
        // Keep its native timer; resetting it here would bypass the cooldown.
        if (isScoutInitialization(this, 46, 122, [456, 456, 0, 0, 8], params)) return true;
        if (active && identity && !dayHold &&
            globalThis.$dataSystem?.advanced?.gameId === auditedBuild.gameId &&
            globalThis.$dataSystem?.versionId === auditedBuild.versionId &&
            (isTimePassesCommand(this, 59, 122, [15, 15, 1, 0, 1]) ||
                isTimePassesCommand(this, 78, 122, [15, 15, 1, 0, 1]))) {
            pendingDayRollover = true;
            return true;
        }
        const terminal = matchingQuestTerminal(this, 122, params);
        const outageFinished = JSON.stringify(params) === JSON.stringify([940, 940, 0, 0, 0]) &&
            isOutageCommand(this, 34, 122, [940, 940, 0, 0, 0]);
        const result = originalCommand122.call(this, params);
        if (result) reconcileQuestTerminal(terminal);
        if (result && outageFinished) finishPowerOutage();
        return result;
    };
    const originalCommand117 = interpreter.command117;
    interpreter.command117 = function(params) {
        if (calendarEnabled()) {
            if (params?.[0] === 4) {
                if (dayHold) {
                    clearHeldTime();
                    return true;
                }
                limitTimeToRollover();
            }
            if (pendingDayRollover && isTimePassesCommand(this, 135, 117, [6])) {
                pendingDayRollover = false;
                dayHold = true;
                console.info(`[${pluginName}] Day ${globalThis.$gameVariables?.value(15)} held`);
                return true;
            }
        }
        return originalCommand117.call(this, params);
    };

    const originalSetupChoices = interpreter.setupChoices;
    if (originalSetupChoices) {
        interpreter.setupChoices = function(params) {
            if ($gameVariables.value(15) === 15 && isHomeDoorCommand(this, 2, 3, 102, params) &&
                JSON.stringify(params) === JSON.stringify([["Let's go.", "Not yet."], 1, 0, 2, 0])) {
                // Preserve native branch numbers, cancel behavior, and the original event list.
                return originalSetupChoices.call(this,
                    [["Leave (begin ending).", "Not yet.", "Keep exploring."], 1, 2, 2, 0]);
            }
            if (calendarEnabled()) {
                const warning = endingChoices.find(entry =>
                    this._mapId === entry.mapId && $gameMap.mapId() === entry.mapId &&
                    this._eventId === entry.eventId && this._index === entry.commandIndex &&
                    this._list === $gameMap.event(entry.eventId)?.event()?.pages?.[entry.pageIndex]?.list &&
                    this._list[this._index]?.code === 102 &&
                    JSON.stringify(params) === JSON.stringify(entry.parameters));
                if (warning) {
                    // Labels only: the native event owns every outcome and timing change.
                    return originalSetupChoices.call(this, [warning.choices.slice(), ...params.slice(1)]);
                }
            }
            return originalSetupChoices.call(this, params);
        };
    }
    const originalCommand402 = interpreter.command402;
    if (originalCommand402) {
        interpreter.command402 = function(params) {
            const explore = $gameVariables.value(15) === 15 &&
                isHomeDoorCommand(this, 2, 4, 402, [0, "Let's go."]) &&
                this._branch[this._indent] === 2;
            const result = originalCommand402.call(this, params);
            if (explore && result) {
                const pages = $gameMap.event(9).event().pages;
                // A waiting visitor must still be answered or dismissed normally.
                const pageIndex = $gameSwitches.value(24) ? 1 : 0;
                this.setupChild(pages[pageIndex].list, 9);
            }
            return result;
        };
    }
    const originalCommand111 = interpreter.command111;
    if (originalCommand111) {
        interpreter.command111 = function(params) {
            if ((dayHold || $gameVariables.value(15) === 15) &&
                isHomeDoorCommand(this, 0, 0, 111, [1, 13, 0, 3, 0])) {
                this._branch[this._indent] = false;
                this.skipBranch();
                return true;
            }
            return originalCommand111.call(this, params);
        };
    }
    const originalCommand101 = interpreter.command101;
    interpreter.command101 = function(params) {
        const messageIndex = this._index + 1;
        const textCommand = this._list?.[messageIndex];
        if (active && globalThis.$dataSystem?.advanced?.gameId === auditedBuild.gameId &&
            globalThis.$dataSystem?.versionId === auditedBuild.versionId &&
            globalThis.$gameMap && this._list?.[this._index]?.code === 101 &&
            textCommand?.code === 401) {
            const event = $gameMap.event(this._eventId);
            const source = sourceSignatures.find(candidate =>
                sourceContextMatches(this, event, candidate) &&
                [candidate, ...(candidate.messageVariants || [])].some(notice =>
                    notice.messageIndex === messageIndex &&
                    notice.originalMessage === textCommand.parameters?.[0])
            );
            if (source) {
                const notice = [source, ...(source.messageVariants || [])].find(entry =>
                    entry.messageIndex === messageIndex &&
                    entry.originalMessage === textCommand.parameters?.[0]);
                const originalParameters = textCommand.parameters;
                textCommand.parameters = [notice.apMessage];
                try {
                    return originalCommand101.call(this, params);
                } finally {
                    textCommand.parameters = originalParameters;
                }
            }
        }
        return originalCommand101.call(this, params);
    };

    // Track actual audited rewards/resolutions before first connection. This
    // leaves native outcomes intact while preventing a later partial AP start.
    for (const code of [121, 122, 123, 126, 127, 128, 404, 412]) {
        const original = interpreter[`command${code}`];
        if (!original) continue;
        interpreter[`command${code}`] = function(params) {
            if (saveError) return false;
            if (!identity && !active && firstBindingEligible &&
                (matchingSource(this, code, params, true) || matchingQuestTerminal(this, code, params, true) ||
                    (code === 122 && (isTimePassesCommand(this, 59, 122, [15, 15, 1, 0, 1]) ||
                        isTimePassesCommand(this, 78, 122, [15, 15, 1, 0, 1]))))) firstBindingEligible = false;
            return original.call(this, params);
        };
    }
    function mapInterpreters(map) {
        const result = new Set();
        function add(it) {
            if (!it || result.has(it)) return;
            result.add(it);
            add(it._childInterpreter);
        }
        add(map?._interpreter);
        for (const event of [...(map?._events || []), ...(map?._commonEvents || [])]) add(event?._interpreter);
        return result;
    }

    function stampInterpreterSources(map) {
        const originals = new Map();
        for (const event of globalThis.$dataCommonEvents || []) {
            if (event?.list) originals.set(event.list, { kind: "common", id: event.id });
        }
        for (const event of map?.events?.() || []) {
            event.event()?.pages?.forEach((page, index) => originals.set(page.list,
                { kind: "map", mapId: map.mapId(), eventId: event._eventId, page: index }));
        }
        for (const it of mapInterpreters(map)) {
            const origin = originals.get(it._list);
            it._loaSavedSource = origin ? { ...origin, ownerMapId: it._mapId, ownerEventId: it._eventId } : null;
        }
    }

    function restoreInterpreterSource(it) {
        if (!resumedInterpreters.has(it)) return;
        resumedInterpreters.delete(it);
        const origin = it._loaSavedSource;
        if (!origin || !it._list) return; // Unrelated plugin-created lists retain their original guards.
        const list = origin.kind === "common" ? globalThis.$dataCommonEvents?.[origin.id]?.list :
            origin.kind === "map" && $gameMap.mapId() === origin.mapId ?
                $gameMap.event(origin.eventId)?.event()?.pages?.[origin.page]?.list : null;
        if (!list || it._mapId !== origin.ownerMapId || it._eventId !== origin.ownerEventId ||
            JSON.stringify(it._list) !== JSON.stringify(list)) {
            rejectSave(null, "Cannot safely resume a changed Archipelago event list");
        }
        // Only interpreters loaded through DataManager, with a saved canonical
        // origin and an exact whole-list match, may regain reference identity.
        it._list = list;
    }

    function restoreInterpreterSources() {
        for (const it of resumedInterpreters) restoreInterpreterSource(it);
    }

    const originalInterpreterSetup = interpreter.setup;
    if (originalInterpreterSetup) {
        interpreter.setup = function() {
            resumedInterpreters.delete(this);
            this._loaSavedSource = null;
            return originalInterpreterSetup.apply(this, arguments);
        };
    }
    const originalExecuteCommand = interpreter.executeCommand;
    if (originalExecuteCommand) {
        interpreter.executeCommand = function() {
            if (saveError) return false;
            restoreInterpreterSource(this);
            return originalExecuteCommand.apply(this, arguments);
        };
    }

    const dataManager = globalThis.DataManager;
    if (!dataManager) throw new Error(`${pluginName} requires DataManager`);
    const originalSetupNewGame = dataManager.setupNewGame;
    const originalMakeSaveContents = dataManager.makeSaveContents;
    const originalExtractSaveContents = dataManager.extractSaveContents;
    dataManager.setupNewGame = function() {
        const result = originalSetupNewGame.apply(this, arguments);
        resetSession();
        firstBindingEligible = true;
        return result;
    };
    dataManager.makeSaveContents = function() {
        if (saveError) throw new Error(saveError);
        restoreInterpreterSources();
        const contents = originalMakeSaveContents.apply(this, arguments);
        if (hasApSaveState || firstBindingEligible) stampInterpreterSources(contents.map);
        contents[eligibilityKey] = { schema: 1, compatibility: compatibilityStamp(), eligible: firstBindingEligible };
        if (hasApSaveState) {
            contents[saveKey] = saveSnapshot();
        }
        return contents;
    };
    dataManager.extractSaveContents = function(contents) {
        // Validate before installing the native map, inventory or quest state.
        // Throwing rejects MZ's loadGame promise, so Scene_Load stays on its list.
        restoreSession(contents?.[saveKey], contents?.[eligibilityKey],
            contents?.switches || globalThis.$gameSwitches, Object.hasOwn(contents || {}, saveKey));
        const result = originalExtractSaveContents.apply(this, arguments);
        if (hasApSaveState || firstBindingEligible) resumedInterpreters = mapInterpreters(contents.map);
        return result;
    };

    const sceneLoad = globalThis.Scene_Load?.prototype;
    if (sceneLoad?.onLoadFailure) {
        const originalLoadFailure = sceneLoad.onLoadFailure;
        sceneLoad.onLoadFailure = function() {
            const result = originalLoadFailure.apply(this, arguments);
            if (saveError) globalThis.alert?.(saveError);
            return result;
        };
    }

    const sceneMap = globalThis.Scene_Map?.prototype;
    if (sceneMap?.update) {
        const originalSceneMapUpdate = sceneMap.update;
        sceneMap.update = function() {
            if (saveError) return;
            restoreInterpreterSources();
            const result = originalSceneMapUpdate.apply(this, arguments);
            deliverPendingItems();
            updatePowerPresentation();
            updateDeliveryPresentation();
            return result;
        };
        const originalMapTerminate = sceneMap.terminate;
        sceneMap.terminate = function() {
            receiptToast?.remove();
            receiptToast = null;
            return originalMapTerminate?.apply(this, arguments);
        };
    }

    const gameMap = globalThis.Game_Map?.prototype;
    if (gameMap?.setup) {
        const originalGameMapSetup = gameMap.setup;
        gameMap.setup = function(mapId) {
            const result = originalGameMapSetup.apply(this, arguments);
            if (mapId === 168 && !globalThis.$gameSwitches?.value(7)) {
                markGoalCompleted();
            }
            return result;
        };
    }

    const gameEvent = globalThis.Game_Event?.prototype;
    if (gameEvent?.meetsConditions) {
        const originalMeetsConditions = gameEvent.meetsConditions;
        gameEvent.meetsConditions = function(page) {
            if (active && globalThis.$dataSystem?.advanced?.gameId === auditedBuild.gameId &&
                globalThis.$dataSystem?.versionId === auditedBuild.versionId) {
                // Immediate restoration can skip the dark-basement scene that
                // starts olmPhase. Keep these two check-bearing encounters
                // available after restoration, without advancing that story.
                // Include the scorpion's retreat/defeated pages: they share
                // the same phase gate and must still outrank its live page.
                if (powerState.received && powerState.outageSeen && !powerState.outageInProgress &&
                    $gameSwitches.value(21) &&
                    ((this._mapId === 50 && this._eventId === 11) ||
                     (this._mapId === 86 && this._eventId === 104)) &&
                    this.event()?.pages?.includes(page) &&
                    page.conditions.variableValid && page.conditions.variableId === 740 &&
                    page.conditions.variableValue === 1) {
                    return originalMeetsConditions.call(this, {
                        ...page, conditions: { ...page.conditions, variableValid: false },
                    });
                }
                if (this._mapId === 74 && this._eventId === 3 &&
                    page === this.event()?.pages?.[1]) {
                    return elevatorFreakDefeated;
                }
                if (this._mapId === 369 && this._eventId === 24 &&
                    page === this.event()?.pages?.[1]) {
                    return checkedKeys.has("power_restoration");
                }
                const sharedSource = sourceSignatures.find(source =>
                    source.sharedConsumedPage !== undefined &&
                    source.mapId === this._mapId && source.eventId === this._eventId
                );
                if (sharedSource && page === this.event()?.pages?.[sharedSource.sharedConsumedPage]) {
                    return checkedKeys.has(sharedSource.key);
                }
            }
            return originalMeetsConditions.call(this, page);
        };
    }

    const menuCommand = globalThis.Window_MenuCommand?.prototype;
    const sceneMenu = globalThis.Scene_Menu?.prototype;
    if (menuCommand?.addOriginalCommands && sceneMenu?.createCommandWindow) {
        const originalAddOriginalCommands = menuCommand.addOriginalCommands;
        menuCommand.addOriginalCommands = function() {
            originalAddOriginalCommands.apply(this, arguments);
            if (globalThis.process?.env?.LOA_DEV_MODE === "1" || identity) {
                this.addCommand("Archipelago Connect", "loaConnect", true);
                this.addCommand("Archipelago Status", "loaStatus", true);
            }
            if (active && identity && dayHold &&
                globalThis.$gameVariables?.value(15) < 15) {
                this.addCommand("Go to Next Day", "loaNextDay", true);
            }
        };
        const originalCreateCommandWindow = sceneMenu.createCommandWindow;
        sceneMenu.createCommandWindow = function() {
            originalCreateCommandWindow.apply(this, arguments);
            this._commandWindow.setHandler("loaConnect", () => {
                if (showMenuDialog(this)) return;
                try {
                    connectFromMenu();
                } catch (error) {
                    console.error(`[${pluginName}] connection setup failed`, error);
                    globalThis.alert?.(error.message);
                }
                this._commandWindow.activate();
            });
            this._commandWindow.setHandler("loaStatus", () => {
                if (showMenuDialog(this)) return;
                globalThis.alert?.(connectionSummary());
                this._commandWindow.activate();
            });
            this._commandWindow.setHandler("loaNextDay", () => {
                if (showMenuDialog(this, true)) return;
                try {
                    advanceDayForDevelopment();
                    this.popScene();
                } catch (error) {
                    console.error(`[${pluginName}] day advance failed`, error);
                    globalThis.alert?.(error.message);
                    this._commandWindow.activate();
                }
            });
        };
        const originalTerminate = sceneMenu.terminate;
        sceneMenu.terminate = function() {
            menuDialog?.close(false);
            return originalTerminate?.apply(this, arguments);
        };
    }

    globalThis.LookOutsideArchipelago = Object.freeze({
        version: "0.0.0-dev",
        booted: true,
        get active() { return active; },
        get saveError() { return saveError; },
        developmentData() {
            return {
                sources: sourceSignatures.map(source => ({
                    key: source.key,
                    mapId: source.mapId,
                    eventId: source.eventId,
                    ...(source.troopId !== undefined ? { troopId: source.troopId } : {}),
                    ...(source.commonEventId !== undefined ? { commonEventId: source.commonEventId } : {}),
                    pageIndex: source.pageIndex,
                    commandIndex: source.commandIndex,
                    commandCode: source.commandCode,
                    databaseId: source.databaseId,
                    apId: source.apId,
                })),
                locationIds: { ...developmentLocationIds },
                itemDefinitions: Object.fromEntries(Object.entries(developmentItemDefinitions)
                    .map(([id, definition]) => [id, { ...definition }])),
            };
        },
        checkedKeys() { return [...checkedKeys]; },
        identity() { return identity && { ...identity }; },
        pendingItems() { return pendingItems.map(entry => ({ index: entry.index, item: { ...entry.item } })); },
        deliverPendingForDevelopment() {
            if (globalThis.process?.env?.LOA_DEV_MODE !== "1") {
                throw new Error("Development delivery requires LOA_DEV_MODE=1");
            }
            deliverPendingItems();
        },
        configureItemDefinitionsForDevelopment(definitions) {
            if (globalThis.process?.env?.LOA_DEV_MODE !== "1") {
                throw new Error("Development configuration requires LOA_DEV_MODE=1");
            }
            configureItemDefinitions(definitions);
        },
        presentItemsForDevelopment() {
            if (globalThis.process?.env?.LOA_DEV_MODE !== "1") throw new Error("Development presentation requires LOA_DEV_MODE=1");
            updateDeliveryPresentation();
        },
        get nextItemIndex() { return nextItemIndex; },
        get connectionState() { return connectionState; },
        get connectionError() { return connectionError; },
        get goalCompleted() { return goalCompleted; },
        goalReleaseSummary() { return goalReleaseSummary(); },
        get elevatorFreakDefeated() { return elevatorFreakDefeated; },
        get pendingDayRollover() { return pendingDayRollover; },
        get dayHold() { return dayHold; },
        remainingDeadlines() { return remainingDeadlines(); },
        powerState() { return { ...powerState, notices: powerState.notices.slice() }; },
        updatePowerForDevelopment() {
            if (globalThis.process?.env?.LOA_DEV_MODE !== "1") throw new Error("Development power update requires LOA_DEV_MODE=1");
            updatePowerPresentation();
        },
        advanceDayForDevelopment() {
            if (globalThis.process?.env?.LOA_DEV_MODE !== "1") {
                throw new Error("Development day advance requires LOA_DEV_MODE=1");
            }
            advanceDayForDevelopment();
        },
        connectForDevelopment(options) {
            if (globalThis.process?.env?.LOA_DEV_MODE !== "1") {
                throw new Error("Development connection requires LOA_DEV_MODE=1");
            }
            if (saveError) throw new Error(saveError);
            if (globalThis.$dataSystem?.advanced?.gameId !== auditedBuild.gameId ||
                globalThis.$dataSystem?.versionId !== auditedBuild.versionId) {
                throw new Error("Installed game build differs from audited build");
            }
            connectForDevelopment(options);
        },
        bindIdentityForDevelopment(seedName, team, slot) {
            if (globalThis.process?.env?.LOA_DEV_MODE !== "1") {
                throw new Error("Development binding requires LOA_DEV_MODE=1");
            }
            if (saveError) throw new Error(saveError);
            bindIdentity(seedName, team, slot);
        },
        queueReceivedItemsForDevelopment(startIndex, items) {
            if (globalThis.process?.env?.LOA_DEV_MODE !== "1" || !identity) {
                throw new Error("Development item reception requires a bound identity");
            }
            return queueReceivedItems(startIndex, items);
        },
        acknowledgePendingItemForDevelopment(index) {
            if (globalThis.process?.env?.LOA_DEV_MODE !== "1") {
                throw new Error("Development acknowledgement requires LOA_DEV_MODE=1");
            }
            const position = pendingItems.findIndex(entry => entry.index === index);
            if (position < 0) throw new Error(`No pending item at index ${index}`);
            pendingItems.splice(position, 1);
        },
        activateForDevelopment(handler) {
            if (globalThis.process?.env?.LOA_DEV_MODE !== "1") {
                throw new Error("Development activation requires LOA_DEV_MODE=1");
            }
            if (saveError) throw new Error(saveError);
            requireNormalMode();
            if (globalThis.$dataSystem?.advanced?.gameId !== auditedBuild.gameId ||
                globalThis.$dataSystem?.versionId !== auditedBuild.versionId) {
                throw new Error("Installed game build differs from audited build");
            }
            checkHandler = handler || null;
            hasApSaveState = true;
            active = true;
            globalThis.$gameMap?.requestRefresh();
        },
        deactivate() {
            resetBattleTracking();
            active = false;
            checkHandler = null;
            globalThis.$gameMap?.requestRefresh();
        },
    });
    console.info(`[${pluginName}] booted`);
})();
