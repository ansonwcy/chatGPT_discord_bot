import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import * as chatHistory from '../data/chatHistory.json';
import * as config from '../config/config.json';
import { Config, ChatHistory, ChatHistoryContent } from '../type'
import { formatMsg } from './pre-post-processer'

const channelSetting = (config as Config).channelSetting;

const setHistory = async (history: any, channelId: string, isReset: boolean): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        try {
            if (history) {
                let maxLength = channelSetting[channelId]["chatHistoryMaxLength"];
                history = shortenMessage(history, maxLength);
            }

            let data = chatHistory as ChatHistory;

            if (data[channelId] && !isReset) {
                data[channelId] = history;
            } else {
                let yamlData: Record<string, any>;
                let systemMsg: { role: string; content: string; };
                try {
                    yamlData = yaml.load(fs.readFileSync(path.join(__dirname, '../config/bot.yml'), 'utf8')) as Record<string, any>;
                    let bot_name = channelSetting[channelId]["bot"]
                    systemMsg = formatMsg(yamlData[bot_name], "system");
                    if (isReset) {
                        data[channelId] = [systemMsg];
                    } else {
                        data[channelId] = [systemMsg, ...history];
                    }
                } catch (err) {
                    console.log(`Error occurred when reading yaml file: ${err}`);
                }
            }

            // Convert the JavaScript object back to a JSON string
            const updatedData = JSON.stringify(data, null, 2);

            // Write the updated JSON string back to the file
            resolve(new Promise((resolve, reject) => {
                fs.writeFile(path.join(__dirname + "/../data/chatHistory.json"), updatedData, 'utf8', (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true)
                    }
                });
            }));
        } catch (err) {
            console.log(`error in setHistory: ${err}`)
        }
    });
}

const getHistory = async (channelId: string): Promise<ChatHistoryContent[]> => {
    if (!(channelId in chatHistory)) {
        await resetMemory(channelId)
    }
    return (chatHistory as ChatHistory)[channelId];
}

const shortenMessage = (history: any[], maxLength: number): ChatHistoryContent[] => {
    let _history = history
    while (getHistoryLength(_history) > maxLength) {
        _history.splice(1, 1);
    }
    return _history;
}

const getHistoryLength = (history: any[]): number => {
    return history.reduce((acc, message) => acc + message.content.length, 0);
}

const resetMemory = async (channelId: string): Promise<boolean> => {
    return await setHistory(undefined, channelId, true);
}

export { setHistory, getHistory, resetMemory }