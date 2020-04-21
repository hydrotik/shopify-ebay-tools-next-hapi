'use strict';
const crypto = require('crypto');
const _ = require('lodash');
const debug = require('../utils/debug');

class EbayShopifyMapper {
    constructor(config, services) {
        this._config = config;
        this._services = services;
    }

    async map(item) {
        const product = await this._mapProduct(item);
        product.metafields = this._mapMetafields(item, product.images);

        return product;
    }

    async _mapProduct(item) {
        try {
            const titleWords = item.title.split(' ');
            const sku = titleWords.pop();
            const title = titleWords.join(' ');
            return {
                title: title,
                body_html: item.shortDescription,
                vendor: item.brand,
                product_type: item.categoryPath,
                variants: [{
                    price: item.price.value,
                    sku: sku
                }],
                images: await this._getImages(item)
            };
        } catch (e) {
            console.error(e);
            debug(item);
        }

    }

    async _getImages(item) {
        if (this._config.ebay.originalImages === true) {
            return await this._services.ebay.imageFetcher.fetch(item.itemWebUrl)
        }

        if (_.has(item, 'additionalImages')) {
            return item.additionalImages.map(function (image) {
                return { src: image.imageUrl };
            })
        }

        if (_.has(item, 'image') && item.image.imageUrl) {
            return [
                { src:  item.image.imageUrl }
            ]
        }

        return [];
    }

    _mapMetafields(item, images) {
        const ebay_images_hash = crypto
            .createHash('md5')
            .update(images.map(img => img.src).join(' '))
            .digest('hex');

        const metafields = item.localizedAspects.map((aspect) => {
            return {
                namespace: 'features',
                description: aspect.name,
                key: _.snakeCase(_.truncate(aspect.name, { length: 30, omission: '' }).trim()),
                value: aspect.value,
                value_type: 'string'
            };
        });

        metafields.push({
            namespace: 'system',
            description: 'Ebay item id',
            key: 'ebay_id',
            value: item.itemId.split('|')[1],
            value_type: 'string'
        });

        metafields.push({
            namespace: 'system',
            description: 'Ebay images hash',
            key: 'ebay_images_hash',
            value: ebay_images_hash,
            value_type: 'string'
        });

        return metafields;
    }
}

module.exports = EbayShopifyMapper;