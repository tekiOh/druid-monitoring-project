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

            <div className="col-6">

                <div id="overview_current_mem" className="component-box type-memory">
                    <div className="type-label">현재 메모리</div>

                    <span className="data-memory">
                            <strong>{this.props.data[this.props.metric]['avg'][0]}</strong> MB
                        </span>

                    <div
                        className="data-value">{this.props.data[this.props.metric]['kpi']['diff_percent'] + "% "}(하루평균대비)
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
