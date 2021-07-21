require('dotenv').config();

/**
 * Discord client doco: https://discord.js.org/#/docs/main/stable/class/Client
 *
 * If want to want presence changes need to use `new Discord.Client({ ws: { intents: ['GUILD_PRESENCES'] } });`.
 * Also need to check that permission is enabled for bot in developer portal.
 */

const borat = require('./borat');
const voice = require('./voice');
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
  // Do nothing if the message was from the bot
  if (message.author === client.user) return;

  // Ping message
  if (message.content === 'ping') {
    message.reply('pong');
  }

  // Join voice
  if (message.content === 'join') {
    const connection = await voice.join(message);

    if (!connection) return;

    connection.play(borat.helloNiceToMeetYou);
  }
});

client.login(process.env.TOKEN);
