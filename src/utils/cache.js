'use strict';

const fs = require('fs');
const path = require('path');

class Cache {
    constructor (path) {
        this._path = path;
    }
    
    load(id) {
        if (this._path === false) {
            return;
        }

        const file = path.resolve(this._path, id + '.json');

        if (fs.existsSync(file)) {
            const data = fs.readFileSync(file);
            return JSON.parse(data);
        }
    }
    
    put(id, data) {
        if (this._path === false) {
            return;
        }

        if (!fs.existsSync(this._path)) {
            fs.mkdirSync(this._path, { recursive: true });
        }

        const file = path.resolve(this._path, id + '.json');
        const json = JSON.stringify(data);
        fs.writeFileSync(file, json);
    }
}

module.exports = Cache;
