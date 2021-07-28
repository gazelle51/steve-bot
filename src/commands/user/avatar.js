const { Message } = require('discord.js');

/**
 * Execute avatar command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
function execute(message, args, client) {
  // Check if a user was mentioned, if not display sender's avatar
  if (!message.mentions.users.size) {
    return message.channel.send(`Here's your avatar`, {
      files: [message.author.displayAvatarURL({ format: 'png', dynamic: true })],
    });
  }

  // Display avatars of mentioned users
  message.mentions.users.map((user) => {
    message.channel.send(`${user.username}'s avatar`, {
      files: [user.displayAvatarURL({ format: 'png', dynamic: true })],
    });
  });
}

module.exports = {
  name: 'avatar',
  description: 'Display avatar of user',
  aliases: ['icon'],
  execute,
};
