'use strict';

const request = require('request-promise');
const cheerio = require('cheerio');
const _ = require('lodash');
const debug = require('../../utils/debug');
const Cache = require('../../utils/cache');

class ImageFetcher {
    constructor(config) {
        this._config = config;
    }

    async fetch(pageUri) {
        try {
            const cache = new Cache(`${this._config.cacheDir}/images`);
            const cacheId = _.last(pageUri.split('/'));
            let images = cache.load(cacheId);

            if (_.isEmpty(images)) {
                debug(`from eBay: ${pageUri}`);
                images = [];
                const requestOptions = {
                    uri: pageUri,
                    transform: function (body) {
                        return cheerio.load(body);
                    }
                };

                await request(requestOptions).then(($) => {
                    $('.tdThumb img').each((n, img) => {
                        images.push($(img).attr('src').replace('-l64', '-l1600'))
                    });

                    if (_.isEmpty(images)) {
                        debug('Preview not available');
                        $('img#icImg').each((n, img) => {
                            images.push($(img).attr('src').replace('-l500', '-l1600'))
                        });
                    }

                    images = _.uniq(images);
                });

                cache.put(cacheId, images);
            }

            return images;
        } catch (e) {
            console.error(e)
        }
    }
}

module.exports = ImageFetcher;