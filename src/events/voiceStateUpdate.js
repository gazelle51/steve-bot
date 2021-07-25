const text = require('../utils/text');

/**
 * Execute when the voiceStateUpdate event fires.
 * @param {Object} client - Discord client
 */
async function execute(oldState, newState, client) {
  // Get a channel
  const channel = text.findTextChannel(newState.guild);

  // Check if user started streaming
  if (!oldState.streaming && newState.streaming) {
    channel.send(`${newState.member.user.username} started streaming`);
  }
}

module.exports = {
  name: 'voiceStateUpdate',
  execute,
};
