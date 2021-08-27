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

/**
 * Return list of all cases and their names.
 * @returns {string[][]} Array of [case ID, case name]
 */
function getCaseNames() {
  return Object.entries(caseData.cases)
    .map(([key, value]) => [key, value.name])
    .sort(function (a, b) {
      if (a[1] < b[1]) {
        return -1;
      }
      if (a[1] > b[1]) {
        return 1;
      }
      return 0;
    });
}

module.exports = { randomCase, isCaseValid, getCaseNames };
