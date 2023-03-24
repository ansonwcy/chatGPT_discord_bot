const postprocesser = (msg: any) => {
    return msg.trim();
}

const preprocesser = (history: any[]) => {
    return history;
};

const addNameTag = (msg: string, userId: string) => {
    return `<@${userId}> ${msg}`;
}

const formatMsg = (newMsg: string, role: string) : { role: string; content: string; }  => {
    return { "role": role, "content": newMsg.trim() }
}

const removeAllTags = (message: string) => {
    return message.replace(/<@\d+>/g, '');
}

export { postprocesser, preprocesser, addNameTag, formatMsg, removeAllTags }