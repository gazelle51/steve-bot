const { emoji } = require('../../config.js');
const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getContainerCommands } = require('../../containerSimulator/containers.js');
const _ = require('lodash');
const unbox = require('../../containerSimulator/unbox').unbox;

/**
 * Execute unbox command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  // Unbox container and get response to send
  const containerName = _.camelCase(interaction.options.getString('container'));
  const unboxResult = await unbox(containerName, interaction.user);

  // Defer reply (giphy responses take a long time)
  await interaction.deferReply({
    ephemeral: unboxResult.ephemeral,
    fetchReply: unboxResult.fetchReply,
  });

  // Send reply
  const reply = await interaction.editReply({
    content: unboxResult.content,
    embeds: unboxResult.embeds,
    files: unboxResult.files,
  });

  // React, reply and pin if knife was opened
  if (unboxResult.weaponColour === 'yellow') {
    await reply.react(emoji[100]);
    await interaction.followUp({
      content: `Nice case opening!`,
      files: ['https://media.giphy.com/media/Ls6ahtmYHU760/giphy.gif'],
    });
    try {
      await reply.pin();
    } catch (err) {
      console.error(err);
    }
  }
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder()
    .setName('unbox')
    .setDescription('Unbox a CS: GO container')
    .addStringOption((option) =>
      option.setName('container').setDescription('Name of container to open')
    ),
  extraHelp: `The containers I can open are ${getContainerCommands().join(', ')}`,
  execute,
};

module.exports = handler;
