import { listenChatMessage, createChatMessage, createMessage } from './processer';
import * as config from '../config/config.json';
import { Config } from '../type'
import { Message } from 'discord.js'

const channelSetting = (config as Config).channelSetting;
const clientId = (config as Config).clientId;
const botTag = `<@${clientId}>`;

const messageEventHandler = async (message: Message): Promise<void> => {
  let listen: boolean = shouldListen(message);
  let reply: boolean = shouldReply(message);
  let isChat: boolean = isChatModel(message.channelId);

  if (listen) {
    console.log("Message(processing):", message.content.trim());
    if (isChat) await listenChatMessage(message);
  }

  if (listen && reply) {
    if (isChat) {
      await createChatMessage(message).then((result: any) => {
        if (result) {
          message.channel.send(result.toString());
        } else {
          message.channel.send(`error occurs`);
        }
      });
    } else {
      await createMessage(message).then((result: any) => {
        if (result) {
          message.channel.send(result.toString());
        } else {
          message.channel.send(`error occurs`);
        }
      });
    }
  }
};

const isChatModel = (channelId: string): boolean => {
  let chSetting = channelSetting[channelId];
  let chatModels = ['gpt-3.5-turbo', 'gpt-3.5-turbo-0301'];
  return (chatModels.includes(chSetting.completionSetting.model)) ? true : false;
}

const shouldListen = (message: Message): boolean => {
  let chSetting = channelSetting[message.channelId];

  // Ignore empty messages
  if (message.content.trim() == "") return false;

  // Ignore messages sent by the bot
  if (message.author.bot) return false;

  // Ignore messages sent in the channel with no config
  if (!channelSetting[message.channelId]) return false;

  if (chSetting['onlyListenTagMessage'] && !message.content.startsWith(botTag)) return false;

  return true;
};

const shouldReply = (message: Message): boolean => {
  let chSetting = channelSetting[message.channelId];

  // Ignore empty messages
  if (message.content.trim() == "") return false;

  // Ignore messages sent in the channel with no config
  if (!channelSetting[message.channelId]) return false;

  if (chSetting['onlyReplyTagMessage'] && !message.content.startsWith(botTag)) return false;

  return true;
};

export { messageEventHandler, isChatModel };
