'use strict';

const _ = require('lodash');
const Cache = require('../../utils/cache');
const debug = require('../../utils/debug');

class ItemsSearcher {
    constructor(config, ebayApi) {
        this._config = config.ebay;
        this._api = ebayApi;
    }

    async search() {
        const cache = new Cache(this._config.cacheDir);
        let items = cache.load('found-items');
        let offset = 0;
        let processFlag = true;

        debug('Fetching items list');

        if (items) {
            debug('loaded from cache');
            return items;
        }

        items = [];
        await this._api.getAccessToken();
        while (processFlag) {
            debug(`offset: ${offset}`);
            await this._api.searchItems({
                categoryId: this._config.search.categoryId,
                filter: this._config.search.filter,
                // limit: 1,
                limit: this._config.search.limit,
                offset
            }).then((data) => {
                data = JSON.parse(data);
                items.push(data.itemSummaries);
                offset += this._config.search.limit;
                processFlag = offset < data.total;
                // processFlag = false;
            });
        }
        debug('Fetching items is finished');

        items = _.flatten(items);
        cache.put('found-items', items);

        return _.flatten(items);
    }
}

module.exports = ItemsSearcher;