const { emoji } = require('../../config.js');
const { Message } = require('discord.js');
const cases = require('../../caseSimulator/cases');
const embeds = require('../../utils/embeds').case;
const unbox = require('../../caseSimulator/unbox').unbox;
const unboxCollection = require('../../caseSimulator/unboxCollection').unboxCollection;

/**
 * Execute unbox command.
 * @param {Message} message - Received message
 * @param {string[]} args - Arguments sent in message
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  let caseKey = '';
  const caseName = args[0];

  // Determine case to open
  if (!caseName) caseKey = cases.randomCase();
  else if (caseName === '?') {
    return await message.reply(`The cases I can open are listed below\n${_getCaseListData()}`);
  } else if (caseName === 'cobblestone') {
    const weapon = await unboxCollection(caseName);
    await message.reply({
      embeds: [embeds.weapon(weapon, message.author)],
    });
  } else if (!cases.isCaseValid(caseName)) {
    return await message.reply(`I am not configured to open ${caseName} cases`);
  } else caseKey = caseName;

  // Open case
  const weapon = await unbox(caseKey);
  const embedMessage = await message.reply({
    embeds: [embeds.weapon(weapon, message.author)],
  });

  // React, reply and pin if knife was opened
  if (weapon.colour === 'yellow') {
    await embedMessage.react(emoji[100]);
    await message.channel.send({
      content: `Nice case opening!`,
      files: ['https://media.giphy.com/media/Ls6ahtmYHU760/giphy.gif'],
    });
    try {
      await embedMessage.pin();
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

/** @type {import('../../typedefs/discord').MessageCommand}} */
const handler = {
  data: {
    name: 'unbox',
    description: 'Unbox a CS-GO case',
    // option: ('case').setDescription('Name of case to open'))
  },
  execute,
};

module.exports = handler;
