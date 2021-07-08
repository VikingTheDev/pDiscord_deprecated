const { guildId } = require('../config.websocket.json');

module.exports = {
    user: {
        roleAdd: function (data, cb) {
            bot.guilds.cache.get(guildId).members.cache.get(data.user).roles.add(data.role)
                .then(r =>cb({err: false, message: `Role ${data.role} has been added to user ${data.user}`}))
                .catch(err => cb({err: true, message: err.message}));
        },
        roleRemove: function (data, cb) {
                client.guilds.cache.get(guildId).members.get(data.user).roles.remove(data.role)
                    .then(r => {cb({err: false, message: `Role ${data.role} removed from user ${data.user}`})})
                    .catch(err => {cb({err: true, message: err.message})});   
        },
        moveVC: function (data, cb) {
            client.guilds.cache.get(guildId).members.get(data.user).voice.setChannel(data.channel)
                .then(r => cb({err: false, message: `User ${data.user} has been moved to VC ${data.channel}`}))
                .catch(err => cb({err: true, message: err.message}))
        },
        sendDM: async function (data, cb) {
            await client.users.cache.get(data.user).send(data.message)
                .then(message => cb({
                    sent: true,
                    messageId: message.id,
                    recipient: {
                        id: message.channel.recipient.id,
                        username: message.channel.recipient.username
                    },
                    content: data.message
                }))
                .catch(err => cb({sent: false, error: err.message}))
        }
    }
}