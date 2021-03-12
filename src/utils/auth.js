import React, { Component } from 'react'
import auth0 from "auth0-js"
import { navigate } from "gatsby"

class Auth extends Component {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: process.env.GATSBY_AUTH0_DOMAIN,
      clientID: process.env.GATSBY_AUTH0_CLIENT_ID,
      redirectUri: process.env.GATSBY_AUTH0_REDIRECT_URI,
      responseType: 'token id_token',
      scope: 'openid profile email offline_access',
    }) || {}
  }

  loginAuth = (agent_id, password) => {
    this.auth0.login({
      realm: 'Sales-Agent-DB',
      email: agent_id,
      password: password,
    }, (err) => {
      if (err) return alert(err.original.error_description)
    })
  }

  signupAuth = (email, password, createUser) => {
    this.auth0.signup({
      connection: 'Internal',
      email: email,
      password: password,
    }, (err) => {
      if (err) return alert(JSON.stringify(err))
      createUser()
    })
  }

  forgotPassword = (email) => {
    this.auth0.changePassword({
      connection: 'Internal',
      email:   email,
    }, (err) => {
      if (err) return alert(err.original.error_description)
      alert('Check your email to reset password.')
    })
  }

  handleAuthentication = (getToken) => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        getToken(authResult.accessToken)
      } else {
        navigate("/")
      }
    })
  }
}

const auth0Client = new Auth()

export default auth0Client
