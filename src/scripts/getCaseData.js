/**
 * Run this script to get data on weapons inside cases.
 *
 * Weapons are collected for each case mentioned in ./containerSimulator/caseData.json
 * and results are saved in ./scriptOutput/caseData.json
 *
 * To run use the `case-data` script defined in the package.json.
 */

const caseData = require('../containerSimulator/caseData.json');
const fs = require('fs');
const scrapeContainerPage = require('../containerSimulator/webScraper').scrapeContainerPage;

(async () => {
  // Loop through cases
  for (const caseObj of Object.values(caseData.cases)) {
    // Get weapon data
    const weapons = await scrapeContainerPage(caseObj.url);
    caseObj.weapons = weapons;
  }

  // Save updated data
  if (!fs.existsSync('./scriptOutput')) {
    fs.mkdirSync('./scriptOutput');
  }
  fs.writeFileSync('./scriptOutput/caseData.json', JSON.stringify(caseData, null, 2));
})();
