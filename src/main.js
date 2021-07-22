require('dotenv').config();

/**
 * Discord client doco: https://discord.js.org/#/docs/main/stable/class/Client
 *
 * If want to want presence changes need to use `new Discord.Client({ ws: { intents: ['GUILD_PRESENCES'] } });`.
 * Also need to check that permission is enabled for bot in developer portal.
 */

const borat = require('./borat');
const voice = require('./voice');
const { prefix } = require('./config.json');
const { Client } = require('discord.js');

// Create Discord client
const client = new Client();

/**
 * Emitted when the client becomes ready to start working.
 */
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

/**
 * Emitted whenever a message is created.
 */
client.on('message', async (message) => {
  // Do nothing if the message does not start with prefix or was from a bot
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Extract command and arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Ping
  if (message.content === `${prefix}ping`) {
    message.channel.send('pong');
  }

  // Join voice channel
  else if (message.content === `${prefix}join` || message.content === 'hi steve') {
    const connection = await voice.join(message);

    if (!connection) return;

    connection.play(borat.helloNiceToMeetYou);
  }

  // Get server details
  else if (message.content === `${prefix}server`) {
    if (!message.guild) return;
    message.channel.send(
      `Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nCreated on: ${message.guild.createdAt}\nRegion: ${message.guild.region}`
    );
  }

  // Get user info
  else if (message.content === `${prefix}user-info`) {
    message.channel.send(
      `Your username: ${message.author.username}\nYour ID: ${message.author.id}`
    );
  }

  // Extract arguments from a command
  else if (command === 'args-info') {
    if (!args.length)
      return message.channel.send(`You didn't provide any arguments, ${message.author}!`);

    message.channel.send(`Command name: ${command}\nArguments: ${args.join(', ')}`);
  }

  // Kick user
  else if (command === 'kick') {
    if (!message.mentions.users.size) {
      return message.reply('you need to tag a user in order to kick them!');
    }

    // Grab the "first" mentioned user from the message
    const taggedUser = message.mentions.users.first();

    message.channel.send(`You wanted to kick: ${taggedUser.username}`);
  }

  // Display avatar of user
  else if (command === 'avatar') {
    if (!message.mentions.users.size) {
      return message.channel.send(
        `Your avatar: <${message.author.displayAvatarURL({ format: 'png', dynamic: true })}>`
      );
    }

    const avatarList = message.mentions.users.map((user) => {
      return `${user.username}'s avatar: <${user.displayAvatarURL({
        format: 'png',
        dynamic: true,
      })}>`;
    });

    // Send the entire array of strings as a message
    // By default, discord.js will `.join()` the array with `\n`
    message.channel.send(avatarList);
  }

  //TODO https://discordjs.guide/creating-your-bot/commands-with-user-input.html#number-ranges
});

client.login(process.env.TOKEN);
