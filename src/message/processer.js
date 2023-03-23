const { clientId, channelSetting } = require('../config/config.json');
const { createChatCompletion } = require('../openAI/chat.js');
const { postprocesser, preprocesser, addNameTag, formatMsg, removeAllTags } = require('./pre-post-processer.js')
const { setHistory, getHistory } = require('./history.js')

const botTag = `<@${clientId}>`;

const messageListen = async (newMessage) => {

    let chId = newMessage.channelId;

    // get message history
    let history = await getHistory(chId);

    // remove all tag in the new message
    const userMessage = removeAllTags(newMessage.content);

    // record user's message on-the-fly and add new message to prompt
    history.push(formatMsg(userMessage, "user"));

    // store reply
    return await setHistory(history, chId, false)
}

const messageCreate = async (message) => {

    let chId = message.channelId;
    let completionSetting = channelSetting[chId]['completionSetting'];
    let history = await getHistory(chId);

    // do pre-process on the prompt
    history = preprocesser(history);

    // generate reply
    let completion = await createChatCompletion(history, completionSetting);

    // create completion sucessfully
    if (completion[0]) {

        // do post-process on the reply
        let reply = postprocesser(completion[1]);

        // record bot's reply
        history.push(formatMsg(reply, "assistant"));

        return await setHistory(history, chId, false).then(async (result) => {
            if (result) {

                // add name tag of the user who sent message
                // send message to discord channel
                if (channelSetting[chId]['replyWithTag'])
                    return addNameTag(reply, message.author.id);
                else
                    return reply

            } else {
                console.log(`error occurs in messageCreate`)
            }
        })
    }
    // fail to create completion
    else {
        return `System: ${completion[1]}`;
    }
}

module.exports = { messageListen, messageCreate }