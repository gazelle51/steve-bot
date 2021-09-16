const _ = require('lodash');
const caseData = require('./caseData.json');

/**
 * Get the `key` of a randomly selected case.
 * @returns {string}
 */
function randomCase() {
  return _.sample(Object.keys(caseData.cases));
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
 * Return list of all case names and their commands.
 * @returns {string[]} Array of `case name - case ID`
 */
function getCaseCommands() {
  return Object.entries(caseData.cases)
    .map(([key, value]) => `${value.name} - ${key}`)
    .sort();
}

module.exports = { randomCase, isCase, getCaseCommands };
