const { Client, Collection } = require('discord.js');

// TODO: update maps and collections

/**
 * Discord command
 * @typedef {Object} Command
 *   name: '',
  description: '',
  args: false,
  usage: '',
  guildOnly: false,
  cooldown: 1,
  aliases: [],
  permissions: '',
  execute,
 */

/**
 * Discord command cooldown
 * @typedef {Object} Cooldown
 *   ?
 */

/**
 * Discord audio queue for a guild
 * @typedef {Object} AudioQueue
 *       voiceChannel: message.member.voice.channel,
    voiceConnection: voiceConnection,
    textChannel: message.channel,
    audioQueue: [audio],
    playing: true,
    leaveInactive: null,
 */

/**
 * Discord client
 * @typedef {Object} ClientExtension
 * @property {Collection} [commands] - Commands library
 * @property {Collection} [cooldowns] - Active cooldowns
 * @property {Map} [queue] - Audio queue
 */

/**
 * Discord client
 * @typedef {Client & ClientExtension} DiscordClient
 */

module.exports = {};
