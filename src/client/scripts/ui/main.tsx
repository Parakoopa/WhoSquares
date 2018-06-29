import * as React from "react";
import * as ReactDOM from "react-dom";

import {BrowserRouter} from "react-router-dom";
import {App} from "./App";

ReactDOM.render(
    <BrowserRouter>
        <App name="Ich"/>
    </BrowserRouter>,
    document.getElementById("content")
);
