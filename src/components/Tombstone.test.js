import React from "react";
import ReactDOM from "react-dom";
import Tombstone from "./Tombstone";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Tombstone />, div);
  ReactDOM.unmountComponentAtNode(div);
});
