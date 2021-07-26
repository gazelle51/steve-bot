const borat = require('../../sounds/borat');
const voice = require('../../utils/voice');

/**
 * Execute join command.
 * @param {Object} message - Received message
 * @param {string[]} args
 * @param {Object} client - Discord client
 */
async function execute(message, args, client) {
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
