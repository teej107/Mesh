import React from 'react';
import '../css/mesh.css';
import MeshAPI from 'mesh-api';

class Mesh extends React.Component {

    constructor(props)
    {
        super(props);
        this.socket = this.newSocket();
        this.state = {value: ''};
    }

    newSocket = () => {
        let socket = new WebSocket('ws://192.168.0.30:3000/api/teej/test');
        socket.onopen = (event) => {
            socket.onclose = (event) => this.socket = this.newSocket()
        };
        socket.onmessage = (event) => {
            var data = MeshAPI.MeshPacketContent.parse(event.data);
            if (data instanceof MeshAPI.FileDataChange)
            {
                const selectionStart = this.textarea.selectionStart;
                const selectionEnd = this.textarea.selectionEnd;
                const caretOffset = data.start > selectionStart ? 0 : 1;
                this.setState({value: data.handle(this.state.value)});
                this.textarea.setSelectionRange(selectionStart + caretOffset, selectionEnd + caretOffset);
            }
            else if (data instanceof MeshAPI.SynchronizeData)
            {
                let selectionStart = this.textarea.selectionStart;
                this.setState({value: data.handle()});
                selectionStart = Math.min(this.state.value.length, selectionStart);
                this.textarea.setSelectionRange(selectionStart, selectionStart);
            }
        };
        return socket;
    };

    onInput = (event) => {
        const length = event.target.textLength - this.state.value.length;
        const start = event.target.selectionStart - length;
        const data = event.target.value.substr(start, length);
        const inputEvent = new MeshAPI.FileDataChange(start, data, length, event.target.textLength);
        this.setState({value: event.target.value});
        this.socket.send(inputEvent);
    };

    reload = () => {
        this.socket.send(new MeshAPI.SynchronizeData());
    };

    render = () => {
        return (
            <div id="mesh-divider">
                <div id="mesh-textarea">
                    <textarea ref={(ref) => this.textarea = ref} value={this.state.value} onChange={this.onInput}/>
                </div>
                <button onClick={this.reload}>Reload</button>
            </div>
        );
    }
}


export default Mesh;