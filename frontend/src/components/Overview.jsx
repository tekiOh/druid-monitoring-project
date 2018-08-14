import React, {Component} from "react";

import OverviewKPIBox from './OverviewKPIBox';
import OverviewCurrentMem from './OverviewCurrentMem';
import OverviewCurrentCPU from './OverviewCurrentCPU';

import PropTypes from "prop-types";
import 'echarts/theme/macarons.js';

export default class Overview extends Component {

    constructor() {
        super();

        this.propTypes = {
            //data = {'jvm/mem/used':{'avg':[],'percent':[],min:20,max:90,kpi:{}}, etc.}
            data: PropTypes.object.isRequired,
            server: PropTypes.string.isRequired,
            serverNodeHost: PropTypes.string.isRequired,
        };

        this.state = {
            modalIsOpen: false,
            metricList: []
        };


        this.hasPercent = this.hasPercent.bind(this);
        this.getOption = this.getOption.bind(this);
    }

    //metric 안에 percent 데이터가 있는지 확인.
    hasPercent({data}) {
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

    //차트 옵션 지정.
    getOption({data}, {metric}) {

        // console.log("in getOption : ");
        // console.log(data["percent"]);
        // console.log(data["avg"]);
        // console.log(hasP);
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            title: {
                textStyle: {
                    color: 'white',
                    fontSize: 13,
                    fontFamily: 'SpoqaHanSans',
                    fontWeight: 'bold'
                },
                left: '40%',
                text: data["kpi"]["diff_percent"] + "%" + "(" + data["kpi"]["diff_value"] + ")"
            },
            calculable: true,
            xAxis: {
                type: 'category',
                axisLine: {
                    lineStyle: {
                        color: "white"
                    }
                },
                data: data["timestamp"],
                axisLabel: {
                    fontFamily: 'SpoqaHanSans',
                    formatter: function (value) {
                        let date = new Date(value);
                        let texts = [date.getUTCHours(), date.getUTCMinutes()];
                        return texts.join(':');
                    }
                },
                boundaryGap: false
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: "white"
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
                data: this.hasPercent(this.props.data[metric]) ? data["percent"] : data["avg"],
                type: 'line',
                markLine: {
                    data: [{
                        type: 'average', name: 'avg'
                    }],
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

    setServerNodeHost(serverNodeHost){
        serverNodeHost=JSON.stringify(serverNodeHost);
        console.log("in setServerNodeHost")
        console.log(serverNodeHost)
        switch (serverNodeHost){

            case serverNodeHost.includes("coordinator"):
                return(
                    <div className="box-server type-coordinator">{serverNodeHost}</div>
                )
            case serverNodeHost.includes("broker"):
                return(
                    <div className="box-server broker">{serverNodeHost}</div>
                )
            case serverNodeHost.includes("historical"):
                return(
                    <div className="box-server historical">{serverNodeHost}</div>
                )
            case serverNodeHost.includes("overlord"):
                return(
                    <div className="box-server overlord">{serverNodeHost}</div>
                )
            case serverNodeHost.includes("middleManager"):
                return(
                    <div className="box-server middlemanger">{serverNodeHost}</div>
                )
        }

    }

    render() {
        return (
            console.log(this.props.data),

                <div className="wrap-memory is-clear">

                    <div className="ui-server">
                        {this.setServerNodeHost(this.props.serverNodeHost)}
                    </div>

                    <div className="col-5">
                        <OverviewCurrentMem data={this.props.data} metric={"jvm/mem/used"}/>
                        <OverviewCurrentCPU data={this.props.data} metric={"jvm/pool/used"}/>
                    </div>
                    <div className="col-7">
                        {Object.keys(this.props.data).map(metric => (
                            console.log(metric),
                                <OverviewKPIBox data={this.props.data} metric={metric}/>
                        ))}
                    </div>

                </div>

        )
    }
} //end of class


