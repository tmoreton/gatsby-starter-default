import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from '@helloinspire/melodic-react'
import { Row, Col } from 'react-bootstrap'
import { createCase, getCaseTypes, uploadFile } from '../../actions/help'
import { navigate, Link } from 'gatsby'
import FileUpload from '../../components/FileUpload'
import Layout from '../../components/layout'
import HelpText from '../../components/HelpText'

const CreateOffice = () => {
  const dispatch = useDispatch()
  const case_type = useSelector(state => state.cases)
  const { loggedIn } = useSelector(state => state.user)
  const [file, setFile] = useState(null)
  const [categoryName] = useState('New Office Creation')
  const [caseType] = useState('OFFICE')

  useEffect(() => {
    if(!loggedIn) navigate('/help')
    dispatch(getCaseTypes(caseType, categoryName))
  }, [])

  const handleSubmit = async (data) => {
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
  }

  return (
    <Layout>
      <div className="col-md-8 mx-auto text-center">
        <h2 className="py-3">{categoryName}</h2>
        <p>Request to create a new office for a new sales manager or create a new office for an existing manager moving to a new state</p>
        <Form.Container onSubmit={e => handleSubmit(e)}>
          <Form.Input hidden name="case_type_category_id" value={case_type.case_type_category_id} />
          <Row>
            <Col md={4}>
              <Form.Input label="Partner Name" name="source_code" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={4}>
              <Form.Input label="Agent ID of Requester" name="agent_id" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={4}>
              <Form.Input label="Sales Channel" name="sales_channel" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Input label="Manager Name" name="manager_name" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={4}>
              <Form.Input label="State" name="state" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
          </Row>
          <Form.Input label="Agent ID's to be Transferred to New Office" name="transfer_agent_id" />
          <Form.Input label="Device ID's to be Transferred to New Office" name="transfer_device_id" />
          <h6 className="text-left" style={{ fontWeight: 400, marginBottom: 0 }}>Office Status</h6>
          <div className="d-flex">
            <label className="form-check-inline mr-5">
              <Form.Radio class="form-check-input" name="active" type="radio" value={'true'} />
                Active
            </label>
            <label className="form-check-inline">
              <Form.Radio class="form-check-input" name="active" type="radio" value={'false'} />
                Inactive
            </label>
          </div>
          <Form.Input label="Notes" name="notes" />
          <hr></hr>
          <FileUpload upload={e => setFile(e)}/>
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

export default CreateOffice
