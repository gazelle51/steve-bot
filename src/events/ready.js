/**
 * Execute when the ready event fires.
 * @param {import("../typedefs/discord").DiscordClient} client - Discord client
 */
async function execute(client) {
  if (client.user === null) {
    console.log('A user is not logged in yet');
  } else console.log(`Logged in as ${client.user.tag}!`);
}

/** @type {import('../typedefs/discord').Event}} */
const handler = {
  name: 'ready',
  once: true,
  execute,
};

module.exports = handler;
