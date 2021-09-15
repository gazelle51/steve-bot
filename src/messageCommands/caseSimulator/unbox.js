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
    return await message.channel.send(
      `The cases I can open are listed below\n${_getCaseListData()}`
    );
  } else if (caseName === 'cobblestone') {
    const weapon = await unboxCollection(caseName);
    return await message.channel.send({
      embeds: [embeds.weapon(weapon, message.author)],
    });
  } else if (caseName === 'box') {
    return await message.channel.send({
      files: [
        'https://media.giphy.com/media/26his8ERHOSxKuWw8/giphy.gif?cid=ecf05e477mcpzpur95w1wm4t66zkh06t17j8lgc6nwq5f5c3&rid=giphy.gif&ct=g',
      ],
    });
  } else if (!cases.isCaseValid(caseName)) {
    return await message.channel.send(`I am not configured to open ${caseName} cases`);
  } else caseKey = caseName;

  // Open case
  const weapon = await unbox(caseKey);
  const embedMessage = await message.channel.send({
    embeds: [embeds.weapon(weapon, message.author)],
  });

  // React, reply and pin if knife was opened
  if (weapon.colour === 'yellow') {
    await embedMessage.react(emoji[100]);
    await message.reply({
      content: `Nice case opening!`,
      files: [
        'https://media.giphy.com/media/l7fdqmHQ1jCg2HzQlx/giphy.gif?cid=ecf05e47183sp00h6sr6g8t7p0sesbgg5uq4pzciqac9puyr&rid=giphy.gif&ct=g',
      ],
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
