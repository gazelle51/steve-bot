const { Message } = require('discord.js');

/**
 * Execute ping command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
function execute(message, args, client) {
  message.channel.send('Pong');
}

/** @type {import('../../typedefs/discord').Command}} */
const handler = {
  name: 'ping',
  description: 'Ping the bot',
  execute,
};

module.exports = handler;
