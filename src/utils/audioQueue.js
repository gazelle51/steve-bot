const {
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  getVoiceConnection,
} = require('@discordjs/voice');
const { CommandInteraction } = require('discord.js');
const { VoiceConnection } = require('@discordjs/voice/dist');
const embeds = require('./embeds').queue;
const voice = require('./voice');
const ytdl = require('ytdl-core');

/**
 * Create an audio queue and player for the specified server.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 * @param {CommandInteraction} interaction - Received interaction
 * @param {VoiceConnection} voiceConnection - Voice channel connection
 * @param {import('../typedefs/audio').Audio} audio - Audio to add to queue
 */
function createServerQueue(client, interaction, voiceConnection, audio) {
  // Create and subscribe to audio player
  const player = createAudioPlayer();
  voiceConnection.subscribe(player);

  // Create queue
  const queueConstruct = {
    audioQueue: [audio],
    player: player,
    playing: true,
    leaveInactive: null,
  };
  client.queue.set(interaction.guild.id, queueConstruct);

  // Get server queue and set event handlers
  const serverQueue = client.queue.get(interaction.guild.id);
  serverQueue.player
    .on('error', (error) => console.error(error))
    .on('stateChange', (oldState, newState) => {
      if (
        newState.status === AudioPlayerStatus.Idle &&
        oldState.status !== AudioPlayerStatus.Idle
      ) {
        // If the Idle state is entered from a non-Idle state, it means that an audio resource has finished playing.
        serverQueue.audioQueue.shift();
        play(client, interaction.guild.id, serverQueue.audioQueue[0]);
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
      getVoiceConnection(guildId).destroy();
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
 * @param {CommandInteraction} interaction - Received interaction
 * @returns
 */
async function skip(client, interaction) {
  if (!interaction.member.voice.channel)
    return await interaction.reply('You have to be in a voice channel to stop the music!');

  // Get server queue
  const serverQueue = client.queue.get(interaction.guild.id);

  if (!serverQueue) return await interaction.reply('There is no song that I could skip!');

  // Put player into idle state to trigger next item in queue
  serverQueue.player.stop();
}

/**
 * Stop playing music and clear the queue.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 * @param {CommandInteraction} interaction - Received interaction
 * @returns
 */
async function stop(client, interaction) {
  if (!interaction.member.voice.channel)
    return await interaction.reply('You have to be in a voice channel to stop the music!');

  // Get server queue
  const serverQueue = client.queue.get(interaction.guild.id);

  if (!serverQueue) return await interaction.reply('There is no song that I could stop!');

  // Clear queue and put player into idle state
  serverQueue.audioQueue = [];
  serverQueue.player.stop();
}

/**
 * Get the current queue.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 * @param {CommandInteraction} interaction - Received interaction
 * @returns {import('../typedefs/audio').Audio[]} Copy of the queue array
 */
function getQueue(client, interaction) {
  // Get server queue
  const serverQueue = client.queue.get(interaction.guild.id);

  if (!serverQueue) return [];

  return [...serverQueue.audioQueue];
}

/**
 * Add audio to queue and start playing.
 * If queue is inactive, it will be resumed.
 * If a queue doesn't exist, one will be created.
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import('../typedefs/audio').Audio} audio - Audio to add to queue
 * @returns
 */
async function addAudio(client, interaction, audio) {
  // Get queue for the server
  const serverQueue = client.queue.get(interaction.guild.id);

  if (!serverQueue) {
    // If there is no queue, join voice channel
    const connection = await voice.join(interaction);

    // Check connection was successful before continuing
    if (!connection) return;

    // Create queue and start playing
    createServerQueue(client, interaction, connection, audio);
    play(client, interaction.guild.id, audio);
  } else if (serverQueue && serverQueue.playing === false) {
    // If there is a queue that is not playing, add to it and start again
    serverQueue.audioQueue.push(audio);
    play(client, interaction.guild.id, audio);
  } else {
    // If there is a queue that is playing, add to it
    serverQueue.audioQueue.push(audio);
  }

  interaction.reply({ embeds: [embeds.songAdded(audio)] });
  console.log(`${audio.title} has been added to the queue`);
}

module.exports = { play, skip, stop, getQueue, addAudio };
