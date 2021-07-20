require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client();

// Initial log in
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message) => {
  // Do nothing if the message was from the bot
  if (message.author === client.user) return;

  // Ping message
  if (message.content === 'ping') {
    message.reply('pong');
  }

  // Join voice
  if (message.content === 'join') {
    // Voice only works in guilds, if the message does not come from a guild, we ignore it
    if (!message.guild) return;

    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      connection.play('./forgetMeToo.mp3');
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }

  console.log(message.author);
});

client.login(process.env.TOKEN);
