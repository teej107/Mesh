module.exports = function () {
    return {
        //keys should be a function of 'app'
        'get': new Get(),
        'post': new Post(),
        'put': new Put(),
        'ws': new Ws()
    };
};

const Stream = require('stream');
const ConnectionManager = require('./connection-manager');
const connectionManager = new ConnectionManager();
const MeshAPI = require('mesh-api');
const root = "/api";

function Endpoint(endpoint, callback, paramsCheck)
{
    this.endpoint = endpoint.startsWith(root) ? endpoint : root + endpoint;
    this.callback = callback;
    this.paramsCheck = typeof paramsCheck === 'function' ? paramsCheck : (req, res, next) => next();
}

function Get()
{

}

function Post()
{

}

function Put()
{

}

let text = "Sample Text!";

function Ws()
{
    this.connect = new Endpoint('/:owner/:project',
        (ws, req) => {
            connectionManager.push(ws);
            ws.send(new MeshAPI.FileDataChange(0, text, text.length).toString());
            ws.on('message', (data) => {
                data = MeshAPI.MeshPacketContent.parse(data);
                if(data instanceof MeshAPI.MeshPacketContent)
                {
                    text = data.handle(text);
                    console.log(text);
                    data = data.toString();
                    connectionManager.forEach((conn) => conn.send(data), ws);
                }
            });
        });
}
