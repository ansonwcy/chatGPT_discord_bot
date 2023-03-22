const postprocesser = (msg) => {
    return msg.trim();
}

const preprocesser = (history) => {
    return history;
};

const addNameTag = (msg, userId) => {
    return `<@${userId}> ${msg}`;
}

const formatMsg = (newMsg, role) => {
    if (!(role == "system" || role == "user" || role == "assistant")) return null;
    else return { "role": role, "content": newMsg.trim() }
}

const removeAllTags = (message) => {
    return message.replace(/<@\d+>/g, '');
}

module.exports = { postprocesser, preprocesser, addNameTag, formatMsg, removeAllTags }