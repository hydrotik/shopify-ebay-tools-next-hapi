'use strict';

const EbayApi = require('ebay-node-api');
const Fetcher = require ('./fetcher');
const ImageFetcher = require('./image.fetcher');
const ItemFetcher = require('./item.fetcher');
const ItemsSearcher = require('./items.searcher');

class Ebay {
    constructor(config) {
        this.api = new EbayApi(config.ebay.client);
        this.imageFetcher = new ImageFetcher(config.ebay);
        this.itemsSearcher = new ItemsSearcher(config, this.api);
        this.itemFetcher = new ItemFetcher(config.ebay, this);
        this.fetcher = new Fetcher(this);
    }
}

module.exports = Ebay;