const MeshAPI = require('mesh-api');
const uuid = require('uuid/v4');
const WebSocket = require('ws');

var text = 'Sample Text!';

class ConnectionManager {

    constructor()
    {
        var connections = {};
        var th = this;
        this.forEach = (callback, conn) => {
            for (var key in connections)
            {
                var connection = connections[key];
                if (connection !== conn && connection.readyState  === WebSocket.OPEN)
                    callback(connection);
            }
        };

        this.push = (conn) => {
            conn.send(new MeshAPI.SynchronizeData(text).toString());

            var mesh = {
                id: uuid(),
                address: conn._socket.remoteAddress
            };
            console.log(mesh.address, "connected");
            conn.mesh = mesh;

            conn.on('close', () => {
                console.log(mesh.address, "disconnected");
                delete connections[mesh.id];
            });
            conn.on('message', (data) => {
                data = MeshAPI.MeshPacketContent.parse(data);
                if (data instanceof MeshAPI.FileDataChange)
                {
                    if (!data.change || data.change === data.setChange(text))
                    {
                        text = data.handle(text);
                        console.log(text);
                        data = data.toString();
                        this.forEach((conn) => conn.send(data), conn);
                    }
                    else
                    {
                        console.log('sending correct info');
                        console.log(text);
                        conn.send(new MeshAPI.SynchronizeData(text).toString());
                    }
                }
                else if(data instanceof MeshAPI.SynchronizeData)
                {
                    console.log("syncing data");
                    console.log(text);
                    conn.send(new MeshAPI.SynchronizeData(text).toString());
                }
            });

            connections[mesh.id] = conn;
        };
    }
}

module.exports = ConnectionManager;

