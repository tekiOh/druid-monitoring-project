import React, {Component} from 'react';
import 'react-datetime/css/react-datetime.css'
import 'echarts/theme/macarons.js';
import NodesEachChart from './NodesEachChart';
import PropTypes from 'prop-types';


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
               <div className='ddp-clear'>

                   {Object.keys(this.props.data[this.props.serverNodeHost]).map(metric=>
                       (<NodesEachChart data={this.props.data} serverNodeHost={this.props.serverNodeHost} metric={metric}/>)
                   )}
               </div>)
   }
} //end of class
