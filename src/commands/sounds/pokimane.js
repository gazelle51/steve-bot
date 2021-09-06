const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const pokimane = require('../../sounds/pokimane');
const queue = require('../../utils/audioQueue');
const sound = require('../../utils/sound');

/**
 * Execute pokimane command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  await interaction.reply({
    files: [
      'https://www.theloadout.com/wp-content/uploads/2021/01/rust-twitch-drops-pokimane-900x506.jpg',
    ],
  });

  // Get random Pokimane line
  const randomSound = sound.getNameOfRandomSound(pokimane);
  const audio = pokimane[randomSound];

  // Add to queue
  await queue.addAudio(client, interaction, { ...audio, addedBy: interaction.user.tag });
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder()
    .setName('pokimane')
    .setDescription('Say a random Pokimane sound and show the garage door'),
  guildOnly: true,
  execute,
};

module.exports = handler;
