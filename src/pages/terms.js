import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SignatureCanvas from 'react-signature-canvas'
import terms from '../utils/terms'
import Layout from "../components/layout"
import { navigate } from "gatsby"
import { showError } from '../actions/error'
import {
  updateSignature,
  getTerms,
  clearTerms,
  clearStatus,
} from '../actions/order'

class Terms extends Component {
  state = {
    signatureUrl: null,
    checked: false,
    disabled: false
  }

  sigPad = {}

  componentDidMount = () => {
    if(!this.props.order.street){
      this.props.clearStatus()
      navigate('/')
    }
  }

  trim = (order) => {
    let signature = this.sigPad.getTrimmedCanvas().toDataURL('image/png')
    this.setState({signatureUrl: signature})
    this.props.updateSignature(signature)
  }

  clear = () => {
    this.sigPad.clear()
    this.setState({signatureUrl: null})
    this.props.updateSignature('')
  }

  goBack = (e) => {
    e.preventDefault()
    this.clear()
    if(this.props.order.loa.length < 1){
      navigate('/confirm')
    } else if(!this.props.salesPermission.loa_required) {
      navigate('/confirm')
    } else {
      navigate('/loa')
    }
  }

  onNext = (e) => {
    e.preventDefault()
    if(this.state.checked){
      navigate('/order')
    } else {
      this.props.showError('Please Read & Confirm Terms')
    }
  }

  handleCheckboxChange = () => this.setState({ checked: !this.state.checked })

  render() {
    return (
      <Layout progress='90%'>
        <div className={!this.props.order.terms ? 'd-none col-md-10 mx-auto' : 'col-md-10 mx-auto'}>
          <div className="terms-html" dangerouslySetInnerHTML={{__html: this.props.order.terms}} />
          <p><input type="checkbox" checked={this.state.checked} onChange={this.handleCheckboxChange} className="mr-2"/><b>{terms(this.props.order).terms}</b></p>
          <h3 className="text-center">Sign Below:</h3>
          <SignatureCanvas onBegin={() => this.trim(null)} onEnd={() => this.trim(this.props.order)} ref={(ref) => { this.sigPad = ref }} classNamepenColor='black' canvasProps={{className: 'signatureCanvas'}} />
          <p className="text-center p-4" onClick={this.clear}><b>Clear</b></p>
          { this.state.signatureUrl !== null ? <button className="btn btn-primary btn-lg mb-5 btn-block" onClick={!this.state.disabled ? this.onNext : null}>Next</button> : null }
          <button className="col-6 btn btn-block mx-auto btn-outline-dark" onClick={this.goBack}><b>Back</b></button>
        </div>
      </Layout>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateSignature,
    getTerms,
    showError,
    clearTerms,
    clearStatus,
  }, dispatch)
}

function mapStateToProps(state) {
  return {
    user: state.user,
    order: state.order,
    salesPermission: state.salesPermission,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Terms)
