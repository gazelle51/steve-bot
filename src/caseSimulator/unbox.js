const _ = require('lodash');
const caseData = require('./data.json');
const scrapeCasePage = require('./webScraper').scrapeCasePage;
const scrapeWeaponPage = require('./webScraper').scrapeWeaponPage;

/*
TODO
- numbers
- only scrape for certain colour
*/

/**
 * Unbox a CS-GO case.
 * @param {string} caseName - name of case to unbox
 * @returns {Promise<import('../typedefs/case').CaseWeapon>}
 */
async function unbox(caseName) {
  const data = caseData.cases[caseName];

  console.log(`Unboxing: ${data.name}`);

  const colour = weaponColour();
  const stStatus = statTrak();
  const wwStatus = weaponWear();

  // TODO: only scrape for certain colour
  const caseWeaponData = await scrapeCasePage(data.url);
  const weaponData = weapon(caseWeaponData[colour]);
  const weaponDetails = await scrapeWeaponPage(weaponData.url, stStatus, wwStatus);

  const caseWeapon = {
    ...weaponData,
    ...weaponDetails,
    colour: colour,
    wear: wwStatus,
    statTrak: stStatus,
    caseName: data.name,
  };

  return caseWeapon;
}

/**
 * Generate a weapon colour based on the grade odds.
 * @returns {string}
 */
function weaponColour() {
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
 * @param {import('../typedefs/case').WeaponData[]} possibleWeapons
 * @returns {import('../typedefs/case').WeaponData}
 */
function weapon(possibleWeapons) {
  return _.sample(possibleWeapons);
}

/**
 * Generate a weapon wear based on the wear odds.
 * @returns {string}
 */
function weaponWear() {
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
function statTrak() {
  return Math.random() <= caseData.statTrakThreshold ? true : false;
}

module.exports = { unbox };
