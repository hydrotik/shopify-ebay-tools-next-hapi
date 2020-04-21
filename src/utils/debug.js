'use strict';

require('dotenv').config();

module.exports = (message) => {
    if (process.env.DEBUG ? process.env.DEBUG : false) {
        console.debug(message)
    }
};
