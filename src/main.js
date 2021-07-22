require('dotenv').config();

/**
 * Discord client doco: https://discord.js.org/#/docs/main/stable/class/Client
 *
 * If want to want presence changes need to use `new Discord.Client({ ws: { intents: ['GUILD_PRESENCES'] } });`.
 * Also need to check that permission is enabled for bot in developer portal.
 */

const fs = require('fs');
const { prefix } = require('./config.json');
const { Client, Collection } = require('discord.js');

// Create Discord client
const client = new Client();
client.commands = new Collection();

// Load command folders and ignore template file
const commandFolders = fs
  .readdirSync('./src/commands')
  .filter((folder) => folder !== '_template.js');

// Load command files
for (const folder of commandFolders) {
  // Get js files
  const commandFiles = fs
    .readdirSync(`./src/commands/${folder}`)
    .filter((file) => file.endsWith('.js'));

  // Add to client command Collection
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

/**
 * Emitted when the client becomes ready to start working.
 */
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

/**
 * Emitted whenever a message is created.
 */
client.on('message', async (message) => {
  // Do nothing if the message does not start with prefix or was from a bot
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Extract command and arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Check command is defined
  if (!client.commands.has(commandName)) return;

  console.log(`Executing ${message.content}`);

  // Get command
  const command = client.commands.get(commandName);

  // Check if arguments are required
  if (command.args && !args.length)
    return message.channel.send(`You didn't provide any arguments, ${message.author}!`);

  // Execute the command
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.login(process.env.TOKEN);
