import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { resetMemory } from '../message/history';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reset')
		.setDescription('Reset me!'),
	async execute(interaction: CommandInteraction) {
        await resetMemory(interaction.channelId).then(async result => {
            if (result) {
                await interaction.reply(`\`\`\`Memory reset!\`\`\``);
            } else {
                console.log(`Error in resetMemory`);
                await interaction.reply(`\`\`\`Something went wrong!\`\`\``);
            }
        });
	},
};