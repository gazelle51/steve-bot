const { Message } = require('discord.js');
const csgo = require('../../sounds/csgo');
const queue = require('../../utils/audioQueue');

/**
 * Execute deathcry command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  // Format audio
  const audio = queue.formatAudio('deathcry', csgo.deathcry);

  // Add to queue
  queue.addAudio(client, message, audio);
}

module.exports = {
  name: 'deathcry',
  description: 'CSGO death cry',
  guildOnly: true,
  execute,
};
