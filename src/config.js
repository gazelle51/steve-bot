const prefix = '~';

const defaultCooldown = 0.1;

/** @type {string[]} */
const disabledCommands = [];

/** @type {string[]} */
const disabledEvents = [];

/** @type {import("discord.js").HexColorString}} */
const embedColour = '#23E5D6';

const emoji = {
  sparkles: '✨',
  music: '🎵',
  crying: '😭',
  leftArrow: '⬅️',
  rightArrow: '➡️',
  100: '💯',
};

module.exports = {
  prefix: prefix,
  defaultCooldown: defaultCooldown,
  disabledCommands: disabledCommands,
  disabledEvents: disabledEvents,
  embedColour: embedColour,
  emoji: emoji,
};
