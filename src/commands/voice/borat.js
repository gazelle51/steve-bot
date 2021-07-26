const borat = require('../../sounds/borat');
const voice = require('../../utils/voice');

/**
 * Execute borat command.
 * @param {Object} message - Received message
 * @param {string[]} args
 */
async function execute(message, args) {
  // Join voice channel
  const connection = await voice.join(message);

  // Check connection was successful
  if (!connection) return;

  // Say a Borat line
  if (args[0] === 'steve') {
    connection.play(borat.peopleCallMeSteve);
  } else {
    const boratSounds = Object.keys(borat);
    const randomBoratSound = boratSounds[Math.floor(Math.random() * boratSounds.length)];

    connection.play(borat[randomBoratSound]);
  }
}

module.exports = {
  name: 'borat',
  description: 'Say a random Borat line',
  guildOnly: true,
  cooldown: 2,
  execute,
};
