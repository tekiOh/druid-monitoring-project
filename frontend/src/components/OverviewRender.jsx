import NodeListProvider from './NodeListProvider'
import OverviewKPIs from './OverviewKPIs'
import * as U from './utils'
import React ,{Component}from "react";

export default class OverviewRender extends Component{

    render() {
        return (
            <React.Fragment>
                <NodeListProvider endpoint="data/nodelist"
                                  render={nodeList_all => (
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

        )
    }
}
