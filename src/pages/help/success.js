import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../../components/layout'
import { Hero, Button } from '@helloinspire/melodic-react'
import { Link } from 'gatsby'

const Success = ({ location }) => {
  return (
    <Layout>
      <Hero className="py-3" heading='Success!' subHeading='Your ticket has been submitted.' />
      <hr></hr>
      <p className="text-center">If you would like to submit another ticket, please click below.</p>
      <p className="py-2 text-center"><b>Case ID:</b> {location.state.case_guid.substring(0, 8)}</p>
      <div className="row justify-content-center">
        <Link to="/help">
          <Button variant="primary">Submit another ticket</Button>
        </Link>
      </div>
    </Layout>
  )
}

Success.propTypes = {
  location: PropTypes.obj
}

export default Success
