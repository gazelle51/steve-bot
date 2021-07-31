const text = require('../utils/text');

/**
 * Execute when the voiceStateUpdate event fires.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(oldState, newState, client) {
  // Get a channel
  const channel = text.findTextChannel(newState.guild);

  // Check if user started streaming and is playing CS-GO
  if (
    !oldState.streaming &&
    newState.streaming &&
    newState.member.user.presence.activities.filter(
      (activity) =>
        activity.type === 'PLAYING' && activity.name === 'Counter-Strike: Global Offensive'
    ).length
  ) {
    channel.send(`${newState.member.user.username} is opening cases!!!!!!!!`);
  }

  // Check if user started streaming
  else if (!oldState.streaming && newState.streaming) {
    channel.send(`${newState.member.user.username} started streaming`);
  }
}

module.exports = {
  name: 'voiceStateUpdate',
  execute,
};
