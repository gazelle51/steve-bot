/**
 * Run this script to deploy slash commands to a guild or globally.
 *
 * To deploy to a guild use the `deploy-guild` script defined in the package.json.
 * To deploy globally use the `deploy-global` script defined in the package.json.
 *
 * The following encironment variables must be defined in a .env file:
 * - TOKEN - Discord bot token
 * - CLIENT_ID - Discord bot application ID
 * - GUILD_ID (only for guild deployment) - Server/guild ID
 */

require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { disabledCommands } = require('../config');
const fs = require('fs');

const slashCommands = [];

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

    if (!disabledCommands.includes(slashCommand.name))
      slashCommands.push(slashCommand.data.toJSON());
  }
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
  try {
    // Script arguments
    const args = process.argv.slice(2);

    // Deploy guild commands
    const clientId = process.env.CLIENT_ID;
    const guildId = process.env.GUILD_ID;

    console.log('Started refreshing application slash commands.');
    console.log(`${slashCommands.length} commands to refresh`);

    if (args.length && args[0] === 'global') {
      // Deploy global commands
      await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });
    } else {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashCommands });
    }

    console.log('Successfully reloaded application slash commands.');
  } catch (error) {
    console.error(error);
  }
})();
