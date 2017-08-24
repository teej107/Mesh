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

        this.timestamp = Date.now();
    }

    _createClass(MeshPacketContent, [{
        key: 'handle',
        value: function handle(obj) {
            throw 'Default implementation is not supported';
        }
    }, {
        key: 'toString',
        value: function toString() {
            return JSON.stringify(this);
        }
    }], [{
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

            if (json.hasOwnProperty('id') && _packets.hasOwnProperty(json.id)) return _packets[json.id](json);

            return null;
        }
    }, {
        key: 'getID',
        value: function getID() {
            return "MeshPacketContent";
        }
    }]);

    return MeshPacketContent;
}();

var SynchronizeData = function (_MeshPacketContent) {
    _inherits(SynchronizeData, _MeshPacketContent);

    function SynchronizeData(data) {
        _classCallCheck(this, SynchronizeData);

        var _this = _possibleConstructorReturn(this, (SynchronizeData.__proto__ || Object.getPrototypeOf(SynchronizeData)).call(this));

        _this.id = SynchronizeData.getID();
        _this.data = data || null;
        return _this;
    }

    _createClass(SynchronizeData, [{
        key: 'handle',
        value: function handle() {
            var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            return this.data ? this.data : str;
        }
    }], [{
        key: 'getID',
        value: function getID() {
            return "SynchronizeData";
        }
    }]);

    return SynchronizeData;
}(MeshPacketContent);

var FileDataChange = function (_MeshPacketContent2) {
    _inherits(FileDataChange, _MeshPacketContent2);

    function FileDataChange(start, data, length, change) {
        _classCallCheck(this, FileDataChange);

        var _this2 = _possibleConstructorReturn(this, (FileDataChange.__proto__ || Object.getPrototypeOf(FileDataChange)).call(this));

        _this2.id = FileDataChange.getID();
        _this2.start = start;
        _this2.data = data;
        _this2.length = length;
        _this2.change = change || 0;
        return _this2;
    }

    _createClass(FileDataChange, [{
        key: 'setChange',
        value: function setChange(str) {
            this.change = this.length < 0 ? "-" + str.substr(this.start + this.length, -this.length) : "+";
            return this.change;
        }
    }, {
        key: 'handle',
        value: function handle(str) {
            if (this.length < 0) return str.substring(0, this.start + this.length) + str.substring(this.start);

            return str.substring(0, this.start) + this.data + str.substring(this.start + this.data.length);
        }
    }], [{
        key: 'getID',
        value: function getID() {
            return 'FileDataChange';
        }
    }]);

    return FileDataChange;
}(MeshPacketContent);

MeshPacketContent.registerPacket(FileDataChange.getID(), function (obj) {
    return new FileDataChange(obj.start, obj.data, obj.length, obj.change);
});
MeshPacketContent.registerPacket(SynchronizeData.getID(), function (obj) {
    return new SynchronizeData(obj.data);
});

var lib = {
    FileDataChange: FileDataChange,
    MeshPacketContent: MeshPacketContent,
    SynchronizeData: SynchronizeData
};

exports.default = lib;
for (var key in lib) {
    exports[key] = lib[key];
}

if (module) {
    var descriptor = Object.getOwnPropertyDescriptor(module, 'exports');
    if (descriptor && descriptor.writable) module.exports = lib;
}
