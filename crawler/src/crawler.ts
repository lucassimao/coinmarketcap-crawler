import puppeteer, { ElementHandle, Page } from 'puppeteer';
import ElasticSearchService from './elasticSearchService';
import { COLUMN_SELECTOR, Coin } from "./types";

const autoScroll = async (page: Page) => {
    return await page.evaluate(async () => {
        await new Promise(resolve => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve(null);
                }
            }, 100);
        });
    });
}

const getInnerHTML = async (cssSelector: string, tableRow: ElementHandle): Promise<string> => {
    const element = await tableRow.$(cssSelector);
    const property = await element?.getProperty('innerText')
    const value = await property?.jsonValue()
    return (value as string)?.trim();
}



const mapToNumber = (text: string): number => parseFloat(text.replace(/[$,]/g, ''));

export const startCrawler = async () => {

    console.log('starting crawler ...');
    

    const browser = await puppeteer.launch({ headless: true, args: ['--start-maximized','--disable-dev-shm-usage','--no-sandbox'] });
    const page = await browser.newPage();
    page.setViewport({ width: 1800, height: 800, isMobile: false })
    await page.goto('https://coinmarketcap.com/');



    const buttonCustomize = await page.$('div.table-control-area button:last-child');
    await buttonCustomize?.click()

    await page.waitForSelector('div[class^="modalWrpper__"] > div > div:nth-child(2) > span > div:nth-child(5) > div:nth-child(2)');

    const buttonCirculatingSupply = await page.$('div[class^="modalWrpper__"] > div > div:nth-child(2) > span > div:nth-child(5) > div:nth-child(2) > span:nth-child(1)');
    await buttonCirculatingSupply?.click();

    const buttonTotalSupply = await page.$('div[class^="modalWrpper__"] > div > div:nth-child(2) > span > div:nth-child(5) > div:nth-child(2) > span:nth-child(2)');
    await buttonTotalSupply?.click();

    const buttonMaxSupply = await page.$('div[class^="modalWrpper__"] > div > div:nth-child(2) > span > div:nth-child(5) > div:nth-child(2) > span:nth-child(3)');
    await buttonMaxSupply?.click();

    const buttonApplyChanges = await page.$('div[class^="modalWrpper__"] div[class^="footer__"] button:nth-child(2)');
    await buttonApplyChanges?.click();


    // await page.screenshot({ path: 'example2.png' });

    await autoScroll(page);


    const table = await page.$('table');
    if (!table) {
        return
    }
    const tableRows = await table?.$$('tbody tr');
    const coins: Coin[] = [];
    for (const tableRow of tableRows) {
        const name = await getInnerHTML(COLUMN_SELECTOR.NAME, tableRow);
        if (!name) {
            // ignores ads column
            continue
        }
        const symbol = await getInnerHTML(COLUMN_SELECTOR.SYMBOL, tableRow);
        const price = await getInnerHTML(COLUMN_SELECTOR.PRICE, tableRow);
        const marketCap = await getInnerHTML(COLUMN_SELECTOR.MARKET_CAP, tableRow);
        const totalSupply = await getInnerHTML(COLUMN_SELECTOR.TOTAL_SUPPLY, tableRow);
        const maxSupply = await getInnerHTML(COLUMN_SELECTOR.MAX_SUPPLY, tableRow);

        coins.push({
            name, symbol, price: mapToNumber(price), marketCap: mapToNumber(marketCap),
            totalSupply: mapToNumber(totalSupply), maxSupply: maxSupply !== '--' ? mapToNumber(maxSupply) : undefined
        })
    }

    browser.close();

    if (coins.length) {
        console.log('updating elasticsearch index ...');
        const result = await ElasticSearchService.upsert(coins);
        console.log('resut: ',result);
    }
};