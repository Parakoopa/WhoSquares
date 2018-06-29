import * as React from "react";
import * as ReactDOM from "react-dom";

import {HashRouter} from "react-router-dom";
import {App} from "./App";
import {Route} from "react-router";

ReactDOM.render(
    <HashRouter>
        <Route path="/">
            <App name="Ich"/>
        </Route>
    </HashRouter>,
    document.getElementById("content")
);
