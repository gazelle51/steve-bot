const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');
const { CommandInteraction } = require('discord.js');

/**
 * Join a voice channel. The channel that is joined will be the same channel
 * the incoming message's author is connected to. If they are not connected
 * to a voice channel the bot will not join a voice channel.
 * @param {CommandInteraction} interaction - Received interaction
 * @returns Voice connection or undefined
 */
async function join(interaction) {
  // Voice only works in guilds, if the message does not come from a guild, we ignore it
  if (!interaction.guild) return;

  // Only try to join the sender's voice channel if they are in one themselves
  if (interaction.member.voice.channel) {
    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    return connection;
  } else {
    await interaction.reply('You need to join a voice channel first!');
    return;
  }
}

/**
 * Leave a voice channel. The channel that is left will be the same channel
 * the incoming message's author is connected to. If they are not connected
 * to a voice channel the bot will not leave a voice channel.
 * @param {CommandInteraction} interaction - Received interaction
 * @returns
 */
async function leave(interaction) {
  // Voice only works in guilds, if the message does not come from a guild, we ignore it
  if (!interaction.guild) return;

  // Only try to leave the sender's voice channel if they are in one themselves
  if (interaction.member.voice.channel) {
    getVoiceConnection(interaction.guild.id).destroy();
  } else {
    await interaction.reply('You need to join a voice channel first!');
  }
}

module.exports = { join, leave };
