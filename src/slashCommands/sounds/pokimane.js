const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const embeds = require('../../utils/embeds').queue;
const pokimane = require('../../sounds/pokimane');
const queue = require('../../utils/audioQueue');
const sound = require('../../utils/sound');

/**
 * Execute pokimane command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  // Get random Pokimane line
  const randomSound = sound.getNameOfRandomSound(pokimane);
  const audio = { ...pokimane[randomSound], addedBy: interaction.user.tag };

  // Add to queue
  queue.addAudio(client, interaction.member.voice.channel.id, interaction.guild, audio);

  // Reply
  await interaction.reply({ embeds: [embeds.songAdded(audio)] });
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder()
    .setName('pokimane')
    .setDescription('Say a random Pokimane sound and show the garage door'),
  guildOnly: true,
  voiceChannel: true,
  execute,
};

module.exports = handler;
