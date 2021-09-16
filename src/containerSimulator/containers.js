const _ = require('lodash');
const caseData = require('./caseData.json');
const collectionData = require('./collectionData.json');

/**
 * Return list of all case names and their commands.
 * @returns {string[]} Array of `case name - case ID`
 */
function getCaseCommands() {
  return Object.entries(caseData.cases)
    .map(([key, value]) => `${value.name} - ${key}`)
    .sort();
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
