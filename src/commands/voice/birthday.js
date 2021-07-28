const { Message } = require('discord.js');
const birthday = require('../../sounds/birthday');
const queue = require('../../utils/audioQueue');

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
    audio = queue.formatAudio('birthday.music', birthday.music);
  } else if (args[0] === 'boy') {
    audio = queue.formatAudio('birthday.bdayBoy', birthday.bdayBoy);
  } else {
    const bdaySounds = Object.keys(birthday);
    const randomBdaySound = bdaySounds[Math.floor(Math.random() * bdaySounds.length)];
    audio = queue.formatAudio(`birthday.${randomBdaySound}`, birthday[randomBdaySound]);
  }

  // Add to queue
  queue.addAudio(client, message, audio);
}

module.exports = {
  name: 'birthday',
  description: 'Say Happy Birthday!',
  guildOnly: true,
  aliases: ['bday'],
  execute,
};
