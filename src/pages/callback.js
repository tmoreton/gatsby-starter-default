import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getUser } from '../actions/user'
import auth0Client from '../utils/auth'

class Callback extends Component {

  componentDidMount() {
    const getToken = (token) => {
      this.props.getUser(token)
    }
    auth0Client.handleAuthentication(getToken)
  }

  render() {
    return (
      <div></div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getUser }, dispatch)
}

export default connect(null, mapDispatchToProps)(Callback)
