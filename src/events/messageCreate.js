const { prefix } = require('../config.js');
const { updateCommandCooldown } = require('../utils/cooldown.js');
const { Message } = require('discord.js');

/**
 * Execute when the message event fires.
 * @param {Message} message - Received message
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 */
async function execute(message, client) {
  // Do nothing if the message does not start with prefix or was from a bot
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Do nothing if a blocked user tried to interact with bot
  if (JSON.parse(process.env.BLOCKED_USERS).includes(message.author.id)) {
    console.log(
      `${message.author.username} (${message.author.id}) tried to execute '${message.content}' but is blocked`
    );
    return;
  }

  // Extract command and arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Get command
  const command = client.messageCommands.get(commandName);

  // Check command exists
  if (!command) return;

  // Log command
  console.log(
    `Executing '${message.content}'; called by ${message.author.username} (${message.author.id})`
  );

  // Check guild only flag
  if (command.guildOnly && message.channel.type === 'DM') {
    return message.reply("I can't execute that command inside DMs");
  }

  // Check voice channel flag
  if (command.voiceChannel && !message.member.voice.channel) {
    return await message.reply('You need to join a voice channel to use that command');
  }

  // Check cooldowns
  const cdTime = updateCommandCooldown(
    commandName,
    command.cooldown,
    message.author.id,
    client.cooldowns
  );
  if (cdTime)
    return await message.reply(
      `Please wait ${cdTime.toFixed(1)} more second(s) before using this command`
    );

  // Execute command
  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    await message.reply('There was an error while executing this command');
  }
}

/** @type {import('../typedefs/discord').Event}} */
const handler = {
  name: 'messageCreate',
  execute,
};

module.exports = handler;
