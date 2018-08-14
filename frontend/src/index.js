import ReactDOM from "react-dom";
import React from "react";

import OverviewRender from "./components/OverviewRender"
import NodesRender from "./components/NodesRender"

const w_overview = (document.getElementById('overview_wrap'));
ReactDOM.render(<OverviewRender />, w_overview);

// const w_nodes = (document.getElementById('node_select'));
// ReactDOM.render(<NodesRender />, w_nodes);

