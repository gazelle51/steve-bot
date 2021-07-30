const { Message } = require('discord.js');
const egirl = require('../../sounds/egirl');
const queue = require('../../utils/audioQueue');

/**
 * Execute egirl command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  let audio;

  // Get random e-girl line
  if (args[0] === 'stepbro') {
    audio = queue.formatAudio('egirl.whatAreYouDoingStepBro', egirl.whatAreYouDoingStepBro);
  } else {
    const egirlSounds = Object.keys(egirl);
    const randomEgirlSound = egirlSounds[Math.floor(Math.random() * egirlSounds.length)];
    audio = queue.formatAudio(`egirl.${randomEgirlSound}`, egirl[randomEgirlSound]);
  }

  // Add to queue
  queue.addAudio(client, message, audio);
}

module.exports = {
  name: 'egirl',
  description: 'Say a random e-girl line',
  guildOnly: true,
  execute,
};