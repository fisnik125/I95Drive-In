import React, { Component } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import Api from '../../Api';

export default class Reports extends Component {
  static DEFAULT_REPORT = 'moviesByProfit'

  state = {
    report: [],
  }

	componentWillMount() {
    this.reportChange({ target: { value: Reports.DEFAULT_REPORT } });
  }

  reportChange = (ev) => {
    const { value: reportType } = ev.target;

    Api.get(`/api/reports/${reportType}`)
      .then(res => { this.setState({ report: res.report }); })
      .catch(err => { console.error(err); });
  }

  render() {
    const { report } = this.state;
    console.log('report', report);
    return (
      <div className='Reports'>
        <h1>Reports</h1>
        <label htmlFor='report-selection'>Select Your Report: </label>
        <select onChange={this.reportChange} id='report-selection'>
          <option default value='moviesByProfit'>Movies By Profit</option>
        </select>

        <BarChart width={970} height={500} data={report}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey='name'/>
          <YAxis/>
          <Tooltip separator=': $'/>
          <Bar dataKey='value' fill="#8884d8"/>
        </BarChart>
      </div>
    );
  }
}
