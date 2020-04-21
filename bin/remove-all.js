'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const config = require('../config');
const Services = require('../src/services');
const retry = require('../src/utils/retry');
const debug = require('../src/utils/debug');

(async () => {
    try {
        const services = new Services(config);
        console.log('Removing all products from shopify store');

        const perPage = 50;
        const productsCount = await services.shopify.api.product.count();
        const pagesCount = Math.ceil(productsCount / perPage);

        await Promise.map(_.range(1, pagesCount + 1), async (page) => {
            await services.shopify.api.product.list({ limit: perPage , page: page}).then(async (products) => {
                await Promise.map(products, async (product) => {
                    await retry(async () => {
                        debug(product.id);
                        await services.shopify.api.product.delete(product.id);
                    });
                }, {concurrency: 5})
            })
        }, {concurrency: 3});

        console.log(`${productsCount} products was removed`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
