/**
 * Execute kick command.
 * @param {Object} message - Received message
 * @param {string[]} args
 * @param {Object} client - Discord client
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

module.exports = {
  name: 'kick',
  description: 'Kick a user from the server',
  guildOnly: true,
  permissions: 'KICK_MEMBERS',
  execute,
};
