/**
 * Execute server command.
 * @param {Object} message - Received message
 * @param {string[]} args
 */
function execute(message, args) {
  // Send server details
  message.channel.send(
    `Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nCreated on: ${message.guild.createdAt}\nRegion: ${message.guild.region}`
  );
}

module.exports = {
  name: 'server',
  description: 'Get server details',
  guildOnly: true,
  execute,
};
