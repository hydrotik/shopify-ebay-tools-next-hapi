'use strict';

const Promise = require('bluebird');
const config = require('../config');
const Services = require('../src/services');
const HandlersExecutor = require('../src/utils/handlers.executor');
const handlersExecutor = new HandlersExecutor(config.shopify.handlers);

(async () => {
    try {
        const services = new Services(config);
        const stat = {
            created: 0,
            updated: 0,
            removed: 0,
            total: 0
        };

        console.log('Fetching products from Shopify');
        const shopifyProducts = await services.shopify.productsFetcher.fetch();
        console.log(`Fetched products: ${shopifyProducts.length}`);

        console.log('Fetching products from Ebay');
        const ebayProducts = await services.ebay.fetcher.fetch();
        console.log(`Fetched products: ${ebayProducts.length}`);
        const ebayProductsIds = ebayProducts.map(product => product.itemId.split('|')[1]);
        stat.total = ebayProducts.length;

        console.log('Removing products from Shopify');
        await Promise.map(shopifyProducts, product => {
            const ebayField = product.metafields.find(metafield => {
                return metafield.key === 'ebay_id';
            });

            if (!ebayField || !ebayProductsIds.includes(ebayField.value)) {
                services.shopify.productRemover.remove(product.id);
                stat.removed++;
            }
        }, { concurrency: 3 });

        console.log('Updating shopify store');
        await Promise
            .map(ebayProducts, async ebayProduct => {
                const id = ebayProduct.itemId.split('|')[1];
                const shopifyProduct = shopifyProducts.find(product => {
                    return product.metafields.find(metafield => {
                        return metafield.key === 'ebay_id' && metafield.value === id;
                    })
                })

                let product = await services.ebayShopifyMapper.map(ebayProduct);
                product = await handlersExecutor.run(product);

                if (shopifyProduct) {
                    if (await services.shopify.productUpdater.update(product, shopifyProduct)) {
                        stat.updated++;
                    }
                } else {
                    await services.shopify.productCreator.create(product);
                    stat.created++;
                }
            }, { concurrency: 3 });

        console.table(stat);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
