const _ = require('lodash');
const collectionData = require('./collectionData.json');
const scrapeCasePage = require('./webScraper').scrapeCasePage;
const scrapeWeaponPage = require('./webScraper').scrapeWeaponPage;

// https://steamcommunity.com/app/730/discussions/0/1637542851358238466/

// TODO: make weapon data dynamic
// TODO: add more collections - drop rates will not be static

/**
 * Unbox a CS-GO collection.
 * @param {string} caseName - name of collection to unbox
 * @returns {Promise<import('../typedefs/case').CaseWeapon>}
 */
async function unboxCollection(caseName) {
  const data = collectionData.collections[caseName];

  console.log(`Unboxing: ${data.name}`);

  // Randomised weapon data
  const colour = _weaponColour();
  const souvinerStatus = _souviner();
  const weaponWearStatus = _weaponWear();

  // Static weapon data
  const collectionWeaponData = data.weapons;
  const weaponData = _weapon(collectionWeaponData[colour]);
  const weaponDetails = await scrapeWeaponPage(weaponData.url, souvinerStatus, weaponWearStatus);

  const caseWeapon = {
    ...weaponData,
    ...weaponDetails,
    colour: colour,
    wear: weaponWearStatus,
    souviner: souvinerStatus,
    caseName: data.name,
  };

  return caseWeapon;
}

/**
 * Generate a weapon colour based on the grade odds.
 * @returns {string}
 */
function _weaponColour() {
  const randomNumber = Math.random();
  const whiteThreshold = collectionData.gradeOdds.white;
  const lightBlueThreshold = whiteThreshold + collectionData.gradeOdds.lightBlue;
  const blueThreshold = lightBlueThreshold + collectionData.gradeOdds.blue;
  const purpleThreshold = blueThreshold + collectionData.gradeOdds.purple;
  const pinkThreshold = purpleThreshold + collectionData.gradeOdds.pink;

  let colour = 'red';
  if (randomNumber <= whiteThreshold) colour = 'white';
  else if (randomNumber <= lightBlueThreshold) colour = 'lightBlue';
  else if (randomNumber <= blueThreshold) colour = 'blue';
  else if (randomNumber <= purpleThreshold) colour = 'purple';
  else if (randomNumber <= pinkThreshold) colour = 'pink';

  return colour;
}

/**
 * Pick a random weapon from the proided weapon list.
 * @param {import('../typedefs/case').WeaponData[]} possibleWeapons
 * @returns {import('../typedefs/case').WeaponData}
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
 * Generate a souviner true or false flag based on the souviner threshold.
 * @returns {boolean}
 */
function _souviner() {
  return Math.random() <= collectionData.souvinerThreshold ? true : false;
}

module.exports = { unboxCollection };
