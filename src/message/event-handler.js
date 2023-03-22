const { messageListen, messageCreate } = require('./processer')
const { channelSetting, clientId } = require('../../config/config.json');
const botTag = `<@${clientId}>`;

const messageEventHandler = async (message) => {

    let listen = shouldListen(message);
    let reply = shouldReply(message);

    if (listen) {
        console.log("Message(processing):", message.content.trim());
        await messageListen(message);
    }

    if (listen && reply) {
        await messageCreate(message).then((result) => {
            if (result) {
                message.channel.send(result.toString());
            }
        })
    }
}

const shouldListen = (message) => {

    let chSetting = channelSetting[message.channelId];

    // Ignore messages sent by the bot
    if (message.author.bot) return false;

    // Ignore messages sent in the channel with no config
    if (!channelSetting[message.channelId]) return false;

    if (chSetting['onlyListenTagMessage'] && !message.content.startsWith(botTag)) return false;

    return true;
}

const shouldReply = (message) => {

    let chSetting = channelSetting[message.channelId];

    // Ignore messages sent in the channel with no config
    if (!channelSetting[message.channelId]) return false;

    if (chSetting['onlyReplyTagMessage'] && !message.content.startsWith(botTag)) return false;

    return true;
}

module.exports = { messageEventHandler }