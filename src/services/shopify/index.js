'use strict';

const ShopifyAPI = require('shopify-api-node');
const ProductsFetcher = require('./products.fetcher');
const ProductsUpdater = require('./product.updater');
const ProductsCreator = require('./product.creator');
const ProductsRemover = require('./product.remover');

class Shopify {
    constructor(config) {
        this.api = new ShopifyAPI(config.shopify.client);
        this.productsFetcher = new ProductsFetcher(config.shopify, this);
        this.productUpdater = new ProductsUpdater(config.shopify, this);
        this.productCreator = new ProductsCreator(config.shopify, this);
        this.productRemover = new ProductsRemover(config.shopify, this);
    }
}

module.exports = Shopify;
