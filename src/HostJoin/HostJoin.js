import React from 'react';
import { Link } from 'react-router-dom';

class HostJoin extends React.Component {
    render() {
        return (
            <div className="button-holder">
                <button className="lets-begin"><Link to="/create">Host</Link></button>
                <button className="lets-begin"><Link to="/join">Join</Link></button>
            </div>
        );
    }
}

export default HostJoin;