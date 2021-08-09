const { Message } = require('discord.js');
const pokimane = require('../../sounds/pokimane');
const queue = require('../../utils/audioQueue');
const sound = require('../../utils/sound');

/**
 * Execute pokimane command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  message.channel.send('', {
    files: [
      'https://www.theloadout.com/wp-content/uploads/2021/01/rust-twitch-drops-pokimane-900x506.jpg',
    ],
  });

  // Get random Pokimane line
  const randomSound = sound.getNameOfRandomSound(pokimane);
  const audio = pokimane[randomSound];

  // Add to queue
  queue.addAudio(client, message, { ...audio, addedBy: message.author.tag });
}

/** @type {import('../../typedefs/discord').Command}} */
const handler = {
  name: 'pokimane',
  description: 'Say a random Pokimane sound and show the garage door',
  guildOnly: true,
  execute,
};

module.exports = handler;
