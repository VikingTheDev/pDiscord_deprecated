const { guildIds } = require('../config.websocket.json');

module.exports = {
    structureMember,
    getUserData: ({user, guild}, cb) => {
        const guildId = guild ? guild : guildIds;
        try {
            const member = structureMember(bot.guilds.cache.get(guildId).members.get(user));
            cb(true, member);
        } catch(err) {
            cb(false, err.message)
        }
    },
    getUserRoles: ({user, guild}, cb) => {
        const guildId = guild ? guild : guildIds;
        try {
            const member = structureMember(client.guilds.cache.get(guildId).members.get(user)).roles;
            cb(true, member);
        } catch(err) {
            cb(false, err.message)
        }
    },
    checkDiscordBan: async ({user, guild}, cb) => {
        const guildId = guild ? guild : guildIds;
        let reason;
        let state = false;
        try {
            const bans = await client.guilds.cache.get(guildId).fetchBans();
            bans.forEach( (x) => {
                if(x.user.id == user) {
                    reason = x;
                    state = true;
                };
            });
            if (state) {
                if (reason == null) {
                    cb(true, "No reason specified")
                } else {
                    cb(true, reason)
                }
            } else {
                cb(false)
            }
        } 
        catch(err) {
            cb(false, err.message)
        }
    }
}

function structureMember(m) {
    const { id, tag } = m.user, { displayName } = m, guildId = m.guild.id;

    const roles = [];

    m.roles.map(role => {
        if (role.guild == guildIds) {
            roles.push(role.id);
        }
    })

    return { id, guildId, tag, displayName, roles};
}