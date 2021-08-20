const axios = require('axios').default;
const cache = require('../cache/cache');
const cheerio = require('cheerio');

/**
 * Extract all weapons from case at the provided URL.
 * If the provided colour is not yellow, knives/gloves data will not be returned.
 * @param {string} url - URL to scrape
 * @param {string} [colour=yellow] - colour of weapon we are interested in
 * @returns {Promise<import('../typedefs/case').CaseData>} weapons in case
 */
async function scrapeCasePage(url, colour = 'yellow') {
  const weapons = {
    blue: [],
    purple: [],
    pink: [],
    red: [],
    yellow: [],
  };

  console.log(`Scraping case at ${url}`);

  // Load page into Cheerio
  const html = await _getHtml(url);
  const $ = cheerio.load(html);

  await extractWeaponData($, weapons, colour);

  return weapons;
}

/**
 * Extract data about the weapon at the provided URL.
 * @param {string} url - URL to scrape
 * @param {boolean} statTrak - indicates if the details should be for a StatTrak weapon
 * @param {string} wear - wear of the weapon
 * @returns {Promise<import('../typedefs/case').WeaponDetailsData>}
 */
async function scrapeWeaponPage(url, statTrak, wear) {
  console.log(`Scraping weapon at ${url}`);

  // Load page into Cheerio
  const html = await _getHtml(url);
  const $ = cheerio.load(html);

  // Find all prices for the weapon
  const weaponPrices = $('div#prices')
    .children('div .btn-group-sm.btn-group-justified:not(.price-bottom-space)')
    .children('a')
    .toArray()
    .map((result) => {
      return $(result)
        .children('span')
        .toArray()
        .map((x) => $(x).text());
    });

  // Find price of specific weapon
  const weaponPriceArray = weaponPrices.find(
    (price) =>
      (statTrak && price.includes('StatTrak') && price.includes(wear)) ||
      (!statTrak && !price.includes('StatTrak') && price.includes(wear))
  );
  const weaponPrice = weaponPriceArray ? weaponPriceArray.pop() : "Couldn't find price";

  return { price: weaponPrice };
}

/**
 * Extract all knives at the provided URL. Also works for gloves.
 * @param {string} url - URL to scrape
 * @returns {Promise<import('../typedefs/case').CaseKnifeData>} knives in case
 */
async function scrapeKnivesPage(url) {
  const knives = { yellow: [] };

  console.log(`Scraping knives/gloves at ${url}`);

  // Load page into Cheerio
  const html = await _getHtml(url);
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
    const pageHtml = await _getHtml(url);
    const page$ = cheerio.load(pageHtml);
    const pageResultBoxRow = page$('div .row ').has('div > div .result-box');

    // Merge result boxes with original result boxes
    resultBoxRow.append(pageResultBoxRow.children());
  }

  // Extract knives data
  await extractWeaponData($, knives, 'yellow', true);

  return knives;
}

/**
 * Extract all weapons at the provided URL.
 * Knife/glove data will only be fetched if the provided colour is yellow.
 * @param {import('cheerio').CheerioAPI} $ - Cheerio object of HTML to extract elements from
 * @param {import('../typedefs/case').CaseData|import('../typedefs/case').CaseKnifeData} weapons - existing weapons data to update
 * @param {string} colourOfInterest - colour of weapon we are interested in
 * @param {boolean} [knivesData=false] - if true, the data to be extracted is knives
 * @returns {Promise<void>} weapons in case
 */
async function extractWeaponData($, weapons, colourOfInterest, knivesData = false) {
  let knivesUrl;

  // Find all result boxes with a h3 inside of them
  $('div .result-box')
    .not((i, result) => !$(result).children('h3').length)
    .each((i, result) => {
      // Weapon name
      const name = $(result).find('h3').text();

      // Skip knives and gloves but note the URL if needed
      if (!knivesData && (name.includes('Knives') || name.includes('Gloves'))) {
        knivesUrl = $(result).children('h3').children('a').attr('href');
        return;
      }

      // Rarity
      const rarityLinks = $(result).find('a[class=nounderline]');
      const rarityParent = rarityLinks.length ? rarityLinks : result;
      const rarity = $(rarityParent)
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

      // Prices
      const priceElements = $(result).find('div .price');
      const prices = $(priceElements)
        .filter((i, elem) => $(elem).children().find('a[class="price-st"]').length === 0)
        .text();
      const statTrakPrices = $(priceElements)
        .filter((i, elem) => $(elem).children().find('a[class="price-st"]').length === 1)
        .text();

      // Weaspon URL
      const url = $(result).find('a > img').parent().attr('href');

      weapons[colour].push({
        name: name,
        image: imageUrl,
        priceRange: prices,
        statTrakPriceRange: statTrakPrices,
        url: url,
      });
    });

  // Get knives/gloves data mentioned on page if needed
  if (colourOfInterest === 'yellow' && !knivesData && knivesUrl) {
    const knives = await scrapeKnivesPage(knivesUrl);
    weapons.yellow.push(...knives.yellow);
  }
}

/**
 * Get the HTML of the provided URL by first checking the cache. If it does
 * not exist in the cache, then call the URL and save the HTML in the cache.
 * @param {string} url - URL of HTML to get
 * @returns {Promise<string>}
 */
async function _getHtml(url) {
  const htmlCache = cache.get(url);
  if (htmlCache !== undefined) return htmlCache;

  const html = (await axios.get(url)).data;
  cache.set(url, html);

  return html;
}

module.exports = { scrapeCasePage, scrapeWeaponPage };
