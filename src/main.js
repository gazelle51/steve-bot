require('dotenv').config();

const { disabledCommands, disabledEvents } = require('./config');
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');

console.log('Starting up...');

// Check blocked users parses correctly
try {
  if (!process.env.BLOCKED_USERS) throw new Error('BLOCKED_USERS env variable is not defined');

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

console.log(`Total blocked users: ${JSON.parse(process.env.BLOCKED_USERS).length}`);

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
client.selectMenus = new Collection();
client.cooldowns = new Collection();
client.queue = new Map();

// ----- Load message commands -----

console.log(`Loading commands - total disabled commands: ${disabledCommands.length}`);
if (disabledCommands.length) console.log(`Disabled commands are: ${disabledCommands.join(', ')}`);

console.log('Loading message commands');

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

// ----- Load select menus -----

console.log('Loading select menus');

// Load select menu folders
const selectMenuFolders = fs
  .readdirSync('./src/selectMenus')
  .filter((folder) => folder !== '_template.js');

// Load select menu files
for (const folder of selectMenuFolders) {
  const selectMenuFiles = fs
    .readdirSync(`./src/selectMenus/${folder}`)
    .filter((file) => file.endsWith('.js'));

  // Add to client select menu Collection
  for (const file of selectMenuFiles) {
    const selectMenu = require(`./selectMenus/${folder}/${file}`);
    client.selectMenus.set(selectMenu.name, selectMenu);
  }
}

// ----- Load events -----

console.log(`Loading events - total disabled events: ${disabledEvents.length}`);
if (disabledEvents.length) console.log(`Disabled events are: ${disabledEvents.join(', ')}`);

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

// ----- Log in -----

console.log('Start up complete');

client.login(process.env.TOKEN);
