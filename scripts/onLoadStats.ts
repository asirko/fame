import { Browser, launch } from 'puppeteer';
import { promisify } from 'util';
import { appendFileSync, writeFile } from 'fs';

const fileName = 'scripts/logs.csv';

async function test(nb_try = 10) {
  const browser = await launch({headless: true});
  for (let i = 0; i < nb_try; i++) {
    const ms = await singleTest(browser);
    appendFileSync(fileName, `${i},${ms}\n`);
  }
  await browser.close();
}

async function singleTest(browser: Browser): Promise<number> {
  const msStart = new Date().getTime();

  const page = await browser.newPage();
  await page.goto('https://anim-trader.firebaseapp.com/catalog', {waitUntil: 'networkidle2'});
  await page.close();

  const msEnd = new Date().getTime();
  return msEnd - msStart;
}

promisify(writeFile)(fileName, 'iter,durée\n')
  .then(() => test(process.argv[2] && +process.argv[2]))
  .then(() => console.log('done'))
  .catch(error => console.log(error));
