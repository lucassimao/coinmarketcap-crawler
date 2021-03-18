import { startCrawler } from "./crawler";

const main = async () => {
    await startCrawler();
    setTimeout(main, 5000)
}

main();