const { Interaction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

/**
 * Execute command.
 * @param {Interaction} interaction - Received interaction
 * @param {import("../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {}

/** @type {import('../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder().setName('').setDescription(''),
  execute,
};

module.exports = handler;
