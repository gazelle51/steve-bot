/**
 * Execute args-info command.
 * @param {Object} message - Received message
 * @param {string[]} args
 * @param {Object} client - Discord client
 */
function execute(message, args, client) {
  message.channel.send(`Arguments are: ${args.join(', ')}`);
}

module.exports = {
  name: 'args-info',
  description: 'Extract arguments from a command',
  args: true,
  usage: '<arg1> <arg2> <arg3> ...',
  execute,
};
