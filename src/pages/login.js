import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateAgentId } from '../actions/user'
import { navigate } from 'gatsby'
import Layout from '../components/layout'
import auth0Client from '../utils/auth'
import { showError } from '../actions/error'
import isRetail from '../utils/isRetail'

class Login extends Component {
  state = {
    agent_id: '',
    password: ''
  }

  componentDidMount = () => {
    const { loggedIn, channel_code } = this.props.user
    if(loggedIn && isRetail(channel_code)){
      navigate("/clock-in")
    }
    if(loggedIn){
      navigate("/address")
    }
  }

  componentDidUpdate = () => {
    const { loggedIn, channel_code } = this.props.user
    if(loggedIn && isRetail(channel_code)){
      navigate("/clock-in")
    }
    if(loggedIn){
      navigate("/address")
    }
  }

  handleLogin = (e) => {
    const { agent_id, password } = this.state
    e.preventDefault()
    if(!agent_id) {
      this.props.showError("Missing Agent ID")
    } else if (!password) {
      this.props.showError("Missing Password")
    } else {
      auth0Client.loginAuth(agent_id, password)
    }
  }

  handleEmailChange = (e) => {
    const agent_id = e.target.value.toUpperCase()
    this.setState({agent_id})
    this.props.updateAgentId(agent_id)
  }

  handlePasswordChange = (e) => {
    const password = e.target.value
    this.setState({password})
  }

  render() {
    return (
      <Layout>
        <div className="col-md-4 mx-auto">
          <form>
            <div className="form-group text-left">
              <label htmlFor='agent_id'>Agent ID</label>
              <input id="agent_id" className="form-control" value={this.state.agent_id} onChange={this.handleEmailChange}/>
            </div>
            <div className="form-group text-left">
              <label htmlFor='password'>Password</label>
              <input id="password" className="form-control" type="password" value={this.state.password} onChange={this.handlePasswordChange}/>
            </div>
            <button className="btn btn-primary btn-lg btn-block mt-4" onClick={this.handleLogin}>Log In</button>
          </form>
          <p className="text-center pt-3"><small>Version 0.2.17</small></p>
        </div>
      </Layout>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateAgentId, showError }, dispatch)
}

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
