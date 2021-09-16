const { emoji } = require('../../config.js');
const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const _ = require('lodash');
const unbox = require('../../caseSimulator/unbox').unbox;

/**
 * Execute unbox command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  // Unbox container and get response to send
  const containerName = _.camelCase(interaction.options.getString('case'));
  const unboxResult = await unbox(containerName, interaction.user);

  // Send reply
  const reply = await interaction.reply({
    content: unboxResult.content,
    ephemeral: unboxResult.ephemeral,
    embeds: unboxResult.embeds,
    files: unboxResult.files,
    fetchReply: unboxResult.fetchReply,
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
    .setDescription('Unbox a CS-GO container')
    .addStringOption((option) =>
      option.setName('container').setDescription('Name of container to open')
    ),
  execute,
};

module.exports = handler;
