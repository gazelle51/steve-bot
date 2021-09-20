const { updateCommandCooldown } = require('../utils/cooldown.js');
const { CommandInteraction, SelectMenuInteraction } = require('discord.js');

/**
 * Execute when the interactionCreate event fires.
 * @param {CommandInteraction|SelectMenuInteraction} interaction - Received interaction
 * @param {import("../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  if (interaction.channel.type === 'DM')
    console.log(
      `${interaction.user.username} (${interaction.user.id}) triggered '${interaction.type}' interaction in a DM`
    );
  else
    console.log(
      `${interaction.user.username} (${interaction.user.id}) triggered '${interaction.type}' interaction in #${interaction.channel.name}`
    );

  // Do nothing if a blocked user tried to interact with bot
  if (JSON.parse(process.env.BLOCKED_USERS).includes(interaction.user.id)) {
    console.log(`${interaction.user.username} (${interaction.user.id}) is blocked`);
    return await interaction.reply({ content: 'You are not allowed to do that', ephemeral: true });
  }

  // Command
  if (interaction.isCommand()) {
    // Get command
    const { commandName } = interaction;
    const command = client.slashCommands.get(commandName);

    // Check command exists
    if (!command) {
      return await interaction.reply({ content: "That command doesn't exist", ephemeral: true });
    }

    // Log command
    const options =
      ' ' + interaction.options.data.map((opt) => `${opt.name}:${opt.value}`).join(', ');
    console.log(
      `Executing '/${commandName}${options}'; called by ${interaction.user.username} (${interaction.user.id})`
    );

    // Check guild only flag
    if (command.guildOnly && interaction.channel.type === 'DM') {
      return await interaction.reply("I can't execute that command inside DMs");
    }

    // Check voice channel flag
    if (command.voiceChannel && !interaction.member.voice.channel) {
      return await interaction.reply({
        content: 'You need to join a voice channel to use that command',
        ephemeral: true,
      });
    }

    // Check cooldowns
    const cdTime = updateCommandCooldown(
      commandName,
      command.cooldown,
      interaction.user.id,
      client.cooldowns
    );
    if (cdTime)
      return await interaction.reply({
        content: `Please wait ${cdTime.toFixed(1)} more second(s) before using this command`,
        ephemeral: true,
      });

    // Execute command
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command',
        ephemeral: true,
      });
    }
  }

  // Select menu
  else if (interaction.isSelectMenu()) {
    // Get select menu
    const selectMenu = interaction.customId;
    const selectMenuHandler = client.selectMenus.get(selectMenu);

    // Check select menu handler exists
    if (!selectMenuHandler) {
      return await interaction.reply({
        content: "I don't know what to do with this dropdown",
        ephemeral: true,
      });
    }

    // Log select menu
    console.log(
      `Executing select menu '${selectMenu} values: ${interaction.values}'; called by ${interaction.user.username} (${interaction.user.id})`
    );

    // Execute select menu handler
    try {
      await selectMenuHandler.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while processing this dropdown',
        ephemeral: true,
      });
    }
  }
}

/** @type {import('../typedefs/discord').Event}} */
const handler = {
  name: 'interactionCreate',
  execute,
};

module.exports = handler;
