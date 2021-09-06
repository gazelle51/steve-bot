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
  const commands = client.commands;
  const commandName = interaction.options.getString('command_name');

  // Check if generic help was requested or a single command
  if (!commandName) {
    // Format data
    data.push("Here's a list of all my commands:");
    data.push(commands.map((command) => command.data.name).join(', '));
    data.push(
      `\nYou can send \`/help command_name:[command_name]\` to get info on a specific command.`
    );
  } else {
    // Get command details
    const command = commands.get(commandName);

    // Check command exists
    if (!command) {
      return await interaction.reply({ content: "That's not a valid command", ephemeral: true });
    }

    // Format data
    data.push(`**Name:** ${commandName}`);
    if (command.data.description) data.push(`**Description:** ${command.data.description}`);
    data.push(`**Cooldown:** ${command.cooldown || defaultCooldown} second(s)`);
    data.push(`**Guild only?** ${command.guildOnly ? 'Yes' : 'No'}`);
  }

  // Send help message
  await interaction.reply(data.join('\n'));
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
