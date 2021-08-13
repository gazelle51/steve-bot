/**
 * Raw weapon data.
 * @typedef {Object} WeaponData
 * @property {string} name - weapon name
 * @property {string} image - weapon image URL
 * @property {string} priceRange - normal price range
 * @property {number} priceLow - lowest price
 * @property {number} priceHigh - highest price
 * @property {string} statTrakPriceRange - StatTrak price range
 * @property {number} statTrakPriceLow - StatTrak lowest price
 * @property {number} statTrakPriceHigh - StatTrak highest price
 */

/**
 * Weapon opened from a case.
 * @typedef {Object} CaseWeapon
 * @property {string} name - weapon name
 * @property {string} image - weapon image URL
 * @property {string} colour - weapon colour
 * @property {string} wear - weapon wear
 * @property {boolean} stattrak - whether the weapon has StatTrak tech or not
 * @property {string} caseName - case the weapon was opened from
 * @property {string} priceRange - normal price range
 * @property {string} statTrakPriceRange - StatTrak price range
 */

/**
 * Raw case knife/glove data.
 * @typedef {Object} CaseKnifeData
 * @property {WeaponData[]} yellow - yellow weapons
 */

/**
 * Raw case data.
 * @typedef {Object} CaseNonKnifeData
 * @property {WeaponData[]} blue - blue weapons
 * @property {WeaponData[]} purple - purple weapons
 * @property {WeaponData[]} pink - pink weapons
 * @property {WeaponData[]} red - red weapons
 */

/**
 * Raw case data.
 * @typedef {CaseNonKnifeData & CaseKnifeData} CaseData
 * @property {WeaponData[]} blue - blue weapons
 * @property {WeaponData[]} purple - purple weapons
 * @property {WeaponData[]} pink - pink weapons
 * @property {WeaponData[]} red - red weapons
 */

module.exports = {};
