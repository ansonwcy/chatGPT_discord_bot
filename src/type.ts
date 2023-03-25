export interface ChatCompletion {
    model: string;
    temperature: number | null;
    max_tokens: number;
    top_p: number | null;
    frequency_penalty: number | null;
    presence_penalty: number | null;
}

export interface ChannelSettings {
    channelName: string;
    chatHistoryMaxLength: number | null;
    onlyListenTagMessage: boolean;
    onlyReplyTagMessage: boolean;
    replyWithTag: boolean;
    bot: string | null;
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
