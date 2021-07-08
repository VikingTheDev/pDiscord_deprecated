const { botToken, guildId, websocketToken } = require('../config.api.json');
const options = {
    allowRequest: (req, callback) => {
        const state = req._query.token === websocketToken ? true : false;
        callback(null, state);
    }
}

const { Client } = require('discord.js');
const io = require('socket.io') (4242, options);
const bot = new Client({});

// When a websocket connection is made, listen for discord and server events.
io.on('connection', socket => {

    console.log('Websocket connected!')
    
    // callback inception is possible, do this for all the exports.
    // socket.emit('test', 'hi', cb => {
    //     console.log(cb);
    // })

    socket.on('user', (type, data, cb) => {
        try {
            user[type](data, callb => {
                cb(callb);
            });
        } catch (err) {
            console.log(err.message);
        };
    });

    socket.on('sendLogMsg', (type, channel, data, cb) => {
        try {
            sendLogMsg[type](channel, data, callb => {
                cb(callb);
            });
        } catch (err) {
            console.log(err.message);
        };
    });

    socket.on('getUserData', (user, cb) => {
        try {
            member = structureMember(bot.guilds.cache.get(guildId).members.cache.get(user));
        } catch(err) {
            console.log(err.message);
        }
        cb(member);
    });

    socket.on('checkDiscordBan', async (user, cb) => {
        let reason, state = false;
        try {
            const bans = await bot.guilds.cache.get(guildId).fetchBans();
            bans.forEach( (x) => {
                if(x.user.id == user) {
                    reason = x.reason;
                    state = true;
                };
            });
            if (state) {
                if (reason == undefined) {
                    reason = "No reason specified";
                }
            }
        } 
        catch(err) {
            state = false, reason = err.message;
        }

        cb({ state, reason });
    });

    bot.on('guildMemberUpdate', (m) => {
        console.log('ws')
        let member = {};
        try {
            member = structureMember(bot.guilds.cache.get(guildId).members.cache.get(m.id));
        } catch(err) {
            console.log(err.message)
        }
        socket.emit('guildMemberUpdate', member);
    });

    bot.on('guildBanAdd', async (guild, user) => {

        let reason, state = false;
        try {
            const bans = await bot.guilds.cache.get(guildId).fetchBans();
            bans.forEach( (x) => {
                if(x.user.id == user.id) {
                    reason = x.reason;
                    state = true;
                };
            });
            if (state) {
                if (reason == undefined) {
                    reason = "No reason specified";
                }
            }
        } 
        catch(err) {
            state = false, reason = err.message;
        }

        const userInfo = {
            id: user.id,
            username: user.username,
        };

        socket.emit('guildBanAdd', (guild.id, userInfo, reason));
    })

    bot.on('guildBanRemove', (guild, user) => {
        const userInfo = {
            id: user.id,
            username: user.tag,
        };
        socket.emit('guildBanRemove', (guild.id, userInfo));
    })
});

bot.login(botToken);


// Helper functions since module.exports wants to be cancer.
const structureMember = (m) => {
    const { id, tag } = m.user, { displayName } = m, guildId = m.guild.id;

    const roles = [];

    m.roles.cache.map(role => {
        if (role.guild.id === guildId) {
            roles.push(role.id)
        }
    })

    return { id, guildId, tag, displayName, roles};
}

const user = {
    roleAdd: (data, cb) => {
        bot.guilds.cache.get(guildId).members.cache.get(data.user).roles.add(data.role)
            .then(r =>cb({err: false, message: `Role ${data.role} has been added to user ${data.user}`}))
            .catch(err => cb({err: true, message: err.message}));
    },
    roleRemove: (data, cb) => {
            bot.guilds.cache.get(guildId).members.cache.get(data.user).roles.remove(data.role)
                .then(r => {cb({err: false, message: `Role ${data.role} removed from user ${data.user}`})})
                .catch(err => {cb({err: true, message: err.message})});   
    },
    moveVC: (data, cb) =>{
        bot.guilds.cache.get(guildId).members.cache.get(data.user).voice.setChannel(data.channel)
            .then(r => cb({err: false, message: `User ${data.user} has been moved to VC ${data.channel}`}))
            .catch(err => cb({err: true, message: err.message}))
    },
    sendDM: async (data, cb) => {
        await bot.users.cache.get(data.user).send(data.message)
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
};

const sendLogMsg = {
    regular: async (channel, message, cb) => {
      let dest = await bot.channels.cache.get(channel);
      if (dest) {
        dest
          .send(message)
          .then((message) => {
            cb({
              sent: true,
              id: message.id,
              channelId: message.channel.id,
            });
          })
          .catch((error) => {
            cb({ sent: false, error: error.message })
          })
      } else {
        cb({ sent: false, error: "Channel not found"})
      }
    },
    embed: async (channel, object, cb) => {
      let dest = await bot.channels.cache.get(channel);
      if (dest) {
        if (!object.content) object.content = "";
        dest
          .send({content: object.content, embed: object.embed})
          .then((message) => {
            cb({
              sent:true,
              id: message.id,
              channelId: message.channel.id,
            });
          })
          .catch((error) => {
            cb({ sent: false, error: error.message})
          })
      } else {
        cb({ sent:false, error: "Channel not found"})
      }
    }
};