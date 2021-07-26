const borat = require('../../sounds/borat');
const queue = require('../../utils/audioQueue');

/**
 * Execute join command.
 * @param {Object} message - Received message
 * @param {string[]} args
 * @param {Object} client - Discord client
 */
async function execute(message, args, client) {
  // Format audio
  const audio = queue.formatAudio('borat.helloNiceToMeetYou', borat.helloNiceToMeetYou);

  // Add to queue
  queue.addAudio(client, message, audio);
}

module.exports = {
  name: 'join',
  description: 'Join voice channel',
  guildOnly: true,
  cooldown: 0.5,
  execute,
};
