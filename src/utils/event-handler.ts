import { listenChatMessage, createChatMessage, createMessage } from './processer';
import { Message, TextChannel, CommandInteraction } from 'discord.js';
import { getConfig, getChannelSetting, getAllChannelSetting } from './readConfig';

const config = getConfig();
const botTag = `<@${config.clientId}>`;

const messageEventHandler = async (message: Message): Promise<void> => {

  let inListenList: boolean = checkInListenChannel(message.channelId);

  // Ignore messages sent in the channel with no config
  if (!inListenList) return;

  let listen: boolean = shouldListen(message);
  let reply: boolean = shouldReply(message);
  let isChat: boolean = isChatModel(message.channelId)

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

const commandEventHandler = async (interaction: CommandInteraction): Promise<void> => {

  if (!interaction.channelId) {
    await interaction.reply('Bot is not listening on this channel!');
    return;
  }
  let inListenList: boolean = checkInListenChannel(interaction.channelId);

  // Ignore interactions sent in the channel with no config
  if (!inListenList) {
    await interaction.reply('Bot is not listening on this channel!');
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
}

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
  let chSetting = getChannelSetting(channelId);
  let chatModels = ['gpt-3.5-turbo', 'gpt-3.5-turbo-0301'];
  return (chatModels.includes(chSetting.completionSetting.model)) ? true : false;
}

const shouldListen = (message: Message): boolean => {

  let chSetting = getChannelSetting(message.channelId);

  // Ignore empty messages
  if (message.content.trim() == "") return false;

  // Ignore messages sent by the bot
  if (message.author.bot) return false;

  if (chSetting['onlyListenTagMessage'] && !message.content.startsWith(botTag)) return false;

  return true;
};

const shouldReply = (message: Message): boolean => {

  let chSetting = getChannelSetting(message.channelId);

  // Ignore empty messages
  if (message.content.trim() == "") return false;

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

const checkInListenChannel = (channelId: string): boolean => {
  const keys = Object.keys(getAllChannelSetting());
  if (keys.includes(channelId)) return true;
  else return false;
}

export { messageEventHandler, commandEventHandler, isChatModel };
