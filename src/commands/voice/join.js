const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const borat = require('../../sounds/borat');
const queue = require('../../utils/audioQueue');

/**
 * Execute join command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  // Add to queue
  await queue.addAudio(client, interaction, {
    ...borat.helloNiceToMeetYou,
    addedBy: interaction.user.tag,
  });
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder().setName('join').setDescription('Join voice channel'),
  execute,
};

module.exports = handler;
