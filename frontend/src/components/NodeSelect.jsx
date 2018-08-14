import React,{Component} from "react";
import ReactDOM from "react-dom";
import ReactEcharts from './App';

import Datetime from "react-datetime";
import Select from "react-select"
import 'react-datetime/css/react-datetime.css'

import PropTypes from "prop-types";
import '../../../macarons.js';
import * as echarts from 'echarts';

import * as U from './utils'
import key from "weak-key";
import Nodes from "./Nodes";


let stime = new Date();
stime.setHours(stime.getHours()-1);
let etime = new Date();

export default class NodeSelect extends Component{

    constructor() {
        super();

        this.propTypes = {
            // nodeList_all = {"localhost": {"druid/dev/coordinator": ["8081"], "druid/dev/broker": ["8082"], "druid/dev/historical": ["8083"], "druid/dev/overlord": ["8090"], "druid/dev/middleManager": ["8091", "8100"]}}
            nodeList_all : PropTypes.object.isRequired,
            // servers={['localhost']}
            servers : PropTypes.object.isRequired,
        };

        this.state = {

            //--------------select-box 적용 및 데이터 출력에 관련된 내용--------------//

            //this.state.nodeList = [[["druid/dev/coordinator", "druid/dev/broker", "druid/dev/historical", "druid/dev/overlord", "druid/dev/middleManager"]]
            //서버 목록에서 'n'번에 있는 서버의 노드 목록이 nodeList 목록의 'n'번 자리에 list로 저장되어있음.
            nodeList: [],
            // [[["8081"], ["8082"], ["8083"], ["8090"], ["8091", "8100", "8101"]]]
            // servers 목록에서 'n'번 자리에 들어있는 서버 안에 있는 각 노드들의 포트 번호가 'n'번 목록에 담겨있다.
            portList: [],

            nodeOptions: [],
            serverHostOptions : [],
            granularityOptions : [],

            //--------------select-box 및 서버 fetch 관련된 내용--------------//
            start: stime.toISOString(),

            end: etime.toISOString(),

            placeholder: "Loading...",

            // nodeOption: {value : 'druid/dev/broker' , label : 'Broker'},
            nodeOption: {value : 'druid/dev/broker' , label : 'broker'},

            //  serverHostOption : "localhost:8081" => splits into server and port in fetch function
            // 기본값을 이런식으로 정해서는 안되지만 일단 급한대로.
            serverHostOption: {value : "localhost"+":"+8082, label : "localhost"+":"+8082},

            // graOption: {value : 'minute' , label : '1min'},
            graOption: {value : 'minute' , label : '1min'},

            //Default nodeInfo sent with POST on conponentWillMount(default)
            // 기본값을 이런식으로 정해서는 안되지만 일단 급한대로.
            nodeInfo: {

            start_time: stime.toISOString(),

            end_time: etime.toISOString(),

            // node : 'druid/dev/broker'
            node: 'druid/dev/broker',
            // server:'localhost',
            server: 'localhost',
            // port : '8082'
            port:'8082',

            granularity:'minute',

            },


            //--------------chart option에 관련된 내용--------------//
            // overviewChartID : 'nodes-chart',
            overviewSubTitle : echarts.format.formatTime('yyyy.MM.dd', new Date()),
            chartGridTop : 30,
            chartGridHeight : 100,

            //--------------Nodes에 전달되는 내용--------------//
            // this.props.data ={druid/dev/broker:localhost:8082:{"jvm":{"jvm/mem/used":{avg:[],percent:[],kpi:{},min:100,max:100"jvm/pool/used":{~~}}},
            // "query/~":{} ,"blahblah":{~}, etc.}}
            // data : { "druid/dev/broker:localhost:8082": { "jvm":{"jvm/bufferpool/used": { "avg": [ 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94, 2.94 ], "kpi": { "current": 100.0, "diff_percent": 0.02, "diff_value": 0.0, "past": 100.0 }, "max": 100.0, "min": 100.0, "percent": [ 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0 ], "timestamp": [ "2018-08-09T20:08:00.000Z", "2018-08-09T20:09:00.000Z", "2018-08-09T20:10:00.000Z", "2018-08-09T20:11:00.000Z", "2018-08-09T20:12:00.000Z", "2018-08-09T20:13:00.000Z", "2018-08-09T20:14:00.000Z", "2018-08-09T20:15:00.000Z", "2018-08-09T20:16:00.000Z", "2018-08-09T20:17:00.000Z", "2018-08-09T20:18:00.000Z", "2018-08-09T20:19:00.000Z", "2018-08-09T20:20:00.000Z", "2018-08-09T20:21:00.000Z", "2018-08-09T20:22:00.000Z", "2018-08-09T20:23:00.000Z", "2018-08-09T20:24:00.000Z", "2018-08-09T20:25:00.000Z", "2018-08-09T20:26:00.000Z", "2018-08-09T20:27:00.000Z", "2018-08-09T20:28:00.000Z", "2018-08-09T20:29:00.000Z", "2018-08-09T20:30:00.000Z", "2018-08-09T20:31:00.000Z", "2018-08-09T20:32:00.000Z", "2018-08-09T20:33:00.000Z", "2018-08-09T20:34:00.000Z", "2018-08-09T20:35:00.000Z", "2018-08-09T20:36:00.000Z", "2018-08-09T20:37:00.000Z", "2018-08-09T20:38:00.000Z", "2018-08-09T20:39:00.000Z", "2018-08-09T20:40:00.000Z", "2018-08-09T20:41:00.000Z", "2018-08-09T20:42:00.000Z", "2018-08-09T20:43:00.000Z", "2018-08-09T20:44:00.000Z", "2018-08-09T20:45:00.000Z", "2018-08-09T20:46:00.000Z", "2018-08-09T20:47:00.000Z", "2018-08-09T20:48:00.000Z", "2018-08-09T20:49:00.000Z", "2018-08-09T20:50:00.000Z", "2018-08-09T20:51:00.000Z", "2018-08-09T20:52:00.000Z", "2018-08-09T20:53:00.000Z", "2018-08-09T20:54:00.000Z", "2018-08-09T20:55:00.000Z", "2018-08-09T20:56:00.000Z", "2018-08-09T20:57:00.000Z", "2018-08-09T20:58:00.000Z", "2018-08-09T20:59:00.000Z", "2018-08-09T21:00:00.000Z", "2018-08-09T21:01:00.000Z", "2018-08-09T21:02:00.000Z", "2018-08-09T21:03:00.000Z", "2018-08-09T21:04:00.000Z", "2018-08-09T21:05:00.000Z", "2018-08-09T21:06:00.000Z", "2018-08-09T21:07:00.000Z" ] }, "jvm/gc/mem/used": { "avg": [ 498.49, 498.65, 498.72, 498.72, 498.74, 499.41, 499.43, 503.4, 503.4, 503.4, 503.4, 503.4, 511.12, 511.98, 512.14, 512.16, 512.19, 512.22, 512.22, 512.67, 512.67, 513.36, 517.3, 517.32, 517.32, 517.32, 517.35, 521.29, 521.46, 521.47, 522.15, 522.22, 526.45, 526.45, 526.45, 526.45, 526.48, 530.47, 531.15, 531.16, 531.33, 531.77, 531.99, 531.99, 531.99, 532.0, 532.71, 532.71, 532.73, 532.73, 532.73, 532.73, 540.4, 540.4, 541.25, 541.45, 541.46, 541.46, 541.46, 541.46 ], "kpi": { "current": 17.3, "diff_percent": 4.46, "diff_value": 23.1, "past": 16.6 }, "max": 17.3, "min": 15.9, "percent": [ 15.9, 15.9, 15.9, 15.9, 15.9, 16.0, 16.0, 16.1, 16.1, 16.1, 16.1, 16.1, 16.3, 16.4, 16.4, 16.4, 16.4, 16.4, 16.4, 16.4, 16.4, 16.4, 16.5, 16.5, 16.5, 16.5, 16.5, 16.7, 16.7, 16.7, 16.7, 16.7, 16.8, 16.8, 16.8, 16.8, 16.8, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.3, 17.3, 17.3, 17.3, 17.3, 17.3, 17.3, 17.3 ], "timestamp": [ "2018-08-09T20:08:00.000Z", "2018-08-09T20:09:00.000Z", "2018-08-09T20:10:00.000Z", "2018-08-09T20:11:00.000Z", "2018-08-09T20:12:00.000Z", "2018-08-09T20:13:00.000Z", "2018-08-09T20:14:00.000Z", "2018-08-09T20:15:00.000Z", "2018-08-09T20:16:00.000Z", "2018-08-09T20:17:00.000Z", "2018-08-09T20:18:00.000Z", "2018-08-09T20:19:00.000Z", "2018-08-09T20:20:00.000Z", "2018-08-09T20:21:00.000Z", "2018-08-09T20:22:00.000Z", "2018-08-09T20:23:00.000Z", "2018-08-09T20:24:00.000Z", "2018-08-09T20:25:00.000Z", "2018-08-09T20:26:00.000Z", "2018-08-09T20:27:00.000Z", "2018-08-09T20:28:00.000Z", "2018-08-09T20:29:00.000Z", "2018-08-09T20:30:00.000Z", "2018-08-09T20:31:00.000Z", "2018-08-09T20:32:00.000Z", "2018-08-09T20:33:00.000Z", "2018-08-09T20:34:00.000Z", "2018-08-09T20:35:00.000Z", "2018-08-09T20:36:00.000Z", "2018-08-09T20:37:00.000Z", "2018-08-09T20:38:00.000Z", "2018-08-09T20:39:00.000Z", "2018-08-09T20:40:00.000Z", "2018-08-09T20:41:00.000Z", "2018-08-09T20:42:00.000Z", "2018-08-09T20:43:00.000Z", "2018-08-09T20:44:00.000Z", "2018-08-09T20:45:00.000Z", "2018-08-09T20:46:00.000Z", "2018-08-09T20:47:00.000Z", "2018-08-09T20:48:00.000Z", "2018-08-09T20:49:00.000Z", "2018-08-09T20:50:00.000Z", "2018-08-09T20:51:00.000Z", "2018-08-09T20:52:00.000Z", "2018-08-09T20:53:00.000Z", "2018-08-09T20:54:00.000Z", "2018-08-09T20:55:00.000Z", "2018-08-09T20:56:00.000Z", "2018-08-09T20:57:00.000Z", "2018-08-09T20:58:00.000Z", "2018-08-09T20:59:00.000Z", "2018-08-09T21:00:00.000Z", "2018-08-09T21:01:00.000Z", "2018-08-09T21:02:00.000Z", "2018-08-09T21:03:00.000Z", "2018-08-09T21:04:00.000Z", "2018-08-09T21:05:00.000Z", "2018-08-09T21:06:00.000Z", "2018-08-09T21:07:00.000Z" ] }, "jvm/mem/used": { "avg": [ 1049.04, 1049.04, 1049.18, 1049.18, 1049.21, 1050.56, 1050.59, 1058.53, 1058.53, 1058.53, 1058.53, 1058.53, 1073.98, 1075.69, 1076.01, 1076.05, 1076.11, 1076.18, 1076.18, 1077.07, 1077.07, 1078.45, 1086.35, 1086.38, 1086.38, 1086.38, 1086.44, 1094.65, 1094.65, 1096.03, 1096.03, 1096.18, 1104.63, 1104.63, 1104.63, 1104.63, 1104.69, 1112.68, 1114.03, 1114.07, 1114.39, 1115.29, 1115.72, 1115.72, 1115.72, 1115.75, 1117.16, 1117.16, 1117.19, 1117.19, 1117.19, 1117.19, 1132.54, 1132.54, 1134.24, 1134.63, 1134.66, 1134.66, 1134.66, 1134.66 ], "kpi": { "current": 22.5, "diff_percent": 4.24, "diff_value": 46.16, "past": 21.6 }, "max": 22.5, "min": 20.8, "percent": [ 20.8, 20.8, 20.8, 20.8, 20.8, 20.8, 20.8, 21.0, 21.0, 21.0, 21.0, 21.0, 21.3, 21.3, 21.3, 21.3, 21.3, 21.3, 21.3, 21.4, 21.4, 21.4, 21.5, 21.5, 21.5, 21.5, 21.5, 21.7, 21.7, 21.7, 21.7, 21.7, 21.9, 21.9, 21.9, 21.9, 21.9, 22.1, 22.1, 22.1, 22.1, 22.1, 22.1, 22.1, 22.1, 22.1, 22.1, 22.1, 22.1, 22.1, 22.1, 22.1, 22.5, 22.5, 22.5, 22.5, 22.5, 22.5, 22.5, 22.5 ], "timestamp": [ "2018-08-09T20:08:00.000Z", "2018-08-09T20:09:00.000Z", "2018-08-09T20:10:00.000Z", "2018-08-09T20:11:00.000Z", "2018-08-09T20:12:00.000Z", "2018-08-09T20:13:00.000Z", "2018-08-09T20:14:00.000Z", "2018-08-09T20:15:00.000Z", "2018-08-09T20:16:00.000Z", "2018-08-09T20:17:00.000Z", "2018-08-09T20:18:00.000Z", "2018-08-09T20:19:00.000Z", "2018-08-09T20:20:00.000Z", "2018-08-09T20:21:00.000Z", "2018-08-09T20:22:00.000Z", "2018-08-09T20:23:00.000Z", "2018-08-09T20:24:00.000Z", "2018-08-09T20:25:00.000Z", "2018-08-09T20:26:00.000Z", "2018-08-09T20:27:00.000Z", "2018-08-09T20:28:00.000Z", "2018-08-09T20:29:00.000Z", "2018-08-09T20:30:00.000Z", "2018-08-09T20:31:00.000Z", "2018-08-09T20:32:00.000Z", "2018-08-09T20:33:00.000Z", "2018-08-09T20:34:00.000Z", "2018-08-09T20:35:00.000Z", "2018-08-09T20:36:00.000Z", "2018-08-09T20:37:00.000Z", "2018-08-09T20:38:00.000Z", "2018-08-09T20:39:00.000Z", "2018-08-09T20:40:00.000Z", "2018-08-09T20:41:00.000Z", "2018-08-09T20:42:00.000Z", "2018-08-09T20:43:00.000Z", "2018-08-09T20:44:00.000Z", "2018-08-09T20:45:00.000Z", "2018-08-09T20:46:00.000Z", "2018-08-09T20:47:00.000Z", "2018-08-09T20:48:00.000Z", "2018-08-09T20:49:00.000Z", "2018-08-09T20:50:00.000Z", "2018-08-09T20:51:00.000Z", "2018-08-09T20:52:00.000Z", "2018-08-09T20:53:00.000Z", "2018-08-09T20:54:00.000Z", "2018-08-09T20:55:00.000Z", "2018-08-09T20:56:00.000Z", "2018-08-09T20:57:00.000Z", "2018-08-09T20:58:00.000Z", "2018-08-09T20:59:00.000Z", "2018-08-09T21:00:00.000Z", "2018-08-09T21:01:00.000Z", "2018-08-09T21:02:00.000Z", "2018-08-09T21:03:00.000Z", "2018-08-09T21:04:00.000Z", "2018-08-09T21:05:00.000Z", "2018-08-09T21:06:00.000Z", "2018-08-09T21:07:00.000Z" ] }, "jvm/pool/used": { "avg": [ 349.68, 349.68, 349.73, 349.73, 350.19, 350.19, 350.2, 352.84, 352.84, 352.84, 352.84, 352.84, 357.99, 358.56, 358.67, 358.68, 358.7, 358.73, 358.73, 359.02, 359.02, 359.48, 362.12, 362.13, 362.13, 362.13, 362.15, 364.88, 364.88, 365.34, 365.34, 365.39, 368.21, 368.21, 368.21, 368.21, 368.23, 371.34, 371.34, 371.36, 371.46, 371.87, 371.91, 371.91, 371.91, 371.92, 372.39, 372.39, 372.4, 372.4, 372.4, 372.4, 377.51, 377.51, 378.08, 378.21, 378.22, 378.22, 378.22, 378.22 ], "kpi": { "current": 20.0, "diff_percent": 4.24, "diff_value": 15.37, "past": 19.2 }, "max": 20.0, "min": 18.5, "percent": [ 18.5, 18.5, 18.5, 18.5, 18.5, 18.5, 18.5, 18.6, 18.6, 18.6, 18.6, 18.6, 18.9, 18.9, 19.0, 19.0, 19.0, 19.0, 19.0, 19.0, 19.0, 19.0, 19.1, 19.1, 19.1, 19.1, 19.1, 19.3, 19.3, 19.3, 19.3, 19.3, 19.5, 19.5, 19.5, 19.5, 19.5, 19.6, 19.6, 19.6, 19.6, 19.7, 19.7, 19.7, 19.7, 19.7, 19.7, 19.7, 19.7, 19.7, 19.7, 19.7, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0 ], "timestamp": [ "2018-08-09T20:08:00.000Z", "2018-08-09T20:09:00.000Z", "2018-08-09T20:10:00.000Z", "2018-08-09T20:11:00.000Z", "2018-08-09T20:12:00.000Z", "2018-08-09T20:13:00.000Z", "2018-08-09T20:14:00.000Z", "2018-08-09T20:15:00.000Z", "2018-08-09T20:16:00.000Z", "2018-08-09T20:17:00.000Z", "2018-08-09T20:18:00.000Z", "2018-08-09T20:19:00.000Z", "2018-08-09T20:20:00.000Z", "2018-08-09T20:21:00.000Z", "2018-08-09T20:22:00.000Z", "2018-08-09T20:23:00.000Z", "2018-08-09T20:24:00.000Z", "2018-08-09T20:25:00.000Z", "2018-08-09T20:26:00.000Z", "2018-08-09T20:27:00.000Z", "2018-08-09T20:28:00.000Z", "2018-08-09T20:29:00.000Z", "2018-08-09T20:30:00.000Z", "2018-08-09T20:31:00.000Z", "2018-08-09T20:32:00.000Z", "2018-08-09T20:33:00.000Z", "2018-08-09T20:34:00.000Z", "2018-08-09T20:35:00.000Z", "2018-08-09T20:36:00.000Z", "2018-08-09T20:37:00.000Z", "2018-08-09T20:38:00.000Z", "2018-08-09T20:39:00.000Z", "2018-08-09T20:40:00.000Z", "2018-08-09T20:41:00.000Z", "2018-08-09T20:42:00.000Z", "2018-08-09T20:43:00.000Z", "2018-08-09T20:44:00.000Z", "2018-08-09T20:45:00.000Z", "2018-08-09T20:46:00.000Z", "2018-08-09T20:47:00.000Z", "2018-08-09T20:48:00.000Z", "2018-08-09T20:49:00.000Z", "2018-08-09T20:50:00.000Z", "2018-08-09T20:51:00.000Z", "2018-08-09T20:52:00.000Z", "2018-08-09T20:53:00.000Z", "2018-08-09T20:54:00.000Z", "2018-08-09T20:55:00.000Z", "2018-08-09T20:56:00.000Z", "2018-08-09T20:57:00.000Z", "2018-08-09T20:58:00.000Z", "2018-08-09T20:59:00.000Z", "2018-08-09T21:00:00.000Z", "2018-08-09T21:01:00.000Z", "2018-08-09T21:02:00.000Z", "2018-08-09T21:03:00.000Z", "2018-08-09T21:04:00.000Z", "2018-08-09T21:05:00.000Z", "2018-08-09T21:06:00.000Z", "2018-08-09T21:07:00.000Z" ] }}, "query/cache/delta/hitRate": { "avg": [ 0.0, 0.0, 0.9981718464351006, 0.0, 0.0, 0.0, 0.0, 0.9981718464351006, 0.0, 0.0, 0.0, 0.0, 0.9981718464351006, 0.0, 0.0, 0.0, 0.0, 0.9981718464351006, 0.0, 0.0, 0.0, 0.0, 0.9981718464351006, 0.0, 0.0, 0.0, 0.0, 0.9981718464351006, 0.0, 0.0, 0.0, 0.0, 0.9963503649635036, 0.0, 0.0, 0.0, 0.0, 0.9963503649635036, 0.0, 0.0, 0.0, 0.0, 0.9972627737226277, 0.0, 0.0, 0.0, 0.0, 0.9981751824817519, 0.0, 0.0, 0.0, 0.0, 0.9981751824817519, 0.0, 0.0, 0.0, 0.0, 0.9981751824817519, 0.0, 0.0 ], "kpi": { "current": 0.24954379562043796, "diff_percent": 30.06, "diff_value": 0.06, "past": 0.19186864932196135 }, "max": 0.9981751824817519, "min": 0.0, "percent": [], "timestamp": [ "2018-08-09T20:08:00.000Z", "2018-08-09T20:09:00.000Z", "2018-08-09T20:10:00.000Z", "2018-08-09T20:11:00.000Z", "2018-08-09T20:12:00.000Z", "2018-08-09T20:13:00.000Z", "2018-08-09T20:14:00.000Z", "2018-08-09T20:15:00.000Z", "2018-08-09T20:16:00.000Z", "2018-08-09T20:17:00.000Z", "2018-08-09T20:18:00.000Z", "2018-08-09T20:19:00.000Z", "2018-08-09T20:20:00.000Z", "2018-08-09T20:21:00.000Z", "2018-08-09T20:22:00.000Z", "2018-08-09T20:23:00.000Z", "2018-08-09T20:24:00.000Z", "2018-08-09T20:25:00.000Z", "2018-08-09T20:26:00.000Z", "2018-08-09T20:27:00.000Z", "2018-08-09T20:28:00.000Z", "2018-08-09T20:29:00.000Z", "2018-08-09T20:30:00.000Z", "2018-08-09T20:31:00.000Z", "2018-08-09T20:32:00.000Z", "2018-08-09T20:33:00.000Z", "2018-08-09T20:34:00.000Z", "2018-08-09T20:35:00.000Z", "2018-08-09T20:36:00.000Z", "2018-08-09T20:37:00.000Z", "2018-08-09T20:38:00.000Z", "2018-08-09T20:39:00.000Z", "2018-08-09T20:40:00.000Z", "2018-08-09T20:41:00.000Z", "2018-08-09T20:42:00.000Z", "2018-08-09T20:43:00.000Z", "2018-08-09T20:44:00.000Z", "2018-08-09T20:45:00.000Z", "2018-08-09T20:46:00.000Z", "2018-08-09T20:47:00.000Z", "2018-08-09T20:48:00.000Z", "2018-08-09T20:49:00.000Z", "2018-08-09T20:50:00.000Z", "2018-08-09T20:51:00.000Z", "2018-08-09T20:52:00.000Z", "2018-08-09T20:53:00.000Z", "2018-08-09T20:54:00.000Z", "2018-08-09T20:55:00.000Z", "2018-08-09T20:56:00.000Z", "2018-08-09T20:57:00.000Z", "2018-08-09T20:58:00.000Z", "2018-08-09T20:59:00.000Z", "2018-08-09T21:00:00.000Z", "2018-08-09T21:01:00.000Z", "2018-08-09T21:02:00.000Z", "2018-08-09T21:03:00.000Z", "2018-08-09T21:04:00.000Z", "2018-08-09T21:05:00.000Z", "2018-08-09T21:06:00.000Z", "2018-08-09T21:07:00.000Z" ] }, "query/time": { "avg": [ 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.08, 0.01, 0.01, 0.01, 0.01, 0.01 ], "kpi": { "current": 10.833333333333334, "diff_percent": -49.06, "diff_value": -0.01, "past": 21.266666666666666 }, "max": 0.08, "min": 0.01, "percent": [], "timestamp": [ "2018-08-09T20:10:00.000Z", "2018-08-09T20:15:00.000Z", "2018-08-09T20:20:00.000Z", "2018-08-09T20:25:00.000Z", "2018-08-09T20:30:00.000Z", "2018-08-09T20:35:00.000Z", "2018-08-09T20:40:00.000Z", "2018-08-09T20:45:00.000Z", "2018-08-09T20:50:00.000Z", "2018-08-09T20:55:00.000Z", "2018-08-09T21:00:00.000Z", "2018-08-09T21:05:00.000Z" ] } } },
            serverNodeHost : "druid/dev/broker:localhost:8082",

            isLoaded : false,

        };
    }

    componentWillMount(){

        // console.log("NodeSelect : in componentWillMount")
        // console.log(this.props.servers)

        this.getNodes(this.props.servers);

        //this.state.nodeOptions =
        this.makeNodeOptions(this.state.nodeList)

        // console.log(this.state.nodeOptions)

        //this.state.serverHostOptions =
        this.makeServerHostOptions(this.props.servers,this.state.portList)

        // console.log(this.state.serverHostOptions)

        this.state.granularityOptions = [
            {value: 'minute', label: '1min'},
            {value: 'fifteen_minute', label: '15min'},
            {value: 'thirty_minute', label: '30min'},
            {value: 'hour', label: '1hour'},
            {value: 'day', label: 'day'},
            {value: 'week', label: 'week'},
            {value: 'month', label: 'month'},
            {value: 'quarter', label: 'quarter'},
            {value: 'year', label: 'year'}
        ];

        //initial fetch default render
        fetch('data/detail/post', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: "cors",

            //여기가 실제로 서버에 요청을 보내는 부분. 사용자가 select-box에서 클릭한 내용에 따라.

            body: JSON.stringify(this.state.nodeInfo)
        })
            .then(response => {
                if (response.status !== 200) {
                    return this.setState({placeholder: "Something went wrong"});
                }
                // console.log("output!!!!!!!!!!!!!!!:" + response)
                return response.json();
            }).then(data => {
            console.log(data)
            this.setState({data: data, isLoaded: true, serverNodeHost : this.state.nodeOption.value+":"+this.state.serverHostOption.value})

            ReactDOM.render(<Nodes data={this.state.data} serverNodeHost={this.state.serverNodeHost}/>,document.getElementById('node_details'));

        });

        console.log(this.state.nodeInfo);

        this.handleStart=this.handleStart.bind(this);
        this.handleEnd=this.handleEnd.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.handleChange2=this.handleChange2.bind(this);
        this.handleChange3=this.handleChange3.bind(this);

    }

    //@params servers : ["localhost","52.1.100.132"]
    //List of servers passed
    getNodes (servers){

        Object.values(servers).map(server =>(
            this.state.nodeList.push(Object.keys(this.props.nodeList_all[server])
        )));

        Object.values(servers).map(server =>(
            this.state.portList.push(Object.values(this.props.nodeList_all[server])
        )));

        // console.log("in getNodes")
        // [["druid/dev/coordinator", "druid/dev/broker", "druid/dev/historical", "druid/dev/overlord", "druid/dev/middleManager"]]
        // servers 목록에서 0번 자리에 들어있는 서버 안에 있는 각 노드들이 0번 목록에 담겨있다.
        // console.log(this.state.nodeList)
        // [[["8081"], ["8082"], ["8083"], ["8090"], ["8091", "8100", "8101"]]]
        // servers 목록에서 0번 자리에 들어있는 서버 안에 있는 각 노드들의 포트 번호가 0번 목록에 담겨있다.
        // console.log(this.state.portList)
    }

    makeNodeOptions (nodeList){
        // console.log("in makeNodeOptions")
        // console.log(nodeList)
        Object.values(nodeList).map(nodes =>(
            Object.values(nodes).map(node=>(
                // console.log(node),
                this.state.nodeOptions.push({value : node, label : node.toString().split("/")[2]})
            ))

        ));
    }

    makeServerHostOptions(servers, portList){
        // console.log("in makeServerHostOptions")
        Object.values(servers).map(server=>(
            // console.log(server),
            Object.values(portList).map(listPortsOnServer=>(
                // console.log(listPortsOnServer),
                Object.values(listPortsOnServer).map(ports=>(
                    // console.log(ports),
                    Object.values(ports).map(port=>(
                        // console.log(port),
                        this.state.serverHostOptions.push({value : server+":"+port, label: server+":"+port})
                    ))

                ))

            ))
        ))
    }

    //set date
    handleStart (date) {
        this.setState({
            start: date._d.toISOString()
        });
    }
    handleEnd (date) {
        this.setState({
            end: date._d.toISOString()
        });
    }

    //get changed value
    handleChange(nodeOption) {
        this.setState({
            nodeOption : nodeOption
        });
        console.log(`node Option selected:`, nodeOption);
    }

    handleChange2 (serverHostOption) {
        this.setState({
            serverHostOption: serverHostOption
        });
        console.log(`serverPortOption selected:`, serverHostOption);
    }

    handleChange3 (graOption) {
         this.setState({
            graOption: graOption
        });
        console.log(`gra Option selected:`, graOption);
    }

    handleSubmit = (event) => {
        console.log("in handleSubmit")
        event.preventDefault();

        this.state.nodeInfo = {
            start_time: this.state.start,
            end_time: this.state.end,

            // node : 'druid/dev/broker'
            node: this.state.nodeOption.value,
            // server:'localhost',
            server: this.state.serverHostOption.value.split(":")[0],
            // port : '8081'
            port:this.state.serverHostOption.value.split(":")[1],

            granularity: this.state.graOption.value,
        }

        console.log(this.state.nodeInfo)

        //앞에 슬래쉬(/)를 하나 더 해주면 절대경로로 된다.
        fetch('data/detail/post', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: "cors",

            //여기가 실제로 서버에 요청을 보내는 부분. 사용자가 select-box에서 클릭한 내용에 따라.

            body: JSON.stringify(this.state.nodeInfo)
        })
            .then(response => {
                if (response.status !== 200) {
                    return this.setState({placeholder: "Something went wrong"});
                }
                // console.log("output!!!!!!!!!!!!!!!:" + response)
                return response.json();
            }).then(data => {
            console.log(data)

            this.setState({data: data, isLoaded: true, serverNodeHost : this.state.nodeOption.value+":"+this.state.serverHostOption.value})

            console.log("check loaded & serverNodeHost")
            console.log(this.state.isLoaded)
            console.log(this.state.serverNodeHost)

            ReactDOM.render(<Nodes data={this.state.data} serverNodeHost={this.state.serverNodeHost}/>,document.getElementById('node_details'));

            })
    }

    render(){

        return(
            <React.Fragment>
                <div className="ddp-ui-option ddp-clear">

                    <form className="ddp-ui-option ddp-clear" onSubmit={this.handleSubmit}>

                        {/*select node*/}
                        <div className="ddp-wrap-edit">
                           <label className="ddp-label-type">Node Select</label>
                           <div className="ddp-ui-edit-option">
                             <div className="ddp-type-selectbox">
                                <Select className="ddp-list-selectbox ddp-selectdown" value={this.state.nodeOption} onChange={this.handleChange} options={this.state.nodeOptions}/>
                             </div>
                           </div>
                        </div>

                        {/*select server, host*/}
                        <div className="ddp-wrap-edit">
                            <label className="ddp-label-type">Server Select</label>
                            <div className="ddp-ui-edit-option">
                                <div className="ddp-type-selectbox">
                                    <Select className="ddp-list-selectbox ddp-selectdown" value={this.state.serverHostOption} onChange={this.handleChange2} options={this.state.serverHostOptions}/>
                                </div>
                            </div>
                        </div>

                        {/*select granularity*/}
                        <div className="ddp-wrap-edit">
                            <label className="ddp-label-type">Granularity Select</label>
                            <div className="ddp-ui-edit-option">
                                <div className="ddp-type-selectbox">
                                    <Select className="ddp-list-selectbox ddp-selectdown" value={this.state.graOption} onChange={this.handleChange3} options={this.state.granularityOptions}/>
                                </div>
                            </div>
                        </div>

                        <div className="ddp-wrap-edit">
                            <div className="ddp-ui-edit-option">
                                <label className="ddp-label-type">Start Time</label>
                                <Datetime className = "ddp-btn-toggle ddp-data-range" onChange={this.handleStart} utc={true} value={this.state.start}>DateTime Start </Datetime>
                                <label className = "ddp-label-type">End Time</label>
                                <Datetime className = "ddp-btn-toggle ddp-data-range" onChange={this.handleEnd} utc={true} value={this.state.end}>DateTime End </Datetime>
                            </div>
                        </div>

                        <div className="ddp-wrap-edit">
                            <div className="ddp-ui-edit-option">
                                <button className="ddp-ui-edit-button" type="submit">submit</button>
                            </div>
                        </div>

                    </form>

                </div>

        </React.Fragment>
        )
    }

} //end of class


