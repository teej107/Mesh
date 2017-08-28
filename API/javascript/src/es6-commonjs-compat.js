"use strict"

function exportJS(obj)
{
    Object.defineProperty(this.exports, '_esModule', {
        value: true
    });

    for (var key in obj)
    {
        this.exports[key] = obj[key];
    }

    if (this.module)
    {
        let descriptor = Object.getOwnPropertyDescriptor(this.module, 'exports');
        if (descriptor && descriptor.writable)
            this.module.exports = obj;
    }
}

exportJS({'default': exportJS});