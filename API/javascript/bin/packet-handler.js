'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function handle(data, packetHandler) {
    if (typeof data === 'string') data = JSON.parse(data);
}

var PacketHandler = function PacketHandler() {
    _classCallCheck(this, PacketHandler);
};