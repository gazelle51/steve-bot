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
  console.log(commandName);

  // Check if generic help was requested
  if (!commandName) {
    data.push("Here's a list of all my commands:");
    data.push(commands.map((command) => command.data.name).join(', '));
    data.push(`\nYou can send \`/help [command name]\` to get info on a specific command.`);

    return interaction.user
      .send(data.join('\n'))
      .then(() => {
        if (interaction.channel.type === 'DM') return;
        interaction.reply("I've sent you a DM with all my commands.");
      })
      .catch((error) => {
        console.error(`Could not send help DM to ${interaction.user.tag}.\n`, error);
        interaction.reply("It seems like I can't DM you! Do you have DMs disabled?");
      });
  }

  // Get command details
  const command = commands.get(commandName);

  if (!command) {
    return await interaction.reply("That's not a valid command!");
  }

  data.push(`**Name:** ${commandName}`);

  if (command.data.description) data.push(`**Description:** ${command.data.description}`);

  data.push(`**Cooldown:** ${command.cooldown || defaultCooldown} second(s)`);

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
