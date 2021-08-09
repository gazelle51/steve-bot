const { MessageEmbed, User } = require('discord.js');
const { embedColour, emoji } = require('../config.json');

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
 * Display the result of a case unboxing.
 * @param {import('../typedefs/case').CaseWeapon} weapon - case weapon object
 * @param {User} author - user who opened case
 * @returns {MessageEmbed}
 */
function caseWeapon(weapon, author) {
  const colours = {
    blue: '#4b69cd',
    purple: '#8847ff',
    pink: '#d32ce6',
    red: '#eb4b4b',
    yellow: '#ffcc00',
  };

  let description = '';
  if (weapon.stattrak) description = description + '```arm\nStatTrak™\n```\n';
  description = description + `\`\`\`\n${weapon.wear}\n\`\`\``;

  return new MessageEmbed()
    .setColor(colours[weapon.colour])
    .setTitle(weapon.name)
    .setDescription(description)
    .setImage(weapon.image)
    .setFooter(`${author.tag} | ${weapon.caseName}`, author.avatarURL());
}

module.exports = {
  queue: {
    base: queueBase,
    empty: queueEmpty,
    nowPlayingOnly: queueNowPlayingOnly,
    songAdded: queueSongAdded,
  },
  case: { weapon: caseWeapon },
};
