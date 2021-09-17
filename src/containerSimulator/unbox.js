const _ = require('lodash');
const embeds = require('../utils/embeds').container;
const { User } = require('discord.js');
const { isCase, isCollection, randomCase, randomCollection } = require('./containers');
const { unboxCase } = require('./unboxCase');
const { unboxCollection } = require('./unboxCollection');

/**
 * Unbox a container.
 * @param {string} containerName - name of container to open
 * @param {User} user - user who initiated unboxing
 * @returns {Promise<import('../typedefs/container').UnboxResult>}
 */
async function unbox(containerName, user) {
  let containerType;

  // Get container type and name details
  switch (containerName) {
    // No container name - randomly select a case or collection
    case undefined:
    case null:
    case '':
      containerType = _.sample(['case', 'collection']);
      containerName = containerType === 'case' ? randomCase() : randomCollection();
      break;

    // Special containers
    case 'box':
    case 'laura':
      containerType = containerName;
      break;

    // Default
    default:
      if (isCase(containerName)) containerType = 'case';
      else if (isCollection(containerName)) containerType = 'collection';
      break;
  }

  // Handle each container type
  switch (containerType) {
    // Non-configured containers
    case undefined:
    case null:
    case '':
      return {
        content: `I am not configured to open ${containerName} containers`,
        ephemeral: true,
      };

    // Case
    case 'case':
      const caseWeapon = await unboxCase(containerName);
      return {
        embeds: [embeds.weapon(caseWeapon, user)],
        fetchReply: true,
        weaponColour: caseWeapon.colour,
      };

    // Collection
    case 'collection':
      const collectionWeapon = await unboxCollection(containerName);
      return {
        embeds: [embeds.weapon(collectionWeapon, user)],
        fetchReply: true,
        weaponColour: collectionWeapon.colour,
      };

    // Box
    case 'box':
      return {
        embeds: [
          embeds.image(
            'Ducky',
            'https://media.giphy.com/media/26his8ERHOSxKuWw8/giphy.gif?cid=ecf05e477mcpzpur95w1wm4t66zkh06t17j8lgc6nwq5f5c3&rid=giphy.gif&ct=g',
            user,
            'Box'
          ),
        ],
      };

    // Laura
    case 'laura':
      return {
        embeds: [
          embeds.image(
            'Laura Chan ローラ',
            'https://media.giphy.com/media/xTiTngxCg9CQfe1lfi/giphy.gif?cid=ecf05e470c34hd6qgfsc775871j0uvnvt78sxm4oqst947yh&rid=giphy.gif&ct=g',
            user,
            'Laura'
          ),
        ],
      };
  }

  return { content: `I don't know what to do :(`, ephemeral: true };
}

module.exports = { unbox };
