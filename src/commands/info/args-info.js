/**
 * Execute args-info command.
 * @param {Object} message - Received message
 * @param {string[]} args
 */
function execute(message, args) {
  message.channel.send(`Arguments are: ${args.join(', ')}`);
}

module.exports = {
  name: 'args-info',
  description: 'Extract arguments from a command',
  args: true,
  usage: '<arg1> <arg2> <arg3> ...',
  execute,
};
