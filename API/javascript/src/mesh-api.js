"use strict"

Object.defineProperty(exports, '_esModule', {
    value: true
});

const _packets = {};

class MeshPacketContent {

    constructor()
    {
        this.timestamp = Date.now();
    }

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
            return _packets[json.id](json);

        return null;
    }

    static getID()
    {
        return "MeshPacketContent";
    }

    handle(obj)
    {
        throw 'Default implementation is not supported';
    }

    toString()
    {
        return JSON.stringify(this);
    }
}

class SynchronizeData extends MeshPacketContent {
    constructor(data)
    {
        super();
        this.id = SynchronizeData.getID();
        this.data = (data && typeof data === 'object'? data.data : data) || null;
    }

    handle(str = "")
    {
        return this.data ? this.data : str;
    }

    static getID()
    {
        return "SynchronizeData"
    }
}

class FileDataChange extends MeshPacketContent {

    constructor(start, data, length, totalLength)
    {
        super();
        this.id = FileDataChange.getID();

        const isObj = typeof start === 'object';
        this.start = isObj ? start.start : start;
        this.data = isObj ? start.data : data;
        this.length = isObj ? start.length : length;
        this.totalLength = isObj ? start.totalLength : totalLength;
    }

    handle(str)
    {
        var charArray = str.split('');
        if (this.length < 0)
            charArray.splice(this.start + this.length, -this.length);
        else
            charArray.splice(this.start, 0, this.data);

        return charArray.join('');
    }

    static getID()
    {
        return 'FileDataChange';
    }
}

MeshPacketContent.registerPacket(FileDataChange.getID(), (obj) => new FileDataChange(obj));
MeshPacketContent.registerPacket(SynchronizeData.getID(), (obj) => new SynchronizeData(obj));

const lib = {
    FileDataChange: FileDataChange,
    MeshPacketContent: MeshPacketContent,
    SynchronizeData: SynchronizeData
};

exports.default = lib;
for (var key in lib)
{
    exports[key] = lib[key];
}

if (module)
{
    let descriptor = Object.getOwnPropertyDescriptor(module, 'exports');
    if (descriptor && descriptor.writable)
        module.exports = lib;
}
