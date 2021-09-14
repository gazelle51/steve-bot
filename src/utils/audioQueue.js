const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { CommandInteraction, Guild } = require('discord.js');
const { VoiceConnection } = require('@discordjs/voice/dist');
const voice = require('./voice');
const ytdl = require('ytdl-core');

/**
 * Create an audio queue and player for the specified server.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 * @param {string} guildId - ID of guild to create queue for
 * @param {VoiceConnection} voiceConnection - Voice channel connection
 * @param {import('../typedefs/audio').Audio} audio - Audio to add to queue
 */
function createServerQueue(client, guildId, voiceConnection, audio) {
  // Create and subscribe to audio player
  const player = createAudioPlayer();
  voiceConnection.subscribe(player);

  // Create and set queue
  const queueConstruct = {
    audioQueue: [audio],
    player: player,
    playing: true,
    leaveInactive: null,
  };
  client.queue.set(guildId, queueConstruct);

  // Get server queue and set event handlers
  const serverQueue = client.queue.get(guildId);
  serverQueue.player
    // Error handler
    .on('error', (error) => console.error(error))
    // Current audio finished handler
    .on('stateChange', (oldState, newState) => {
      if (
        newState.status === AudioPlayerStatus.Idle &&
        oldState.status !== AudioPlayerStatus.Idle
      ) {
        serverQueue.audioQueue.shift();
        play(client, guildId, serverQueue.audioQueue[0]);
      }
    });
}

/**
 * Play the next audio in the queue.
 * Disconnect if the queue is finished.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 * @param {string} guildId - Discord guild ID
 * @param {import('../typedefs/audio').Audio} audio - Audio to play
 * @returns
 */
function play(client, guildId, audio) {
  // Get server queue
  const serverQueue = client.queue.get(guildId);

  // Check if there is audio to play
  if (!audio) {
    serverQueue.playing = false;

    // Leave after 10 minutes of inactivity
    serverQueue.leaveInactive = setTimeout(function () {
      voice.leave(guildId);
      client.queue.delete(guildId);
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
  const inlineVolume = audio.volume ? true : false;
  const audioResource = createAudioResource(url, { inlineVolume });
  if (inlineVolume) audioResource.volume.setVolume(audio.volume ? audio.volume : 1);

  // Play audio
  serverQueue.player.play(audioResource);
}

/**
 * Skip the currently playing song.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 * @param {string} guildId - ID of guild to stop queue for
 * @returns {boolean} true if successful, otherwise false
 */
function skip(client, guildId) {
  // Get server queue
  const serverQueue = client.queue.get(guildId);

  if (!serverQueue) return false;

  // Put player into idle state to trigger next item in queue
  serverQueue.player.stop();

  return true;
}

/**
 * Stop playing music and clear the queue.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 * @param {string} guildId - ID of guild to stop queue for
 * @returns {boolean} true if successful, otherwise false
 */
function stop(client, guildId) {
  // Get server queue
  const serverQueue = client.queue.get(guildId);

  if (!serverQueue) return false;

  // Clear queue and put player into idle state
  serverQueue.audioQueue = [];
  serverQueue.player.stop();

  return true;
}

/**
 * Get the current queue in a guild.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 * @param {string} guildId - ID of guild to get queue for
 * @returns {import('../typedefs/audio').Audio[]} Copy of the queue array
 */
function getQueue(client, guildId) {
  // Get server queue
  const serverQueue = client.queue.get(guildId);

  if (!serverQueue) return [];

  return [...serverQueue.audioQueue];
}

/**
 * Add audio to queue and start playing.
 * If queue is inactive, it will be resumed.
 * If a queue doesn't exist, one will be created.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 * @param {string} channelId - ID of voice channel to join
 * @param {Guild} guild - guild the voice channel belongs to
 * @param {import('../typedefs/audio').Audio} audio - Audio to add to queue
 * @returns {void}
 */
function addAudio(client, channelId, guild, audio) {
  // Get queue for the server
  const serverQueue = client.queue.get(guild.id);

  if (!serverQueue) {
    // If there is no queue, join voice channel
    const connection = voice.join(channelId, guild);

    // Create queue and start playing
    createServerQueue(client, guild.id, connection, audio);
    play(client, guild.id, audio);
  } else if (serverQueue && serverQueue.playing === false) {
    // If there is a queue that is not playing, add to it and start again
    serverQueue.audioQueue.push(audio);
    play(client, guild.id, audio);
  } else {
    // If there is a queue that is playing, add to it
    serverQueue.audioQueue.push(audio);
  }

  console.log(`${audio.title} has been added to the queue`);
}

module.exports = { play, skip, stop, getQueue, addAudio };
