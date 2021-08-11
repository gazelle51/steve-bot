const axios = require('axios').default;
const cheerio = require('cheerio');

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

  // Find all result boxes with a h3 inside of them
  $('div .result-box ')
    .not((i, result) => !$(result).children('h3').length)
    .each((i, result) => {
      // Weapon name
      const name = $(result).find('h3').text();

      // Skip knives
      if (name.includes('Knives')) return;

      // Rarity
      const rarity = $(result)
        .find('a[class=nounderline]')
        .children('div .quality')
        .attr('class')
        .replace('quality color-', '');

      // Colour (based on rarity)
      const colourMap = {
        covert: 'red',
        classified: 'pink',
        restricted: 'purple',
        milspec: 'blue',
      };
      const colour = colourMap[rarity];

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
        priceLow: +price.match(/[0-9]+.[0-9]+/g)[0],
        priceHigh: +price.match(/[0-9]+.[0-9]+/g)[1],
        statTrakPriceLow: +statTrakPrice.match(/[0-9]+.[0-9]+/g)[0],
        statTrakPriceHigh: +statTrakPrice.match(/[0-9]+.[0-9]+/g)[1],
      });
    });

  return weapons;
}

scrapeCasePage('https://csgostash.com/case/4/CS:GO-Weapon-Case-2');
