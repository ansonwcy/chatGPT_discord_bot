import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('source-code')
		.setDescription('Show the source code on Github.'),
	async execute(interaction: CommandInteraction) {
		await interaction.reply('https://github.com/ansonwcy/chatGPT_discord_bot');
	},
};