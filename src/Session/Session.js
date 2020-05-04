import React from 'react';

class Session extends React.Component {
    render() {
        const sessionID = this.props.match.params.id
        return (
            <>
                <p>
                    Welcome to {sessionID}
                </p>
                <div className="name-box">
                </div>
            </>
        );
    }
}

export default Session;