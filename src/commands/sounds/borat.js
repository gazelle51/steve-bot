const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const borat = require('../../sounds/borat');
const queue = require('../../utils/audioQueue');
const sound = require('../../utils/sound');

/**
 * Execute borat command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  let audio;

  // Get random Borat line
  const randomSound = sound.getNameOfRandomSound(borat);
  audio = borat[randomSound];

  // Add to queue
  await queue.addAudio(client, interaction, { ...audio, addedBy: interaction.user.tag });
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder().setName('borat').setDescription('Say a random Borat line'),
  guildOnly: true,
  execute,
};

module.exports = handler;
