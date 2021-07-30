const { Message } = require('discord.js');
const queue = require('../../utils/audioQueue');

/**
 * Execute stop command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  queue.stop(client, message);
}

module.exports = {
  name: 'stop',
  description: 'Stop the currently playing audio and clear the queue',
  guildOnly: true,
  execute,
};
