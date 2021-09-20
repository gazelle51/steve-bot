const { SelectMenuInteraction } = require('discord.js');

/**
 * Execute select menu.
 * @param {SelectMenuInteraction} interaction - Received interaction
 * @param {import("../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {}

/** @type {import('../typedefs/discord').SelectMenuHandler}} */
const handler = {
  name: '',
  description: '',
  execute,
};

module.exports = handler;
