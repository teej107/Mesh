Date.prototype._meshUTCTime = function () {
    return this.getTime() + this.getTimezoneOffset() * 60000;
};

module.exports = require('./bin/mesh-api');