const { Message } = require('discord.js');
const memes = require('../../sounds/memes');
const queue = require('../../utils/audioQueue');

/**
 * Execute gay command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  // Add to queue
  queue.addAudio(client, message, { ...memes.whyAreYouGay, addedBy: message.author.tag });
}

/** @type {import('../../typedefs/discord').Command}} */
const handler = {
  name: 'gay',
  description: 'Why are you gay?',
  guildOnly: true,
  execute,
};

module.exports = handler;
