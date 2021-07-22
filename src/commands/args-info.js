/**
 * Execute args-info command.
 * @param {Object} message - Received message
 * @param {*} args
 */
function execute(message, args) {
  // Check arguments are provided
  if (!args.length)
    return message.channel.send(`You didn't provide any arguments, ${message.author}!`);

  message.channel.send(`Arguments are: ${args.join(', ')}`);
}

module.exports = {
  name: 'args-info',
  description: 'Extract arguments from a command',
  execute,
};
