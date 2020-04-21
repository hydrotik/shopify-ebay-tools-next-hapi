'use strict';

require('dotenv').config();
const path = require('path');

module.exports = {
    client: {
        clientID: process.env.EBAY_CLIENT_ID,
        clientSecret: process.env.EBAY_SECRET,
        env: 'PRODUCTION',
        headers: {
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        },
        body: {
            grant_type: 'client_credentials',
            scope: 'https://api.ebay.com/oauth/api_scope'
        }
    },
    search: {
        categoryId: process.env.EBAY_SEARCH_CATEGORY_ID,
        filter: process.env.EBAY_SEARCH_CATEGORY_FILTER,
        limit: 50
    },
    originalImages: process.env.EBAY_USE_ORIGINAL_IMAGES,
    outputDir: path.resolve(__dirname, '../var/ebay'),
    // cacheDir: false
    cacheDir: path.resolve(__dirname, '../var/ebay/cache')
};
