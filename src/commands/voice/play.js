const { Message } = require('discord.js');
const queue = require('../../utils/audioQueue');

/**
 * Execute skip command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  // Format audio
  const audio = queue.formatAudio(args[0], args[0]);

  // Add to queue
  queue.addAudio(client, message, audio);
}

module.exports = {
  name: 'play',
  description: 'Play a song from Youtube',
  args: true,
  usage: '<youtube URL>',
  guildOnly: true,
  execute,
};
