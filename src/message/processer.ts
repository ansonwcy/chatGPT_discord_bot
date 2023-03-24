import * as config from '../config/config.json';
import { createChatCompletion, createCompletion } from '../openAI/chat';
import { postprocesser, preprocesser, addNameTag, formatMsg, removeAllTags } from './pre-post-processer'
import { setHistory, getHistory } from './history'
import { Config } from '../type'
import { Message } from 'discord.js'

const channelSetting = (config as Config).channelSetting;

const listenChatMessage = async (newMessage: Message): Promise<boolean> => {

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

const createChatMessage = async (message: Message): Promise<string | undefined> => {

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

        return await setHistory(history, chId, false).then(result => {
            if (result) {

                // add name tag of the user who sent message
                // send message to discord channel
                if (channelSetting[chId]['replyWithTag'])
                    return addNameTag(reply, message.author.id);
                else
                    return reply

            } else {
                console.log(`error occurs in createChatMessage`)
            }
        })
    }
    // fail to create completion
    else {
        return `System: ${completion[1]}`;
    }
}

const createMessage = async (message: Message): Promise<string | undefined> => {

    let chId = message.channelId;
    let completionSetting = channelSetting[chId]['completionSetting'];

    // generate reply
    let completion = await createCompletion(message.content.trim(), completionSetting);

    // create completion sucessfully
    if (completion[0]) {

        // do post-process on the reply
        let reply = postprocesser(completion[1]);

        // add name tag of the user who sent message
        // send message to discord channel
        if (channelSetting[chId]['replyWithTag'])
            return addNameTag(reply, message.author.id);
        else
            return reply
    }
    // fail to create completion
    else {
        return `System: ${completion[1]}`;
    }
}

export { listenChatMessage, createChatMessage, createMessage }