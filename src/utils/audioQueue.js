const voice = require('./voice');

/**
 * Create an audio queue for the specified server.
 * @param {Object} client - Discord client
 * @param {Object} message - Received message
 * @param {Object} voiceConnection - Voice channel connection
 * @param {{title: string, url: string}} audio - Audio to add to queue
 */
function createServerQueue(client, message, voiceConnection, audio) {
  const queueConstruct = {
    voiceChannel: message.member.voice.channel,
    voiceConnection: voiceConnection,
    textChannel: message.channel,
    audioQueue: [audio],
    playing: true,
  };
  client.queue.set(message.guild.id, queueConstruct);
}

/**
 * Play the next audio in the queue.
 * Disconnect if the queue is finished.
 * @param {Object} client - Discord client
 * @param {Object} guild - Discord guild
 * @param {{title: string, url: string}} audio - Audio to play
 * @returns
 */
function play(client, guild, audio) {
  // Get server queue
  const serverQueue = client.queue.get(guild.id);

  // Check if there is audio to play
  if (!audio) {
    serverQueue.voiceChannel.leave();
    client.queue.delete(guild.id);
    return;
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
 * If a queue doesn't exist, one will be created.
 * @param {Object} client - Discord client
 * @param {Object} message - Received message
 * @param {{title: string, url: string}} audio - Audio to add to queue
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
  } else {
    // If there is a queue, add to it
    serverQueue.audioQueue.push(audio);
    console.log(`${audio.title} has been added to the queue`);
  }
}

module.exports = { createServerQueue, play, addAudio };
