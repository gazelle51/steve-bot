const { defaultCooldown } = require('../config.js');
const { updateCommandCooldown } = require('../utils/cooldown.js');
const { Collection, CommandInteraction } = require('discord.js');

/**
 * Execute when the interactionCreate event fires.
 * @param {CommandInteraction} interaction - Received interaction
 * @param {import("../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
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
    const command = client.commands.get(commandName);

    // Check command exists
    if (!command) {
      await interaction.reply({ content: "That command doesn't exist", ephemeral: true });
      return;
    }

    // Log command
    const options = interaction.options.data.map((opt) => `${opt.name}:${opt.value}`).join(', ');
    console.log(
      `Executing \`/${interaction.commandName} ${options}\`; called by ${interaction.user.username} (${interaction.user.id})`
    );

    // Check cooldowns
    const cdTime = updateCommandCooldown(
      commandName,
      command.cooldown,
      interaction.user.id,
      client.cooldowns
    );
    if (cdTime)
      return await interaction.reply({
        content: `Please wait ${cdTime.toFixed(1)} more second(s) before using this command.`,
        ephemeral: true,
      });

    // Execute command
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
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
