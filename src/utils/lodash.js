const _ = require('lodash');

/**
 * Gets a random element from collection.
 * @template T
 * @param {T[]} collection - the collection to sample
 * @returns {T} Returns the random element.
 */
function sample(collection) {
  const randomItem = _.sample(collection);
  if (randomItem === undefined) {
    throw new Error('Could not get a random sample');
  }
  return randomItem;
}

module.exports = { sample };
