const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const egirl = require('../../sounds/egirl');
const embeds = require('../../utils/embeds').queue;
const queue = require('../../utils/audioQueue');
const sound = require('../../utils/sound');

/**
 * Execute e-girl command.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  let audio;

  const soundArg = interaction.options.getString('sound');

  // Get random E-Girl line
  if (soundArg === 'stepbro') {
    audio = egirl.whatAreYouDoingStepBro;
  } else {
    const randomSound = sound.getNameOfRandomSound(egirl);
    audio = egirl[randomSound];
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
    .setName('egirl')
    .setDescription('Say a random e-Girl line')
    .addStringOption((option) =>
      option
        .setName('sound')
        .setDescription('Sound to play')
        .addChoices({ name: 'Step-bro', value: 'stepbro' })
    ),
  guildOnly: true,
  voiceChannel: true,
  execute,
};

module.exports = handler;
