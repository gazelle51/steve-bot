const { Client, Collection } = require('discord.js');

// TODO: update maps and collections

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
