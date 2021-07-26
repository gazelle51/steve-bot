const csgo = require('../../sounds/csgo');
const voice = require('../../utils/voice');

/**
 * Execute deathcry command.
 * @param {Object} message - Received message
 * @param {string[]} args
 */
async function execute(message, args) {
  // Join voice channel
  const connection = await voice.join(message);

  // Check connection was successful
  if (!connection) return;

  // Say hello
  connection.play(csgo.deathcry);
}

module.exports = {
  name: 'deathcry',
  description: 'CSGO death cry',
  guildOnly: true,
  cooldown: 2,
  execute,
};
