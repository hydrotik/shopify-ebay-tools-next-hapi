'use strict';

const _ = require('lodash');
const Cache = require('../../utils/cache');
const debug = require('../../utils/debug');
const retry = require('../../utils/retry');

class ItemFetcher {
    constructor(config, ebayServices) {
        this._config = config;
        this._ebayApi = ebayServices.api;
    }

    async fetch(ebaiId) {
        try {
            const cache = new Cache(this._config.cacheDir);
            ebaiId = this._normalizeId(ebaiId);
            const cacheId = ebaiId.split('|')[1];
            let product = cache.load(cacheId);

            if (_.isEmpty(product)) {
                debug(`${ebaiId} from eBay`);
                await this._ebayApi.getAccessToken();
                await retry(async () => {
                    await this._ebayApi.getItem(ebaiId).then((data) => {
                        product = data;
                    });
                });

                cache.put(cacheId, product);
            }

            return product;
        } catch (e) {
            console.error(e)
        }
    }

    _normalizeId(ebaiId) {
        if (ebaiId.split('|').length === 1) {
            ebaiId = `v1|${ebaiId}|0`;
        }
        return ebaiId;
    }
}

module.exports = ItemFetcher;
