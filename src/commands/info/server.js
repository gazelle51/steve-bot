const { Message } = require('discord.js');

/**
 * Execute server command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
function execute(message, args, client) {
  // Send server details
  message.channel.send(
    `Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nCreated on: ${message.guild.createdAt}\nRegion: ${message.guild.region}`
  );
}

/** @type {import('../../typedefs/discord').Command}} */
module.exports = {
  name: 'server',
  description: 'Get server details',
  guildOnly: true,
  execute,
};
