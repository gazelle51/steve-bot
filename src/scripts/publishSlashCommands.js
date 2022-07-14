/**
 * Run this script to deploy slash commands to a guild or globally.
 *
 * To deploy to a guild use the `deploy-guild` script defined in the package.json.
 * To deploy globally use the `deploy-global` script defined in the package.json.
 *
 * The following environment variables must be defined in a .env file:
 * - TOKEN - Discord bot token
 * - CLIENT_ID - Discord bot application ID
 * - GUILD_ID (only for guild deployment) - Server/guild ID
 */

require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { disabledCommands } = require('../config');
const fs = require('fs');

/**
 * Check if this script should deploy slash commands globally.
 * @param {string[]} args - script arguments
 * @returns {boolean} True if commands are to be deployed globally.
 */
function isGlobal(args) {
  return args.length > 0 && args[0] === 'global';
}

const slashCommands = [];

// Check for required environment variables
if (process.env.TOKEN === undefined) throw new Error('TOKEN environment variable must be defined');
if (process.env.CLIENT_ID === undefined)
  throw new Error('CLIENT_ID environment variable must be defined');

// Script arguments
const args = process.argv.slice(2);

// Check if guild or global deployment
if (isGlobal(args) && process.env.GUILD_ID === undefined)
  throw new Error('GUILD_ID environment variable must be defined when deploying globally');

// Read environment variables
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID || '';

// Load slash command folders
const slashCommandFolders = fs
  .readdirSync('./src/slashCommands')
  .filter((folder) => folder !== '_template.js');

// Load slash command files
for (const folder of slashCommandFolders) {
  const slashCommandFiles = fs
    .readdirSync(`./src/slashCommands/${folder}`)
    .filter((file) => file.endsWith('.js'));

  // Add to slash command array if not disabled
  for (const file of slashCommandFiles) {
    const slashCommand = require(`../slashCommands/${folder}/${file}`);

    if (!disabledCommands.includes(slashCommand.data.name))
      slashCommands.push(slashCommand.data.toJSON());
  }
}

const rest = new REST({ version: '9' }).setToken(TOKEN);

(async (GUILD_ID) => {
  try {
    console.log('Started refreshing application slash commands');
    console.log(`Disabled commands are: ${disabledCommands.join(', ')}`);
    console.log(`${slashCommands.length} commands to refresh`);

    if (args.length && args[0] === 'global') {
      // Deploy global commands
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: slashCommands });
    } else {
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: slashCommands });
    }

    console.log('Successfully reloaded application slash commands');
  } catch (error) {
    console.error(error);
  }
})(GUILD_ID);
