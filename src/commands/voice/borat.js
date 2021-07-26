const borat = require('../../sounds/borat');
const queue = require('../../utils/audioQueue');

/**
 * Execute borat command.
 * @param {Object} message - Received message
 * @param {string[]} args
 * @param {Object} client - Discord client
 */
async function execute(message, args, client) {
  let audio;

  // Get random Borat line
  if (args[0] === 'steve') {
    audio = queue.formatAudio('borat.peopleCallMeSteve', borat.peopleCallMeSteve);
  } else {
    const boratSounds = Object.keys(borat);
    const randomBoratSound = boratSounds[Math.floor(Math.random() * boratSounds.length)];
    audio = queue.formatAudio(`borat.${randomBoratSound}`, borat[randomBoratSound]);
  }

  // Add to queue
  queue.addAudio(client, message, audio);
}

module.exports = {
  name: 'borat',
  description: 'Say a random Borat line',
  guildOnly: true,
  execute,
};
