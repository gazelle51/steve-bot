const { MessageEmbed, User } = require('discord.js');
const { embedColour, emoji } = require('../config');

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
 *
 * @returns {MessageEmbed}
 */
function helpAllCommands() {
  return new MessageEmbed().setColor(embedColour).setTitle('title');
}

module.exports = {
  queue: {
    base: queueBase,
    empty: queueEmpty,
    nowPlayingOnly: queueNowPlayingOnly,
    songAdded: queueSongAdded,
  },
  container: { weapon: containerWeapon, image: containerImage },
  help: { allCommands: helpAllCommands },
};
