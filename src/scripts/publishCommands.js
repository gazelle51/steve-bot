require('dotenv').config();

const { disabledCommands } = require('../config');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

// Place your client and guild ids here
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const commands = [];

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
    const command = require(`../commands/${folder}/${file}`);
    if (!disabledCommands.includes(command.name)) commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    // Deploy global commands
    // await rest.put(Routes.applicationCommands(clientId), { body: commands });

    // Deploy guild commands
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
