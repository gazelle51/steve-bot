const { Message } = require('discord.js');

/**
 * Execute command.
 * @param {Message} message - Received message
 * @param {string[]} args - Arguments sent in message
 * @param {import("../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(message, args, client) {}

/** @type {import('../typedefs/discord').MessageCommand}} */
const handler = {
  data: { name: '', description: '' },
  cooldown: undefined,
  guildOnly: undefined,
  voiceChannel: undefined,
  execute,
};

module.exports = handler;
