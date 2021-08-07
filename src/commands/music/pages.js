const { Message, MessageEmbed } = require('discord.js');

// TODO: make arrow keys not need to be pressed twice

/**
 * Execute skip command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  // Initialise pages
  const pages = ['hello', 'this is a page', 'and another', 'hehehehe'];
  let page = 1;

  // Create embed
  const embed = createQueueEmbed(pages[0], page, pages.length);

  // Send embed
  const embedMessage = await message.channel.send(embed);

  // Initialise reactions (arrow keys)
  await Promise.all([embedMessage.react('⬅️'), embedMessage.react('➡️')]);

  // Forward and backward filters
  const backwardsFilter = (reaction, user) =>
    reaction.emoji.name === '⬅️' && user.id === message.author.id;
  const forwardsFilter = (reaction, user) =>
    reaction.emoji.name === '➡️' && user.id === message.author.id;

  // Forward and backward reaction collectors, allow 2 mins to react
  const reactionTime = 120000;
  const backwards = embedMessage.createReactionCollector(backwardsFilter, { time: reactionTime });
  const forwards = embedMessage.createReactionCollector(forwardsFilter, { time: reactionTime });

  // Handle the backwards collection
  backwards.on('collect', async (r) => {
    // Do not allow to go backwards from page 1
    if (page === 1) return;

    // Put page number back 1
    page--;

    // Update embed and send
    embedMessage.edit(createQueueEmbed(pages[page - 1], page, pages.length));
  });

  // Handle the forwards collection
  forwards.on('collect', async (r) => {
    // Do not allow to go forwards if at end
    if (page === pages.length) return;

    // Put page number forward 1
    page++;

    // Update embed and send
    embedMessage.edit(createQueueEmbed(pages[page - 1], page, pages.length));
  });
}

function createQueueEmbed(pageData, pageNum, pageTotal) {
  // Set up embed
  return new MessageEmbed()
    .setColor('#23E5D6')
    .setTitle('✨🎵 Test Embed 🎵✨')
    .setDescription(pageData)
    .setTimestamp()
    .setFooter(`Page ${pageNum} of ${pageTotal}`);
}

module.exports = {
  name: 'page',
  description: 'Preview pages',
  execute,
};
