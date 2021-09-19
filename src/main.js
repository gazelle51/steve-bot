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
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: [
    // 'USER',
    'CHANNEL', // Enabled so that bot can receive DMs
    // 'GUILD_MEMBER',
    // 'MESSAGE',
    // 'REACTION',
  ],
});
client.messageCommands = new Collection();
client.slashCommands = new Collection();
client.cooldowns = new Collection();
client.queue = new Map();

// ----- Load message commands -----

console.log('Loading message commands');
console.log(`Disabled commands are: ${disabledCommands.join(', ')}`);

// Load message command folders
const messageCommandFolders = fs
  .readdirSync('./src/messageCommands')
  .filter((folder) => folder !== '_template.js');

// Load message command files
for (const folder of messageCommandFolders) {
  const messageCommandFiles = fs
    .readdirSync(`./src/messageCommands/${folder}`)
    .filter((file) => file.endsWith('.js'));

  // Add to client message command Collection if not disabled
  for (const file of messageCommandFiles) {
    const messageCommand = require(`./messageCommands/${folder}/${file}`);

    if (!disabledCommands.includes(messageCommand.data.name))
      client.messageCommands.set(messageCommand.data.name, messageCommand);
  }
}

// ----- Load slash commands -----

console.log('Loading slash commands');
console.log(`Disabled commands are: ${disabledCommands.join(', ')}`);

// Load slash command folders
const slashCommandFolders = fs
  .readdirSync('./src/slashCommands')
  .filter((folder) => folder !== '_template.js');

// Load slash command files
for (const folder of slashCommandFolders) {
  const slashCommandFiles = fs
    .readdirSync(`./src/slashCommands/${folder}`)
    .filter((file) => file.endsWith('.js'));

  // Add to client slash command Collection if not disabled
  for (const file of slashCommandFiles) {
    const slashCommand = require(`./slashCommands/${folder}/${file}`);

    if (!disabledCommands.includes(slashCommand.data.name))
      client.slashCommands.set(slashCommand.data.name, slashCommand);
  }
}

// ----- Load events -----

console.log('Loading events');
console.log(`Disabled events are: ${disabledEvents.join(', ')}`);

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
