const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const borat = require('../../sounds/borat');
const embeds = require('../../utils/embeds').queue;
const queue = require('../../utils/audioQueue');
const sound = require('../../utils/sound');

/**
 * Execute borat command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  // Get random Borat line
  const randomSound = sound.getNameOfRandomSound(borat);
  const audio = { ...borat[randomSound], addedBy: interaction.user.tag };

  // Add to queue
  queue.addAudio(client, interaction.member.voice.channel.id, interaction.guild, audio);

  // Reply
  await interaction.reply({ embeds: [embeds.songAdded(audio)] });
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder().setName('borat').setDescription('Say a random Borat line'),
  guildOnly: true,
  voiceChannel: true,
  execute,
};

module.exports = handler;
