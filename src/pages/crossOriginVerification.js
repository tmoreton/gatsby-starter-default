import React, { Component } from 'react'
import auth0Client from '../utils/auth'

class CrossOriginVerification extends Component {
  componentDidMount() {
    auth0Client.crossOriginVerification()
  }

  render() {
    return (
      <div></div>
    )
  }
}

export default CrossOriginVerification
