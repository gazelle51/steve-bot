const _ = require('lodash');
const caseData = require('./caseData.json');
const scrapeWeaponPage = require('./webScraper').scrapeWeaponPage;

/**
 * Unbox a CS-GO case.
 * @param {string} caseName - name of case to unbox
 * @returns {Promise<import('../typedefs/container').ContainerWeapon>}
 */
async function unboxCase(caseName) {
  const data = caseData.cases[caseName];
  const caseWeaponData = data.weapons;

  console.log(`Unboxing: ${data.name}`);

  // Randomised weapon data
  const colour = _weaponColour();
  const statTrakStatus = _statTrak();
  const weaponWearStatus = _weaponWear();

  // Static weapon data
  const weaponData = _weapon(caseWeaponData[colour]);
  const weaponDetails = await scrapeWeaponPage(weaponData.url, weaponWearStatus, {
    statTrak: statTrakStatus,
  });

  const caseWeapon = {
    ...weaponData,
    ...weaponDetails,
    colour: colour,
    wear: weaponWearStatus,
    statTrak: statTrakStatus,
    containerName: data.name,
  };

  return caseWeapon;
}

/**
 * Generate a weapon colour based on the grade odds.
 * @returns {string}
 */
function _weaponColour() {
  const randomNumber = Math.random();
  const blueThreshold = caseData.gradeOdds.blue;
  const purpleThreshold = blueThreshold + caseData.gradeOdds.purple;
  const pinkThreshold = purpleThreshold + caseData.gradeOdds.pink;
  const redThreshold = pinkThreshold + caseData.gradeOdds.red;

  let colour = 'yellow';
  if (randomNumber <= blueThreshold) colour = 'blue';
  else if (randomNumber <= purpleThreshold) colour = 'purple';
  else if (randomNumber <= pinkThreshold) colour = 'pink';
  else if (randomNumber <= redThreshold) colour = 'red';

  return colour;
}

/**
 * Pick a random weapon from the proided weapon list.
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
  const wellWornThreshold = caseData.wearOdds.wellWorn;
  const battleScarredThreshold = wellWornThreshold + caseData.wearOdds.battleScarred;
  const fieldTestedThreshold = battleScarredThreshold + caseData.wearOdds.fieldTested;
  const minimalWearThreshold = fieldTestedThreshold + caseData.wearOdds.minimalWear;

  let wear = 'Factory New';
  if (randomNumber <= wellWornThreshold) wear = 'Well-Worn';
  else if (randomNumber <= battleScarredThreshold) wear = 'Battle-Scarred';
  else if (randomNumber <= fieldTestedThreshold) wear = 'Field-Tested';
  else if (randomNumber <= minimalWearThreshold) wear = 'Minimal Wear';

  return wear;
}

/**
 * Generate a StatTrak true or false flag based on the StatTrak threshold.
 * @returns {boolean}
 */
function _statTrak() {
  return Math.random() <= caseData.statTrakThreshold ? true : false;
}

module.exports = { unboxCase };
