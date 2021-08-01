/**
 * Get the name of a random sound from an object of sounds.
 * @param {Object} object - Sound object
 * @returns {string} Name (key) of random sound in the object
 */
function getNameOfRandomSound(object) {
  const objectSounds = Object.keys(object);
  return objectSounds[Math.floor(Math.random() * objectSounds.length)];
}

module.exports = { getNameOfRandomSound };
