const fs = require('fs');
const puppeteer = require('puppeteer');

var program = require('commander');

program
  .arguments('<url>')
  .action(function(url) {

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
        const h4 = [...document.querySelectorAll('#tab-3 h4')];
        return h4.filter(el=> /^[0-9][0-9ABab][0-9]? -/g.test(el.innerText)).map(el => {
          return {
            identifier: /^[0-9][0-9ABab][0-9]?/g.exec(el.innerText)[0],
            // full: el.innerText.replace(/(\r\n|\n|\r)/gm,'').trim(' '),
            year: /[0-9]{4}/g.exec(el.innerText.replace(/(\r\n|\n|\r)/gm,'').trim(' '))[0],
            urls: ([...el.nextSibling.querySelectorAll('a')]).map(a => a.href)
          };
        });
      });
      fs.writeFile('../data/' + baseName + '.json', JSON.stringify(infosIgn, null, ' '), function(err) {
        if(err) throw err;
      })

      // console.log('OnlineAvailability:', infosIgn);

      await browser.close();
    })();

  })
  .parse(process.argv);


