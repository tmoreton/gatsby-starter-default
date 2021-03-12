import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Layout from '../components/layout'
import { navigate } from 'gatsby'
import isEmpty from '../utils/isEmpty'
import {
  getLocations,
  recordEvent,
  updateLocationName,
  updateLocationCode
} from '../actions/user'
import {
  updateLatitude,
  updateLongitude
} from '../actions/order'

class ClockIn extends Component {
  componentDidMount() {
    this.props.getLocations()
    this.getGeoLocation()
  }

  onChange = (e) => {
    this.props.updateLocationCode(e.target.value)
    const item = this.props.event.locations.find(element => element.sales_location_code === e.target.value)
    this.props.updateLocationName(item.location_name)
  }

  clockIn = () => {
    this.props.recordEvent('CLOCK_IN')
  }

  getGeoLocation = () => {
    if(!this.props.order.latitude){
      navigator.geolocation.getCurrentPosition((position) => {
        this.props.updateLatitude(position.coords.latitude)
        this.props.updateLongitude(position.coords.longitude)
      })
    }
  }

  render() {
    const { channel_code } = this.props.user
    const { locations } = this.props.event
    return (
      <Layout>
        <div className="col-md-6 mx-auto text-center">
          <h3>Clock In</h3>
          <select value={this.props.event.location.sales_location_code} onChange={(e) => this.onChange(e)} className="custom-select" id="state" required>
            <option value="" disabled selected="selected"></option>
            {
              locations.map((location, key) => {
                if(location.channel_code === channel_code){
                  return <option key={key} onClick={(e) => this.onChange(e)} value={location.sales_location_code}>{location.location_name}</option>
                }
              })
            }
          </select>
          <button className="btn btn-primary btn-md mt-3" onClick={this.clockIn}>Start Shift</button>
        </div>
      </Layout>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getLocations,
    recordEvent,
    updateLocationName,
    updateLocationCode,
    updateLatitude,
    updateLongitude
  }, dispatch)
}

function mapStateToProps(state) {
  return {
    user: state.user,
    event: state.event,
    order: state.order,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClockIn)
