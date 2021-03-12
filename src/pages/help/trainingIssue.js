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

const TrainingIssue = () => {
  const dispatch = useDispatch()
  const case_type = useSelector(state => state.cases)
  const { loggedIn } = useSelector(state => state.user)
  const [file, setFile] = useState(null)
  const [categoryName] = useState('Docebo/Training Issue')
  const [caseType] = useState('TRAINING')

  useEffect(() => {
    if(!loggedIn) navigate('/help')
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
        <p>A sales agent or manager is having issues logging into Docebo or accessing their training courses</p>
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
            <Col md={6}>
              <Form.Input label="Office or Manager Name" name="office_name" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={6}>
              <Form.Input label="Manager Name" name="manager_name" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Input label="Agent First Name" name="first_name" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={4}>
              <Form.Input label="Agent Last Name"name="last_name" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col md={4}>
              <Form.Input label="Agent Email Address" name="email" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
          </Row>
          <Form.Input label="Please explain the issue." name="case_description" required settings={{ required: true }} />
          <HelpText>Required*</HelpText>
          <hr></hr>
          <FileUpload upload={e => setFile(e)} required settings={{ required: true }} />
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

export default connect(mapDispatchToProps) (TrainingIssue)
