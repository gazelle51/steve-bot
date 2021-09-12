const { emoji } = require('../../config.js');
const { Message } = require('discord.js');
const cases = require('../../caseSimulator/cases');
const embeds = require('../../utils/embeds').case;
const unbox = require('../../caseSimulator/unbox').unbox;
const unboxCollection = require('../../caseSimulator/unboxCollection').unboxCollection;

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
  else if (args.join(' ') === '?') {
    message.reply({
      content: `The cases I can open are listed below\n${_getCaseListData()}`,
    });
    return;
  } else if (args.join(' ') === 'cobblestone') {
    const weapon = await unboxCollection('cobblestone');
    await message.channel.send({
      embeds: [embeds.weapon(weapon, message.author)],
    });
    return;
  } else if (!cases.isCaseValid(args.join(' '))) {
    message.reply({
      content: `I am not configured to open ${args.join(' ')} cases`,
    });
    return;
  } else caseKey = args.join(' ');

  // Open case
  const weapon = await unbox(caseKey);
  const embedMessage = await message.channel.send({
    embeds: [embeds.weapon(weapon, message.author)],
  });

  // React, reply and pin if knife was opened
  if (weapon.colour === 'yellow') {
    embedMessage.react(emoji[100]);
    embedMessage.reply({
      content: `Nice case opening!`,
      files: ['https://media.giphy.com/media/Ls6ahtmYHU760/giphy.gif'],
    });
    try {
      embedMessage.pin();
    } catch (err) {
      console.error(err);
    }
  }
}

/**
 * Get a list of all cases and the command that must be used with them.
 * @returns {string} List of cases and their commands
 */
function _getCaseListData() {
  return cases
    .getCaseNames()
    .map((caseName) => `${caseName[1]} - ${caseName[0]}`)
    .join('\n');
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
