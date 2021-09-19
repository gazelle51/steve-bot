const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

/**
 * Execute send command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  // Send message to channel
  const channel = interaction.options.getChannel('channel');
  const message = interaction.options.getString('message');
  await channel.send(message);

  // Reply to interaction
  await interaction.reply({ content: 'Message sent', ephemeral: true });
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder()
    .setName('send')
    .setDescription('Send a message to the specified channel')
    .addChannelOption((option) =>
      option.setName('channel').setDescription('Channel to send message to').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('message').setDescription('Message to send').setRequired(true)
    ),
  guildOnly: true,
  execute,
};

module.exports = handler;
