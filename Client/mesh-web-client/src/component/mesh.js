import React from 'react';
import ReactDOM from 'react-dom';
import '../css/mesh.css';
import MeshAPI from 'mesh-api';

class Mesh extends React.Component {

    constructor(props)
    {
        super(props);
        this.socket = this.newSocket();
        this.state = {value: ''};
    }

    newSocket()
    {
        let socket = new WebSocket('ws://192.168.0.30:3000/api/teej/test');
        socket.onopen = (event) => {
            socket.onclose = (event) => this.socket = this.newSocket()
        };
        socket.onmessage = (event) => {
            var data = MeshAPI.MeshPacketContent.parse(event.data);
            if (data instanceof MeshAPI.FileDataChange)
            {
                if (!data.change || data.change === data.setChange(this.state.value))
                {
                    this.setState({value: data.handle(this.state.value)});
                }
                else
                {
                    console.log("Sync error!");
                    socket.send(new MeshAPI.SynchronizeData());
                }
            }
            else if(data instanceof MeshAPI.SynchronizeData)
            {
                this.setState({value: data.handle()});
            }
        };
        return socket;
    }

    onInput = (event) => {
        var length = event.target.textLength - this.state.value.length;
        var start = event.target.selectionStart - length;
        var inputEvent = new MeshAPI.FileDataChange(start, event.target.value.substr(start, length), length);
        inputEvent.setChange(this.state.value);
        this.setState({value: event.target.value});
        this.socket.send(inputEvent);
    };

    render()
    {
        return <textarea id="mesh-textarea" value={this.state.value} onChange={this.onInput}/>
    }
}


export default Mesh;