const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { defaultCooldown } = require('../../config.js');

/**
 * Execute help command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  const data = [];
  const slashCommands = client.slashCommands;
  const commandName = interaction.options.getString('command_name');

  // Check if generic help was requested or a single command
  if (!commandName) {
    // Format data
    data.push("Here's a list of all my commands:");
    data.push(
      slashCommands
        .map((command) => command.data.name)
        .sort()
        .join(', ')
    );
    data.push(
      `\nYou can send \`/help command_name:[command_name]\` to get more information on a specific command.`
    );
  } else {
    // Get command details
    const slashCommand = slashCommands.get(commandName);

    // Check command exists
    if (!slashCommand) {
      return await interaction.reply({ content: "That's not a valid command", ephemeral: true });
    }

    // Format data
    data.push(`**Name:** ${commandName}`);
    if (slashCommand.data.description)
      data.push(`**Description:** ${slashCommand.data.description}`);
    data.push(`**Cooldown:** ${slashCommand.cooldown || defaultCooldown} second(s)`);
    data.push(
      `**Can the command only be used in a server?** ${slashCommand.guildOnly ? 'Yes' : 'No'}`
    );
    data.push(
      `**Does the user need to be in a voice channel?** ${slashCommand.voiceChannel ? 'Yes' : 'No'}`
    );
  }

  // Send help message
  await interaction.reply({ content: data.join('\n'), ephemeral: true });
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
