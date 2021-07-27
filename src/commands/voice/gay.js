const memes = require('../../sounds/memes');
const queue = require('../../utils/audioQueue');

/**
 * Execute gay command.
 * @param {Object} message - Received message
 * @param {string[]} args
 * @param {Object} client - Discord client
 */
async function execute(message, args, client) {
  // Format audio
  const audio = queue.formatAudio('memes.whyAreYouGay', memes.whyAreYouGay);

  // Add to queue
  queue.addAudio(client, message, audio);
}

module.exports = {
  name: 'gay',
  description: 'Why are you gay?',
  guildOnly: true,
  execute,
};
