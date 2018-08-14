import React from "react";
import ReactDOM from "react-dom";

//import to use echart-react component
import ReactEcharts from 'echarts-for-react';
var echarts = require('echarts');

import EchartsReactCore from './core';

// export the Component the echarts Object.
export default class EchartsReact extends EchartsReactCore {
  constructor(props) {
    super(props);
    this.echartsLib = echarts;
  }
}

//--------------------------------- functions ---------------------------//


//--------------------------------- overview tab ---------------------------//
//1. Called in first time by ReactDom.render
//pass the nodeList data in 'server : node,host' key&value form.

//OverviewRender calls NodelistProvider and delivers key&value object (nodelist_all) to OverviewKPIs
// (+extracts list of servers as an array, stored in variable named 'servers')


//2. Gets the nodeList which has all server, node data
//and the array of servers which only holds name of servers

//OverviewKPIs delivers each host(port)'s overview data to Overview
//Overview draws charts of data with ReactEchart


//--------------------------------- node tab ---------------------------//




