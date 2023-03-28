import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { getChannelSetting } from '../utils/readConfig';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('model-setting')
		.setDescription('See the parameters of the AI model'),
	async execute(interaction: CommandInteraction) {
		let spec = getChannelSetting(interaction.channelId).completionSetting;
		let specParams =
			`
		\`\`\`  Model Parameters\n\n- Model: ${spec.model}\n- Temperature: ${spec.temperature}\n- Max Tokens: ${spec.max_tokens}\n- Top P: ${spec.top_p}\n- Frequency Penalty: ${spec.frequency_penalty}\n- Presence Penalty: ${spec.presence_penalty}\n- Other set to default\`\`\`
		`;
		await interaction.reply(specParams);
	},
};