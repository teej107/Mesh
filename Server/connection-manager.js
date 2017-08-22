class ConnectionManager {
    constructor()
    {
        var connections = [];

        this.push = (conn) => {
            conn.on('close', () => {
                connections.splice(connections.indexOf(conn), 1)
            });
            console.log(conn._socket.remoteAddress + " connected");
            connections.push(conn);
        };
        this.forEach = (callback, conn) => connections.forEach((e, i) => {
            if (e !== conn)
                callback(e, i);
        });
    }
}

module.exports = ConnectionManager;

