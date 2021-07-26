const voice = require('../../utils/voice');

/**
 * Execute leave command.
 * @param {Object} message - Received message
 * @param {string[]} args
 * @param {Object} client - Discord client
 */
async function execute(message, args, client) {
  await voice.leave(message);
}

module.exports = {
  name: 'leave',
  description: 'Leave voice channel',
  guildOnly: true,
  execute,
};
