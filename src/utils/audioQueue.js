const { Guild, Message, VoiceConnection } = require('discord.js');
const voice = require('./voice');

/**
 * Create an audio queue for the specified server.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 * @param {Message} message - Received message
 * @param {VoiceConnection} voiceConnection - Voice channel connection
 * @param {import('../typedefs/audio').Audio} audio - Audio to add to queue
 */
function createServerQueue(client, message, voiceConnection, audio) {
  const queueConstruct = {
    voiceChannel: message.member.voice.channel,
    voiceConnection: voiceConnection,
    textChannel: message.channel,
    audioQueue: [audio],
    playing: true,
    leaveInactive: null,
  };
  client.queue.set(message.guild.id, queueConstruct);
}

/**
 * Play the next audio in the queue.
 * Disconnect if the queue is finished.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 * @param {Guild} guild - Discord guild
 * @param {import('../typedefs/audio').Audio} audio - Audio to play
 * @returns
 */
function play(client, guild, audio) {
  // Get server queue
  const serverQueue = client.queue.get(guild.id);

  // Check if there is audio to play
  if (!audio) {
    serverQueue.playing = false;

    // Leave after 10 minutes of inactivity
    serverQueue.leaveInactive = setTimeout(function () {
      serverQueue.voiceChannel.leave();
      client.queue.delete(guild.id);
    }, 10 * 60 * 1000);

    return;
  }

  // Clear inactivity timer
  serverQueue.playing = true;
  try {
    clearTimeout(serverQueue.leaveInactive);
  } catch (e) {
    console.log('Could not clear inactivity timeout');
  }

  // Dispatcher
  serverQueue.voiceConnection
    .play(audio.url)
    .on('finish', () => {
      serverQueue.audioQueue.shift();
      play(client, guild, serverQueue.audioQueue[0]);
    })
    .on('error', (error) => console.error(error));
}

/**
 * Add audio to queue and start playing.
 * If queue is inactive, it will be resumed.
 * If a queue doesn't exist, one will be created.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 * @param {Message} message - Received message
 * @param {import('../typedefs/audio').Audio} audio - Audio to add to queue
 * @returns
 */
async function addAudio(client, message, audio) {
  // Get queue for the server
  const serverQueue = client.queue.get(message.guild.id);

  if (!serverQueue) {
    // If there is no queue, join voice channel
    const connection = await voice.join(message);

    // Check connection was successful before continuing
    if (!connection) return;

    // Create queue and start playing
    createServerQueue(client, message, connection, audio);
    play(client, message.guild, audio);
  } else if (serverQueue && serverQueue.playing === false) {
    // If there is a queue that is not playing, add to it and start again
    serverQueue.audioQueue.push(audio);
    console.log(`${audio.title} has been added to the queue`);
    play(client, message.guild, audio);
  } else {
    // If there is a queue that is playing, add to it
    serverQueue.audioQueue.push(audio);
    console.log(`${audio.title} has been added to the queue`);
  }
}

/**
 * Format an audio object.
 * @param {string} title - Audio title
 * @param {string} url - Audio URL
 * @returns {import('../typedefs/audio').Audio}
 */
function formatAudio(title, url) {
  return { title: title, url: url };
}

module.exports = { createServerQueue, play, addAudio, formatAudio };
