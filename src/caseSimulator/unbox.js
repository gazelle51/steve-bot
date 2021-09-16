const _ = require('lodash');
const embeds = require('../utils/embeds').case;
const { User } = require('discord.js');
const { randomCase, isCase, getCaseCommands } = require('./cases');
const { randomCollection, isCollection, getCollectionCommands } = require('./collections');
const { unboxCase } = require('./unboxCase');
const { unboxCollection } = require('./unboxCollection');

/**
 * Unbox a container.
 * @param {string} containerName - name of container to open
 * @param {User} user - user who initiated unboxing
 * @returns {Promise{TODO}}
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
        files: [
          'https://media.giphy.com/media/26his8ERHOSxKuWw8/giphy.gif?cid=ecf05e477mcpzpur95w1wm4t66zkh06t17j8lgc6nwq5f5c3&rid=giphy.gif&ct=g',
        ],
      };
  }

  return { content: `I don't know what to do :(`, ephemeral: true };
}

// return {
//   content: `The containers I can open are listed below\n${[
//     ...getCaseCommands(),
//     ...getCollectionCommands(),
//   ].join('\n')}`,
//   ephemeral: true,
// };

module.exports = { unbox };
