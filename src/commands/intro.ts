import { SlashCommandBuilder, CommandInteraction, ChannelType, TextChannel, VoiceChannel } from 'discord.js';
import * as config from '../config/config.json';
import { Config } from '../type'

const channelSetting = (config as Config).channelSetting;

const getChannelName = async (id: string, interaction: CommandInteraction): Promise<string | undefined> => {
	const channel = await interaction.client.channels.fetch(id);
	if (!channel) return '';
	if (channel.type === ChannelType.GuildText) {
		return (channel as TextChannel).name;
	} else if (channel.type === ChannelType.GuildVoice) {
		return (channel as VoiceChannel).name;
	} else {
		// handle other types of channels here
		return '';
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('intro')
		.setDescription('I will introduce myself!'),
	async execute(interaction: CommandInteraction) {

		const keys = Object.keys(channelSetting);
		const channelNames = await Promise.all(keys.map(async (id) => {
			return getChannelName(id, interaction);
		}));

		const channelNamesStr = channelNames.join(', ')
		const currentChannelName = await getChannelName(interaction.channelId, interaction);
		const modelName = channelSetting[interaction.channelId]['completionSetting']['model'];
		let listenTagOnly = (channelSetting[interaction.channelId]['onlyListenTagMessage']) ? "messages which tagged me" : "all message";
		let replyTagOnly = (channelSetting[interaction.channelId]['onlyReplyTagMessage']) ? "messages which tagged me" : "all message";

		let txt1 = `Hi, I am ${(config as Config).botName} created by ${(config as Config).creator} using ${modelName}.`;
		let txt2 = `I am listening on these channel(s):\n${channelNamesStr}`;
		let txt3 = `In this current channel (${currentChannelName}):`;
		let txt4 = `1. I will listen on ${listenTagOnly}.`;
		let txt5 = `2. I will reply on ${replyTagOnly}.`;

		let specParams =
			`
		\`\`\`${txt1}\n\n${txt2}\n\n${txt3}\n${txt4}\n${txt5}\`\`\`
		`;
		await interaction.reply(specParams);
	},
};