const { emoji } = require('../../config.js');
const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const cases = require('../../caseSimulator/cases');
const embeds = require('../../utils/embeds').case;
const unbox = require('../../caseSimulator/unbox').unbox;

/**
 * Execute unbox command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  let caseKey = '';

  const caseName = interaction.options.getString('case');

  // Determine case to open
  if (!caseName) caseKey = cases.randomCase();
  else if (caseName === '?') {
    await interaction.reply({
      content: `The cases I can open are listed below\n${_getCaseListData()}`,
    });
    return;
  } else if (caseName === 'cobblestone') {
    await interaction.reply({
      content: `Stop asking me to open Cobblestone cases unless you know the drop rates!!!`,
    });
    return;
  } else if (!cases.isCaseValid(caseName)) {
    await interaction.reply({
      content: `I am not configured to open ${caseName} cases`,
    });
    return;
  } else caseKey = caseName;

  // Open case
  const weapon = await unbox(caseKey);
  const embedMessage = await interaction.channel.send({
    embeds: [embeds.weapon(weapon, interaction.user)],
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

  await interaction.reply({ content: 'nice', ephemeral: true });
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

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder()
    .setName('unbox')
    .setDescription('Unbox a CS-GO case')
    .addStringOption((option) => option.setName('case').setDescription('Name of case to open')),
  execute,
};

module.exports = handler;
