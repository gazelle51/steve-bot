const { Message } = require('discord.js');
const embeds = require('../../utils/embeds').case;
const unbox = require('../../caseSimulator/unbox').unbox;

/**
 * Execute unbox command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
function execute(message, args, client) {
  const weapon = unbox('operationbravo');

  message.channel.send(embeds.weapon(weapon, message.author));
}

/** @type {import('../../typedefs/discord').Command}} */
const handler = {
  name: 'unbox',
  description: 'Unbox a CS-GO case',
  args: undefined,
  usage: undefined,
  aliases: ['case'],
  execute,
};

module.exports = handler;
