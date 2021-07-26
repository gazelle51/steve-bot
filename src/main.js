require('dotenv').config();

/**
 * Discord client doco: https://discord.js.org/#/docs/main/stable/class/Client
 *
 * If want to want presence changes need to use `new Discord.Client({ ws: { intents: ['GUILD_PRESENCES'] } });`.
 * Also need to check that permission is enabled for bot in developer portal.
 */

const fs = require('fs');
const { Client, Collection } = require('discord.js');

// Create Discord client
/** @type {import('./typedefs/discord').DiscordClient}} */
const client = new Client();
client.commands = new Collection();
client.cooldowns = new Collection();
client.queue = new Map();

// Load command folders
const commandFolders = fs
  .readdirSync('./src/commands')
  .filter((folder) => folder !== '_template.js');

// Load command files
for (const folder of commandFolders) {
  // Get command files
  const commandFiles = fs
    .readdirSync(`./src/commands/${folder}`)
    .filter((file) => file.endsWith('.js'));

  // Add to client command Collection
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

// Get event files
const eventFiles = fs
  .readdirSync('./src/events')
  .filter((file) => file.endsWith('.js') && !file.startsWith('_'));

// Load and configure events
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(process.env.TOKEN);
