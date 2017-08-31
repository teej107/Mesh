const MeshAPI = require('mesh-api');
const uuid = require('uuid/v4');
const WebSocket = require('ws');

class ConnectionManager {

    constructor()
    {
        let text = "this is line 1 \nthis is line 2 ";
        let fileDataChangeHistory = [];
        let connections = {};

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
                data.timestamp = Date.now();
                if (data instanceof MeshAPI.FileDataChange)
                {
                    let mismatch = data.length + text.length !== data.totalLength;
                    if (mismatch)
                    {
                        console.log(conn.mesh.address, 'mismatch', data.toString());
                        console.log("server length:", text.length);

                        //TODO: Further testing needed to assure accuracy
                        /*
                            Compare last "non-own" packet start, modify if packet start is before data.start
                         */
                        let dataPacket;
                        for(let i = 0; i < fileDataChangeHistory.length; i++) {
                            let packet = fileDataChangeHistory[i];
                            if(packet.uuid === conn.mesh.id)
                            {
                                dataPacket = fileDataChangeHistory[i - 1];
                                break;
                            }
                        }
                        if(dataPacket && dataPacket.start < data.start)
                        {
                            data.start += text.length - data.totalLength + data.length;
                        }
                    }
                    fileDataChangeHistory.unshift(data);
                    text = data.handle(text);
                    console.log(text + '\n');
                    data = data.toString();
                    this.forEach((conn) => conn.send(data), conn);
                    data.uuid = conn.mesh.id;
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

