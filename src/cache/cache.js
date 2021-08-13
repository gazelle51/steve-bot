const NodeCache = require('node-cache');

// Set up cache
const cache = new NodeCache({
  stdTTL: 3 * 60 * 60, // default time to live (3 hours)
  checkperiod: 1 * 60 * 60, // automatic delete check interval (1 hour)
});

// When an item is set
cache.on('set', function (key, value) {
  console.log(`Cache: key added ${key}`);
});

// When an item is expired
cache.on('expired', function (key, value) {
  console.log(`Cache: key expired ${key}`);
});

module.exports = cache;
