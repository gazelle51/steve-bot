const egirl = require('../../sounds/egirl');
const voice = require('../../utils/voice');

/**
 * Execute egirl command.
 * @param {Object} message - Received message
 * @param {string[]} args
 * @param {Object} client - Discord client
 */
async function execute(message, args, client) {
  // Join voice channel
  const connection = await voice.join(message);

  // Check connection was successful
  if (!connection) return;

  // Say an e-girl line
  if (args[0] === 'stepbro') {
    connection.play(egirl.whatAreYouDoingStepBro);
  } else {
    const egirlSounds = Object.keys(egirl);
    const randomEgirlSound = egirlSounds[Math.floor(Math.random() * egirlSounds.length)];

    connection.play(egirl[randomEgirlSound]);
  }
}

module.exports = {
  name: 'egirl',
  description: 'Say a random e-girl line',
  guildOnly: true,
  cooldown: 2,
  execute,
};
