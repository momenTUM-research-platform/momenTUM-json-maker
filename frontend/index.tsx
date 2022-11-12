import ReactDOM from "react-dom";
import "./index.css";
import App from "./src/App";
import React from "react";
import { enableMapSet } from "immer";



enableMapSet() // Needed for immer to be able to use Maps
ReactDOM.render(<App />, document.getElementById("root"));
