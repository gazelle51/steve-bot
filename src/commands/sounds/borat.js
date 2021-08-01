const { Message } = require('discord.js');
const borat = require('../../sounds/borat');
const queue = require('../../utils/audioQueue');
const sound = require('../../utils/sound');

/**
 * Execute borat command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, args, client) {
  let audio;

  // Get random Borat line
  if (args[0] === 'steve') {
    audio = queue.formatAudio('borat.peopleCallMeSteve', borat.peopleCallMeSteve);
  } else {
    const randomSound = sound.getNameOfRandomSound(borat);
    audio = queue.formatAudio(`borat.${randomSound}`, borat[randomSound]);
  }

  // Add to queue
  queue.addAudio(client, message, audio);
}

module.exports = {
  name: 'borat',
  description: 'Say a random Borat line',
  guildOnly: true,
  execute,
};
