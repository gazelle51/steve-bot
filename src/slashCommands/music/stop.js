const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const embeds = require('../../utils/embeds').queue;
const queue = require('../../utils/audioQueue');

/**
 * Execute stop command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  const result = queue.stop(client, interaction.guildId);

  if (!result)
    await interaction.reply({ content: 'There is no music for me to stop', ephemeral: true });
  await interaction.reply({ embeds: [embeds.stop()] });
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop the currently playing audio and clear the queue'),
  guildOnly: true,
  voiceChannel: true,
  execute,
};

module.exports = handler;
