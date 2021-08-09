const { Message } = require('discord.js');
const queue = require('../../utils/audioQueue');
const yts = require('yt-search');

/**
 * Execute play command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  // Search Youtube
  const youtubeResult = await yts(args.join(' '));

  // Stop if there are no search results
  if (!youtubeResult.videos.length) {
    message.reply(`I couldn't find any search results for "${args.join(' ')}"`);
    return;
  }

  // Format audio
  const audio = {
    title: youtubeResult.videos[0].title,
    url: youtubeResult.videos[0].url,
    length: secondsToTime(youtubeResult.videos[0].duration.seconds),
    addedBy: message.author.tag,
  };

  // Add to queue
  queue.addAudio(client, message, audio);
}

/**
 * Convert seconds into hours, minutes and seconds.
 * @param {number} e - total seconds
 * @returns {string} Seconds represented as HH:MM:SS
 */
function secondsToTime(e) {
  var h = Math.floor(e / 3600)
      .toString()
      .padStart(2, '0'),
    m = Math.floor((e % 3600) / 60)
      .toString()
      .padStart(2, '0'),
    s = Math.floor(e % 60)
      .toString()
      .padStart(2, '0');

  if (h == '00' && m == '00') return `0:${s}`;
  else if (h == '00') return `${m}:${s}`;
  else return `${h}:${m}:${s}`;
}

/** @type {import('../../typedefs/discord').Command}} */
module.exports = {
  name: 'play',
  description: 'Play a song from Youtube',
  args: true,
  usage: '<Name of audio to play>',
  guildOnly: true,
  execute,
};
