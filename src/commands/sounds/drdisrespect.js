const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const drdisrespect = require('../../sounds/drdisrespect');
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

  // Add to queue
  await queue.addAudio(client, interaction, {
    ...drdisrespect[randomSound],
    addedBy: interaction.user.tag,
  });
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder()
    .setName('drdisrespect')
    .setDescription('Say a random Dr DisRespect line'),
  execute,
};

module.exports = handler;
