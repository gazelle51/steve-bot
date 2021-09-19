const { Collection, MessageEmbed, User } = require('discord.js');
const { defaultCooldown, embedColour, emoji, prefix } = require('../config');

/**
 * Embed to display when a song is added to the queue.
 * @param {import('../typedefs/audio').Audio} audio - Audio added to queue
 * @returns {MessageEmbed}
 */
function queueSongAdded(audio) {
  const suffix = audio.url.includes('youtube.com')
    ? "\n\nThis is the first result I found on YouTube, if it's not what you're looking for you can try the `search` command to select a particular result."
    : '';

  return new MessageEmbed()
    .setColor(embedColour)
    .setDescription(
      `[${audio.title}](${audio.url}) (${audio.length}) was added to the queue.${suffix}`
    );
}

/**
 * Create a base embed for displaying a queue.
 * @returns {MessageEmbed}
 */
function queueBase() {
  return new MessageEmbed()
    .setColor(embedColour)
    .setTitle(`${emoji.sparkles}${emoji.music} Music Queue ${emoji.music}${emoji.sparkles}`);
}

/**
 * Create an embed containing details of an empty queue.
 * @returns {MessageEmbed}
 */
function queueEmpty() {
  const embed = queueBase();
  embed.addField(
    "There's nothing here",
    `No music is being played ${emoji.crying}! Add some music to the queue using the \`play\` command.`
  );
  return embed;
}

/**
 * Create an embed containing details of the current queue when there is a song
 * playing and no more songs in the queue.
 * @param {import('../typedefs/audio').Audio} nowPlaying - Audio now playing
 * @returns {MessageEmbed}
 */
function queueNowPlayingOnly(nowPlaying) {
  const embed = queueBase();
  embed.addField(
    'Now playing',
    `[${nowPlaying.title}](${nowPlaying.url}) (${nowPlaying.length}), added by \`${nowPlaying.addedBy}\`\n`
  );
  embed.addField('Up next', `No more songs in the queue.`);
  return embed;
}

/**
 * Display the result of a container unboxing.
 * @param {import('../typedefs/container').ContainerWeapon} weapon - container weapon object
 * @param {User} author - user who opened container
 * @returns {MessageEmbed}
 */
function containerWeapon(weapon, author) {
  const colours = {
    white: '#b0c3d9',
    lightBlue: '#5e98d9',
    blue: '#4b69cd',
    purple: '#8847ff',
    pink: '#d32ce6',
    red: '#eb4b4b',
    yellow: '#ffcc00',
  };

  let description = `\`\`\`\n${weapon.wear}\n\`\`\`\n`;

  // StatTrak
  if (weapon.statTrak) description = description + '```arm\nStatTrak™\n```\n';

  // Souvenir
  if (weapon.souvenir) description = description + '```fix\nSouvenir\n```\n';

  // Price
  description = description + `\`\`\`\n${weapon.price}\n\`\`\`\n`;

  return new MessageEmbed()
    .setColor(colours[weapon.colour])
    .setTitle(weapon.name)
    .setDescription(description)
    .setImage(weapon.image)
    .setURL(weapon.url)
    .setFooter(`${author.tag} | ${weapon.containerName}`, author.avatarURL());
}

/**
 * Display an image as the result of a container unboxing.
 * Usually used for joke purposes.
 * @param {string} title - image title
 * @param {string} url - image URL
 * @param {User} author - user who opened container
 * @param {string} containerName - name of container opened
 * @returns {MessageEmbed}
 */
function containerImage(title, url, author, containerName) {
  return new MessageEmbed()
    .setColor(embedColour)
    .setTitle(title)
    .setImage(url)
    .setFooter(`${author.tag} | ${containerName}`, author.avatarURL());
}

/**
 * Create an embed for help on all bot commands.
 * @param {Collection<string, import('../typedefs/discord').SlashCommand>} commands - list of all slash commands for bot
 * @returns {MessageEmbed}
 */
function helpAllCommands(commands) {
  // Get all command names and halfway index
  const commandNames = commands.map((command) => command.data.name).sort();
  const halfway = Math.ceil(commandNames.length / 2);

  return new MessageEmbed()
    .setColor(embedColour)
    .setTitle('Help')
    .setDescription(
      "Here's a list of all my commands. You can send `/help command_name:[command_name]` to get more information on a specific command."
    )
    .addFields([
      { name: '\u200b', inline: true, value: commandNames.slice(0, halfway).join('\n') },
      { name: '\u200b', inline: true, value: commandNames.slice(-halfway).join('\n') },
    ]);
}

/**
 * Create an embed for help on a specific bot command.
 * @param {import('../typedefs/discord').SlashCommand} slashCommand - slash command
 * @param {import('../typedefs/discord').MessageCommand} [messageCommand=undefined] - message command
 * @returns {MessageEmbed}
 */
function helpSingleCommand(slashCommand, messageCommand = undefined) {
  // Get options data
  const options = slashCommand.data.options.map(
    (option, i) =>
      `**${i + 1}.** Name: \`${option.name}\`; Description: ${option.description}\; Required? ${
        option.required ? 'Yes' : 'No'
      }`
  );

  // Create base embed
  const embed = new MessageEmbed()
    .setColor(embedColour)
    .setTitle(`Help for \`${slashCommand.data.name}\``)
    .addFields([
      { name: 'Command name', value: '`' + slashCommand.data.name + '`' },
      { name: 'Description', value: slashCommand.data.description },
      { name: 'Options', value: slashCommand.data.options.length ? options.join('\n') : 'None' },
      { name: 'Cooldown', value: `${slashCommand.cooldown || defaultCooldown} second(s)` },
      {
        name: 'Can the command only be used in a server?',
        value: slashCommand.guildOnly ? 'Yes' : 'No',
      },
      {
        name: 'Does the user need to be in a voice channel?',
        value: slashCommand.voiceChannel ? 'Yes' : 'No',
      },
    ]);

  // Add message command data if it's defined
  if (messageCommand) {
    // Generic use
    const genericExample = messageCommand.usage
      ? `${prefix}${messageCommand.data.name} ${messageCommand.usage}`
      : `${prefix}${messageCommand.data.name} `;

    let text = `This command can also be activated from a message, send \`${genericExample}\` to use it.`;

    // Examples of use
    if (messageCommand.examples) {
      const specificExamples = messageCommand.examples.map((example) => `${prefix}${example}`);
      text = text + `\nHere's some examples: \`` + specificExamples.join('`, `') + '`.';
    }

    embed.addField('Message command', text);
  }

  return embed;
}

module.exports = {
  queue: {
    base: queueBase,
    empty: queueEmpty,
    nowPlayingOnly: queueNowPlayingOnly,
    songAdded: queueSongAdded,
  },
  container: { weapon: containerWeapon, image: containerImage },
  help: { allCommands: helpAllCommands, singleCommand: helpSingleCommand },
};
