const { Message } = require('discord.js');
const queue = require('../../utils/audioQueue');
const yts = require('yt-search');

/**
 * Execute skip command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  // Search Youtube
  const youtubeResult = await yts(args.join(' '));

  // TODO: no search results

  // Format audio
  const audio = queue.formatAudio(youtubeResult.videos[0].title, youtubeResult.videos[0].url);

  // Add to queue
  queue.addAudio(client, message, audio);
}

module.exports = {
  name: 'play',
  description: 'Play a song from Youtube',
  args: true,
  usage: '<Name of audio to play>',
  guildOnly: true,
  execute,
};
