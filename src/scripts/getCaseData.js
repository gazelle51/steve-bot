/**
 * Run this script to get data on weapons inside cases.
 *
 * Weapons are collected for each case mentioned in ./caseSimulator/caseData.json
 * and results are saved in ./scriptOutput/caseData.json
 *
 * To run use the `case-data` script defined in the package.json.
 */

const caseData = require('../caseSimulator/caseData.json');
const fs = require('fs');
const scrapeCasePage = require('../caseSimulator/webScraper').scrapeCasePage;

(async () => {
  // Loop through cases
  for (const caseObj of Object.values(caseData.cases)) {
    // Get weapon data
    const weapons = await scrapeCasePage(caseObj.url);
    caseObj.weapons = weapons;
  }

  // Save updated data
  if (!fs.existsSync('./scriptOutput')) {
    fs.mkdirSync('./scriptOutput');
  }
  fs.writeFileSync('./scriptOutput/caseData.json', JSON.stringify(caseData, null, 2));
})();
