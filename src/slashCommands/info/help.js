const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const embeds = require('../../utils/embeds').help;

/**
 * Execute help command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  let embed;
  const slashCommands = client.slashCommands;
  const commandName = interaction.options.getString('command_name');

  // Check if generic help was requested or a single command
  if (!commandName) {
    embed = embeds.allCommands(slashCommands);
  } else {
    // Get command details
    const slashCommand = slashCommands.get(commandName);

    // Check command exists
    if (!slashCommand) {
      return await interaction.reply({ content: "That's not a valid command", ephemeral: true });
    }

    // Check if command is also a message command
    const messageCommands = client.messageCommands;
    const messageCommand = messageCommands.get(commandName);

    embed = embeds.singleCommand(slashCommand, messageCommand);
  }

  // Send help message
  await interaction.reply({ embeds: [embed], ephemeral: true });
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all commands or info about a specific command')
    .addStringOption((option) =>
      option.setName('command_name').setDescription('Name of specific command to get help for')
    ),
  execute,
};

module.exports = handler;
