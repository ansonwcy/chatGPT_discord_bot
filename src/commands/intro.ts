import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('intro')
		.setDescription('I will introduce myself!'),
	async execute(interaction: CommandInteraction) {
		let introCommand: string = "Briefly introduce yourself";
		// Todo
	},
};