"use strict"

const _ = require('lodash');

module.exports = (metafields, key) => {
  return ((m = _.find(metafields, { key })) => {
    return m ? m.value : undefined;
  })();
}
