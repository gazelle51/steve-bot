const _ = require('lodash');
const collectionData = require('./collectionData.json');

/**
 * Get the `key` of a randomly selected collection.
 * @returns {string}
 */
function randomCollection() {
  return _.sample(Object.keys(collectionData.collections));
}

/**
 * Return true if the provided container name is a collection.
 * @param {string} containerName
 * @returns {boolean}
 */
function isCollection(containerName) {
  return Object.keys(collectionData.collections).includes(containerName);
}

/**
 * Return list of all collection names and their commands.
 * @returns {string[]} Array of `collection name - collection ID`
 */
function getCollectionCommands() {
  return Object.entries(collectionData.collections)
    .map(([key, value]) => `${value.name} - ${key}`)
    .sort();
}

module.exports = { randomCollection, isCollection, getCollectionCommands };
