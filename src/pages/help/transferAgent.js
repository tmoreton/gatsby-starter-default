import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../../components/layout'
import { Form, Button } from '@helloinspire/melodic-react'
import { createCase, getCaseTypes, uploadFile } from '../../actions/help'
import { Row, Col } from 'react-bootstrap'
import { navigate, Link } from 'gatsby'
import FileUpload from '../../components/FileUpload'
import HelpText from '../../components/HelpText'

const TransferAgent = () => {
  const dispatch = useDispatch()
  const case_type = useSelector(state => state.cases)
  const { loggedIn } = useSelector(state => state.user)
  const [file, setFile] = useState(null)
  const [categoryName] = useState('Agent Transfer')
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
        <p>Request to transfer a sales agent ID to different office or state</p>
        <Form.Container onSubmit={e => handleSubmit(e)}>
          <Form.Input hidden name="case_type_category_id" value={case_type.case_type_category_id} />
          <Row>
            <Col>
              <Form.Input label="Partner Name" name="source_code" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col>
              <Form.Input label="Agent ID of Requester" name="agent_id" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col>
              <Form.Input label="Sales Channel" name="sales_channel" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
          </Row>
          <hr></hr>
          <Row>
            <Col>
              <Form.Input label="Agent First Name" name="first_name" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col>
              <Form.Input label="Agent Last Name"name="last_name" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Input label="Old Office Name" name="office_name" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
            <Col>
              <Form.Input label="New Office Name" name="new_office_name" required settings={{ required: true }} />
              <HelpText>Required*</HelpText>
            </Col>
          </Row>
          <Form.Input label="Transfer Date" name="transfer_dt" required settings={{ required: true }} type="date"/>
          <HelpText>Required*</HelpText>
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

export default TransferAgent
