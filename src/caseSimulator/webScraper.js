const axios = require('axios').default;
const cache = require('../cache/cache');
const cheerio = require('cheerio');

/**
 * Extract all weapons from case at the provided URL.
 * @param {string} url - URL to scrape
 * @returns {Promise<import('../typedefs/case').CaseData>} weapons in case
 */
async function scrapeCasePage(url) {
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

  await extractWeaponData($, weapons);

  return weapons;
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
  await extractWeaponData($, knives, true);

  return knives;
}

/**
 * Extract all knives at the provided URL.
 * @param {import('cheerio').CheerioAPI} $ - Cheerio object of HTML to extract elements from
 * @param {import('../typedefs/case').CaseData|import('../typedefs/case').CaseKnifeData} weapons - existing weapons data to update
 * @param {boolean} [knivesData=false] - if true, the data to be extracted is knives
 * @returns {Promise<void>} weapons in case
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

      // Price
      const [priceLow, priceHigh] = _extractPrices(prices);

      // StatTrak price
      const [statTrakPriceLow, statTrakPriceHigh] = _extractPrices(statTrakPrices);

      // Weaspon URL
      const url = $(result).find('a > img').parent().attr('href');

      weapons[colour].push({
        name: name,
        image: imageUrl,
        priceRange: prices,
        priceLow: priceLow,
        priceHigh: priceHigh,
        statTrakPriceRange: statTrakPrices,
        statTrakPriceLow: statTrakPriceLow,
        statTrakPriceHigh: statTrakPriceHigh,
        url: url,
      });
    });

  // Get knives/gloves data mentioned on page
  if (!knivesData && knivesUrl) {
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

/**
 * Extract low and high prices from HTML text.
 * @param {string} pricesRaw - price text from HTML
 * @returns {[number, number]} [low price, high price]
 */
function _extractPrices(pricesRaw) {
  // Extract prices
  const prices = pricesRaw
    .trim()
    .replace(',', '')
    .match(/[0-9]+.[0-9]+/g);

  // Return prices based on results
  if (!prices) return [undefined, undefined];
  else if (prices.length === 1) return [+prices[0], undefined];
  else return [+prices[0], +prices[1]];
}

module.exports = { scrapeCasePage };