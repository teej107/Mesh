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
            if (typeof event.data === 'string')
                this.setState({value: event.data});
            else
                return;
        };
        return socket;
    }

    onInput = (event) => {
        var length = event.target.textLength - this.state.value.length;
        var start = event.target.selectionStart - length;
        var inputEvent = new MeshAPI.FileDataChange(start, event.target.value.substr(start, length), length);
        this.setState({value: event.target.value});
        this.socket.send(inputEvent);
    };

    render()
    {
        return <textarea id="mesh-textarea" value={this.state.value} onChange={this.onInput}/>
    }
}


export default Mesh;