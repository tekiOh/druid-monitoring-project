import React from 'react';

export const pick = (obj, keys) => {
  const r = {};
  keys.forEach((key) => {
    r[key] = obj[key];
  });
  return r;
};

export const getServers = ({nodeList_all})=>{
    // console.log("in getServers");

    let servers = Object.keys(nodeList_all);

    // console.log(servers)

    let result = JSON.stringify(servers);

    // console.log(result)

    return JSON.parse(result)
}

export const getNode = ({node}) => {

    let temp = node
    if(typeof temp != "string"){
        temp=JSON.stringify(node)
    }

    if(temp.includes('coordinator')){
        return "overview/coordinator"
    }else if(temp.includes('broker')){
        return "overview/broker"
    }else if(temp.includes('historical')){
        return "overview/historical"
    }else if(temp.includes('overlord')){
        return "overview/overlord"
    }else if(temp.includes('middleManager')){
        return "overview/middleManager"
    }
}

export const makeServerNodeHostKey = ({node},{server},{host}) => {
    return (node+":"+server+":"+host).toString()
}

export const changeMetric =({metric}) =>{
    switch (metric){
        case "jvm/bufferpool/used":
            return "Bufferpool 사용률"
        case "jvm/gc/mem/used":
            return "Garbage Collector 메모리 사용률"
        case "jvm/mem/used":
            return "JVM 메모리 사용률"
        case "jvm/pool/used":
            return "Pool 사용률"
        case "query/cache/delta/hitRate":
            return "Query cache 재사용률"
        case "query/time":
            return "Query 소요시간"
        case "task/run/time":
            return "Task 소요 시간"
        case "ingest/events/processed":
            return "Ingest된 event의 양"
        case "ingest/events/thrownAway":
            return "Ingest 실패한 event 양"
        case "ingest/events/unparseable":
            return "Ingest 할 수 없는 event 양"
        default :
            return metric
        // detail에 사용되는 metric에 대한 변환이 추가적으로 이루어져야함.
        // case "":
        //     return ""

    }
}



