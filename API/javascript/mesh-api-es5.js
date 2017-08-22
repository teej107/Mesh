"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, '_esModule', {
    value: true
});

var _packets = {};

var MeshPacketContent = function () {
    function MeshPacketContent() {
        _classCallCheck(this, MeshPacketContent);
    }

    _createClass(MeshPacketContent, null, [{
        key: 'registerPacket',
        value: function registerPacket(id, factoryCallback) {
            var size = Object.keys(_packets).length;
            _packets[id] = factoryCallback;
            var success = size < Object.keys(_packets).length;
            return function () {
                return success;
            };
        }
    }, {
        key: 'parse',
        value: function parse(json) {
            if (typeof json === 'string') json = JSON.parse(json);

            if (json.hasOwnProperty('id') && _packets.hasOwnProperty(json.id)) return _packets[json.id]();

            return null;
        }
    }]);

    return MeshPacketContent;
}();

var FileDataChange = function (_MeshPacketContent) {
    _inherits(FileDataChange, _MeshPacketContent);

    function FileDataChange(start, data, length) {
        _classCallCheck(this, FileDataChange);

        var _this = _possibleConstructorReturn(this, (FileDataChange.__proto__ || Object.getPrototypeOf(FileDataChange)).call(this));

        _this.id = FileDataChange.getID();
        _this.start = start;
        _this.data = data;
        _this.length = length;
        return _this;
    }

    _createClass(FileDataChange, null, [{
        key: 'getID',
        value: function getID() {
            return 'FileDataChange';
        }
    }]);

    return FileDataChange;
}(MeshPacketContent);

MeshPacketContent.registerPacket(FileDataChange.getID(), function (obj) {
    return new FileDataChange(obj.start, obj.data, obj.length);
});

var lib = {
    FileDataChange: FileDataChange,
    MeshPacketContent: MeshPacketContent
};

exports.default = lib;
exports.MeshPacketContent = MeshPacketContent;
exports.FileDataChange = FileDataChange;

if (module) {
    var descriptor = Object.getOwnPropertyDescriptor(module, 'exports');
    if (descriptor && descriptor.writable) module.exports = lib;
}
