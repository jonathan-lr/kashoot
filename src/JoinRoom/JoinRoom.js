import React from 'react';
import {Link} from "react-router-dom";

class JoinRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {id: '', name: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleChange(event) {
        this.setState({id: event.target.value});
    }

    handleNameChange(event){
        this.setState({name: event.target.value});
    }

    render() {
        return (
            <>
                <p>
                    Enter Room Node
                </p>
                <label>
                    ID:
                    <input type="text" value={this.state.id} onChange={this.handleChange} />
                </label>
                <label>
                    Name:
                    <input type="text" value={this.state.name} onChange={this.handleNameChange} />
                </label>
                <button className="lets-begin"><Link to={`/session/${this.state.id}`}>Join</Link></button>
            </>
        );
    }
}

export default JoinRoom;