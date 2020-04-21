'use strict';

const Promise = require('bluebird');
const retry = require('../../utils/retry');

class Fetcher {
    constructor(ebayServices) {
        this._itemsSearcher = ebayServices.itemsSearcher;
        this._itemFetcher = ebayServices.itemFetcher;
    }

    async fetch() {
        const itemsList = await this._itemsSearcher.search();
        let products = [];

        await Promise.map((itemsList), async (item) => {
            await retry(async () => {
                const product = await this._itemFetcher.fetch(item.itemId);
                if (product) {
                    products.push(product);
                }
            }).catch(e => console.log(e))
        }, {concurrency: 5});

        return products;
    }
}

module.exports = Fetcher;