const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const embeds = require('../../utils/embeds').queue;
const queue = require('../../utils/audioQueue');
const ytdl = require('ytdl-core');
const yts = require('yt-search');

/**
 * Execute play command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  const song = interaction.options.getString('song');
  const youtubeUrl = song.includes('www.youtube.com');

  const audio = {
    title: '',
    url: '',
    length: '',
    addedBy: interaction.user.tag,
  };

  if (youtubeUrl) {
    // Song details from Youtube
    const songDetails = await ytdl.getBasicInfo(song);

    audio.title = songDetails.videoDetails.title;
    audio.url = songDetails.videoDetails.video_url;
    audio.length = _secondsToTime(+songDetails.videoDetails.lengthSeconds);
  } else {
    // Search Youtube
    const youtubeResult = await yts(song);

    // Stop if there are no search results
    if (!youtubeResult.videos.length) {
      return await interaction.reply(`I couldn't find any search results for "${song}"`);
    }

    audio.title = youtubeResult.videos[0].title;
    audio.url = youtubeResult.videos[0].url;
    audio.length = _secondsToTime(youtubeResult.videos[0].duration.seconds);
  }

  // Add to queue
  queue.addAudio(client, interaction.member.voice.channel.id, interaction.guild, audio);

  // Reply
  await interaction.reply({ embeds: [embeds.songAdded(audio, !youtubeUrl)] });
}

/**
 * Convert seconds into hours, minutes and seconds.
 * @param {number} e - total seconds
 * @returns {string} Seconds represented as HH:MM:SS
 */
function _secondsToTime(e) {
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
  voiceChannel: true,
  execute,
};

module.exports = handler;
