'use strict';

const _ = require('lodash');
const BaseHandler = require('../base-handler');

class Tags extends BaseHandler {
    handle() {
        this._tags = [];

        _.forEach(this._config, (tagConfig, tagName) => {
            const dataType = typeof tagConfig;

            if (dataType === 'string') {
                this._buildTag(tagName, tagConfig);
            } else if (dataType === 'object') {
                this._tagFromMetafield(tagName, tagConfig);
            } else if (dataType === 'function') {
                this._tags.push(tagConfig(this._payload));
            }
        });

        this._payload.tags = _.uniq(this._tags).filter(Boolean).sort().join(', ');

        return this._payload
    }

    _tagFromMetafield(field, replacement) {
        const metafield = _.find(this._payload.metafields, { namespace: 'features', description: field });

        if (metafield) {
            const values = metafield.value.split(',').map(v => v.trim());

            for (let value of values) {
                value = replacement[value] ? replacement[value] : value;
                this._buildTag(field, value);
            }
        }
    }

    _buildTag(name, value) {
        if (typeof value === 'object') {
            for (const v of value) {
                this._buildTag(name, v);
            }
        } else {
            this._tags.push(_.kebabCase(name) + ':' + value);
        }
    }
}

module.exports = Tags;