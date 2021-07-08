SetDiscordAppId('858785858378399774');
SetDiscordRichPresenceAsset('ssrplogo');
SetDiscordRichPresenceAssetText('discord.gg/ssrp');
SetDiscordRichPresenceAction(0, 'Join now!', 'fivem://connect/51.81.166.62:30120');
SetDiscordRichPresenceAction(1, 'Discord', 'https://discord.gg/SSRP');

let firstSpawn = true;

on('playerSpawned', () => {
    if (firstSpawn) {
        emitNet('pConnect:playerConnect');
    }
    firstSpawn = false;
})