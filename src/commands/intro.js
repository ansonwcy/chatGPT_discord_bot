const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('intro')
		.setDescription('I will introduce myself!'),
	async execute(interaction) {
        let introCommand = "Briefly introduce yourself";
        // Todo
	},
};