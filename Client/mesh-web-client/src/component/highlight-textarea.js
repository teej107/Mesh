import React from 'react';
import '../css/highlight-textarea.css';

class HighlightTextArea extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {
            className: ("highlight-textarea " + (props.className || "")).trim(),
            highlightStyle: props.style || {},
            textareaStyle: props.style || {},
            value: ""
        };
    }

    getText = () => this.state.value;

    setText = (value) => {
        this.setState({value: value});
    };

    onInput = (event) => {
        console.log(event.target.innerHTML);
    };

    render = () => {
        return <highlight-textarea contentEditable
                                   ref={(e) => this.textarea = e}
                                   onChange={this.onInput}
                                   dangerouslySetInnerHTML={{__html: this.state.value}}/>;
    }
}


export default HighlightTextArea;