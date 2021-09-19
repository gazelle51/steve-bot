const _ = require('lodash');
const caseData = require('./caseData.json');
const collectionData = require('./collectionData.json');

/**
 * Return list of all case commands.
 * @returns {string[]} Array of case IDs
 */
function getCaseCommands() {
  return Object.keys(caseData.cases).sort();
}

/**
 * Return list of all collection commands.
 * @returns {string[]} Array of collection IDs
 */
function getCollectionCommands() {
  return Object.keys(collectionData.collections).sort();
}

/**
 * Return list of all containers and their commands.
 * @returns {string[]} Array of `container name - container ID`
 */
function getContainerCommands() {
  return [...getCaseCommands(), ...getCollectionCommands()].sort();
}

/**
 * Return true if the provided container name is a case.
 * @param {string} containerName
 * @returns {boolean}
 */
function isCase(containerName) {
  return Object.keys(caseData.cases).includes(containerName);
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
 * Get the `key` of a randomly selected case.
 * @returns {string}
 */
function randomCase() {
  return _.sample(Object.keys(caseData.cases));
}

/**
 * Get the `key` of a randomly selected collection.
 * @returns {string}
 */
function randomCollection() {
  return _.sample(Object.keys(collectionData.collections));
}

module.exports = {
  getCaseCommands,
  getCollectionCommands,
  getContainerCommands,
  isCase,
  isCollection,
  randomCase,
  randomCollection,
};
