const { GuildMember } = require('discord.js');
const _ = require('lodash');
const text = require('../utils/text');

/**
 * Execute when the guildMemberUpdate event fires.
 * @param {GuildMember} oldMember - The member before the update
 * @param {GuildMember} newMember - The member after the update
 * @param {import('../typedefs/discord').DiscordClient} client - Discord client
 */
function execute(oldMember, newMember, client) {
  // Get a channel
  const channel = text.findTextChannel(newMember.guild);

  // Check if a role was added
  const added = _.difference(newMember._roles, oldMember._roles);
  if (added.length)
    channel.send(
      `${newMember.user.username}, you just got a new role - "${
        newMember.guild.roles.cache.get(added[0]).name
      }"`
    );

  // Check if a role was removed
  const removed = _.difference(oldMember._roles, newMember._roles);
  if (removed.length)
    channel.send(
      `${newMember.user.username}, you just got a role removed - "${
        oldMember.guild.roles.cache.get(removed[0]).name
      }"`
    );
}

module.exports = {
  name: 'guildMemberUpdate',
  execute,
};
