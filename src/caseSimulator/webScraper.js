const axios = require('axios').default;
const cheerio = require('cheerio');

/**
 * Extract all weapons from case at the provided URL.
 * @param {string} url - URL to scrape
 * @returns {Promise<Object>} weapons in case
 */
async function scrapeCasePage(url) {
  const weapons = {
    blue: [],
    purple: [],
    pink: [],
    red: [],
    yellow: [],
  };

  // Load page into Cheerio
  const html = (await axios.get(url)).data;
  const $ = cheerio.load(html);

  await extractWeaponData($, weapons);

  return weapons;
}

/**
 * Extract all knives at the provided URL. Also works for gloves.
 * @param {string} url - URL to scrape
 * @returns {Promise<Object>} knives in case
 */
async function scrapeKnivesPage(url) {
  const knives = { yellow: [] };

  // Load page into Cheerio
  const html = (await axios.get(url)).data;
  const $ = cheerio.load(html);

  // Get URLs of additional pages
  const pageUrls = [
    ...new Set(
      $('div .pagination-nomargin > ul > li > a')
        .map((i, result) => $(result).attr('href'))
        .toArray()
    ),
  ];

  // Find element (row) containing result boxes
  const resultBoxRow = $('div .row').has('div > div .result-box');

  // Get HTML of other pages
  for (const pageUrl of pageUrls) {
    const pageHtml = (await axios.get(pageUrl)).data;
    const page$ = cheerio.load(pageHtml);
    const pageResultBoxRow = page$('div .row ').has('div > div .result-box');

    // Merge result boxes with original result boxes
    resultBoxRow.append(pageResultBoxRow.children());
  }

  // Extract knives data
  await extractWeaponData($, knives, true);

  return knives;
}

/**
 * Extract all knives at the provided URL.
 * @param {import('cheerio').CheerioAPI} $ - Cheerio object of HTML to extract elements from
 * @param {Object} weapons - existing weapons data to update
 * @param {boolean} [knivesData=false] - if true, the data to be extracted is knives
 * @returns {Promise<Object>} weapons in case
 */
async function extractWeaponData($, weapons, knivesData = false) {
  let knivesUrl;

  // Find all result boxes with a h3 inside of them
  $('div .result-box ')
    .not((i, result) => !$(result).children('h3').length)
    .each((i, result) => {
      // Weapon name
      const name = $(result).find('h3').text();

      // Skip knives and gloves
      if (!knivesData && (name.includes('Knives') || name.includes('Gloves'))) {
        knivesUrl = $(result).children('h3').children('a').attr('href');
        return;
      }

      // Rarity
      const rarity = $(result)
        .find('a[class=nounderline]')
        .children('div .quality')
        .attr('class')
        .replace('quality color-', '');

      // Colour (based on rarity)
      const colourMap = {
        rare: 'yellow',
        covert: 'red',
        classified: 'pink',
        restricted: 'purple',
        milspec: 'blue',
      };
      const colour = knivesData ? 'yellow' : colourMap[rarity];

      // Image URL
      const imageUrl = $(result).find('a').children('img').attr('src');

      // Price
      const priceElements = $(result).find('div .price');
      const price = $(priceElements)
        .filter((i, elem) => $(elem).children().find('a[class="price-st"]').length === 0)
        .text()
        .trim();
      const statTrakPrice = $(priceElements)
        .filter((i, elem) => $(elem).children().find('a[class="price-st"]').length === 1)
        .text()
        .trim();

      weapons[colour].push({
        name: name,
        image: imageUrl,
        priceLow: +price.replace(',', '').match(/[0-9]+.[0-9]+/g)[0],
        priceHigh: +price.replace(',', '').match(/[0-9]+.[0-9]+/g)[1],
        statTrakPriceLow: +statTrakPrice.replace(',', '').match(/[0-9]+.[0-9]+/g)[0],
        statTrakPriceHigh: +statTrakPrice.replace(',', '').match(/[0-9]+.[0-9]+/g)[1],
      });
    });

  // Get knives/gloves data mentioned on page
  if (!knivesData && knivesUrl) {
    const knives = await scrapeKnivesPage(knivesUrl);
    weapons.yellow.push(...knives.yellow);
  }
}

module.exports = { scrapeCasePage };
