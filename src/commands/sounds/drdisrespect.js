const { Message } = require('discord.js');
const drdisrespect = require('../../sounds/drdisrespect');
const queue = require('../../utils/audioQueue');
const sound = require('../../utils/sound');

/**
 * Execute drdisrespect command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  // Get random Dr DisRespect line
  const randomSound = sound.getNameOfRandomSound(drdisrespect);

  // Add to queue
  queue.addAudio(client, message, { ...drdisrespect[randomSound], addedBy: message.author.tag });
}

/** @type {import('../../typedefs/discord').Command}} */
module.exports = {
  name: 'drdisrespect',
  description: 'Say a random Dr DisRespect line',
  guildOnly: true,
  aliases: ['disrespect'],
  execute,
};
