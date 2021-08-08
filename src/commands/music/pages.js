const { Message, MessageEmbed, MessageReaction, User, TextChannel } = require('discord.js');

/**
 * Execute skip command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  // Initialise pages
  const pages = ['hello', 'this is a page', 'and another', 'hehehehe'];

  await createAndSendEmbed(pages, message.author.id, message.channel);
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
      .setTitle('✨🎵 Test Embed 🎵✨')
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
  name: 'page',
  description: 'Preview pages',
  execute,
};
