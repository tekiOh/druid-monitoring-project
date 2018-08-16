import NodeListProvider from './NodeListProvider'
import OverviewKPIs from './OverviewKPIs'
import * as U from './utils'
import React from "react";

const OverviewRender =()=>(
  <React.Fragment>
      <NodeListProvider endpoint="data/nodelist"
          render={nodeList_all=>(
               // console.log("Entering OverviewKPIs"),
               // console.log(nodeList_all),
               // console.log(U.getServers({nodeList_all})),
              <OverviewKPIs
                  nodeList_all={nodeList_all}
                  // servers={['localhost']}
                  servers={U.getServers({nodeList_all})}
              />)}
      />
  </React.Fragment>
);
export default OverviewRender
