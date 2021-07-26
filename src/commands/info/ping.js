/**
 * Execute ping command.
 * @param {Object} message - Received message
 * @param {string[]} args
 * @param {Object} client - Discord client
 */
function execute(message, args, client) {
  message.channel.send('pong');
}

module.exports = {
  name: 'ping',
  description: 'Ping the bot',
  execute,
};
