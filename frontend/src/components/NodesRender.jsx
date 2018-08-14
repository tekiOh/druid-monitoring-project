import NodeListProvider from './NodeListProvider'
import * as U from './utils'
import React, {Component} from "react";
import NodeSelect from "./NodeSelect";

export default class NodesRender extends Component {

    constructor() {
        super();

        this.propTypes = {
        };

        this.state = {
        };
    }

    componentDidMount(){
        return this.setState(
            {
            })
    }

    render(){
        return(
            <React.Fragment>

              <NodeListProvider endpoint="data/nodelist"
                  render={nodeList_all=>(
                       // console.log("NodesRender"),
                       // console.log(nodeList_all),
                      <NodeSelect
                          // nodeList_all = {"localhost": {"druid/dev/coordinator": ["8081"], "druid/dev/broker": ["8082"], "druid/dev/historical": ["8083"], "druid/dev/overlord": ["8090"], "druid/dev/middleManager": ["8091", "8100"]}}
                          nodeList_all={nodeList_all}
                          // servers={['localhost']}
                          servers={U.getServers({nodeList_all})}
                      />)}
              />
            </React.Fragment>
        )
    }
}
