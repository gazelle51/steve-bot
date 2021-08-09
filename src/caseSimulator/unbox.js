const _ = require('lodash');
const caseData = require('./data.json');

/*
https://csgostash.com/
TODO
- more knives
- statrak
- numbers
- embed with requesting user
*/

/**
 * Unbox a CS-GO case.
 * @param {string} caseName - name of case to unbox
 * @returns {Object}
 */
function unbox(caseName) {
  const data = caseData.cases[0];

  console.log(`Unboxing: ${data.name}`);

  const colour = weaponColour();
  const caseWeapon = weapon(data[colour]);

  caseWeapon.colour = colour;
  caseWeapon.wear = weaponWear();

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
 * @param {Object[]} possibleWeapons
 * @returns {Object}
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
  if (randomNumber <= wellWornThreshold) wear = 'Well Worn';
  else if (randomNumber <= battleScarredThreshold) wear = 'Battle Scarred';
  else if (randomNumber <= fieldTestedThreshold) wear = 'Field Tested';
  else if (randomNumber <= minimalWearThreshold) wear = 'Minimal Wear';

  return wear;
}

module.exports = { unbox };
