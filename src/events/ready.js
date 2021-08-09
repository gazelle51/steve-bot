/**
 * Execute when the ready event fires.
 * @param {import("../typedefs/discord").DiscordClient} client - Discord client
 */
function execute(client) {
  console.log(`Logged in as ${client.user.tag}!`);
}

/** @type {import('../typedefs/discord').Event}} */
const handler = {
  name: 'ready',
  once: true,
  execute,
};

module.exports = handler;
