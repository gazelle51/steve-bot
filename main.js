require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client();

// Initial log in
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
  // Do nothing if the message was from the bot
  if (msg.author === client.user) return;

  // Ping message
  if (msg.content === 'ping') {
    msg.reply('pong');
  }

  print(message.author);
  print(message.author.id);
  print(message.author.name);
  print(message.author.discriminator);
});

client.login(process.env.TOKEN);
