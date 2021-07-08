module.exports = {
    sendLogMsg: {
        regular: async function (channel, message, cb) {
          let dest = await client.channels.cache.get(channel);
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
        embed: async function(channel, object, cb) {
          let dest = await client.channels.cache.get(channel);
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
    }
}