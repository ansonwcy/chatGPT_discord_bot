import { listenChatMessage, createChatMessage, createMessage } from './processer';
import * as config from '../config/config.json';
import { Config } from '../type'
import { Message, TextChannel, VoiceChannel } from 'discord.js'

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
          sendMessageByChunks(result, message.channel as TextChannel);
        } else {
          message.channel.send(`error occurs`);
        }
      });
    } else {
      await createMessage(message).then((result: any) => {
        if (result) {
          sendMessageByChunks(result, message.channel as TextChannel);
        } else {
          message.channel.send(`error occurs`);
        }
      });
    }
  }
};

// support more types of channel
const sendMessageByChunks = (singleMessage: string, channel: TextChannel): void => {
  const discordMaxLength = 2000;
  let splitMessage: string[] = [];

  splitMessage = splitString(singleMessage, discordMaxLength);
  splitMessage.forEach((msg) => {
    channel.send(msg.toString());
  })
}

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

const splitString = (str: string, maxLength: number): string[] => {
  if (str.length <= maxLength) {
    return [str];
  }

  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += maxLength) {
    chunks.push(str.slice(i, i + maxLength));
  }

  return chunks;
}

export { messageEventHandler, isChatModel };
