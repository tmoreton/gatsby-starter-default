import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector, connect } from 'react-redux'
import Layout from '../../components/layout'
import { Form, Button } from '@helloinspire/melodic-react'
import { createCase, getCaseTypes, uploadFile } from '../../actions/help'
import { Row, Col } from 'react-bootstrap'
import { navigate, Link } from 'gatsby'
import FileUpload from '../../components/FileUpload'
import HelpText from '../../components/HelpText'
import { showError } from '../../actions/error'
import { bindActionCreators } from 'redux'

const TpvIssue = (props) => {
  const dispatch = useDispatch()
  const case_type = useSelector(state => state.cases)
  const [file, setFile] = useState(null)
  const [categoryName] = useState('TPV Issue')
  const [caseType] = useState('GENERAL')
  const { loggedIn } = useSelector(state => state.user)

  useEffect(() => {
    dispatch(getCaseTypes(caseType, categoryName))
  }, [])

  const handleSubmit = async (data) => {
    if(file != null){
      const response = await dispatch(createCase(data, caseType))
      if(response){
        navigate('/help/success', {
          state: {
            case_guid: response.case_guid,
          }
        })
      }
      if(response && file){
        dispatch(uploadFile(response, file))
      }
    } else {
      dispatch(showError("Must upload a screenshot"))
    }
  }

  return (
    <Layout>
      <div className="col-md-8 mx-auto text-center">
        <h2 className="py-3">{categoryName}</h2>
        <p>A sales agent or manager is having an issue with the TPV process</p>
        <Form.Container onSubmit={e => handleSubmit(e)}>
          <Form.Input hidden name="case_type_category_id" value={case_type.case_type_category_id} />
          <Row>
            <Col md={4}>
              <Form.Input  label="Partner Name" name="source_code" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={4}>
              <Form.Input label="Agent ID of Requestor" name="agent_id" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={4}>
              <Form.Input label="Agent ID with Issue" name="new_agent_id" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
          </Row>
          <hr></hr>
          <Row>
            {loggedIn ? 
              <Col md={6}>
                <Form.Input label="Device ID" name="device_id" required settings={{ required: true }}/>
                <HelpText>Required*</HelpText>
              </Col>
              :
              <Col md={6}>
                <Form.Input label="Device ID" name="device_id" />
              </Col>
            }
            <Col md={6}>
              <Form.Input label="Office or Manager Name" name="office_name" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
          </Row>
          <Form.Input label="Please explain the issue." name="case_description" required settings={{ required: true }} />
          <HelpText>Required*</HelpText>
          <Form.Input label="Sales Location/Store Name" name="issue_state" required settings={{ required: true }} />
          <HelpText>Required*</HelpText>
          <Row>
            <Col md={4}>
            <Form.Select multiple className="form-control  custom-select d-block w-100" label="TPV Type" name="tpv_type" options={["Web/SMS", "Live", "Phone", "Internal"]} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={4}>
              <Form.Select label="Customer Phone Carrier" className="form-control custom-select d-block w-100" name="device_carrier"
                options={[" ", "AT&T", "Cricket", "MetroPCS", "Sprint/T-Mobile", "Verizon", "Other" ]} 
              />
            </Col>
            <Col md={4}>
              <Form.Select label="Customer Device Type" className="form-control custom-select d-block w-100" name="customer_device_type"
                options={[ " ", "iPhone", "Android", "Not a Smart Phone" ]}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Select label="Is your device connected to Wifi?" className="form-control custom-select d-block w-100" name="agent_device_wifi"
                options={[ " ", "Yes", "No" ]}
              />
            </Col>
            <Col md={6}>
              <Form.Select label="Does your device have service?" className="form-control custom-select d-block w-100" name="agent_device_service"
              options={[ " ", "Yes", "No" ]}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
            <Form.Select label="Does the Customer’s phone have service?" className="form-control custom-select d-block w-100" name="customer_phone_service"
              options={[ " ", "Yes", "No" ]}
              />
            </Col>
            <Col md={6}>
            <Form.Select label="Is the Customer’s phone connected to Wifi?" className="form-control custom-select d-block w-100" name="customer_phone_wifi"
              options={[ " ", "Yes", "No" ]}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
            <Form.Select label="Does the Customer's phone block calls/texts from unknown numbers?" className="form-control custom-select d-block w-100" name="customer_phone_block_unknown"
              options={[ " ", "Yes", "No" ]}
              />
            </Col>
          </Row>
          <hr></hr>
          <FileUpload upload={e => setFile(e)} required settings={{ required: true }}/>
          <HelpText>Required*</HelpText>
          <Row>
            <Button className="btn btn-block mx-auto btn-outline-primary">
              <Link to="/help">
                <b>Cancel</b>
              </Link>
            </Button>
            <Form.Submit className="mx-auto"/>
          </Row>
        </Form.Container>
      </div>
    </Layout>
  )
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ showError }, dispatch)
}

export default connect(mapDispatchToProps) (TpvIssue)
