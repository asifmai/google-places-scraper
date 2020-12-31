const puppeteer = require('puppeteer-extra');
const UserAgent = require('user-agents');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const { siteLink, searchKeyword, numberOfPages } = require('./keys');
puppeteer.use(pluginStealth());
let browser;

const run = () =>
  new Promise(async (resolve, reject) => {
    try {
      browser = await launchBrowser();
      const businesses = await fetchBusinesses();

      await browser.close();
    } catch (error) {
      console.log(`run error: ${error.stack}`);
      reject(error);
    }
  });

const fetchBusinesses = () =>
  new Promise(async (resolve, reject) => {
    try {
      console.log(`Navigating to ${siteLink}`);
      const page = await launchPage(browser);
      await page.goto(siteLink, { timeout: 0, waitUntil: 'networkidle2' });
      await page.screenshot({ path: 'screenshot.png' });
      await page.waitForSelector('input#searchboxinput');
      console.log(`Typing Keyword [${searchKeyword}]`);
      await page.type('input#searchboxinput', searchKeyword, { delay: 50 });
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);
      await page.waitForSelector(
        '.section-layout.section-scrollbox.scrollable-y[aria-label]'
      );
      console.log('Taking screenshot');
      await page.close();
      resolve(true);
    } catch (error) {
      console.log(`fetchBusinesses error: ${error}`);
      reject(error);
    }
  });

const launchBrowser = (headless = true) =>
  new Promise(async (resolve, reject) => {
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
  });

const launchPage = async (browser) =>
  new Promise(async (resolve, reject) => {
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
  });

run();
