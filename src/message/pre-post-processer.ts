import { Config, ChatHistory, ChatHistoryContent } from '../type'

const postprocesser = (msg: any): string => {
    return msg.trim();
}

const preprocesser = (history: any[]): ChatHistoryContent[] => {
    return history;
};

const addNameTag = (msg: string, userId: string): string => {
    return `<@${userId}> ${msg}`;
}

const formatMsg = (newMsg: string, role: string): ChatHistoryContent => {
    return { "role": role, "content": newMsg.trim() }
}

const removeAllTags = (message: string): string => {
    return message.replace(/<@\d+>/g, '');
}

export { postprocesser, preprocesser, addNameTag, formatMsg, removeAllTags }