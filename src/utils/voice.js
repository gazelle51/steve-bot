const { Message } = require('discord.js');

/**
 * Join a voice channel. The channel that is joined will be the same channel
 * the incoming message's author is connected to. If they are not connected
 * to a voice channel the bot will not join a voice channel.
 * @param {Message} message - Incoming message received in Discord
 * @returns Voice connection or undefined
 */
async function join(message) {
  // Voice only works in guilds, if the message does not come from a guild, we ignore it
  if (!message.guild) return;

  // Only try to join the sender's voice channel if they are in one themselves
  if (message.member.voice.channel) {
    const connection = await message.member.voice.channel.join();
    return connection;
  } else {
    message.reply('You need to join a voice channel first!');
    return;
  }
}

/**
 * Leave a voice channel. The channel that is left will be the same channel
 * the incoming message's author is connected to. If they are not connected
 * to a voice channel the bot will not leave a voice channel.
 * @param {Message} message - Incoming message received in Discord
 * @returns
 */
async function leave(message) {
  // Voice only works in guilds, if the message does not come from a guild, we ignore it
  if (!message.guild) return;

  // Only try to leave the sender's voice channel if they are in one themselves
  if (message.member.voice.channel) {
    await message.member.voice.channel.leave();
  } else {
    message.reply('You need to join a voice channel first!');
  }
}

module.exports = { join, leave };
