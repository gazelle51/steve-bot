const borat = require('../../borat');
const voice = require('../../utils/voice');

/**
 * Execute borat command.
 * @param {Object} message - Received message
 * @param {*} args
 */
async function execute(message, args) {
  // Join voice channel
  const connection = await voice.join(message);

  // Check connection was successful
  if (!connection) return;

  const boratSounds = Object.keys(borat);
  const randomBoratSound = boratSounds[Math.floor(Math.random() * boratSounds.length)];

  // Say hello
  connection.play(borat[randomBoratSound]);
}

module.exports = {
  name: 'borat',
  description: 'Say a random Borat line',
  guildOnly: true,
  cooldown: 2,
  execute,
};
