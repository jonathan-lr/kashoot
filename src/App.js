import React from "react";
import "./App.css"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./Home/Home";
import Room from "./Room/Room";

export default function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <Switch>
                        <Route path="/play" component={Room} />
                        <Route path="/" component={Home} />
                    </Switch>
                </header>
            </div>
        </Router>
    );
}