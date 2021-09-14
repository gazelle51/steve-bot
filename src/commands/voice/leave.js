const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const voice = require('../../utils/voice');

/**
 * Execute leave command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  voice.leave(interaction.guild.id);
  await interaction.reply('Bye!');
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder().setName('leave').setDescription('Leave voice channel'),
  guildOnly: true,
  voiceChannel: true,
  execute,
};

module.exports = handler;
