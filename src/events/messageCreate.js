const { Collection, Message } = require('discord.js');
const { defaultCooldown, prefix } = require('../config.json');

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

  // Get command, also check aliases
  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  // Check command is defined
  if (!command) return;

  console.log(
    `Executing '${message.content}'; command: ${command.name}; args: ${args.join(
      ', '
    )}; called by ${message.author.username} (${message.author.id})`
  );

  // Check if command can only be used in a guild
  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply("I can't execute that command inside DMs!");
  }

  // Check if user has command permissions
  if (command.permissions && message.channel.type !== 'dm') {
    const authorPerms = message.channel.permissionsFor(message.author);
    if (!authorPerms || !authorPerms.has(command.permissions)) {
      return message.reply('You can not do this!');
    }
  }

  // Check if arguments are required
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  // Check cooldowns
  const { cooldowns } = client;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || defaultCooldown) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${
          command.name
        }\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // Execute the command
  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
}

/** @type {import('../typedefs/discord').Event}} */
const handler = {
  name: 'messageCreate',
  execute,
};

module.exports = handler;
