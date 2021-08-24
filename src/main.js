require('dotenv').config();

const { disabledCommands, disabledEvents } = require('./config');
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');

// Check blocked users parses correctly
try {
  const blockedUsers = JSON.parse(process.env.BLOCKED_USERS);

  if (typeof blockedUsers !== 'object') throw new Error('BLOCKED_USERS is not an object/array');
  if (blockedUsers.length === undefined) throw new Error('BLOCKED_USERS is not an array');
} catch (err) {
  console.error(
    'Error when parsing BLOCKED_USERS env variable, ensure the variable is a stringified JSON array'
  );
  console.error(err);
  process.env.BLOCKED_USERS = '[]';
}

// Create Discord client
/** @type {import('./typedefs/discord').DiscordClient}} */
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  partials: ['CHANNEL'],
});
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

  // Add to client command Collection if not disabled
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    if (!disabledCommands.includes(command.name)) client.commands.set(command.name, command);
  }
}

// Get event files
const eventFiles = fs
  .readdirSync('./src/events')
  .filter((file) => file.endsWith('.js') && !file.startsWith('_'));

// Load and configure events
for (const file of eventFiles) {
  const event = require(`./events/${file}`);

  // Continue if event is disabled
  if (disabledEvents.includes(event.name)) continue;
  else if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(process.env.TOKEN);

console.log(`Disabled events are: ${disabledEvents.join(', ')}`);
console.log(`Disabled commands are: ${disabledCommands.join(', ')}`);
