/**
 * Execute when the voiceStateUpdate event fires.
 * @param {Object} client - Discord client
 */
async function execute(oldState, newState, client) {
  // Check if user started streaming
  if (!oldState.streaming && newState.streaming) {
    const channel = client.channels.cache.get(process.env.EPICGAMERROOM);
    channel.send(`${newState.member.user.username} started streaming`);
  }
}

module.exports = {
  name: 'voiceStateUpdate',
  execute,
};
