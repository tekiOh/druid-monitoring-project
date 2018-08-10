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



