const { Message } = require('discord.js');
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
  if (!audioQueue.length) return message.channel.send('The queue is empty!');

  // Get audio now playing
  const nowPlaying = audioQueue.shift();

  // Format string to send
  let displayString = `**Now playing:** ${nowPlaying.title} (${nowPlaying.length}), added by ${nowPlaying.addedBy}\n\n**Up next:**\n`;
  for (const [i, audio] of audioQueue.entries()) {
    displayString = displayString.concat(
      `${i}. ${audio.title} (${audio.length}), added by ${audio.addedBy}\n`
    );
  }

  // Display results in text channel
  message.channel.send(displayString);
}

module.exports = {
  name: 'queue',
  description: 'View of queue and currently playing audio',
  guildOnly: true,
  execute,
};
