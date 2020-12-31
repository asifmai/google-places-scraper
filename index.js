const puppeteer = require('puppeteer-extra');
const UserAgent = require('user-agents');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const pageURL = 'https://www.google.com/';
puppeteer.use(pluginStealth());
let browser;

const run = async () => {
  browser = await launchBrowser();
  const page = await launchPage(browser);

  for (let i = 0; i < 50; i++) {
    const response = await page.goto(pageURL, {
      timeout: 0,
      waitUntil: 'networkidle2',
    });
    if (response.status() === 403) {
      console.log('Your ip Blocked by Website...');
    } else if (response.status() === 404) {
      console.log('Page Not Found...');
    } else {
      console.log(i + 1, ' -- ', response.status());
      await page.waitForSelector('body');
      await page.screenshot({ fullPage: true, path: `screenshot${i}.png` });
    }
  }
  await browser.close();
};

const launchBrowser = async (headless = true) => {
  try {
    const browser = await puppeteer.launch({
      headless,
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--ignore-certificate-errors',
        '--disable-gpu',
        '--proxy-server=5.79.73.131:13010',
      ],
    });

    resolve(browser);
  } catch (error) {
    console.log(`launchBrowser Error: ${error.stack}`);
    reject(error);
  }
};

const launchPage = async (browser) => {
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    const userAgent = new UserAgent();
    await page.setUserAgent(userAgent.toString());

    resolve(page);
  } catch (error) {
    console.log(`launchPage Error: ${error.stack}`);
    reject(error);
  }
};

run();
