'use strict';

const BaseHandler = require('../handlers/base-handler');

class HandlersExecutor {
    constructor(handlers) {
        this._handlers = handlers;
    }

    async run(payload) {
        try {
            for (const handler of this._handlers) {
                payload = await this._execute(handler, payload)
            }

            return payload;
        } catch (e) {
            console.error(e)
        }
    }

    async _execute(handler, payload) {
        let Handler;

        if (handler instanceof BaseHandler) {
            Handler = new handler(payload, []);
        } else if (handler.handler) {
            const config = handler.config ? handler.config : [];
            Handler = new handler.handler(payload, config);
        } else if (typeof handler === 'function') {
            return handler(payload);
        } else {
            throw Error('Invalid handler.')
        }

        if (Handler instanceof BaseHandler) {
            return Handler.handle();
        }

        throw Error('Invalid handler.')
    }
}

module.exports = HandlersExecutor;
