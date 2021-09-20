const _ = require('lodash');
const collectionData = require('./collectionData.json');
const scrapeWeaponPage = require('./webScraper').scrapeWeaponPage;

/**
 * Unbox a CS: GO collection.
 * @param {string} collectionName - name of collection to unbox
 * @returns {Promise<import('../typedefs/container').ContainerWeapon>}
 */
async function unboxCollection(collectionName) {
  const data = collectionData.collections[collectionName];
  const collectionWeaponData = data.weapons;
  const tier = _collectionTier(collectionWeaponData);

  console.log(`Unboxing: ${data.name}`);

  // Randomised weapon data
  const colour = _weaponColour(tier, collectionName);
  const souvenirStatus = _souvenir();
  const weaponWearStatus = _weaponWear();

  // Static weapon data
  const weaponData = _weapon(collectionWeaponData[colour]);
  const weaponDetails = await scrapeWeaponPage(weaponData.url, weaponWearStatus, {
    souvenir: souvenirStatus,
  });

  const collectionWeapon = {
    ...weaponData,
    ...weaponDetails,
    colour: colour,
    wear: weaponWearStatus,
    souvenir: souvenirStatus,
    containerName: data.name,
  };

  return collectionWeapon;
}

/**
 * Determine if the collection is 6, 5, 4 or 3 tier
 * @param {Object} weaponData - weapon data for collection
 * @returns {string}
 */
function _collectionTier(weaponData) {
  if (weaponData.red.length) return 'sixTier';
  if (weaponData.pink.length) return 'fiveTier';
  if (weaponData.purple.length) return 'fourTier';
  else return 'threeTier';
}

/**
 * Generate a weapon colour based on the grade odds.
 * @param {string} tier - collection tier
 * @param {string} collectionName - name of collection (for edge cases)
 * @returns {string}
 */
function _weaponColour(tier, collectionName) {
  let colour;
  const randomNumber = Math.random();

  // Edge cases
  if (collectionName === 'blacksite') {
    return 'purple';
  } else if (['dust', 'cache'].includes(collectionName)) {
    const lightBlueThresholdEdge = collectionData.gradeOdds.threeTier.white;
    const blueThresholdEdge = lightBlueThresholdEdge + collectionData.gradeOdds.threeTier.lightBlue;

    if (randomNumber <= lightBlueThresholdEdge) colour = 'lightBlue';
    else if (randomNumber <= blueThresholdEdge) colour = 'blue';
    else colour = 'purple';

    return colour;
  }

  // Standard tiers
  switch (tier) {
    // 6 tier
    case 'sixTier':
      const whiteThreshold6 = collectionData.gradeOdds.sixTier.white;
      const lightBlueThreshold6 = whiteThreshold6 + collectionData.gradeOdds.sixTier.lightBlue;
      const blueThreshold6 = lightBlueThreshold6 + collectionData.gradeOdds.sixTier.blue;
      const purpleThreshold6 = blueThreshold6 + collectionData.gradeOdds.sixTier.purple;
      const pinkThreshold6 = purpleThreshold6 + collectionData.gradeOdds.sixTier.pink;

      if (randomNumber <= whiteThreshold6) colour = 'white';
      else if (randomNumber <= lightBlueThreshold6) colour = 'lightBlue';
      else if (randomNumber <= blueThreshold6) colour = 'blue';
      else if (randomNumber <= purpleThreshold6) colour = 'purple';
      else if (randomNumber <= pinkThreshold6) colour = 'pink';
      else colour = 'red';

      break;

    // 5 tier
    case 'fiveTier':
      const whiteThreshold5 = collectionData.gradeOdds.fiveTier.white;
      const lightBlueThreshold5 = whiteThreshold5 + collectionData.gradeOdds.fiveTier.lightBlue;
      const blueThreshold5 = lightBlueThreshold5 + collectionData.gradeOdds.fiveTier.blue;
      const purpleThreshold5 = blueThreshold5 + collectionData.gradeOdds.fiveTier.purple;

      if (randomNumber <= whiteThreshold5) colour = 'white';
      else if (randomNumber <= lightBlueThreshold5) colour = 'lightBlue';
      else if (randomNumber <= blueThreshold5) colour = 'blue';
      else if (randomNumber <= purpleThreshold5) colour = 'purple';
      else colour = 'pink';

      break;

    // 4 tier
    case 'fourTier':
      const whiteThreshold4 = collectionData.gradeOdds.fourTier.white;
      const lightBlueThreshold4 = whiteThreshold4 + collectionData.gradeOdds.fourTier.lightBlue;
      const blueThreshold4 = lightBlueThreshold4 + collectionData.gradeOdds.fourTier.blue;

      if (randomNumber <= whiteThreshold4) colour = 'white';
      else if (randomNumber <= lightBlueThreshold4) colour = 'lightBlue';
      else if (randomNumber <= blueThreshold4) colour = 'blue';
      else colour = 'purple';

      break;

    // 3 tier
    case 'threeTier':
      const whiteThreshold3 = collectionData.gradeOdds.threeTier.white;
      const lightBlueThreshold3 = whiteThreshold3 + collectionData.gradeOdds.threeTier.lightBlue;

      if (randomNumber <= whiteThreshold3) colour = 'white';
      else if (randomNumber <= lightBlueThreshold3) colour = 'lightBlue';
      else colour = 'blue';

      break;
  }

  return colour;
}

/**
 * Pick a random weapon from the provided weapon list.
 * @param {import('../typedefs/container').WeaponData[]} possibleWeapons
 * @returns {import('../typedefs/container').WeaponData}
 */
function _weapon(possibleWeapons) {
  return _.sample(possibleWeapons);
}

/**
 * Generate a weapon wear based on the wear odds.
 * @returns {string}
 */
function _weaponWear() {
  const randomNumber = Math.random();
  const wellWornThreshold = collectionData.wearOdds.wellWorn;
  const battleScarredThreshold = wellWornThreshold + collectionData.wearOdds.battleScarred;
  const fieldTestedThreshold = battleScarredThreshold + collectionData.wearOdds.fieldTested;
  const minimalWearThreshold = fieldTestedThreshold + collectionData.wearOdds.minimalWear;

  let wear = 'Factory New';
  if (randomNumber <= wellWornThreshold) wear = 'Well-Worn';
  else if (randomNumber <= battleScarredThreshold) wear = 'Battle-Scarred';
  else if (randomNumber <= fieldTestedThreshold) wear = 'Field-Tested';
  else if (randomNumber <= minimalWearThreshold) wear = 'Minimal Wear';

  return wear;
}

/**
 * Generate a souvenir true or false flag based on the souvenir threshold.
 * @returns {boolean}
 */
function _souvenir() {
  return Math.random() <= collectionData.souvenirThreshold ? true : false;
}

module.exports = { unboxCollection };
