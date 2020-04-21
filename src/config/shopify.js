'use strict';

require('dotenv').config();
const path = require('path');
const handlersConfig = require('./handlers');

module.exports = {
    client: {
        shopName: process.env.SHOPIFY_NAME,
        apiKey: process.env.SHOPIFY_API_KEY,
        password: process.env.SHOPIFY_PASSWORD,
        autoLimit: { calls: 2, interval: 1000, bucketSize: 35 }
        // autoLimit: true
    },
    handlers: [
        {
            handler: require('../src/handlers/shopify/vendor'),
            config: handlersConfig.vendor
        },
        {
            handler: require('../src/handlers/shopify/tags'),
            config: handlersConfig.tags
        },
        function(product) {
            product.product_type = 'Watches';
            return product;
        }
    ],
    softRemove: process.env.SHOPIFY_SOFT_REMOVE,
    outputDir: path.resolve(__dirname, '../var/shopify'),
    // cacheDir: false
    cacheDir: path.resolve(__dirname, '../var/shopify/cache')
};
