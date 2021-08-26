const { Client, Collection, Permissions, TextChannel, VoiceChannel } = require('discord.js');
const { AudioPlayer, VoiceConnection } = require('@discordjs/voice/dist');

/**
 * Discord command handler
 * @typedef {Object} Command
 * @property {string} name - command name used to call the command
 * @property {string} description - command description
 * @property {boolean} [args] - if true, arguments are required to run command
 * @property {string} [usage] - example of how the arguments are used
 * @property {boolean} [guildOnly] - if true, command cannot be used in DMs
 * @property {number} [cooldown] - command cooldown, if different from the default
 * @property {string[]} [aliases] - other command names that can be used to execute command
 * @property {Permissions} [permissions] - permission needed to execute the command
 * @property {Function} execute - function that is called whent the command is executed
 */

/**
 * Discord event handler
 * @typedef {Object} Event
 * @property {string} name - event name
 * @property {boolean} [once] - if true, this event will only be handled once
 * @property {Function} execute - function that is called when the event occurs
 */

/**
 * Discord audio queue for a guild
 * @typedef {Object} AudioQueue
 * @property {import('./audio').Audio[]} audioQueue - queue of audio to play
 * @property {AudioPlayer} player - audio player
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
