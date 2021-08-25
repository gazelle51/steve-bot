const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { Guild, Message } = require('discord.js');
const { VoiceConnection } = require('@discordjs/voice/dist');
const embeds = require('./embeds').queue;
const voice = require('./voice');
const ytdl = require('ytdl-core');

/**
 * Create an audio queue for the specified server.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 * @param {Message} message - Received message
 * @param {VoiceConnection} voiceConnection - Voice channel connection
 * @param {import('../typedefs/audio').Audio} audio - Audio to add to queue
 */
function createServerQueue(client, message, voiceConnection, audio) {
  // Create and subscribe to audio player
  const player = createAudioPlayer();
  voiceConnection.subscribe(player);

  const queueConstruct = {
    voiceChannel: message.member.voice.channel,
    voiceConnection: voiceConnection,
    textChannel: message.channel,
    audioQueue: [audio],
    player: player,
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
      serverQueue.voiceConnection.destroy();
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

  // Get audio to play
  const url = audio.url.includes('youtube') ? ytdl(audio.url) : audio.url;
  const audioResource = createAudioResource(url, { inlineVolume: false });
  // audioResource.volume.setVolume(audio.volume ? audio.volume : 1);

  // Dispatcher
  serverQueue.player.play(audioResource);
  serverQueue.player
    .on('error', (error) => console.error(error))
    .on(AudioPlayerStatus.Idle, () => {
      serverQueue.audioQueue.shift();
      play(client, guild, serverQueue.audioQueue[0]);
    });
}

/**
 * Skip the currently playing song.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 * @param {Message} message - Discord message
 * @returns
 */
function skip(client, message) {
  if (!message.member.voice.channel)
    return message.channel.send('You have to be in a voice channel to stop the music!');

  // Get server queue
  const serverQueue = client.queue.get(message.guild.id);

  if (!serverQueue) return message.channel.send('There is no song that I could skip!');

  serverQueue.player.stop();
}

/**
 * Stop playing music and clear the queue.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 * @param {Message} message - Discord message
 * @returns
 */
function stop(client, message) {
  if (!message.member.voice.channel)
    return message.channel.send('You have to be in a voice channel to stop the music!');

  // Get server queue
  const serverQueue = client.queue.get(message.guild.id);

  if (!serverQueue) return message.channel.send('There is no song that I could stop!');

  serverQueue.audioQueue = [];
  serverQueue.player.stop();
}

/**
 * Get the current queue.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 * @param {Message} message - Discord message
 * @returns {import('../typedefs/audio').Audio[]} Copy of the queue array
 */
function getQueue(client, message) {
  // Get server queue
  const serverQueue = client.queue.get(message.guild.id);

  if (!serverQueue) return [];

  return [...serverQueue.audioQueue];
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
    play(client, message.guild, audio);
  } else {
    // If there is a queue that is playing, add to it
    serverQueue.audioQueue.push(audio);
  }

  message.channel.send({ embeds: [embeds.songAdded(audio)] });
  console.log(`${audio.title} has been added to the queue`);
}

module.exports = { createServerQueue, play, skip, stop, getQueue, addAudio };
