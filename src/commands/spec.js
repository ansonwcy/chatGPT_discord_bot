const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spec')
		.setDescription('See the parameters of the AI model'),
	async execute(interaction) {
		await interaction.reply(`spec`);
	},
};