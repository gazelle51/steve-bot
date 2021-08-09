const { Message } = require('discord.js');
const voice = require('../../utils/voice');

/**
 * Execute leave command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  await voice.leave(message);
}

/** @type {import('../../typedefs/discord').Command}} */
module.exports = {
  name: 'leave',
  description: 'Leave voice channel',
  guildOnly: true,
  execute,
};
