const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const csgo = require('../../sounds/csgo');
const embeds = require('../../utils/embeds').queue;
const queue = require('../../utils/audioQueue');

/**
 * Execute deathcry command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  // Add to queue
  const audio = { ...csgo.deathcry, addedBy: interaction.user.tag };
  queue.addAudio(client, interaction.member.voice.channel.id, interaction.guild, audio);

  // Reply
  await interaction.reply({ embeds: [embeds.songAdded(audio)] });
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder().setName('deathcry').setDescription('CS: GO death cry'),
  guildOnly: true,
  voiceChannel: true,
  execute,
};

module.exports = handler;
