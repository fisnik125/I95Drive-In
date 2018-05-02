import React, { Component } from 'react';
import { BarChart, PieChart, Sector, Pie, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import Api from '../../Api';

const DriveInBarChart = ({ report }) => (
  <BarChart width={970} height={500} data={report}>
    <CartesianGrid strokeDasharray="3 3"/>
    <XAxis dataKey='name'/>
    <YAxis/>
    <Tooltip separator=': $'/>
    <Bar dataKey='value' fill="#8884d8"/>
  </BarChart>
);

class DriveInAreaChart extends Component {
  state = {
    activeIndex: 0,
  }

  onPieEnter = (_, index) => {
    this.setState({ activeIndex: index });
  }

  renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} transactions`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  }

  render() {
    const { report } = this.props;
    const { activeIndex } = this.state;

    return (
      <PieChart width={970} height={500}>
        <Pie activeIndex={activeIndex}
             activeShape={this.renderActiveShape}
             data={report}
             dataKey='value'
             nameKey='name'
             fill="#8884d8"
             innerRadius={100}
             outerRadius={200}
             onMouseEnter={this.onPieEnter} />
      </PieChart>
    )
  }
}

export default class Reports extends Component {
  static DEFAULT_REPORT = 'moviesByProfit'

  state = {
    report: [],
    reportType: Reports.DEFAULT_REPORT,
  }

	componentWillMount() {
    this.reportChange({ target: { value: Reports.DEFAULT_REPORT } });
  }

  reportChange = (ev) => {
    const { value: reportType } = ev.target;

    Api.get(`/api/reports/${reportType}`)
      .then(res => { this.setState({ report: res.report, reportType }); })
      .catch(err => { console.error(err); });
  }

  render() {
    const { report, reportType } = this.state;
    console.log('report', report);

    return (
      <div className='Reports'>
        <h1>Reports</h1>
        <label htmlFor='report-selection'>Select Your Report: </label>
        <select onChange={this.reportChange} id='report-selection'>
          <option default value='moviesByProfit'>Movies By Profit</option>
          <option default value='transactionsByDayOfWeek'>Most Popular Weekday</option>
        </select>

        {(() => {
          switch(reportType) {
            case 'moviesByProfit': return <DriveInBarChart report={report} />
            case 'transactionsByDayOfWeek': return <DriveInAreaChart report={report} />
          }
          })()
        }
      </div>
    );
  }
}
