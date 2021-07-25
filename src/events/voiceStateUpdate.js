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

    // Check if user is playing CS GO
    if (
      newState.member.user.presence.activities.filter(
        (activity) =>
          activity.type === 'PLAYING' && activity.name === 'Counter-Strike: Global Offensive'
      ).length
    )
      channel.send(`${newState.member.user.username} is opening cases!!!!!!!!`);
  }
}

module.exports = {
  name: 'voiceStateUpdate',
  execute,
};
