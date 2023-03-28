// Require the necessary discord.js classes
import * as fs from 'fs';
import * as path from 'path';
import { Client, Collection, Events, GatewayIntentBits, Partials, CommandInteraction } from 'discord.js';
import { messageEventHandler, commandEventHandler } from './utils/event-handler';
import { getConfig } from './utils/readConfig';

declare module "discord.js" {
	export interface Client {
		commands: Collection<unknown, any>
	}
}

const client: Client = new Client({
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
	intents: [
		GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates
	]
});
client.commands = new Collection();

const commandsPath = path.join(__dirname, './commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once(Events.ClientReady, async c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {

	await commandEventHandler(interaction as CommandInteraction);
});

client.on('messageCreate', async message => {

	await messageEventHandler(message);

});

client.login(getConfig().token);