const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const chatHistory = require('../data/chat_history.json');
const { channelSetting } = require('../config/config.json');
const { formatMsg } = require('./pre-post-processer.js')

const setHistory = async (history, channelId, isReset) => {
    return new Promise((resolve, reject) => {
        try {
            if (history) {
                let maxLength = channelSetting[channelId]["chatHistoryMaxLength"];
                history = shortenMessage(history, maxLength);
            }

            let data = chatHistory;

            if (data[channelId] && !isReset) {
                data[channelId] = history;
            } else {
                let yamlData, systemMsg;
                try {
                    yamlData = yaml.load(fs.readFileSync(path.join(__dirname, '../config/bot.yml'), 'utf8'));
                    let bot_name = channelSetting[channelId]["bot"]
                    systemMsg = formatMsg(yamlData[bot_name], "system");
                } catch (err) {
                    console.log(`Error occurred when reading yaml file: ${err}`);
                }

                if (isReset) {
                    data[channelId] = [systemMsg];
                } else {
                    data[channelId] = [systemMsg, ...history];
                }
            }

            // Convert the JavaScript object back to a JSON string
            const updatedData = JSON.stringify(data, null, 2);

            // Write the updated JSON string back to the file
            resolve(new Promise((resolve, reject) => {
                fs.writeFile(path.join(__dirname, '../data/chat_history.json'), updatedData, 'utf8', (err) => {
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

const getHistory = async (channelId) => {
    if (!chatHistory[channelId]) {
        await resetMemory(channelId)
    }
    return chatHistory[channelId];
}

const shortenMessage = (history, maxLength) => {
    let _history = history
    while (getHistoryLength(_history) > maxLength) {
        _history.splice(1, 1);
    }
    return _history;
}

const getHistoryLength = (history) => {
    return history.reduce((acc, message) => acc + message.content.length, 0);
}

const resetMemory = async (channelId) => {
    return await setHistory(undefined, channelId, true);
}

module.exports = { setHistory, getHistory, resetMemory }