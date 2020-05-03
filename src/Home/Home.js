import React from "react";
import { Link } from 'react-router-dom';

class Home extends React.Component {
    render() {
        return (
            <>
                <p>
                    Welcome To Kashoot
                </p>
                <p>
                    Here we want to kashoot our selves
                </p>
                <button className="lets-begin"><Link to="/next">Lets Begin</Link></button>
            </>
        );
    }
}

export default Home;