const { Message } = require('discord.js');
const borat = require('../../sounds/borat');
const queue = require('../../utils/audioQueue');

/**
 * Execute join command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  // Add to queue
  queue.addAudio(client, message, { ...borat.helloNiceToMeetYou, addedBy: message.author.tag });
}

/** @type {import('../../typedefs/discord').Command}} */
const handler = {
  name: 'join',
  description: 'Join voice channel',
  guildOnly: true,
  execute,
};

module.exports = handler;
