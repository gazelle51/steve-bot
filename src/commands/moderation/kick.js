const { Message } = require('discord.js');

/**
 * Execute kick command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
function execute(message, args, client) {
  // Check a user was mentioned
  if (!message.mentions.users.size) {
    return message.reply('you need to tag a user in order to kick them!');
  }

  // Grab the "first" mentioned user from the message
  const taggedUser = message.mentions.users.first();

  // Send a message
  message.channel.send(`You wanted to kick ${taggedUser.username}`);
}

/** @type {import('../../typedefs/discord').Command}} */
module.exports = {
  name: 'kick',
  description: 'Kick a user from the server',
  guildOnly: true,
  permissions: 'KICK_MEMBERS',
  execute,
};
