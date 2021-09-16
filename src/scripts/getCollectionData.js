/**
 * Run this script to get data on weapons inside collections.
 *
 * Weapons are collected for each case mentioned in ./containerSimulator/collectionData.json
 * and results are saved in ./scriptOutput/collectionData.json
 *
 * To run use the `collection-data` script defined in the package.json.
 */

const collectionData = require('../containerSimulator/collectionData.json');
const fs = require('fs');
const scrapeContainerPage = require('../containerSimulator/webScraper').scrapeContainerPage;

(async () => {
  // Loop through cases
  for (const collectionObj of Object.values(collectionData.collections)) {
    // Get weapon data
    const weapons = await scrapeContainerPage(collectionObj.url);
    collectionObj.weapons = weapons;
  }

  // Save updated data
  if (!fs.existsSync('./scriptOutput')) {
    fs.mkdirSync('./scriptOutput');
  }
  fs.writeFileSync('./scriptOutput/collectionData.json', JSON.stringify(collectionData, null, 2));
})();
