import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { getChannelSetting } from '../utils/readConfig';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel-setting')
        .setDescription('See the parameters of this channel'),
    async execute(interaction: CommandInteraction) {
        let spec = getChannelSetting(interaction.channelId);
        let specParams =
            `
		\`\`\`  Channel Parameters\n\n- Bot: ${spec["bot"]}\n- ChatHistoryMaxLength: ${spec["chatHistoryMaxLength"]}\n- OnlyListenTagMessage: ${spec["onlyListenTagMessage"]}\n- OnlyReplyTagMessage: ${spec["onlyReplyTagMessage"]}\n- ReplyWithTag: ${spec["replyWithTag"]}\`\`\`
		`;
        await interaction.reply(specParams);
    },
};