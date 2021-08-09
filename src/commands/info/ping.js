const { Message } = require('discord.js');

/**
 * Execute ping command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
function execute(message, args, client) {
  message.channel.send('pong');
}

/** @type {import('../../typedefs/discord').Command}} */
module.exports = {
  name: 'ping',
  description: 'Ping the bot',
  execute,
};
