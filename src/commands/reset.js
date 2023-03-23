const { SlashCommandBuilder } = require('discord.js');
const { resetMemory } = require('../message/history.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reset')
		.setDescription('Reset me!'),
	async execute(interaction) {
        await resetMemory(interaction.channelId).then(async (result) => {
            if (result) {
                await interaction.reply(`\`\`\`Memory reset!\`\`\``);
            } else {
                console.log(`Error in resetMemory`);
                await interaction.reply(`\`\`\`Something went wrong!\`\`\``);
            }
        });
	},
};