const { emoji } = require('../../config.json');
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
  const embedMessage = await message.channel.send(embeds.weapon(weapon, message.author));

  // React and reply if knife was opened
  // TODO discord-reply https://stackoverflow.com/questions/65114050/discord-js-reply-to-message-actual-reply-with-reply-decoration
  if (weapon.colour === 'yellow') {
    await embedMessage.react(emoji[100]);
    embedMessage.reply(``, {
      files: ['https://media.giphy.com/media/Ls6ahtmYHU760/giphy.gif'],
    });
  }
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
