import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from '@helloinspire/melodic-react'
import { createCase, getCaseTypes, uploadFile } from '../../actions/help'
import { Link, navigate } from 'gatsby'
import { Col, Row } from 'react-bootstrap'
import FileUpload from '../../components/FileUpload'
import Layout from '../../components/layout'
import HelpText from '../../components/HelpText'

const ActivateAgent = () => {
  const dispatch = useDispatch()
  const case_type = useSelector(state => state.cases)
  const { loggedIn } = useSelector(state => state.user)
  const [file, setFile] = useState(null)
  const [categoryName] = useState('Agent Activation')
  const [caseType] = useState('AGENT')

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
        <p>Request to activate a new sales agent or reactivate a previous sales agent</p>
        <Form.Container onSubmit={e => handleSubmit(e)}>
          <Form.Input hidden name="case_type_category_id" value={case_type.case_type_category_id} />
          <Row>
            <Col md={4}>
              <Form.Input label="Partner Name" name="source_code" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={4}>
              <Form.Input label="Office Name" name="office_name" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={4}>
              <Form.Input label="Sales Channel" name="sales_channel" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Input label="Manager Name" name="manager" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={6}>
              <Form.Input label="Agent ID of Requester" name="agent_id" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
          </Row>
          <hr></hr>
          <Row>
            <Col md={4}>
              <Form.Input label="Agent First Name" name="first_name" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={4}>
              <Form.Input label="Agent Middle Name" placeholder="If none, use X" name="middle_name" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={4}>
              <Form.Input label="Agent Last Name" name="last_name" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Input label="Agent ID" name="new_agent_id" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={4}>
              <Form.Input label="PIN" name="pin" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={4}>
              <select label="Agent Role" className="form-control form-control-wrapper custom-select d-block w-100" name="role" required>
                <option disabled selected>Role</option>
                <option value="Agent">Agent</option>
                <option value="Manager">Manager</option>
              </select>
              <HelpText>Required*</HelpText>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Input label="Agent Email Address" name="agent_email" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={4}>
              <Form.Input label="Agent Phone Number" name="agent_phone" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={4}>
              <select className="form-control-wrapper form-control custom-select d-block w-100" name="shirt_size" required>
                <option disabled selected>Shirt Size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="2XL">2XL</option>
                <option value="3XL">3XL</option>
                <option value="4XL">4XL</option>
              </select>
            </Col>
          </Row>
          <hr></hr>
          <Row>
            <Col md={6}>
              <Form.Input type="date" label="Date of Background Check" name="background_id_dt" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={6}>
              <Form.Input label="Background Check ID" name="background_id" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Input type="date" label="Date of Classroom Training" name="training_dt" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={6}>
              <Form.Input label="Classroom Trainer" name="classroom_trainer" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Input label="Certification Test Score" name="certification_score" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={6}>
              <Form.Input type="date" label="Certification Date" name="dertification_dt" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
          </Row>
          <hr></hr>
          <Row>
            <Col md={4}>
              <select className="form-control-wrapper form-control custom-select d-block w-100" name="language">
                <option disabled selected>Language</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="Bilingual">Bilingual</option>
              </select>
            </Col>
            <Col md={4}>
              <select className="form-control-wrapper form-control custom-select d-block w-100 mb-3" name="status">
                <option disabled selected>Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </Col>
            <Col md={4}>
              <Form.Input type="date" label="Agent Start Date" name="start_dt" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
          </Row>
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

export default ActivateAgent
