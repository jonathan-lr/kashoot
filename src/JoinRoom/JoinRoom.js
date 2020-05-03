import React from 'react';

class JoinRoom extends React.Component {
    render() {
        return (
            <>
                <p>
                    Enter Room Node
                </p>
                <input placeholder="Room ID"></input>
                <input placeholder="User Name"></input>
            </>
        );
    }
}

export default JoinRoom;