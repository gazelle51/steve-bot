const { Message } = require('discord.js');

/**
 * Execute user-info command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
function execute(message, args, client) {
  // Send user info
  message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
}

/** @type {import('../../typedefs/discord').Command}} */
module.exports = {
  name: 'user-info',
  description: 'Get user info',
  execute,
};
