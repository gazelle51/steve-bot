const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const queue = require('../../utils/audioQueue');

/**
 * Execute skip command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  await queue.skip(client, interaction);
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the currently playing audio'),
  guildOnly: true,
  execute,
};

module.exports = handler;
