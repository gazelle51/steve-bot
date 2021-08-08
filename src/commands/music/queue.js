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

  // Display results in text channel
  message.channel.send(queueEmbed(nowPlaying, audioQueue));
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

function queueEmbed(nowPlaying, upNext) {
  const embed = baseEmbed();

  embed.addField(
    'Now playing',
    `[${nowPlaying.title}](${nowPlaying.url}) (${nowPlaying.length}), added by \`${nowPlaying.addedBy}\`\n`
  );

  const upNextData = upNext.length
    ? upNext
        .map(
          (audio, i) =>
            `${i + 1}. [${audio.title}](${audio.url}) (${audio.length}), added by \`${
              audio.addedBy
            }\``
        )
        .join('\n')
    : `No more songs in the queue`;
  embed.addField('Up next', `${upNextData}\n\n**Songs in queue:** ${upNext.length}\n`);

  return embed;
}

/**
 *
 * @param {Object[]} pages - pages of data to display
 * @param {string} authorId - ID of user who requested queue
 * @param {TextChannel} channel - Discord channel queue is to be sent to
 * @returns {Promise<void>}
 */
async function createAndSendEmbed(pages, authorId, channel) {
  /**
   * Create a queue message embed.
   * @param {Object} pageData - page data to display
   * @returns {MessageEmbed}
   */
  function createQueueEmbed(pageData) {
    return new MessageEmbed()
      .setColor('#23E5D6')
      .setTitle('✨🎵 Music Embed 🎵✨')
      .setDescription(pageData)
      .setTimestamp()
      .setFooter(`Page ${page} of ${pages.length}`);
  }

  /**
   * Backward button reaction handler.
   * Go back a page in the embed if not at the first page.
   * @param {MessageReaction} reaction
   * @param {User} user
   * @returns {void}
   */
  const backwardHandler = (reaction, user) => {
    if (page === 1) return;
    page--;
    embedMessage.edit(createQueueEmbed(pages[page - 1]));
  };

  /**
   * Forward button reaction handler.
   * Go forward a page in the embed if not at the last page.
   * @param {MessageReaction} reaction
   * @param {User} user
   * @returns {void}
   */
  const forwardHandler = (reaction, user) => {
    if (page === pages.length) return;
    page++;
    embedMessage.edit(createQueueEmbed(pages[page - 1]));
  };

  // Initialise
  let page = 1;
  const reactionTime = 120000;

  // Create and send initial embed
  const embed = createQueueEmbed(pages[0]);
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
