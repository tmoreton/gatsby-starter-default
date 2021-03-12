import React, { useState } from 'react'
import PropTypes from "prop-types"
import icon from "../images/icon.svg"
import RetailModal from './RetailModal'
import { Link } from 'gatsby'

const Menu = ({ siteTitle, logout, agent_id, clear, children}) => {
  const [toggled, setToggled] = useState(false)
  return (
    <div className={toggled ? 'd-flex toggled' : 'd-flex'} id="wrapper">
      <div className="bg-light border-right" id="sidebar-wrapper">
        <div className="sidebar-heading">
          <p className="navbar-brand p-0"><b>{siteTitle}</b></p>
        </div>
        <div className="list-group list-group-flush">
          <button onClick={clear} className="list-group-item list-group-item-action bg-light">
            <Link to="/">Home</Link>
          </button>
          <button className="list-group-item list-group-item-action bg-light">
            <Link to="/help">Help</Link>
          </button>
          <button onClick={logout} className="list-group-item list-group-item-action bg-light">
            <Link to="/">Logout</Link>
          </button>
        </div>
      </div>

      <div id="page-content-wrapper">
        <header>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
          <nav className="navbar navbar-dark bg-dark flex-md-nowrap shadow">
            <div>
              <button className="navbar-toggler" onClick={() => setToggled(!toggled)}>
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="navbar-brand" onClick={clear}>
                <img className="px-2 py-1" src={icon} alt="Inspire Logo"/>
                { agent_id ? <p className="navbar-brand pr-4 m-0"><small>{agent_id}</small></p> : null }
              </div>
            </div>
            <RetailModal/>
          </nav>
        </header>
        {children}
      </div>
    </div>
  )
}

Menu.propTypes = {
  siteTitle: PropTypes.string,
  logout: PropTypes.func,
  agent_id: PropTypes.string,
  logged_in: PropTypes.bool,
  clear: PropTypes.func,
  children: PropTypes.obj
}

Menu.defaultProps = {
  siteTitle: ``,
  logged_in: false
}

export default Menu
