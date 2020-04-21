'use strict';

const _ = require('lodash');
const BaseHandler = require('../base-handler');

class Vendor extends BaseHandler {
    handle() {
        if (_.has(this._config, this._payload.vendor)) {
            this._payload.vendor = this._config[this._payload.vendor]
        } else {
            this._payload.vendor = this._getVendorFromTitle();
        }

        return this._payload;
    }

    _getVendorFromTitle() {
        const title = this._payload.title.toLowerCase();

        return _.uniq(_.values(this._config)).find((vendor) => {
            return title.search(vendor.toLowerCase()) !== -1;
        }) || '';
    }
}

module.exports = Vendor;
