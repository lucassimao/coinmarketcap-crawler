export interface Coin {
    name: string;
    symbol: string;
    price: number;
    marketCap: number;
    totalSupply: number;
    maxSupply?: number;
}