import React, { Component } from 'react'
import { connect } from 'react-redux'
import { StaticQuery, graphql } from "gatsby"
import '@helloinspire/melodic/dist/css/melodic.min.css'
import Menu from "./Menu"
import "./layout.css"
import { navigate } from "gatsby"
import { bindActionCreators } from 'redux'
import { logout } from '../actions/user'
import isEmpty from "../utils/isEmpty"
import { showError } from '../actions/error'
import { clearData, getUser } from '../actions/user'
import * as Sentry from '@sentry/browser'
import { Button, InspireLogo } from '@helloinspire/melodic-react'

class Layout extends Component {

  componentDidMount() {
    const { order, user } = this.props

    Sentry.init({
      dsn: process.env.GATSBY_SENTRY_DSN,
      environment: process.env.GATSBY_ENV,
    })
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(`Component Error: ${error}, Error Info: ${errorInfo}`)
  }

  clear = () => {
    this.props.clearData()
    navigate('/address')
  }


  logout = () => {
    this.props.logout()
  }

  render() {
    return (
      <StaticQuery
        query={graphql`
          query SiteTitleQuery {
            site {
              siteMetadata {
                title
              }
            }
          }
        `}
        render={data => (
          <Menu
            siteTitle={data.site.siteMetadata.title}
            clear={this.clear}
            logout={this.logout}
            agent_id={this.props.user.agent_id}
          >
            <div className="progress">
              <div className="progress-bar" style={{width: this.props.progress}}></div>
            </div>
            <div className="container mb-5 pt-4">
              <div className="text-center">
                <InspireLogo/>
              </div>
              <main role="main">{this.props.children}</main>
            </div>
            {
              !isEmpty(this.props.error) ?
              <div className="alert-bar" onClick={() => this.props.showError(null)}>
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <strong>{this.props.error}</strong>
                  <button onClick={() => this.props.showError(null)} type="button" className="close">
                    <span>&times;</span>
                  </button>
                </div>
              </div> : null
            }
          </Menu>
        )}
      />
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ logout, showError, clearData, getUser }, dispatch)
}

function mapStateToProps(state) {
  return {
    user: state.user,
    event: state.event,
    error: state.error,
    order: state.order,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
