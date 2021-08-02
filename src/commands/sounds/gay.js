const { Message } = require('discord.js');
const memes = require('../../sounds/memes');
const queue = require('../../utils/audioQueue');

/**
 * Execute gay command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  // Format audio
  const audio = queue.formatAudio(
    'memes.whyAreYouGay',
    memes.whyAreYouGay,
    '?',
    message.author.username
  );

  // Add to queue
  queue.addAudio(client, message, audio);
}

module.exports = {
  name: 'gay',
  description: 'Why are you gay?',
  guildOnly: true,
  execute,
};
