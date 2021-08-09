const _ = require('lodash');
const { Message, MessageEmbed, MessageReaction, User, TextChannel } = require('discord.js');
const queue = require('../../utils/audioQueue');

/**
 * Execute skip command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  // Check user is in a voice channel
  if (!message.member.voice.channel)
    return message.channel.send('You have to be in a voice channel to see the music!');

  // Get queue
  const audioQueue = queue.getQueue(client, message);

  // Check if the queue is empty
  if (!audioQueue.length) {
    return message.channel.send(emptyQueueEmbed());
  }

  // Get audio now playing
  const nowPlaying = audioQueue.shift();

  createAndSendEmbed(nowPlaying, audioQueue, message.author.id, message.channel);
}

function baseEmbed() {
  return new MessageEmbed().setColor('#23E5D6').setTitle('✨🎵 Music Queue 🎵✨');
}

/**
 * Create an embed containing details of an empty queue.
 * @returns {MessageEmbed}
 */
function emptyQueueEmbed() {
  const embed = baseEmbed();
  embed.addField(
    "There's nothing here",
    '​No music is being played 😭! Add some music to the queue using the `play` command.​'
  );
  return embed;
}

/**
 * Create an embed containing details of the current queue when there is a song
 * playing and no more songs in the queue.
 * @param {import('../../typedefs/audio').Audio} nowPlaying - Audio now playing
 * @returns {MessageEmbed}
 */
function nowPlayingOnlyEmbed(nowPlaying) {
  const embed = baseEmbed();
  embed.addField(
    'Now playing',
    `[${nowPlaying.title}](${nowPlaying.url}) (${nowPlaying.length}), added by \`${nowPlaying.addedBy}\`\n`
  );
  embed.addField('Up next', `No more songs in the queue`);
  return embed;
}

/**
 * Create and send an embed containing details of the current queue.
 * Embed may use multiple pages.
 * @param {import('../../typedefs/audio').Audio} nowPlaying - Audio now playing
 * @param {import('../../typedefs/audio').Audio[]} audioQueue - Audio in queue
 * @param {string} authorId - ID of user who requested queue
 * @param {TextChannel} channel - Discord channel queue is to be sent to
 * @returns {Promise<void>}
 */
async function createAndSendEmbed(nowPlaying, audioQueue, authorId, channel) {
  /**
   * Create a queue message embed.
   * @param {import('../../typedefs/audio').Audio[]} pageData - page data to display (up next)
   * @returns {MessageEmbed}
   */
  function createQueueEmbed(pageData) {
    const embed = baseEmbed();

    // Format data for up next
    const upNextData = pageData.map((audio, i) => {
      const itemNum = page * itemsPerPage + i + 1;
      return `${itemNum}. [${audio.title}](${audio.url}) (${audio.length}), added by \`${audio.addedBy}\``;
    });

    // Set description (limit 4096 chars, title is 19 chars, 10 songs is approx 1678 chars, footer is 17 chars)
    const description =
      '**Now playing**\n' +
      `[${nowPlaying.title}](${nowPlaying.url}) (${nowPlaying.length}), added by \`${nowPlaying.addedBy}\`\n\n` +
      '**Up next**\n' +
      upNextData.join('\n') +
      `\n\n**Songs in queue:** ${audioQueue.length}`;
    embed.setDescription(description);

    // Set description
    embed.setFooter(`Page ${page + 1} of ${pages.length}`);

    return embed;
  }

  /**
   * Backward button reaction handler.
   * Go back a page in the embed if not at the first page.
   * @param {MessageReaction} reaction
   * @param {User} user
   * @returns {void}
   */
  const backwardHandler = (reaction, user) => {
    if (page === 0) return;
    page--;
    embedMessage.edit(createQueueEmbed(pages[page]));
  };

  /**
   * Forward button reaction handler.
   * Go forward a page in the embed if not at the last page.
   * @param {MessageReaction} reaction
   * @param {User} user
   * @returns {void}
   */
  const forwardHandler = (reaction, user) => {
    if (page === pages.length - 1) return;
    page++;
    embedMessage.edit(createQueueEmbed(pages[page]));
  };

  // If no more songs in queue, send a simple embed only
  if (!audioQueue.length) {
    channel.send(nowPlayingOnlyEmbed(nowPlaying));
    return;
  }

  // Initialise
  let page = 0;
  const itemsPerPage = 10;
  const pages = _.chunk(audioQueue, itemsPerPage);
  const reactionTime = 120000;

  // Create and send initial embed
  const embed = createQueueEmbed(pages[0]);
  const embedMessage = await channel.send(embed);

  // If there is only 1 page do not set up buttons
  if (pages.length === 1) return;
  await Promise.all([embedMessage.react('⬅️'), embedMessage.react('➡️')]);

  // Reaction filters
  const backwardFilter = (reaction, user) => reaction.emoji.name === '⬅️' && user.id === authorId;
  const forwardFilter = (reaction, user) => reaction.emoji.name === '➡️' && user.id === authorId;

  // Reaction collectors
  const backwards = embedMessage.createReactionCollector(backwardFilter, {
    time: reactionTime,
    dispose: true,
  });
  const forwards = embedMessage.createReactionCollector(forwardFilter, {
    time: reactionTime,
    dispose: true,
  });

  // Reaction events
  backwards.on('collect', backwardHandler);
  backwards.on('remove', backwardHandler);
  forwards.on('collect', forwardHandler);
  forwards.on('remove', forwardHandler);
}

/** @type {import('../../typedefs/discord').Command}} */
module.exports = {
  name: 'queue',
  description: 'View of queue and currently playing audio',
  guildOnly: true,
  execute,
};
