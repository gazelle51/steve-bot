const axios = require('axios').default;
const cheerio = require('cheerio');

async function scrapeCasePage(url) {
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

      console.log(name);
      console.log(rarity);
      console.log(colour);
      console.log(imageUrl);
      console.log(price);
      console.log(statTrakPrice);
      console.log();
    });
}

scrapeCasePage('https://csgostash.com/case/4/CS:GO-Weapon-Case-2');
