import { Config, ChatCompletion, ChannelSettings } from '../type'
import * as config from '../config/config.json';

const getConfig = (): Config => {
    return {
        token: config['token'],
        clientId: config['clientId'],
        guildId: config['guildId'],
        openAIKey: config['openAIKey'],
        creator: config['creator'],
        botName: config['botName'],
    } as Config
}

const getChannelSetting = (channelId: string): ChannelSettings => {
    const channelSettingList = config['channelSetting'] as Record<string, ChannelSettings>;
    let selectedChannel = channelSettingList[channelId];
    const channelcompletionSetting = selectedChannel['completionSetting'] as ChatCompletion;
    return {
        channelName: selectedChannel['channelName'],
        chatHistoryMaxLength: selectedChannel['chatHistoryMaxLength'],
        onlyListenTagMessage: selectedChannel['onlyListenTagMessage'],
        onlyReplyTagMessage: selectedChannel['onlyReplyTagMessage'],
        replyWithTag: selectedChannel['replyWithTag'],
        bot: selectedChannel['bot'],
        completionSetting: channelcompletionSetting,
    } as ChannelSettings
}

const getAllChannelSetting = (): Record<string, ChannelSettings> => {
    return config['channelSetting'];
}

export { getConfig, getChannelSetting, getAllChannelSetting }