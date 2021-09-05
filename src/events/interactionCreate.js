/**
 * Execute when the interactionCreate event fires.
 * @param {import("../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);

  if (interaction.isCommand()) {
    const { commandName } = interaction;

    const command = client.commands.get(commandName);
    if (!command) return;

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
