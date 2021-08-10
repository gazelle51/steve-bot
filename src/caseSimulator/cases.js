const _ = require('lodash');
const caseData = require('./data.json');

/**
 * Get the `key` of a randomly selected case.
 * @returns {string}
 */
function randomCase() {
  return _.sample(Object.keys(caseData.cases));
}

/**
 * Return true if the provided case `key` is defined.
 * @param {string} key
 * @returns {boolean}
 */
function isCaseValid(key) {
  return Object.keys(caseData.cases).includes(key);
}

module.exports = { randomCase, isCaseValid };
