const drdisrespect = require('../../sounds/drdisrespect');
const queue = require('../../utils/audioQueue');

/**
 * Execute drdisrespect command.
 * @param {Object} message - Received message
 * @param {string[]} args
 * @param {Object} client - Discord client
 */
async function execute(message, args, client) {
  // Get random Dr DisRespect line
  const drdisrespectSounds = Object.keys(drdisrespect);
  const randomDrdisrespectSound =
    drdisrespectSounds[Math.floor(Math.random() * drdisrespectSounds.length)];
  const audio = queue.formatAudio(
    `drdisrespect.${randomDrdisrespectSound}`,
    drdisrespect[randomDrdisrespectSound]
  );

  // Add to queue
  queue.addAudio(client, message, audio);
}

module.exports = {
  name: 'drdisrespect',
  description: 'Say a random Dr DisRespect line',
  guildOnly: true,
  cooldown: 0.5,
  aliases: ['disrespect'],
  execute,
};
