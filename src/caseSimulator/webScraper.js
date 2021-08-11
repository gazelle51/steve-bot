const axios = require('axios').default;
const cheerio = require('cheerio');

async function scrapeUrl(url) {
  const html = (await axios.get(url)).data;

  const $ = cheerio.load(html);

  // Find all result boxes with a h3 inside of them
  const data = $('div .result-box > h3');

  console.log(data);
  console.log(data.length);

  // https://zetcode.com/javascript/cheerio/
  // https://stackoverflow.com/questions/58052001/get-html-source-code-from-a-website-and-then-get-an-element-from-the-html-file
  // https://www.freecodecamp.org/news/the-ultimate-guide-to-web-scraping-with-node-js-daa2027dcd3/
}

scrapeUrl('https://csgostash.com/case/4/CS:GO-Weapon-Case-2');
