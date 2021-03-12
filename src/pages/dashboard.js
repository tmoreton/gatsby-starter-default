import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Layout from "../components/layout"
import Chart from "../components/Chart"
import Table from "../components/Table"
import {
  getAgentDashboard,
  updateToDate,
  updateFromDate,
} from '../actions/user'

class Dashboard extends Component {

  componentDidMount() {
    this.props.getAgentDashboard()
  }

  render() {
    return (
      <Layout>
        <div className="text-center">
          <h3>{`${this.props.user.source_code} Agent: ${this.props.user.first_name} ${this.props.user.last_name}, ${this.props.user.agent_id}`}</h3>
          <div className="p-3">
            <label className="mr-3 font-weight-bold">Date Range: </label>
            <input className="mr-3" type="date" value={this.props.dashboard.fromDate} name="from_dt" placeholder="Start Date" onChange={e => this.props.updateFromDate(e.target.value)}/>
            <input className="mr-3" type="date" value={this.props.dashboard.toDate} name="to_dt" placeholder="End Date" onChange={e => this.props.updateToDate(e.target.value)}/>
            <button className="btn btn-primary btn-md" onClick={this.props.getAgentDashboard}>Search</button>
          </div>
          <h4 className="p-4">Accept Order Trend</h4>
          <Chart data={this.props.dashboard.graph}/>
          <h4 className="p-4">Agent Full Order List</h4>
          <div className="agent-table">
            <Table data={this.props.dashboard.data}/>
          </div>
        </div>
      </Layout>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getAgentDashboard, updateToDate, updateFromDate }, dispatch)
}

function mapStateToProps(state) {
  return {
    user: state.user,
    dashboard: state.dashboard,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
