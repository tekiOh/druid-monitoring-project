import React,{Component} from "react";
import DataProvider from './DataProvider'
import Overview from './Overview'
import * as U from './utils'

const OverviewKPIs=({nodeList_all,servers})=> (
    !servers.length?(
        <p>Active server not detected</p>
    ):(
        //(1)서버마다 반복
        //servers = ['localhost']
        //server = 'localhost'
        (<div>{servers.map(server =>
            //(2)노드마다 반복
            //nodeList_all[server] = nodeList_all['localhost']=['druid/dev/coordinator','druid/dev/broker', etc. ]
            //node = 'druid/dev/coordinator'
            (<div>{Object.keys(nodeList_all[server]).map(node =>
                //(3)호스트마다 반복
                //nodeList_all[server][node] = nodeList_all['localhost']['druid/dev/coordinator'] = ['8091,'8100']
                //host = '8091'
                (<div>{Object.values(nodeList_all[server][node]).map(host =>
                        //endpoint={"overview/coordinator"}
                        (<DataProvider endpoint={"data/"+U.getNode({node})}
                              render={data=>(
                                  // console.log(nodeList_all),
                                  // console.log(server),
                                  <Overview
                                  //data ={"druid/dev/coordinator:localhost:8091":{"jvm":{"jvm/mem/used":{avg:[],percent:[],kpi:{},min:100,max:100},"jvm/pool/used":{~~}}},"query/~":{} ,"blahblah":{~}, etc.}}
                                  data={data[U.makeServerNodeHostKey({node},{server},{host})]}
                                  // server={'localhost'}
                                  server={server}
                                  // serverNodeHost={'druid/dev/coordinator:localhost:8081'}
                                  serverNodeHost={U.makeServerNodeHostKey({node},{server},{host})}
                                  />)}
                        />)
                )}
                </div>)
            )}
            </div>)
        )}
        </div>)
    )
);

export default OverviewKPIs
