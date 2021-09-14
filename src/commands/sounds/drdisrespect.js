const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const drdisrespect = require('../../sounds/drdisrespect');
const embeds = require('../../utils/embeds').queue;
const queue = require('../../utils/audioQueue');
const sound = require('../../utils/sound');

/**
 * Execute drdisrespect command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  // Get random Dr DisRespect line
  const randomSound = sound.getNameOfRandomSound(drdisrespect);
  const audio = { ...drdisrespect[randomSound], addedBy: interaction.user.tag };

  // Add to queue
  queue.addAudio(client, interaction.member.voice.channel.id, interaction.guild, audio);

  // Reply
  await interaction.reply({ embeds: [embeds.songAdded(audio)] });
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder()
    .setName('drdisrespect')
    .setDescription('Say a random Dr DisRespect line'),
  guildOnly: true,
  voiceChannel: true,
  execute,
};

module.exports = handler;
