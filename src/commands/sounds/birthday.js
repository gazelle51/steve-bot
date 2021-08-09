const { Message } = require('discord.js');
const birthday = require('../../sounds/birthday');
const queue = require('../../utils/audioQueue');
const sound = require('../../utils/sound');

/**
 * Execute birthday command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  let audio;

  // Get random birthday line
  if (args[0] === 'song' || args[0] === 'music') {
    audio = birthday.music;
  } else if (args[0] === 'boy') {
    audio = birthday.bdayBoy;
  } else {
    const randomSound = sound.getNameOfRandomSound(birthday);
    audio = birthday[randomSound];
  }

  // Add to queue
  queue.addAudio(client, message, { ...audio, addedBy: message.author.tag });
}

/** @type {import('../../typedefs/discord').Command}} */
const handler = {
  name: 'birthday',
  description: 'Say Happy Birthday!',
  guildOnly: true,
  aliases: ['bday'],
  execute,
};

module.exports = handler;
