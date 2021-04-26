import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./Home/Home";
import host from "./Room/host/host";
import local from "./Room/local/local";
import Create from "./Create/create";

export default function App() {
    return (
        <Router>
            <Switch>
                <Route path="/create" component={Create}/>
                <Route path="/xH0vw0Q1AUcxQIxl" component={host} />
                <Route path="/play" component={local} />
                <Route path="/" component={Home} />
            </Switch>
        </Router>
    );
}