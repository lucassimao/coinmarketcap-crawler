import express from 'express';
import ElasticSearchService from './elasticSearchService';

const app = express();

app.get('/coins/bySupplyAvailability',async (req,res) => {
    const size = Number(req.query.size) || 5;
    const coins = await ElasticSearchService.listCoinsBySupplyAvailability(size); 
    res.json(coins).end()
})

app.get('/coins/byHighestMarketDominance',async (req,res) => {
    const size = Number(req.query.size) || 5;
    const coins = await ElasticSearchService.listCoinsByMarketDominance(size); 
    res.json(coins).end()
})

app.get('/coins/byMaxSupply',async (req,res) => {
    const size = Number(req.query.size) || 5;
    const coins = await ElasticSearchService.listCoinsByMaxSupply(size); 
    res.json(coins).end()
})

app.listen(process.env.PORT ,() =>  console.log(`Backend running`));