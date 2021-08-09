const { Message } = require('discord.js');
const embeds = require('../../utils/embeds');

/**
 * Execute test command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
function execute(message, args, client) {
  message.channel.send(
    embeds.queue.songAdded({
      title: 'Skyrim - Music & Ambience',
      url: 'https://www.youtube.com/watch?v=nRe3xFeyhVY&ab_channel=Everness',
      length: '2:29:00',
      addedBy: 'gazelle51#0006',
    })
  );
}

/** @type {import('../../typedefs/discord').Command}} */
const handler = {
  name: 'test',
  description: 'Execute a test feature',
  execute,
};

module.exports = handler;
