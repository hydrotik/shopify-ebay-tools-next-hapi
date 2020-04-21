'use strict';

const config = require('../config');
const Services = require('../src/services');

(async () => {
    try {
        const services = new Services(config);
        await services.shopify.productsFetcher.fetch();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
