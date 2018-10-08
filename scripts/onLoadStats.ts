import { Browser, launch } from 'puppeteer';
import { promisify } from 'util';
import { appendFileSync, writeFile } from 'fs';

const fileName = 'scripts/logs.csv';
const url = 'http://game.biz';

async function test(nbTry = 10) {
  const browser = await launch({headless: false});
  for (let i = 1; i < 50; i++) {
    console.log(`Avec ${i} appels concurrent`);
    await concurrentTest(browser, i, nbTry);
    appendFileSync(fileName, `\n`);
  }
  await browser.close();
}

async function concurrentTest(browser: Browser, nbConcurrent: number, nbTry = 10) {
  for (let i = 0; i < nbTry; i++) {
    console.log('\ttentative démarée à ' + new Date());
    const allTries: Promise<number>[] = [];
    for (let j = 0; j < nbConcurrent; j++) {
      allTries.push(singleTest(browser));
    }
    const ms = await Promise.all(allTries);
    appendFileSync(fileName, `${i},${ms.join((','))}\n`);
  }
}

async function singleTest(browser: Browser): Promise<number> {

  const page = await browser.newPage();
  const msStart = new Date().getTime();
  await page.goto(url, {waitUntil: 'networkidle2'});
  const msEnd = new Date().getTime();
  await page.close();

  return msEnd - msStart;
}

promisify(writeFile)(fileName, 'iter,durées\n')
  .then(() => test(process.argv[2] && +process.argv[2]))
  .then(() => console.log('done'))
  .catch(error => console.log(error));
