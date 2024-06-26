/*
 * Application entry point
*/

const fs = require('node:fs');
const path = require('node:path');

// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Export client instance to use it in other files
exports.client = client;

// Attach Collection to Client instance (useful to use it in other files)
client.commands = new Collection();

// "commands" folder path
const commandsPath = path.join(__dirname, 'commands');
// List of .js files in "commands" folder
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Set commands collection from command files
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}


/****** Handlers ******/

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});


client.on(Events.InteractionCreate, async interaction => {
  // A bit of logging
  console.log('------------------------------------------');
  console.log(new Date().toUTCString());
  console.log('User', interaction.user);
  console.log('Cmd', interaction.commandName);
  console.log('Options', interaction.options);
  console.log('Channel', interaction.channel);

  // Process only slash commands (chat input command)
  if (!interaction.isChatInputCommand()) return;

  // Read user command
  const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
    // Log time of error and entire interaction object
		console.log(new Date().toUTCString());
    console.log(interaction);
    console.error(error);
		if (!interaction.replied && !interaction.deferred) {
			await interaction.reply({ content: error.message, ephemeral: true });
		}
	}
});

/****** Log In ******/
// Log in to Discord with your client's token
client.login(token);

// TODO: Tidy up and factorize code for commands

