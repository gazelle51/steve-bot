/**
 * Execute when the _template event fires.
 * @param {import("../typedefs/discord").DiscordClient} client - Discord client
 */
function execute(client) {}

/** @type {import('../typedefs/discord').Event}} */
const handler = {
  name: '',
  once: false,
  execute,
};

module.exports = handler;
