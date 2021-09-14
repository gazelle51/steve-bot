const { getVoiceConnection, joinVoiceChannel, VoiceConnection } = require('@discordjs/voice');
const { Guild } = require('discord.js');

/**
 * Join a voice channel.
 * @param {string} channelId - ID of voice channel to join
 * @param {Guild} guild - guild the voice channel belongs to
 * @returns {VoiceConnection} Voice connection
 */
function join(channelId, guild) {
  const connection = joinVoiceChannel({
    channelId: channelId,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
  });
  return connection;
}

/**
 * Leave the connected voice channel in the specified guild.
 * @param {string} guildId - ID of guild to leave
 * @returns {void}
 */
function leave(guildId) {
  getVoiceConnection(guildId).destroy();
}

module.exports = { join, leave };
