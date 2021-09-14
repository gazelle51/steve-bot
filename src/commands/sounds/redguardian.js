const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const embeds = require('../../utils/embeds').queue;
const redGuardian = require('../../sounds/redGuardian');
const queue = require('../../utils/audioQueue');

/**
 * Execute redguardian command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  // Add to queue
  const audio = { ...redGuardian.iHaveALotOfEnergy, addedBy: interaction.user.tag };
  queue.addAudio(client, interaction.member.voice.channel.id, interaction.guild, audio);

  // Reply
  await interaction.reply({ embeds: [embeds.songAdded(audio)] });
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder()
    .setName('redguardian')
    .setDescription('Red Guardian has a lot of energy'),
  guildOnly: true,
  voiceChannel: true,
  execute,
};

module.exports = handler;
