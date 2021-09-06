const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const queue = require('../../utils/audioQueue');
const yts = require('yt-search');

/**
 * Execute play command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  // Search Youtube
  const song = interaction.options.getString('song');
  const youtubeResult = await yts(song);

  // Stop if there are no search results
  if (!youtubeResult.videos.length) {
    await interaction.reply(`I couldn't find any search results for "${song}"`);
    return;
  }

  // Format audio
  const audio = {
    title: youtubeResult.videos[0].title,
    url: youtubeResult.videos[0].url,
    length: secondsToTime(youtubeResult.videos[0].duration.seconds),
    addedBy: interaction.user.tag,
  };

  // Add to queue
  await queue.addAudio(client, interaction, audio);
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

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from Youtube')
    .addStringOption((option) =>
      option.setName('song').setDescription('Song name to play').setRequired(true)
    ),
  guildOnly: true,
  execute,
};

module.exports = handler;
