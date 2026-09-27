# Look Outside Archipelago — development playtest

Normal difficulty, game build `74642914`, Archipelago 0.6.7 or newer.
The package manifest identifies the matching plugin and APWorld registry.
Start a fresh seed and save when the registry changes. This is a development
build; a complete interactive playthrough, including calendar ordering, remains.

Registry74 uses save schema7. Older AP saves and incompatible registry/game
versions are rejected with an error before gameplay resumes. Keep the original
matching mod/game version to finish an older run, or start a new save and seed.
See `docs/save_compatibility.md`.

## Prepare the mod

1. Extract this package into a writable folder. Install Python 3.10 or newer
   if `python --version` is unavailable.
2. Open PowerShell in that folder and run:

   ```powershell
   python .\prepare_mod.py --game-dir 'C:\Games\Steam\steamapps\common\Look Outside'
   ```

   This reads the source game and creates `prepared` beside the package. It
   verifies the package checksums and game build, and preserves the original
   plugin entries and their order. It never writes into the source game.
3. Make a separate copy of Look Outside for testing. Omit its `save` folder
   so you start with separate saves. Back up the copy's `js/plugins.js`.
4. Copy the contents of `prepared/js` into the test copy's `js` directory,
   replacing `plugins.js` and adding `plugins/LookOutsideArchipelago.js`.

No game assets are included. Steam updates and other mods can change the
plugin list; regenerate replacement files from the matching original list.

## Generate and host

1. Put `lookoutside.apworld` in your test Archipelago installation's
   `custom_worlds` folder and restart Archipelago.
2. Put `LookOutside.yaml` in the generator's player folder. Edit the player
   name if desired; use the same name when connecting in game.
3. Generate and host the resulting seed with Archipelago. The world is hidden
   from normal world listings during development, but its YAML is usable.
4. Set the room's `release_mode` to `goal`, `enabled`, `auto`, or `auto-enabled`.
   Completing an ending sends the goal and requests release of remaining checks.

## Play

In PowerShell, change to the **test game copy**, then launch:

```powershell
$env:LOA_DEV_MODE = '1'
.\Game.exe --user-data-dir="$PWD\ap-profile"
```

Choose a new **Normal** game. Open **Archipelago Connect** from the in-game
menu and enter the server, slot name, and password if needed. Connect before
collecting any randomized pickup. Archipelago Status shows connection state,
checks, deliveries, and the reviewed deadline warnings. Passwords are not saved.
First connection is refused after an audited reward, quest resolution or day
rollover, and for old vanilla saves without reliable fresh-save metadata.
Already-received items queued for inventory space can deliver after an offline reload.

Household valuables, the reviewed companion rewards, Morton donations,
crafting materials, consumables, purchases, random loot, and the Gauntlet stay
vanilla. Ten key bundles supply 30 Simple Keys. Combat preparation is up to you.
Quest choices reconcile their reviewed reward groups. Transformations retain
their normal recipes. Electricity starts on; an early Power Restored item waits
for the native outage, then restores power with an explicit notice.

Scout's Radio and Bright Frederic's Medic-in-a-jar are randomized reusable
items. The Radio recharges after eight native hours; the Medic rests until a
real new day. Neither recharge sends another check. Frederic's completed-quest
offer checks on acceptance or refusal, and defeating him resolves the same check.

At the 4 a.m. boundary, use **Go to Next Day** when ready. Quest dates and real
new-day waits stay vanilla; time does not generate extra quest days after Day15.
Any real ending on any day completes the goal. Day15's home-door ending is the
fallback if quests remain unfinished. Cheat-mode Credits do not count.
Ending choices are labeled at the roof, Wilhelmina's Word of Power and the
planetarium notes. The tracked deadline list is incomplete: other native
quests can expire, and the host must allow release for the ending fallback.

Use `docs/playtest.md` to record a complete run. Existing automated tests cover
interception, native event branches, networking, and item reachability, but do
not substitute for playing a seed from start to finish.

## Remove or update

Close the test game, restore its original `js/plugins.js`, and remove only
`js/plugins/LookOutsideArchipelago.js`. Keep AP saves separate from vanilla saves.
For an update, prepare from the original plugin list and use the new matching
APWorld/plugin pair. Keep old packages if you need to finish their existing seeds.
