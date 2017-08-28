const MeshAPI = require('mesh-api');
const uuid = require('uuid/v4');
const WebSocket = require('ws');

var text = "this is line 1 \nthis is line 2 ";

class ConnectionManager {

    constructor()
    {
        var connections = {};
        var th = this;
        this.forEach = (callback, conn) => {
            for (var key in connections)
            {
                var connection = connections[key];
                if (connection !== conn && connection.readyState === WebSocket.OPEN)
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
                    let mismatch = data.length + text.length !== data.totalLength;
                    if (mismatch)
                    {
                        console.log(conn.mesh.address);
                        console.log("mismatch:", data.toString());
                        console.log("server length:", text.length);

                        //Further testing needed to assure accuracy
                        data.start += text.length - data.totalLength + data.length;
                    }
                    text = data.handle(text);
                    console.log(text + '\n');
                    data = data.toString();
                    this.forEach((conn) => conn.send(data), conn);
                }
                else if (data instanceof MeshAPI.SynchronizeData)
                {
                    conn.send(new MeshAPI.SynchronizeData(text).toString());
                }
            });

            connections[mesh.id] = conn;
        };
    }
}

module.exports = ConnectionManager;

