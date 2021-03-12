import React, { useEffect } from 'react'
import Layout from '../../components/layout'
import { Link } from 'gatsby'
import { useDispatch, useSelector, connect } from 'react-redux'
import { getEntry } from '../../actions/help'
import { bindActionCreators } from 'redux'


const Help = () => {
  const dispatch = useDispatch()
  const { loggedIn } = useSelector(state => state.user)
  const entry  = useSelector(state => state.entry)
  const entry_id = '2cXWyQKSMUkTNo7H96vh6i'

  useEffect(() => {
    dispatch(getEntry(entry_id))
  }, [])

  return (
    <Layout>
      <div className="col-md-8 mx-auto text-center">
        <hr></hr>
        <h2 className="h1 py-4">Welcome to Inspire Sales Ops Support!</h2>
        <h2 className="h2 py-4 card-subtitle text-muted">{entry.welcomeMessage}</h2>
      </div>
    <br></br>
    <div className="row justify-content-center">
      { loggedIn &&
      <div className="col-md-6">
        <div className="card">
          <div className="card-header border-primary blockquote">
            Agent Services
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><Link className="text-primary h4 w-100 text-center" to="/help/activate">Activate Agent</Link></li>
            <li className="list-group-item"><Link className="text-primary h4 w-100 text-center" to="/help/deactivateAgent">Deactivate Agent</Link></li>
            <li className="list-group-item"><Link className="text-primary h4 w-100 text-center" to="/help/transferAgent">Transfer Agent</Link></li>
            <li className="list-group-item"><Link className="text-primary h4 w-100 text-center" to="/help/transferDevice">Transfer Device</Link></li>
            <li className="list-group-item"><Link className="text-primary h4 w-100 text-center" to="/help/returnDevice">Return Device</Link></li>
            <li className="list-group-item"><Link className="text-primary h4 w-100 text-center" to="/help/createOffice">Create New Office</Link></li>
          </ul>
        </div>
      </div>
      }

      <div className="col-md-6">
        <div className="card">
          <div className="card-header border-primary blockquote">
            Help Desk
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><Link className="text-primary h4 w-100 text-center" to="/help/loginIssue">Login Issues</Link></li>
            <li className="list-group-item"><Link className="text-primary h4 w-100 text-center" to="/help/technicalIssue">Technical Issues</Link></li>
            <li className="list-group-item"><Link className="text-primary h4 w-100 text-center" to="/help/tpvIssue">TPV Issues</Link></li>
            { loggedIn &&  <li className="list-group-item"><Link className="text-primary h4 w-100 text-center" to="/help/trainingIssue">Docebo/Training Issues</Link></li> }
            <li className="list-group-item"><Link className="text-primary h4 w-100 text-center" to="/help/general">General Questions/Issues</Link></li>
          </ul>
        </div>
      </div>
    </div>
    </Layout>
  )
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators( dispatch )
}

export default connect(mapDispatchToProps) (Help)
