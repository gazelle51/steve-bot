/**
 * Execute ping command.
 * @param {Object} message - Received message
 * @param {*} args
 */
function execute(message, args) {
  message.channel.send('pong');
}

module.exports = {
  name: 'ping',
  description: 'Ping the bot',
  execute,
};
