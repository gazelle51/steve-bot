const _ = require('lodash');
const { Message, MessageEmbed, MessageReaction, User, TextChannel } = require('discord.js');
const queue = require('../../utils/audioQueue');

// TODO no arrows if only 1 page

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

function emptyQueueEmbed() {
  const embed = baseEmbed();
  embed.addField(
    "There's nothing here",
    '​No music is being played 😭! Add some music to the queue using the `play` command.​'
  );
  return embed;
}

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
 *
 * @param {Object[]} pages - pages of data to display
 * @param {string} authorId - ID of user who requested queue
 * @param {TextChannel} channel - Discord channel queue is to be sent to
 * @returns {Promise<void>}
 */
async function createAndSendEmbed(nowPlaying, audioQueue, authorId, channel) {
  /**
   * Create a queue message embed.
   * @param {Object} pageData - page data to display
   * @returns {MessageEmbed}
   */
  function createQueueEmbed(pageData) {
    const embed = baseEmbed();

    embed.addField(
      'Now playing',
      `[${nowPlaying.title}](${nowPlaying.url}) (${nowPlaying.length}), added by \`${nowPlaying.addedBy}\`\n`
    );

    const upNextData = pageData
      .map(
        (audio, i) =>
          `${page * itemsPerPage + i + 1}. [${audio.title}](${audio.url}) (${
            audio.length
          }), added by \`${audio.addedBy}\``
      )
      .join('\n');
    embed.addField('Up next', `${upNextData}\n\n**Songs in queue:** ${upNext.length}\n`);

    embed.setFooter(`Page ${page + 1} of ${audioQueue.length}`);

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
    embedMessage.edit(createQueueEmbed(upNext[page]));
  };

  /**
   * Forward button reaction handler.
   * Go forward a page in the embed if not at the last page.
   * @param {MessageReaction} reaction
   * @param {User} user
   * @returns {void}
   */
  const forwardHandler = (reaction, user) => {
    if (page === upNext.length - 1) return;
    page++;
    embedMessage.edit(createQueueEmbed(upNext[page]));
  };

  // If no more songs in queue, send a simple embed only
  if (!audioQueue.length) {
    channel.send(nowPlayingOnlyEmbed(nowPlaying));
    return;
  }

  // Initialise
  let page = 0;
  const itemsPerPage = 5;
  const upNext = _.chunk(audioQueue, itemsPerPage);
  const reactionTime = 120000;

  // Create and send initial embed
  const embed = createQueueEmbed(upNext[0]);
  const embedMessage = await channel.send(embed);
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

module.exports = {
  name: 'queue',
  description: 'View of queue and currently playing audio',
  guildOnly: true,
  execute,
};
