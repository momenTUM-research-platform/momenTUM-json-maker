import ReactDOM from "react-dom";
import "./index.css";
import App from "./src/App";
import React from "react";
import { enableMapSet } from "immer";
import Ajv from "ajv";
import { study } from "./schema/study";
import dagre from "dagre";


export const validator = new Ajv().compile(study);
export const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
enableMapSet() // Needed for immer to be able to use Maps
ReactDOM.render(<App />, document.getElementById("root"));
