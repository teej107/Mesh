"use strict"

Object.defineProperty(exports, '_esModule', {
    value: true
});

const _packets = {};

class MeshPacketContent {

    static registerPacket(id, factoryCallback)
    {
        let size = Object.keys(_packets).length;
        _packets[id] = factoryCallback;
        let success = size < Object.keys(_packets).length;
        return () => success;
    }

    static parse(json)
    {
        if (typeof json === 'string')
            json = JSON.parse(json);

        if (json.hasOwnProperty('id') && _packets.hasOwnProperty(json.id))
            return _packets[json.id]();

        return null;
    }
}

class FileDataChange extends MeshPacketContent {

    constructor(start, data, length)
    {
        super();
        this.id = FileDataChange.getID();
        this.start = start;
        this.data = data;
        this.length = length;
    }

    static getID()
    {
        return 'FileDataChange';
    }
}

MeshPacketContent.registerPacket(FileDataChange.getID(), (obj) => new FileDataChange(obj.start, obj.data, obj.length));

const lib = {
    FileDataChange: FileDataChange,
    MeshPacketContent: MeshPacketContent
};

exports.default = lib;
exports.MeshPacketContent = MeshPacketContent;
exports.FileDataChange = FileDataChange;

if (module)
{
    let descriptor = Object.getOwnPropertyDescriptor(module, 'exports');
    if (descriptor && descriptor.writable)
        module.exports = lib;
}
