const { Message } = require('discord.js');
const queue = require('../../utils/audioQueue');

/**
 * Execute skip command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  queue.skip(client, message);
}

/** @type {import('../../typedefs/discord').Command}} */
module.exports = {
  name: 'skip',
  description: 'Skip the currently playing audio',
  guildOnly: true,
  execute,
};
