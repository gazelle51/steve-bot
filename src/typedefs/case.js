/**
 * Raw generic weapon data scraped from a case page.
 * @typedef {Object} WeaponData
 * @property {string} name - weapon name
 * @property {string} image - weapon image URL
 * @property {string} url - weapon URL
 */

/**
 * Raw weapon details data scraped from a weapon page.
 * We know the wear and StatTrak/souviner details of these objects.
 * @typedef {Object} WeaponDetailsData
 * @property {string} price - weapon price
 */

/**
 * Extra details about weapon opened from a case.
 * @typedef {Object} CaseWeaponData
 * @property {string} colour - weapon colour
 * @property {string} wear - weapon wear
 * @property {boolean} [statTrak] - whether the weapon has StatTrak tech or not
 * @property {boolean} [souviner] - whether the weapon is a souviner or not
 * @property {string} caseName - case the weapon was opened from
 */

/**
 * Weapon opened from a case.
 * @typedef {WeaponData & WeaponDetailsData & CaseWeaponData} CaseWeapon
 */

/**
 * Raw case knife/glove data scraped from a case page.
 * @typedef {Object} CaseKnifeData
 * @property {WeaponData[]} yellow - yellow weapons
 */

/**
 * Raw case non-knife data scraped from a case page.
 * @typedef {Object} CaseNonKnifeData
 * @property {WeaponData[]} blue - blue weapons
 * @property {WeaponData[]} purple - purple weapons
 * @property {WeaponData[]} pink - pink weapons
 * @property {WeaponData[]} red - red weapons
 */

/**
 * Raw case data scraped from a case page.
 * @typedef {CaseNonKnifeData & CaseKnifeData} CaseData
 */

module.exports = {};
