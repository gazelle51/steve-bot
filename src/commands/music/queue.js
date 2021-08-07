const { Message, MessageEmbed } = require('discord.js');
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

  // Create embed
  const queueEmbed = createQueueEmbed();

  // Check if the queue is empty
  if (!audioQueue.length) {
    queueEmbed.addField(
      "There's nothing here",
      '​No music is being played 😭! Add some music to the queue using the `play` command.​'
    );
    return message.channel.send(queueEmbed);
  }

  // Get audio now playing
  const nowPlaying = audioQueue.shift();

  // Add now playing to the embed
  queueEmbed.addField(
    'Now playing',
    `${nowPlaying.title} (${nowPlaying.length}), added by \`${nowPlaying.addedBy}\`\n`
  );

  // Add up next to the embed
  const upNext = audioQueue.length
    ? audioQueue
        .map(
          (audio, i) =>
            `${i + 1}. [${audio.title}](${audio.url}) (${audio.length}), added by \`${
              audio.addedBy
            }\``
        )
        .join('\n')
    : `No more songs in the queue`;
  queueEmbed.addField('Up next', `${upNext}\n\n**Songs in queue:** ${audioQueue.length}\n`);

  // Display results in text channel
  message.channel.send(queueEmbed);
}

function createQueueEmbed() {
  // Set up embed
  return new MessageEmbed()
    .setColor('#23E5D6')
    .setTitle('✨🎵 Music Queue 🎵✨')
    .setTimestamp()
    .setFooter('Page 1/1');
}

module.exports = {
  name: 'queue',
  description: 'View of queue and currently playing audio',
  guildOnly: true,
  execute,
};
