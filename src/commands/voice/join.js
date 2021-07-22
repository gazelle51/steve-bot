const borat = require('../../borat');
const voice = require('../../voice');

/**
 * Execute join command.
 * @param {Object} message - Received message
 * @param {*} args
 */
async function execute(message, args) {
  // Join voice channel
  const connection = await voice.join(message);

  // Check connection was successful
  if (!connection) return;

  // Say hello
  connection.play(borat.helloNiceToMeetYou);
}

module.exports = {
  name: 'join',
  description: 'Join voice channel',
  guildOnly: true,
  cooldown: 2,
  execute,
};
