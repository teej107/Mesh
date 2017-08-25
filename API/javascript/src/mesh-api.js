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
        this.data = data || null;
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

    constructor(start, data, length, change)
    {
        super();
        this.id = FileDataChange.getID();
        this.start = start;
        this.data = data;
        this.length = length;
        this.change = change || 0;
    }

    setChange(str)
    {
        this.change = this.length < 0 ? "-" + str.substr(this.start + this.length, -this.length) : "+";
        return this.change;
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

MeshPacketContent.registerPacket(FileDataChange.getID(), (obj) => new FileDataChange(obj.start, obj.data, obj.length, obj.change));
MeshPacketContent.registerPacket(SynchronizeData.getID(), (obj) => new SynchronizeData(obj.data));

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
