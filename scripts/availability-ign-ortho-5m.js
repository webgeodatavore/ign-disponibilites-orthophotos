const fs = require('fs');
const puppeteer = require('puppeteer');

const url = 'http://professionnels.ign.fr/bdortho-5m';
const baseName = url.split('/').slice(-1)[0].split('#').slice(0,1)[0];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log(url, baseName);
  await page.goto(url, {
    networkIdleTimeout: 5000,
    waitUntil: 'networkidle',
    timeout: 60000
  });

  // Get the "viewport" of the page, as reported by the page.
  const infosIgn = await page.evaluate(() => {
    const links = [...document.querySelectorAll('#tab-3 p a')];
    return links.map(link => ({
      year: /[0-9]{4}/g.exec(link.href.replace(/(\r\n|\n|\r)/gm,'').trim(' '))[0],
      urls: [link.href],
      // full: link.innerText,
      identifier: /([0-9][0-9ABab][0-9]?)/.exec(link.innerText)[0]
    }));
  });
  fs.writeFile('../data/' + baseName + '.json', JSON.stringify(infosIgn, null, ' '), function(err) {
    if(err) throw err;
  })

  await browser.close();
})();




