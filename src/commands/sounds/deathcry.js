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
  // Add to queue
  queue.addAudio(client, message, { ...csgo.deathcry, addedBy: message.author.tag });
}

/** @type {import('../../typedefs/discord').Command}} */
module.exports = {
  name: 'deathcry',
  description: 'CSGO death cry',
  guildOnly: true,
  execute,
};
