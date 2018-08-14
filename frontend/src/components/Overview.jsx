import React, {Component} from "react";
import PropTypes from "prop-types";
import 'echarts/theme/macarons.js';
import OverviewEachChart from './OverviewEachChart';

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
    }

    render(){
        return(
            <div>
                <div className="ddp-clear">

                    <div className="ddp-wrap-edit">
                        <div className="ddp-ui-edit-option">
                            <a href="#" className="ddp-btn-toggle ddp-data-range">{this.props.serverNodeHost}</a>
                        </div>
                    </div>

                    <div>
                        <div className="ddp-clear">
                        </div>
                    </div>

                    {/*this.proos.data = {'jvm/mem/used':{'avg':[],'percent':[],min:20,max:90,kpi:{}}, etc.}*/}
                    {Object.keys(this.props.data).map(metric=>
                    (<OverviewEachChart data={this.props.data} server={this.props.server} serverNodeHost={this.props.serverNodeHost} metric={metric}/>)
                    )}

                </div>

            </div>
        )}
} //end of class


