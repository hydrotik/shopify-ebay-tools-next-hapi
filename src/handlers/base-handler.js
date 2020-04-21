'use strict';

class BaseHandler {
    constructor(payload, config = []) {
        this._payload = payload;
        this._config = config;
    }

    handle() {
        return this._payload;
    }
}

module.exports = BaseHandler;
