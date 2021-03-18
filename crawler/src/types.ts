export enum COLUMN_SELECTOR {
    NAME = 'td:nth-child(3) a div div p',
    SYMBOL = 'td:nth-child(3) a div div div p',
    PRICE = 'td:nth-child(4) div a',
    MARKET_CAP = 'td:nth-child(7) p',
    TOTAL_SUPPLY = 'td:nth-child(10)',
    MAX_SUPPLY = 'td:nth-child(11)',
}
export interface Coin {
    name: string;
    symbol: string;
    price: number;
    marketCap: number;
    totalSupply: number;
    maxSupply?: number;
}