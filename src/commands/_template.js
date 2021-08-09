const { Message } = require('discord.js');

/**
 * Execute _template command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import("../typedefs/discord").DiscordClient} client - Discord client
 */
function execute(message, args, client) {}

/** @type {import('../typedefs/discord').Command}} */
const handler = {
  name: '',
  description: '',
  args: undefined,
  usage: undefined,
  guildOnly: undefined,
  cooldown: undefined,
  aliases: undefined,
  permissions: undefined,
  execute,
};

module.exports = handler;
