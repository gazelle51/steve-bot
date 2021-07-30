const { Message } = require('discord.js');
const queue = require('../../utils/audioQueue');

/**
 * Execute skip command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  // Get queue
  const audioQueue = queue.getQueue(client, message);

  // Display results in text channel
  message.channel.send(audioQueue.map((audio, i) => `${i}. ${audio.title}`));
}

module.exports = {
  name: 'queue',
  description: 'View of queue and currently playing audio',
  guildOnly: true,
  execute,
};
