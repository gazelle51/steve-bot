/**
 * Execute when the ready event fires.
 * @param {import("../typedefs/discord").DiscordClient} client - Discord client
 */
function execute(client) {
  console.log(`Logged in as ${client.user.tag}!`);
}

module.exports = {
  name: 'ready',
  once: true,
  execute,
};
