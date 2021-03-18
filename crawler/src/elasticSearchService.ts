import { Client } from '@elastic/elasticsearch';
import { BulkStats } from '@elastic/elasticsearch/lib/Helpers';
import { Coin } from './types';

export default class ElasticSearchService {

    static async upsert(coins: Coin[]): Promise<BulkStats>{
        const client = new Client({ node: process.env.ELASTIC_SEARCH_URL })
        return client.helpers.bulk({
            datasource: coins,
            onDocument(doc) {
                return [
                    { update: { _index: 'coins', _id: doc.symbol } },
                    { doc_as_upsert: true }
                ]
            }
        })
    }

}