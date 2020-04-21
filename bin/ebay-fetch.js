'use strict';

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const config = require('../config');
const Services = require('../src/services');
const HandlersExecutor = require('../src/utils/handlers.executor');

(async () => {
    try {
        const services = new Services(config);
        const handlersExecutor = new HandlersExecutor(config.shopify.handlers);
        console.log('Fetching products from Ebay');
        const ebayProducts = await services.ebay.fetcher.fetch();
        const products = [];

        console.log('Preparing products for Shopify');
        await Promise.map(ebayProducts, async (ebayProduct) => {
            let product = await services.ebayShopifyMapper.map(ebayProduct);
            product = await handlersExecutor.run(product);
            products.push(product);
        }, { concurrency: 3 });

        if (!fs.existsSync(config.ebay.outputDir)) {
            fs.mkdirSync(config.ebay.outputDir, { recursive: true });
        }

        const shopifyOutput = 'shopify-ready.json';
        const shopifyJson = JSON.stringify(products, null, 4);
        fs.writeFileSync(path.resolve(config.ebay.outputDir, shopifyOutput), shopifyJson)
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
