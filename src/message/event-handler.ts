import { messageListen, messageCreate } from './processer';
import * as config from '../config/config.json';
import { Config } from '../type'

const channelSetting = (config as Config).channelSetting;
const clientId = (config as Config).clientId;

const botTag = `<@${clientId}>`;

const messageEventHandler = async (message: any): Promise<void> => {
  let listen = shouldListen(message);
  let reply = shouldReply(message);

  if (listen) {
    console.log("Message(processing):", message.content.trim());
    await messageListen(message);
  }

  if (listen && reply) {
    await messageCreate(message).then((result: any) => {
      if (result) {
        message.channel.send(result.toString());
      }
    });
  }
};

const shouldListen = (message: any): boolean => {
  let chSetting = channelSetting[message.channelId];

  // Ignore messages sent by the bot
  if (message.author.bot) return false;

  // Ignore messages sent in the channel with no config
  if (!channelSetting[message.channelId]) return false;

  if (chSetting['onlyListenTagMessage'] && !message.content.startsWith(botTag)) return false;

  return true;
};

const shouldReply = (message: any): boolean => {
  let chSetting = channelSetting[message.channelId];

  // Ignore messages sent in the channel with no config
  if (!channelSetting[message.channelId]) return false;

  if (chSetting['onlyReplyTagMessage'] && !message.content.startsWith(botTag)) return false;

  return true;
};

export { messageEventHandler };
