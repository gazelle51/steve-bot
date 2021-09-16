const { MessageEmbed } = require('discord.js');

/**
 * Raw generic weapon data scraped from a container page.
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
 * Extra details about weapon opened from a container.
 * @typedef {Object} ContainerWeaponData
 * @property {string} colour - weapon colour
 * @property {string} wear - weapon wear
 * @property {boolean} [statTrak] - whether the weapon has StatTrak tech or not
 * @property {boolean} [souviner] - whether the weapon is a souviner or not
 * @property {string} containerName - container the weapon was opened from
 */

/**
 * Weapon opened from a container.
 * @typedef {WeaponData & WeaponDetailsData & ContainerWeaponData} ContainerWeapon
 */

/**
 * Raw container knife/glove data scraped from a container page.
 * @typedef {Object} ContainerKnifeData
 * @property {WeaponData[]} yellow - yellow weapons
 */

/**
 * Raw container non-knife data scraped from a container page.
 * @typedef {Object} ContainerNonKnifeData
 * @property {WeaponData[]} blue - blue weapons
 * @property {WeaponData[]} purple - purple weapons
 * @property {WeaponData[]} pink - pink weapons
 * @property {WeaponData[]} red - red weapons
 */

/**
 * Raw container data scraped from a container page.
 * @typedef {ContainerNonKnifeData & ContainerKnifeData} ContainerData
 */

/**
 * Result from container unboxing. This object is intended to be used to send a message in Discord.
 * @typedef {Object} UnboxResult
 * @property {string} [content] - content of a message to send
 * @property {boolean} [ephemeral] - whether the sent message should be ephemeral (only visible to sender)
 * @property {MessageEmbed[]} [embeds] - list of embeds to send in message
 * @property {string[]} [files] - list of file URLss to send in message
 * @property {boolean} [fetchReply] - whether the sent message should be fetched
 * @property {string} [weaponColour] - colour of weapon unboxed
 */

module.exports = {};
