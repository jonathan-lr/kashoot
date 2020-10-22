import React from 'react';
import io from 'socket.io-client';
import howling from './howling.mp3'
const socket = io('http://92.239.26.13:27015');

var audio = new Audio(howling);

class Session extends React.Component {
    constructor(props) {
        super(props);

        this.onMessageSubmit = this.onMessageSubmit.bind(this);

        this.state = {
            name: '',
            message: '',
            chat: [],
        }
    }

    renderChat() {
        return this.state.chat.map(({name, message}, index) => (
            <div key={index}>
                <span>
                    {name}: <span>{message}</span>
                </span>
            </div>
        ))
    }

    onTextChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onMessageSubmit(e) {
        e.preventDefault();
        const {name, message} = this.state;
        socket.emit('message', {name, message})
        this.setState({
            message: ''
        })
    }

    componentDidMount() {
        socket.on('message', ({name, message}) => {
            console.log(message)
            let temp = this.state.chat;
            temp.push({name, message})
            this.setState({
                chat: temp,
            })
        })

        audio.play();
        audio.volume = 0.02;
    }

    render() {
        const sessionID = this.props.match.params.id;
        const { name, message } = this.state;
        return (
            <>
                <p>
                    Welcome to {sessionID}
                </p>
                <div style={{display: "flex"}}>
                    <form onSubmit={this.onMessageSubmit} style={{background: "lightcoral", padding:"10px", borderRadius:"10px 0 0 10px"}}>
                        <div className="name-field">
                            <span>Name:</span>
                            <input name="name" onChange={e => this.onTextChange(e)} value={name} lable="Name" />
                        </div>
                        <div>
                            <span>Text:</span>
                            <input name="message" onChange={e => this.onTextChange(e)} value={message} lable="Message" />
                        </div>
                        <button>Send Message</button>
                    </form>
                    <div className="render-chat" style={{background:"lightpink", width:"500px", height:"500px", overflow:"auto", textAlign:"left", borderRadius:"0 10px 10px 0"}}>
                        <p>Chat Log</p>
                        {this.renderChat()}
                    </div>
                </div>
            </>
        );
    }
}

export default Session;