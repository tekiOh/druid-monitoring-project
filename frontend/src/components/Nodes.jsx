import React, {Component} from “react”;
import ReactEcharts from ‘./App’;
import ‘react-datetime/css/react-datetime.css’

import PropTypes from “prop-types”;
import ‘echarts/theme/macarons.js’;
import * as echarts from ‘echarts’;

import * as U from ‘./utils’
import NodesEachChart from “./NodesEachChart”;


export default class Nodes extends Component{

   constructor() {
       super();

       this.propTypes = {
           data: PropTypes.object.isRequired,
           serverNodeHost: PropTypes.string.isRequired,
       };
       this.state = {

       };

   }

   render(){
       return(
               <div className=“ddp-clear”>

                   {Object.keys(this.props.data[this.props.serverNodeHost]).map(metric=>
                       (<NodesEachChart data={this.props.data} serverNodeHost={this.props.serverNodeHost} metric={metric}/>)
                   )}
               </div>)
   }
} //end of class