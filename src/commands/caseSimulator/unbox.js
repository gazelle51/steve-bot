const { Message } = require('discord.js');
const cases = require('../../caseSimulator/cases');
const embeds = require('../../utils/embeds').case;
const unbox = require('../../caseSimulator/unbox').unbox;

/**
 * Execute unbox command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  let caseKey = '';

  // Determine case to open
  if (args.length === 0) caseKey = cases.randomCase();
  else if (!cases.isCaseValid(args.join(' '))) {
    message.reply(`I am not configured to open ${args.join(' ')} cases`);
    return;
  } else caseKey = args.join(' ');

  // Open case
  const weapon = await unbox(caseKey);
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
