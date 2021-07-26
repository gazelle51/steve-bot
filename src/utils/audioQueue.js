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

module.exports = { createServerQueue, play };
