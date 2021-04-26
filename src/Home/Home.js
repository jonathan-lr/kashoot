import React from "react";
import { Link } from 'react-router-dom';

class Home extends React.Component {
    render() {
        return (
            <div style={{alignItems: "center", justifyContent: "center", fontSize: "50px", height: "100%", display: "flex", flexDirection: "column"}}>
                <p style={{color: "var(--light)"}}>
                    Welcome To Kashoot
                </p>
                <p style={{color: "var(--light)"}}>
                    Here we want to kashoot our selves
                </p>
                <button style={{margin: "unset"}} className="field-button"><Link to="/play">LETS BEGIN</Link></button>
            </div>
        );
    }
}

export default Home;