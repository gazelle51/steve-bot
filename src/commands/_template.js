const { Message } = require('discord.js');

/**
 * Execute _template command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import("../typedefs/discord").DiscordClient} client - Discord client
 */
function execute(message, args, client) {}

/** @type {import('../typedefs/discord').Command}} */
module.exports = {
  name: '',
  description: '',
  args: false,
  usage: '',
  guildOnly: false,
  cooldown: 1,
  aliases: [],
  permissions: '',
  execute,
};
