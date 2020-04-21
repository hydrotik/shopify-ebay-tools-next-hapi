'use strict';

const Promise = require('bluebird');
const debug = require('../../utils/debug');
const retry = require('../../utils/retry');

class ProductCreator {
    constructor (config, shopifyServices) {
        this._config = config;
        this._api = shopifyServices.api;
    }

    async create(product) {
        try {
            const metafields = product.metafields;
            delete product.metafields;

            debug(`Creating new product ${product.title}`);

            if (product.images.length === 0) {
                console.error('Empty images field');
            }

            const createdProduct = await retry(async () => {
                return await this._api.product.create(product);
            }).catch(e => console.log(e));

            await Promise.map(metafields, async metafield => {
                metafield.owner_resource = 'product';
                metafield.owner_id = createdProduct.id;
                await retry(async () => {
                    await this._api.metafield.create(metafield);
                }).catch(e => console.log(e))
            }, { concurrency: 5 });
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = ProductCreator;