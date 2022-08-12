const { SelectMenuInteraction } = require('discord.js');
const { secondsToHMS } = require('../../utils/timestamps');
const embeds = require('../../utils/embeds').queue;
const queue = require('../../utils/audioQueue');
const ytdl = require('ytdl-core');

/**
 * Execute search select menu.
 * @param {SelectMenuInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  const youtubeUrl = interaction.values[0];

  // Song details from Youtube
  const songDetails = await ytdl.getBasicInfo(youtubeUrl);
  const audio = {
    title: songDetails.videoDetails.title,
    url: songDetails.videoDetails.video_url,
    length: secondsToHMS(+songDetails.videoDetails.lengthSeconds),
    addedBy: interaction.user.tag,
  };

  // Add to queue
  queue.addAudio(client, interaction.member?.voice.channel.id, interaction.guild, audio);

  // Reply
  await interaction.update({
    embeds: [embeds.songAdded(audio)],
    components: [],
  });
}

/** @type {import('../../typedefs/discord').SelectMenuHandler}} */
const handler = {
  name: 'search',
  description: 'Add search result to audio queue',
  execute,
};

module.exports = handler;
