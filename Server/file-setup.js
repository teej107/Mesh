const fs = require('fs');
const path = require('path');
const randomAlpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const randomNumeric = "1234567890";

const argumentsBlueprint = {
    'port': 3000,
    'user-directory': () => {
        const dir = '../User Data';
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir);
        return dir;
    },
    'public': '../Client/mesh-web-client/build'
};

const secretBlueprint = {
    'session-secret': randomString
};

let changedFiles = [];

module.exports = {
    arguments: createOrGetData.bind(null, "../arguments.json", argumentsBlueprint),
    secret: createOrGetData.bind(null, "../secret.json", secretBlueprint),
    changedFiles: () => changedFiles
};

function createOrGetData(file, blueprint)
{
    let json = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf-8')) : {};
    let shouldSave = false;
    for (let key in blueprint)
    {
        if (!json.hasOwnProperty(key))
        {
            shouldSave = true;
            let obj = blueprint[key];
            json[key] = typeof obj === 'function' ? obj() : obj;
        }
    }
    if (shouldSave)
    {
        changedFiles.push("Changes have been made to: " + path.resolve(file));
        fs.writeFileSync(file, JSON.stringify(json, null, 2), (err) => {
            if (err)
                throw err;
        });
    }

    return json;
}

function random(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomString(length = 32)
{
    let str = "";
    for (let i = 0; i < length; i++)
    {
        let num = random(0, 3);
        if (num)
            str += randomAlpha.charAt(random(0, randomAlpha.length));
        else
            str += randomNumeric.charAt(random(0, randomNumeric.length));
    }
    return str;
}