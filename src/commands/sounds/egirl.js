const { Message } = require('discord.js');
const egirl = require('../../sounds/egirl');
const queue = require('../../utils/audioQueue');
const sound = require('../../utils/sound');

/**
 * Execute egirl command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  let audio;

  // Get random E-Girl line
  if (args[0] === 'stepbro') {
    audio = queue.formatAudio('egirl.whatAreYouDoingStepBro', egirl.whatAreYouDoingStepBro);
  } else {
    const randomSound = sound.getNameOfRandomSound(egirl);
    audio = queue.formatAudio(`egirl.${randomSound}`, egirl[randomSound]);
  }

  // Add to queue
  queue.addAudio(client, message, audio);
}

module.exports = {
  name: 'egirl',
  description: 'Say a random E-Girl line',
  guildOnly: true,
  execute,
};
