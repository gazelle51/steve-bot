const voice = require('../../utils/voice');

/**
 * Execute leave command.
 * @param {Object} message - Received message
 * @param {*} args
 */
async function execute(message, args) {
  await voice.leave(message);
}

module.exports = {
  name: 'leave',
  description: 'Leave voice channel',
  guildOnly: true,
  cooldown: 2,
  execute,
};
