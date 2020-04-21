'use strict';

const Promise = require("bluebird");
const _ = require('lodash');
const Cache = require('../../utils/cache');
const debug = require('../../utils/debug');
const retry = require('../../utils/retry');

class ProductsFetcher {
    constructor (config, shopifyServices) {
        this._config = config;
        this._api = shopifyServices.api;
    }

    async fetch(queryParams = {}) {
        try {
            const cache = new Cache(this._config.cacheDir);
            let productsList = cache.load('products-list');

            if (!_.isEmpty(productsList)) {
                debug(`Items from from cache`);
                debug(`count: ${productsList.length}`);
                return productsList;
            }

            debug(`Items from from shopify`);
            productsList = [];
            queryParams = {...{ limit: 250, published_status: 'published' }, ...queryParams};

            const productsCount = await this._api.product.count(queryParams);
            const pagesCount = Math.ceil(productsCount / queryParams.limit);
            debug(`count: ${productsCount}`);

            await Promise.map(_.range(1, pagesCount + 1), async (page) => {
                await this._api.product.list({...queryParams, ...{page: page}}).then(async (products) => {
                    debug(`page: ${page}`);
                    await Promise.map(products, async (product) => {
                        debug(`product: ${product.title}`);
                        await retry(async () => {
                            debug(`metafield: ${product.title}`);
                            await this._api.metafield
                                .list({
                                    metafield: { owner_resource: 'product', owner_id: product.id }
                                })
                                .then((metafields) => {
                                    product.metafields = metafields;
                                    productsList.push(product)
                                })
                        }).catch(e => console.log(e))
                    }, {concurrency: 5})
                })
            }, {concurrency: 3});

            if (productsList.length) {
                cache.put('products-list', productsList);
            }

            return productsList;
        } catch (e) {
            console.error(e)
        }
    }
}

module.exports = ProductsFetcher;