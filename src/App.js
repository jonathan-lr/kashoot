import React from "react";
import "./App.css"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./Home/Home";
import JoinRoom from "./JoinRoom/JoinRoom";
import HostJoin from "./HostJoin/HostJoin";
import CreateRoom from "./CreateRoom/CreateRoom";
import Session from "./Session/Session";

export default function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <Switch>
                        <Route path="/session/:id" component={Session} />
                        <Route path="/join" component={JoinRoom} />
                        <Route path="/create" component={CreateRoom} />
                        <Route path="/next" component={HostJoin} />
                        <Route path="/" component={Home} />
                    </Switch>
                </header>
            </div>
        </Router>
    );
}