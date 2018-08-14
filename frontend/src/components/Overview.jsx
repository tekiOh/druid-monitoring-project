import React,{Component} from "react";
import ReactEcharts from './App';
import PropTypes from "prop-types";
import '../../../macarons.js';

import * as U from './utils'
import key from "weak-key";

export default class Overview extends Component{

    constructor() {
        super();

        this.propTypes = {
            //data = {'jvm/mem/used':{'avg':[],'percent':[],min:20,max:90,kpi:{}}, etc.}
            data: PropTypes.object.isRequired,
            server: PropTypes.string.isRequired,
            serverNodeHost: PropTypes.string.isRequired,
        };

        this.state = {
            modalIsOpen : false,
            metricList : []
        };


        this.hasPercent = this.hasPercent.bind(this);
        this.getOption = this.getOption.bind(this);
    }
    //metric 안에 percent 데이터가 있는지 확인.
    hasPercent ({data}) {
        // console.log("in hasPercent")
        // console.log(typeof data)
        // console.log(data)

        let hasP = false;
        if(typeof data == 'undefined'){
            hasP=false
        }else if(data["percent"].length==0){
            hasP=false;
        }else{
            hasP=true
        }
        return hasP
    }

    //차트 옵션 지정.
    getOption ({data},{metric}) {

        // console.log("in getOption : ");
        // console.log(data["percent"]);
        // console.log(data["avg"]);
        // console.log(hasP);
            return {
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            title: {
                textStyle: {
                  color: '#ffff99',
                  fontSize: 18,
                  fontFamily: 'SpoqaHanSans',
                  fontWeight: 'bold'
                },
                left: '30%',
                text: data["kpi"]["diff_percent"]+"%"+"("+data["kpi"]["diff_value"]+")"
            },
            calculable : true,
            grid: {
                borderColor: '#eee',
                top: '10%', //container 내 위치 조정 가능
                bottom: '15%',
                left: '15%',
                right: '5%',
                //height: '50%' //grid interval 간격 조정
            },
            xAxis: {
                type: 'category',
                axisLine:{
                    lineStyle:{
                        color:"white"
                    }
                },
                data: data["timestamp"],
                axisLabel: {
                    fontFamily: 'SpoqaHanSans',
                    formatter: function(value){
                       let date = new Date(value);
                       let texts=[date.getUTCHours(), date.getUTCMinutes()];
                       return texts.join(':');
                    }
                },
                boundaryGap:false
            },
            yAxis: {
                type: 'value',
                min: 'dataMin',
                axisLine:{
                    lineStyle:{
                        color:"white"
                    }
                },
                axisTick: {
                    inside: true
                },
                axisLabel: {
                    fontFamily: 'SpoqaHanSans'
                },
                splitLine: {
                    show: false
                }
            },
            series: [{
                name: metric,
                data: this.hasPercent(this.props.data[metric])?data["percent"]:data["avg"],
                type: 'line',
                markLine: {
                       data: [{type:'average', name:'avg'}],
                       lineStyle: {
                           color: '#ffe680'
                       },
                       symbolSize: 8,
                       label: {
                           position: 'middle'
                       }
                },
            }]
        };
    }

    render(){
        return(
            <div>
                <div className="ddp-clear">
                    <div className="ddp-wrap-edit">
                        <div className="ddp-ui-edit-option">
                            <a href="#" className="ddp-btn-toggle ddp-node-title"><strong>{this.props.serverNodeHost}</strong></a>
                        </div>
                    </div>

                    <div className="ddp-clear">
                        <div className="ddp-clear">
                        </div>
                    </div>

                    <div className="ddp-box-wrap">
                    {/*this.proos.data = {'jvm/mem/used':{'avg':[],'percent':[],min:20,max:90,kpi:{}}, etc.}*/}
                    {Object.keys(this.props.data).map(metric=>
                    (<div className="ddp-col-2">
                        {/*{console.log("after mapping metric of each host")}*/}
                        {/*{console.log(metric)}*/}
                       <div className="ddp-data-title">
                           {metric}
                       </div>

                       <div className="ddp-box-chart">
                           <ReactEcharts
                               option={this.getOption(
                                   {data : this.props.data[metric]},
                                   {metric : metric},
                                   // {data : data['jvm/mem/used']},
                                   // {metric : 'jvm/mem/used'},
                                   // {hasP : hasPercent({data : data['jvm/mem/used']})}
                               )}
                               style={{height: '100%', width: '100%'}}
                               className={"ddp-box-chart"}
                               theme={'macarons'}
                           />
                       </div>
                        <div className="ddp-clear">
                        </div>
                    </div>)
                    )}
                </div>
                <div className="ddp-clear">
                </div>

                </div>
            </div>
        )}
} //end of class


