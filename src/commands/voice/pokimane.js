const pokimane = require('../../sounds/pokimane');
const queue = require('../../utils/audioQueue');

/**
 * Execute pokimane command.
 * @param {Object} message - Received message
 * @param {string[]} args
 * @param {Object} client - Discord client
 */
async function execute(message, args, client) {
  message.channel.send('', {
    files: [
      'https://www.theloadout.com/wp-content/uploads/2021/01/rust-twitch-drops-pokimane-900x506.jpg',
    ],
  });

  let audio;

  // Get random Pokimane line
  if (args[0] === 'steve') {
    audio = queue.formatAudio('pokimane.niggaYouAintFunny', pokimane.niggaYouAintFunny);
  } else {
    const pokimaneSounds = Object.keys(pokimane);
    const randomPokimaneSound = pokimaneSounds[Math.floor(Math.random() * pokimaneSounds.length)];
    audio = queue.formatAudio(`pokimane.${randomPokimaneSound}`, pokimane[randomPokimaneSound]);
  }

  // Add to queue
  queue.addAudio(client, message, audio);
}

module.exports = {
  name: 'pokimane',
  description: 'Say a random Pokimane sound and show the garage door',
  guildOnly: true,
  cooldown: 0.5,
  execute,
};
