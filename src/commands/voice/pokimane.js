const pokimane = require('../../sounds/pokimane');
const voice = require('../../utils/voice');

/**
 * Execute pokimane command.
 * @param {Object} message - Received message
 * @param {*} args
 */
async function execute(message, args) {
  message.channel.send('', {
    files: [
      'https://www.theloadout.com/wp-content/uploads/2021/01/rust-twitch-drops-pokimane-900x506.jpg',
    ],
  });

  // Join voice channel
  const connection = await voice.join(message);

  // Check connection was successful
  if (!connection) return;

  // Say a pokimane line
  if (args[0] === 'steve') {
    connection.play(pokimane.niggaYouAintFunny);
  } else {
    const pokimaneSounds = Object.keys(pokimane);
    const randomPokimaneSound = pokimaneSounds[Math.floor(Math.random() * pokimaneSounds.length)];

    connection.play(pokimane[randomPokimaneSound]);
  }
}

module.exports = {
  name: 'pokimane',
  description: 'Say a random Pokimane sound and show the garage door',
  guildOnly: true,
  cooldown: 2,
  execute,
};
