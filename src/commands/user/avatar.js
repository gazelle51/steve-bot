/**
 * Execute avatar command.
 * @param {Object} message - Received message
 * @param {*} args
 */
function execute(message, args) {
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
