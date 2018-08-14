import * as U from './utils'
import React, {Component} from "react";
import PropTypes from "prop-types";

export default class OverviewKPIBox extends Component {

    constructor() {
        super();

        this.propTypes = {
            data: PropTypes.object.isRequired,
            metric: PropTypes.string.isRequired,
        };
        this.state = {};

    }

    render() {
        return (

            <div className="col-3">

                <div id={this.props.metric} className="component-box type-databox">

                    <div className="type-label">{U.changeMetric(this.props.metric)}</div>

                    <span className="data-memory">
                        <strong>{this.props.data[this.props.metric]['kpi']['diff_value']}</strong>
                    </span>

                    <div
                        className="data-value">{this.props.data[this.props.metric]['kpi']['diff_value'] + " "}(하루평균대비)
                    </div>
                </div>
            </div>


        )
    }

}

// {/*<ReactEcharts*/}
//                        {/*option={this.getOption(*/}
//                            {/*{data : this.props.data[metric]},*/}
//                            {/*{metric : metric},*/}
//                            {/*// {data : data['jvm/mem/used']},*/}
//                            {/*// {metric : 'jvm/mem/used'},*/}
//                            {/*// {hasP : hasPercent({data : data['jvm/mem/used']})}*/}
//                        {/*)}*/}
//                        {/*style={{height: '100%', width: '100%'}}*/}
//                        {/*className={"ddp-box-chart"}*/}
//                        {/*theme={'macarons'}*/}
//                    {/*/>*/}
