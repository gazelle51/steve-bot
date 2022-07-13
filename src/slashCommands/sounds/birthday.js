const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const birthday = require('../../sounds/birthday');
const embeds = require('../../utils/embeds').queue;
const queue = require('../../utils/audioQueue');
const sound = require('../../utils/sound');

/**
 * Execute birthday command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  let audio;

  const soundArg = interaction.options.getString('sound');

  // Get random birthday line
  if (soundArg === 'song') {
    audio = birthday.music;
  } else if (soundArg === 'boy') {
    audio = birthday.bdayBoy;
  } else {
    const randomSound = sound.getNameOfRandomSound(birthday);
    audio = birthday[randomSound];
  }

  // Add to queue
  audio = { ...audio, addedBy: interaction.user.tag };
  queue.addAudio(client, interaction.member.voice.channel.id, interaction.guild, audio);

  // Reply
  await interaction.reply({ embeds: [embeds.songAdded(audio)] });
}

/** @type {import('../../typedefs/discord').SlashCommand}} */
const handler = {
  data: new SlashCommandBuilder()
    .setName('birthday')
    .setDescription('Say Happy Birthday!')
    .addStringOption((option) =>
      option
        .setName('sound')
        .setDescription('Sound to play')
        .addChoices(
          { name: 'Birthday song', value: 'song' },
          { name: 'Birthday boy', value: 'boy' }
        )
    ),
  guildOnly: true,
  voiceChannel: true,
  execute,
};

module.exports = handler;
