import ReactDOM from "react-dom";
import "./index.css";
import App from "./src/App";
import React from "react";
import { enableMapSet } from "immer";
import { dragFix } from "./src/utils/dragFix";
// @ts-nocheck
// Fix for firefox dragging bug https://stackoverflow.com/questions/11656061/why-is-event-clientx-incorrectly-showing-as-0-in-firefox-for-dragend-event/63365865#63365865
if (
  /Firefox\/\d+[\d\.]*/.test(navigator.userAgent) &&
  typeof window.DragEvent === "function" &&
  typeof window.addEventListener === "function"
) {
  dragFix();
}

enableMapSet(); // Needed for immer to be able to use Maps
ReactDOM.render(<App />, document.getElementById("root"));
