'use strict';

const Ebay = require('./ebay');
const Shopify = require('./shopify');
const EbayShopifyMapper = require('./ebay-shopify.mapper');


class Services {
    constructor(config) {
        this.ebay = new Ebay(config);
        this.shopify = new Shopify(config);
        this.ebayShopifyMapper = new EbayShopifyMapper(config, this);
    }
}

module.exports = Services;