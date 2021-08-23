const { Message } = require('discord.js');
const { defaultCooldown, prefix } = require('../../config.js');

/**
 * Execute help command.
 * @param {Message} message - Received message
 * @param {string[]} args
 * @param {import('../../typedefs/discord').DiscordClient} client - Discord client
 */
function execute(message, args, client) {
  const data = [];
  const commands = client.commands;

  // Check if generic help was requested
  if (!args.length) {
    data.push("Here's a list of all my commands:");
    data.push(commands.map((command) => command.name).join(', '));
    data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command.`);

    return message.author
      .send(data.join('\n'))
      .then(() => {
        if (message.channel.type === 'DM') return;
        message.reply("I've sent you a DM with all my commands.");
      })
      .catch((error) => {
        console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
        message.reply("It seems like I can't DM you! Do you have DMs disabled?");
      });
  }

  // Get command details
  const name = args[0].toLowerCase();
  const command = commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name));

  if (!command) {
    return message.reply("That's not a valid command!");
  }

  data.push(`**Name:** ${command.name}`);

  if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
  if (command.description) data.push(`**Description:** ${command.description}`);
  if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

  data.push(`**Cooldown:** ${command.cooldown || defaultCooldown} second(s)`);

  message.channel.send(data.join('\n'));
}

/** @type {import('../../typedefs/discord').Command}} */
const handler = {
  name: 'help',
  description: 'List all commands or info about a specific command',
  usage: '<command name>',
  aliases: ['commands'],
  execute,
};

module.exports = handler;
