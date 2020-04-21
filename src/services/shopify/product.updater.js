'use strict';

const _ = require('lodash');
const Entities = require('html-entities').Html5Entities
const Promise = require('bluebird');
const retry =  require('../../utils/retry');
const debug =  require('../../utils/debug');
const entities = new Entities();

class ProductUpdater {
    constructor (config, shopifyServices) {
        this._config = config;
        this._api = shopifyServices.api;
    }

    async update(ebayProduct, shopifyProduct) {
        try {
            let updated = false
            const productDiff = this._getDiff(ebayProduct, shopifyProduct)
            const metafields = productDiff.metafields;
            delete productDiff.metafields


            if (!_.isEmpty(productDiff)) {
                await this.__updateProduct(productDiff, shopifyProduct);
                updated = true;
            }

            if (!_.isEmpty(metafields)) {
                await this.__updateMetafields(metafields, shopifyProduct);
                updated = true;
            }

            return updated;
        } catch (e) {
            console.error(e);
        }
    }

    async __updateProduct(diff, src) {
        debug(`Updating product ${src.title}`);

        await retry(async () => {
            await this._api.product.update(src.id, diff);
        }).catch(e => console.log(e));
    }

    async __updateMetafields(metafields, src) {
        debug(`Updating metafields ${src.title}`);

        await Promise.map(metafields, async metafield => {
            if (_.has(metafield, 'id')) {
                await retry(() => {
                    this._api.metafield.update(metafield.id, metafield);
                }).catch(e => console.log(e))
            } else {
                metafield.owner_resource = 'product';
                metafield.owner_id = src.id;
                await retry(() => {
                    this._api.metafield.create(metafield);
                }).catch(e => console.log(e))
            }
        }, { concurrency: 5 });
    }

    _getDiff(_new, _exist) {
        const result = Array.isArray(_new) ? [] : {};

        for (const field of Object.keys(_new)) {
            if (field === 'images') {
                continue;
            }

            if (field === 'metafields') {
                result.metafields = this._getDiffMetafields(_new.metafields, _exist.metafields)
                continue;
            }

            if (Array.isArray(_new[field]) || typeof _new[field] === 'object') {
                const newValue = this._getDiff(_new[field], _exist[field]);
                if (!_.isEmpty(newValue)) {
                    result[field] = newValue;
                }
                continue;
            }

            if (_new[field] && _.has(_exist, field)) {
                const newValue = entities.decode(_new[field]);
                const existValue = entities.decode(_exist[field]);

                if (newValue !== existValue) {
                    result[field] = newValue
                }
            }
        }

        return result;
    }

    _getDiffMetafields(_new, _exist) {
        return _new.map(metafield => {

            const existMetafield = _exist.find(_m => {
                return metafield.namespace === _m.namespace
                    && metafield.key === _m.key;
            })

            if (existMetafield) {
                if (metafield.value !== existMetafield.value) {
                    return metafield;
                }
                return;
            }

            return metafield;
        }).filter(Boolean);
    }
}

module.exports = ProductUpdater;