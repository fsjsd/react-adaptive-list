import React from "react";
import ReactDOM from "react-dom";
import AdaptiveListContainer from "./components/AdaptiveListContainer";
import "./index.css";

const style = {
  width: "100%",
  height: "100%"
};

ReactDOM.render(
  <div style={style}>
    <AdaptiveListContainer />
  </div>,
  document.getElementById("root")
);
