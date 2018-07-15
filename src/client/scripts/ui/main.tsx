import * as React from "react";
import * as ReactDOM from "react-dom";

import {Route} from "react-router";
import {HashRouter} from "react-router-dom";
import {App} from "./App";

/**
 * Entry for React!
 */
ReactDOM.render(
    <HashRouter>
        <Route path="/" component={App} />
    </HashRouter>,
    document.getElementById("mainapp")
);
