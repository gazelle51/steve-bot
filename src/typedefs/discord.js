const { Client, Collection, Permissions } = require('discord.js');
const { AudioPlayer } = require('@discordjs/voice/dist');

/**
 * Discord message command handler
 * @typedef {Object} MessageCommand
 * @property {Object} data - Discord slash command builder data
 * @property {string} data.name - command name used to call the command
 * @property {string} data.description - command description
 * @property {number} [cooldown] - command cooldown in seconds, if different from the default
 * @property {boolean} [guildOnly] - if true, command can only be used in a guild
 * @property {boolean} [voiceChannel] - if true, the user must be connected to a voice channel
 * @property {Function} execute - function that is called whent the command is executed
 */

/**
 * Discord slash command handler
 * @typedef {Object} SlashCommand
 * @property {Object} data - Discord slash command builder
 * @property {number} [cooldown] - command cooldown in seconds, if different from the default
 * @property {boolean} [guildOnly] - if true, command can only be used in a guild
 * @property {boolean} [voiceChannel] - if true, the user must be connected to a voice channel
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
 * @property {Collection<string, SlashCommand>} [slashCommands] - Slash commands library, <command name, command object>
 * @property {Collection<string, Collection<string, number>>} [cooldowns] - Active cooldowns, <command name, <user ID, expiration time>>
 * @property {Map<string, AudioQueue>} [queue] - Audio queue, <guild ID, audio queue object>
 */

/**
 * Discord client
 * @typedef {Client & ClientExtension} DiscordClient
 */

module.exports = {};
