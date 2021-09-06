const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const voice = require('../../utils/voice');

/**
 * Execute leave command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  await voice.leave(interaction);
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder().setName('leave').setDescription('Leave voice channel'),
  guildOnly: true,
  execute,
};

module.exports = handler;
