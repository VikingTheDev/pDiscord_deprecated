const {queryToken} = require("./config.json");
const data = {
    token: queryToken
};
const io = require('socket.io-client');
const format = '^7[^6Websocket^7] |';
const client = io.connect('http://localhost:4242', {
    query: data
});

let connected = false;

// client.on('test', (x, cb) => {
//     console.log(x);
//     cb(x);
// })

client.on('connect', () => {
    console.log(`${format} Connection established`);
    connected = true;
});

client.on('disconnect', () => {
    console.log(`${format} Connection has been lost`);
    connected = false;
});

client.on('guildMemberUpdate', member => {
    console.log('update')
    emit('vConnect:guildMemberUpdate', member);
});

client.on('guildBanAdd', (guildId, userInfo, reason) => {
    emit('vConnect:guildBanAdd', { guildId, userInfo, reason });
});

client.on('guildBanRemove', (guildId, userInfo) => {
    emit('vConnect:guildBanRemove', { guildId, userInfo });
});

exports('user', (type, data, cb) => {
    if (connected) {
        client.emit('user', type, data, callb => {
            cb(callb);
        });
    } else {
        console.error('No websocket connection!');
        cb(null);
    };
});

exports('sendLogMsg', (type, channel, data, cb) => {
    if (connected) {
        client.emit('sendLogMsg', type, channel, data, callb => {
            cb(callb);
        });
    } else {
        console.error('No websocket connection!');
        cb(null);
    };
});
  
exports('getUserData', (user, cb) => {
    if (connected) {
        client.emit('getUserData', user, callb => {
            cb(callb);
        });
    } else {
        console.error('No websocket connection!');
        cb(null);
    };
});
  
exports('checkDiscordBan', (user, cb) => {
    if (connected) {
        client.emit('checkDiscordBan', user, callb => {
            cb(callb);
        });
    } else {
        console.error('No websocket connection!');
        cb(null);
    };
});