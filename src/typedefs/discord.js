const { Client, Collection, TextChannel, VoiceChannel, VoiceConnection } = require('discord.js');

// TODO: update maps and collections

/**
 * Discord command
 * @typedef {Object} Command
 * @property {string} name - command name used to call the command
 * @property {string} description - command description
 * @property {boolean} [args] - if true, arguments are required to run command
 * @property {string} [usage] - example of how the arguments are used
 * @property {boolean} [guildOnly] - if true, command cannot be used in DMs
 * @property {number} [cooldown] - command cooldown, if different from the default
 * @property {string[]} [aliases] - other command names that can be used to execute command
 * @property {string} [permissions] - permission needed to execute the command
 * @property {Function} execute - function that is called whent the command is executed
 */

/**
 * Discord audio queue for a guild
 * @typedef {Object} AudioQueue
 * @property {VoiceChannel} voiceChannel - voice channel to play music in
 * @property {VoiceConnection} voiceConnection - connection to the voice channel
 * @property {TextChannel} textChannel - text channel to give updates in
 * @property {import('./audio').Audio[]} audioQueue - queue of audio to play
 * @property {boolean} playing - whether the queue is currently playing or not
 * @property {NodeJS.Timeout} leaveInactive - inactivity timeout function
 */

/**
 * Discord client
 * @typedef {Object} ClientExtension
 * @property {Collection<string, Command>} [commands] - Commands library, <command name, command object>
 * @property {Collection<string, Collection<string, number>>} [cooldowns] - Active cooldowns, <command name, <user ID, expiration time>>
 * @property {Map<string, AudioQueue>} [queue] - Audio queue, <guild ID, audio queue object>
 */

/**
 * Discord client
 * @typedef {Client & ClientExtension} DiscordClient
 */

module.exports = {};
