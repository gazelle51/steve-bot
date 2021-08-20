/**
 * Execute when the _template event fires.
 * @param {import("../typedefs/discord").DiscordClient} client - Discord client
 */
function execute(interaction, client) {
  console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
  interaction.channel.send(
    `${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`
  );
}

/** @type {import('../typedefs/discord').Event}} */
const handler = {
  name: 'interactionCreate',
  execute,
};

module.exports = handler;
