export interface ChatCompletion {
    model: string;
    temperature: number;
    max_tokens: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
}

export interface ChannelSettings {
    channelName: string;
    chatHistoryMaxLength: number;
    onlyListenTagMessage: boolean;
    onlyReplyTagMessage: boolean;
    replyWithTag: boolean;
    bot: string;
    completionSetting: ChatCompletion;
}

export interface Config {
    token: string;
    clientId: string;
    guildId: string;
    openAIKey: string;
    creator: string;
    botName: string;
    channelSetting: Record<string, ChannelSettings>;
}

export type ChatHistory = {
    [channelId: string]: ChatHistoryContent[];
}

export type ChatHistoryContent = {
    role: string;
    content: string;
}
