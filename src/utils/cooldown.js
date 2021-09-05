const { defaultCooldown } = require('../config.js');
const { Collection } = require('discord.js');

/**
 * Check if the command is on cooldown for the specified user.
 * Update cooldowns if command can be used.
 * @param {string} commandName - name of command
 * @param {number} commandCooldown - command cooldown in seconds
 * @param {string} userId - Discord user ID
 * @param {Collection<string, Collection<string, number>>} cooldowns - client command cooldowns
 * @returns {number} number of cooldown seconds remaining
 */
function updateCommandCooldown(commandName, commandCooldown, userId, cooldowns) {
  // If no cooldown exists for this command, create one
  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Collection());
  }

  // Get cooldown numbers
  const now = Date.now();
  const timestamps = cooldowns.get(commandName);
  const cooldownAmount = (commandCooldown || defaultCooldown) * 1000;

  // If a cooldown exists for this user
  if (timestamps.has(userId)) {
    // Get command+user cooldown expiration time
    const expirationTime = timestamps.get(userId) + cooldownAmount;

    // Check if cooldown expired
    if (now < expirationTime) {
      // Return remaining cooldown time
      return (expirationTime - now) / 1000;
    }
  }

  // Create a new cooldown for user
  timestamps.set(userId, now);
  setTimeout(() => timestamps.delete(userId), cooldownAmount);

  return 0;
}

module.exports = { updateCommandCooldown };
