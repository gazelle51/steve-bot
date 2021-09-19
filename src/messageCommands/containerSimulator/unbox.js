const { emoji } = require('../../config.js');
const { Message } = require('discord.js');
const _ = require('lodash');
const unbox = require('../../containerSimulator/unbox').unbox;

/**
 * Execute unbox command.
 * @param {Message} message - Received message
 * @param {string[]} args - Arguments sent in message
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  // Unbox container and get response to send
  const containerName = _.camelCase(args.join(' '));
  const unboxResult = await unbox(containerName, message.author);

  // Send reply
  const reply = await message.reply({
    content: unboxResult.content,
    embeds: unboxResult.embeds,
    files: unboxResult.files,
  });

  // React, reply and pin if knife was opened
  if (unboxResult.weaponColour === 'yellow') {
    await reply.react(emoji[100]);
    await message.reply({
      content: `Nice case opening!`,
      files: ['https://media.giphy.com/media/Ls6ahtmYHU760/giphy.gif'],
    });
    try {
      await reply.pin();
    } catch (err) {
      console.error(err);
    }
  }
}

/** @type {import('../../typedefs/discord').MessageCommand}} */
const handler = {
  data: {
    name: 'unbox',
    description: 'Unbox a CS-GO container',
  },
  usage: '<container>',
  examples: ['unbox', 'unbox bravo'],
  execute,
};

module.exports = handler;
