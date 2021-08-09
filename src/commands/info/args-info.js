const { Message } = require('discord.js');

/**
 * Execute args-info command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
function execute(message, args, client) {
  message.channel.send(`Arguments are: ${args.join(', ')}`);
}

/** @type {import('../../typedefs/discord').Command}} */
const handler = {
  name: 'args-info',
  description: 'Extract arguments from a command',
  args: true,
  usage: '<arg1> <arg2> <arg3> ...',
  execute,
};

module.exports = handler;
