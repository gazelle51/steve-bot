/** @type {import("discord.js").HexColorString}} */
const embedColour = '#23E5D6';

module.exports = {
  prefix: '~',
  defaultCooldown: 0.1,
  disabledCommands: [],
  disabledEvents: ['messageCreate'],
  embedColour: embedColour,
  emoji: {
    sparkles: '✨',
    music: '🎵',
    crying: '😭',
    leftArrow: '⬅️',
    rightArrow: '➡️',
    100: '💯',
  },
};
