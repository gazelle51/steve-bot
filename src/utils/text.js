const { Guild, TextChannel } = require('discord.js');

/**
 * Find the first channel in the guild.
 * @param {Guild} guild - Guild to find channel in
 * @returns {TextChannel}
 */
function findTextChannel(guild) {
  // @ts-ignore
  return guild.channels.cache.filter((channel) => channel.type === 'text').first();
}

module.exports = { findTextChannel };
