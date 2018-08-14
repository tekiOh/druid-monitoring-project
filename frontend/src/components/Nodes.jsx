import React, {Component} from "react";

import PropTypes from "prop-types";
import 'echarts/theme/macarons.js';
import NodesEachChart from "./NodesEachChart";


export default class Nodes extends Component {

    constructor() {
        super();

        this.propTypes = {
            data: PropTypes.object.isRequired,
            serverNodeHost: PropTypes.string.isRequired,
        };
        this.state = {};

    }

    render() {
        return (
            <div>
                {Object.keys(this.props.data[this.props.serverNodeHost]).map(metric =>
                    (<NodesEachChart data={this.props.data} serverNodeHost={this.props.serverNodeHost}
                                     metric={metric}/>)
                )}
            </div>
        )
    }

} //end of class


