const { CommandInteraction, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const embeds = require('../../utils/embeds').queue;
const yts = require('yt-search');

/**
 * Execute search command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  const song = interaction.options.getString('song');

  // Search Youtube
  const youtubeResult = await yts(song);

  // Stop if there are no search results
  if (!youtubeResult.videos.length) {
    return await interaction.reply(`I couldn't find any search results for "${song}"`);
  }

  const options = youtubeResult.videos
    .slice(0, 10)
    .map((video) => ({ label: video.title, description: video.author.name, value: video.url }));

  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('select-search')
      .setPlaceholder('Nothing selected')
      .addOptions(options)
  );

  // Reply
  await interaction.reply({
    content: "Here's the first 10 results I found on YouTube. Select the song you want to play.",
    components: [row],
  });
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
    .setName('search')
    .setDescription('Search for a song on Youtube and add it to the queue')
    .addStringOption((option) =>
      option.setName('song').setDescription('Song to search for').setRequired(true)
    ),
  guildOnly: true,
  voiceChannel: true,
  execute,
};

module.exports = handler;
