import { Client } from '@elastic/elasticsearch';
import { Coin } from './types';

export default class ElasticSearchService {

  static async listCoinsBySupplyAvailability(size: number): Promise<Coin[]> {
    const client = new Client({ node: process.env.ELASTIC_SEARCH_URL })
    const result = await client.search({
      index: 'coins',
      size,
      body: {
        query: {
          exists: {
            field: "maxSupply"
          }
        },
        sort: {
          _script: {
            type: "number",
            script: {
              lang: "painless",
              source: "doc['totalSupply'].value / doc['maxSupply'].value",
            },
            order: "desc"
          },
          totalSupply:'desc'
        }
      }
    })
    return result?.body?.hits?.hits?.map((item: any) => ({ ...item._source}))
  }

  static async listCoinsByMarketDominance(size: number): Promise<Coin[]> {
    const client = new Client({ node: process.env.ELASTIC_SEARCH_URL })
    const aggResult = await client.search({
      index: 'coins',
      size: 0,
      body: {
        query: { match_all: {} },
        aggs: {
          "totalMarketCap": {
            "sum": { "field": "marketCap" }
          }
        }
      }
    })
    const totalMarketCap = aggResult.body.aggregations.totalMarketCap.value;

    const result = await client.search({
      index: 'coins',
      body: {
        size,
        query: {
          match_all: {}
        },
        sort: {
          _script: {
            type: "number",
            script: {
              lang: "painless",
              source: "(doc['marketCap'].value*100) / params.totalMarketCap",
              params: {
                totalMarketCap
              }
            },
            order: "desc"
          },
        }
      }
    })

    return result?.body?.hits?.hits?.map((item: any) => ({ ...item._source, percentage: (item._source.marketCap*100) / totalMarketCap }))
  }

  static async listCoinsByMaxSupply(size: number): Promise<Coin[]> {
    const client = new Client({ node: process.env.ELASTIC_SEARCH_URL })
    const result = await client.search({
      index: 'coins',
      size,
      body: {
        query: {
          exists: {
            field: "maxSupply"
          }
        },
        sort: {
          maxSupply: 'desc'
        }
      }
    })
    return result?.body?.hits?.hits?.map((item: any) => item._source)
  }

}