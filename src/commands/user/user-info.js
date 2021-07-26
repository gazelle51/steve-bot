/**
 * Execute user-info command.
 * @param {Object} message - Received message
 * @param {string[]} args
 * @param {Object} client - Discord client
 */
function execute(message, args, client) {
  // Send user info
  message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
}

module.exports = {
  name: 'user-info',
  description: 'Get user info',
  execute,
};
