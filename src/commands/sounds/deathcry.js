const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const csgo = require('../../sounds/csgo');
const queue = require('../../utils/audioQueue');

/**
 * Execute deathcry command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  // Add to queue
  await queue.addAudio(client, interaction, { ...csgo.deathcry, addedBy: interaction.user.tag });
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder().setName('deathcry').setDescription('CS-GO death cry'),
  execute,
};

module.exports = handler;
