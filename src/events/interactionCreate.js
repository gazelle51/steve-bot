/**
 * Execute when the _template event fires.
 * @param {import("../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(interaction, client) {
  console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);

  if (interaction.isCommand()) {
    const { commandName } = interaction;

    if (commandName === 'ping') {
      await interaction.reply('Pong!');
    } else if (commandName === 'beep') {
      await interaction.reply('Boop!');
    }
  }
}

/** @type {import('../typedefs/discord').Event}} */
const handler = {
  name: 'interactionCreate',
  execute,
};

module.exports = handler;
