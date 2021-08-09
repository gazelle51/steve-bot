const { Message } = require('discord.js');
const redGuardian = require('../../sounds/redGuardian');
const queue = require('../../utils/audioQueue');

/**
 * Execute redguardian command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  // Add to queue
  queue.addAudio(client, message, {
    ...redGuardian.iHaveALotOfEnergy,
    addedBy: message.author.tag,
  });
}

/** @type {import('../../typedefs/discord').Command}} */
const handler = {
  name: 'redguardian',
  description: 'Red Guardian has a lot of energy',
  guildOnly: true,
  aliases: ['energy', 'alexi'],
  execute,
};

module.exports = handler;
