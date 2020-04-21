'use strict';

const debug = require('../../utils/debug');
const retry = require('../../utils/retry');

class ProductRemover {
    constructor (config, shopifyServices) {
        this._config = config;
        this._api = shopifyServices.api;
    }

    async remove(productId) {
        try {
            await retry(async () => {
                if (this._config.softRemove === true) {
                    debug(`Unpublishing product ${productId}`);
                    await this._api.product.update(productId, { published: false });
                } else {
                    debug(`Removing product ${productId}`);
                    await this._api.product.delete(productId);
                }
            }).catch(e => console.log(e))
        } catch (e) {
            console.error(e, productId);
        }
    }
}

module.exports = ProductRemover;