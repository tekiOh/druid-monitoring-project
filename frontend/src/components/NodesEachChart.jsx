import React, {Component} from "react";

import PropTypes from "prop-types";
import * as U from './utils'

import * as echarts from 'echarts';
import ReactEcharts from './App';

import 'react-datetime/css/react-datetime.css';
import 'echarts/theme/macarons.js';


export default class NodesEachChart extends Component {

    constructor() {
        super();

        this.propTypes = {
            //data = {'jvm/mem/used':{'avg':[],'percent':[],min:20,max:90,kpi:{}}, etc.}
            data: PropTypes.object.isRequired,
            serverNodeHost: PropTypes.string.isRequired,
            metric: PropTypes.string.isRequired,
        };

        this.state = {};

    }
    componentWillMount(){
        this.makeGrid=this.makeGrid.bind(this)
        this.makeXAxis=this.makeXAxis.bind(this)
        this.makeYAxis=this.makeYAxis.bind(this)
        this.makeGridData=this.makeGridData.bind(this)
    }

    //metric 안에 percent 데이터가 있는지 확인
    hasPercent(data) {
        // console.log("in hasPercent")
        // console.log(typeof data)
        // console.log(data)

        let hasP = false;
        if (typeof data == 'undefined') {
            hasP = false
        } else if (data["percent"].length == 0) {
            hasP = false;
        } else {
            hasP = true
        }
        return hasP
    }

    makeGrid(top, height, opt) {

        return echarts.util.merge({
            left: 90,
            right: 90,
            top: (top) * 0.1,
            height: height
        }, opt || {}, true);

    }

    makeXAxis(gridIndex, timestamp, opt) {

        let axisLabelFlag = false;
        if (gridIndex % 2 === 0) {
            axisLabelFlag = true;
        }

        return echarts.util.merge({
            type: 'category',
            gridIndex: gridIndex,
            //统一时间轴数据
            data: timestamp,
            axisLabel: {
                fontFamily: 'SpoqaHanSans',
                formatter: function (value) {
                    let date = new Date(value);
                    let text1 = [date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()];
                    let text2 = [date.getUTCHours(), date.getUTCMinutes()];
                    return text1.join('/') + ' ' + text2.join(':');
                },
                show: axisLabelFlag,
            },
            axisLine: {
                lineStyle: {
                    color: "white"
                }
            },
        }, opt || {}, true);
    }

    makeYAxis(gridIndex, opt) {

        return echarts.util.merge({
            type: 'value',
            gridIndex: gridIndex,
            axisLine: {
                lineStyle: {
                    color: "white"
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                fontFamily: 'SpoqaHanSans',
                show: true
            },
        }, opt || {}, true);
    }

    makeGridData(xAxisIndex, yAxisIndex, chartType, chartName, chartData, opt) {
        return echarts.util.merge({
            type: chartType,
            name: chartName,
            xAxisIndex: xAxisIndex,
            yAxisIndex: yAxisIndex,
            data: chartData,
        }, opt || {}, true);
    }

    //차트 옵션 지정.
    getOption({data}, {metric}, {serverNodeHost}) {

        //jvm metric인 경우 다시 하나씩 (총 4개) 꺼내서 하나의 차트에 표시
        if (metric.includes("jvm")) {
            return {
                animation: false,

                title: {

                    x: 'center',
                    text: serverNodeHost,
                    textStyle: {
                        fontFamily: 'SpoqaHanSans',
                        color: '#333'
                    },
                    subtext: this.overviewSubTitle,
                    padding: 0,

                },

                tooltip: {

                    trigger: 'axis',
                    transitionDuration: 0,
                    confine: true,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: '#333',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    textStyle: {
                        fontSize: 12,
                        color: '#333'
                    }
                },

                // toolbox: {
                //     feature: {
                //         saveAsImage: {}
                //     }
                // },

                axisPointer: {
                    type: 'shadow',
                    link: {
                        xAxisIndex: 'all'
                    }
                },

                // grid 모양 만들기(위치관련) 수치는 this.chartGridTop 같은 변수들에 저장되어있는 숫자나 더해지는 숫자를 변경
                // 곱해지는 숫자는 한 번에 표시되는 그래프의 수에 따라 1씩 증가.
                grid: [
                    this.makeGrid(this.chartGridTop, this.chartGridHeight),
                    this.makeGrid(this.chartGridTop + (this.chartGridHeight + 25), this.chartGridHeight),
                    this.makeGrid(this.chartGridTop + (this.chartGridHeight + 25) * 2, this.chartGridHeight),
                    this.makeGrid(this.chartGridTop + (this.chartGridHeight + 25) * 3, this.chartGridHeight),
                ],

                xAxis: [
                    this.makeXAxis(0, data['jvm/mem/used']['timestamp']),
                    this.makeXAxis(1, data['jvm/mem/used']['timestamp']),
                    this.makeXAxis(2, data['jvm/mem/used']['timestamp']),
                    this.makeXAxis(3, data['jvm/mem/used']['timestamp']),
                ],
                yAxis: [
                    this.makeYAxis(0, {
                        // name: "jvm/bufferpool/used",
                        name: "jvm",
                        max: 100
                    }),
                    this.makeYAxis(1, {
                        // name: "jvm/gc/mem/used",
                        max: 100
                    }),
                    this.makeYAxis(2, {
                        // name: "jvm/mem/used",
                        max: 100
                    }),
                    this.makeYAxis(3, {
                        // name: "jvm/pool/used",
                        max: 100
                    }),

                ],

                dataZoom: [{
                    type: 'slider',
                    xAxisIndex: [0, 1, 2, 3],
                    realtime: true,

                    handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '140%',
                }],

                series: [
                    this.makeGridData(0, 0, 'line', 'jvm/bufferpool/used', data['jvm/bufferpool/used']["percent"]),

                    this.makeGridData(1, 1, 'line', 'jvm/gc/mem/used', data['jvm/gc/mem/used']["percent"],

                        {
                            //추가 옵션 넣고 싶은 경우
                        }),

                    this.makeGridData(2, 2, 'line', 'jvm/mem/used', data['jvm/mem/used']["percent"]),
                    this.makeGridData(3, 3, 'line', 'jvm/pool/used', data['jvm/pool/used']["percent"]),
                ]

            }


            //jvm metric이 아닌 경우, 그냥 하나씩 차트로 표시 _ 그리고 percent가 있는 경우
        } else {
            return {
                animation: false,

                title: {

                    x: 'center',
                    text: serverNodeHost,
                    textStyle: {
                        fontFamily: 'SpoqaHanSans',
                        color: 'white'
                    },
                    subtext: this.overviewSubTitle,
                    padding: 0,

                },

                tooltip: {

                    trigger: 'axis',
                    transitionDuration: 0,
                    confine: true,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: '#333',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    textStyle: {
                        fontSize: 12,
                        color: '#333'
                    }
                },

                // toolbox: {
                //     feature: {
                //         saveAsImage: {}
                //     }
                // },

                axisPointer: {
                    type: 'shadow',
                    link: {
                        xAxisIndex: 'all'
                    }
                },

                // grid 모양 만들기(위치관련) 수치는 this.chartGridTop 같은 변수들에 저장되어있는 숫자나 더해지는 숫자를 변경
                // 곱해지는 숫자는 한 번에 표시되는 그래프의 수에 따라 1씩 증가.
                grid: [
                    this.makeGrid(this.chartGridTop, this.chartGridHeight),
                ],

                xAxis: [
                    this.makeXAxis(0, data['timestamp']),
                ],
                yAxis: [
                    this.makeYAxis(0, {
                        name: metric,
                    })

                ],

                dataZoom: [{
                    type: 'slider',
                    xAxisIndex: [0],
                    realtime: true,

                    handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '140%',
                }],

                series: [
                    this.makeGridData(0, 0, 'line', metric, this.hasPercent(data) ? data["percent"] : data["avg"]),
                ]

            }
        }
    }

    render() {
        // console.log("NodesEachChart render")
        //
        // console.log(this.props.data)
        // console.log(this.props.metric)
        // console.log(this.props.serverNodeHost)

        return (<div className="ddp-clear">
                {/*{console.log(this.props.metric)}*/}
                <div className="ddp-data-title">
                    {U.changeMetric({metric: this.props.metric})}
                </div>

                <ReactEcharts
                    option={this.getOption(
                        //data[metric] =data['jvm'] = {"jvm/mem/used":{"avg":[]},"~":{},~}
                        //data[metric] =data['blah'] = {"avg":[],~~}
                        {data: this.props.data[this.props.serverNodeHost][this.props.metric]},
                        {metric: this.props.metric},
                        {serverNodeHost: this.props.serverNodeHost},
                        // {data : data["druid/dev/coordinator:localhost:8081"]},
                        // {metric : 'jvm/mem/used'},
                        //{serverNodeHost: 'druid/dev/broker:localhost:8082'}
                    )}
                    style={{height: '90%', width: '100%'}}
                    className={"ddp-box-graph"}
                    theme={'macarons'}
                />
            </div>

        )
    }
} //end of class


