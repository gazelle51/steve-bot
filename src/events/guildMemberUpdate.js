/**
 * Execute when the guildMemberUpdate event fires.
 * @param {*} oldMember - The member before the update
 * @param {*} newMember - The member after the update
 * @param {Object} client - Discord client
 */
function execute(oldMember, newMember, client) {
  console.log('oldMember');
  // console.log(oldMember);
  console.log(oldMember.user.username);
  console.log(oldMember._roles);
  console.log('');

  console.log('newMember');
  // console.log(newMember);
  console.log(newMember.user.username);
  console.log(newMember._roles);
  console.log(newMember.guild.roles.cache.get('868423434286268447').name);
  console.log('');
}

module.exports = {
  name: 'guildMemberUpdate',
  execute,
};
