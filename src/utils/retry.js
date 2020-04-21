'use strict';

const Promise = require('bluebird');
const debug = require('./debug');

const retry = async (fn, limit = 10, retryAfter = 1000) => {
    return await Promise.resolve()
        .then(fn)
        .catch(e => {
            if (--limit > 0) {
                debug(`retry ${limit}`);
                return Promise.resolve().delay(retryAfter).then(() => retry(fn(), limit, retryAfter));
            }
          debug(fn);
            throw e
        })
};

module.exports = retry;