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


                <div id="overview_current_cpu" className="component-box type-cpu">
                    <div className="type-label">현재 CPU</div>

                    <span className="data-memory">
                           <strong> {this.props.data[this.props.metric]['percent'][0]}</strong>
                        </span>

                    <div
                        className="data-value type-down">{this.props.data[this.props.metric]['kpi']['diff_percent'] + "% "}(하루평균대비)
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
