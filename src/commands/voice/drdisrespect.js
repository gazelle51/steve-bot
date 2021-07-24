const drdisrespect = require('../../drdisrespect');
const voice = require('../../utils/voice');

/**
 * Execute drdisrespect command.
 * @param {Object} message - Received message
 * @param {*} args
 */
async function execute(message, args) {
  // Join voice channel
  const connection = await voice.join(message);

  // Check connection was successful
  if (!connection) return;

  // Say a Borat line
  if (args[0] === 'zzz') {
    connection.play(drdisrespect.whatIsThisGameAbout);
  } else {
    const drdisrespectSounds = Object.keys(drdisrespect);
    const randomDrdisrespectSound =
      drdisrespectSounds[Math.floor(Math.random() * drdisrespectSounds.length)];

    connection.play(drdisrespect[randomDrdisrespectSound]);
  }
}

module.exports = {
  name: 'drdisrespect',
  description: 'Say a random Dr DisRespect line',
  guildOnly: true,
  cooldown: 2,
  aliases: ['disrespect'],
  execute,
};
