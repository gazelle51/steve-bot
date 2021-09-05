const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

/**
 * Execute server command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  // Send server details
  await interaction.reply(
    `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}\nCreated on: ${interaction.guild.createdAt}`
  );
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder().setName('server').setDescription('Get server details'),
  execute,
};

module.exports = handler;
