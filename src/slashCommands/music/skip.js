const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const embeds = require('../../utils/embeds').queue;
const queue = require('../../utils/audioQueue');

/**
 * Execute skip command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  const result = queue.skip(client, interaction.guildId);

  if (!result) await interaction.reply({ content: 'There is no song to skip', ephemeral: true });
  await interaction.reply({ embeds: [embeds.skip()] });
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the currently playing audio'),
  guildOnly: true,
  voiceChannel: true,
  execute,
};

module.exports = handler;
