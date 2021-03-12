import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { navigate } from 'gatsby'
import Layout from '../components/layout'
import terms from '../utils/terms'
import SignatureCanvas from 'react-signature-canvas'
import { getAuthorizations, updateLoaSignature, updateSSN, updateInitials, updateVerificationType } from '../actions/order'
import { showError } from '../actions/error'

class Loa extends Component {
  sigPad = {}
  initialPad = {}
  state = {
    signatureUrl: null,
    initialUrl: null,
    disabled: false,
    index: 0,
  }

  componentDidMount = () => {
    this.props.getAuthorizations()
    this.setState(this.state)
    this.props.updateLoaSignature([])
  }

  componentDidUpdate = (prevProps) => {
    const initials = document.getElementById('initials')
    const initial_canvas = document.getElementById('initial_canvas')
    const ssn = document.getElementById('ssn')
    const type = document.getElementById('verification-dropdown')
    if(initials && initial_canvas){
      initials.appendChild(initial_canvas)
    }
    if(ssn){
      ssn.style.display = null
    }
    if(this.props.order.loa.length < 1){
      navigate('/terms')
    }
    if(type && prevProps.order.verification_type !== type.value){
      this.props.updateVerificationType(type.value)
      this.getIdType(type)
    }
  }

  trim = () => {
    let signature = this.sigPad.getTrimmedCanvas().toDataURL('image/png')
    this.setState({signatureUrl: signature})
    this.updateSignature()
  }

  initialTrim = () => {
    let initials = this.initialPad.getTrimmedCanvas().toDataURL('image/png')
    this.setState({initialUrl: initials})
    this.props.updateInitials(initials)
  }

  clear = () => {
    this.sigPad.clear()
    this.setState({signatureUrl: null})
  }

  checkSSN = () => {
    const last_four = document.getElementById('last_four')
    if(last_four){
      if(last_four.value !== ""){
        this.props.updateSSN(last_four)
        return true
      } else {
        this.props.showError('Please Enter Last 4 SSN')
        return false
      }
    }
    return true
  }

  getInitialBox = () => {
    const initials = document.getElementById('initials')
    if(initials){
      if(this.state.initialUrl == null){
        this.props.showError('Please Add Initials')
        return false
      }
      return true
    }
    return true
  }

  isChecked = () => {
    const checkbox = document.getElementById('terms_checkbox')
    if(checkbox){
      if(checkbox.checked){
        return true
      } else {
        this.props.showError('Please Read & Confirm Terms')
        return false
      }
    }
    return true
  }

  getIdType = (type) => {
    if(type){
      type.addEventListener('change', (e) => this.props.updateVerificationType(e.target.value))
    }
  }

  updateSignature = () => {
    let signatures = this.props.order.loa_signatures
    const file_name = this.props.order.loa[this.state.index].file_name
    let obj = signatures.find(o => o.file_name === file_name)
    if(obj){
      let index = signatures.indexOf(obj)
      signatures[index] = {file_name: file_name, signature: this.state.signatureUrl}
      this.props.updateLoaSignature(signatures)
    } else {
      signatures.push({file_name: file_name, signature: this.state.signatureUrl})
      this.props.updateLoaSignature(signatures)
    }
  }

  onNext = (e) => {
    e.preventDefault()
    let length = this.props.order.loa.length
    if(this.isChecked() && this.checkSSN() && this.getInitialBox()){
      if(length <= 1 || length-1 === this.state.index){
        if(this.props.order.terms){
          navigate('/terms')
        } else {
          navigate('/order')
        }
      } else {
        this.setState({index: this.state.index+=1})
        this.sigPad.clear()
      }
    }
  }

  goBack = (e) => {
    e.preventDefault()
    this.props.updateLoaSignature([])
    navigate('/confirm')
  }

  render() {
    const { order, user } = this.props
    return (
      <Layout progress='75%'>
        { this.props.order.loa.length > 0 ?
        <div className="col-md-8 mx-auto">
          <div className="terms-html" dangerouslySetInnerHTML={{__html: this.props.order.loa[this.state.index].html}} />
          { this.props.shopper.service_state === 'OH' ?
            <SignatureCanvas onBegin={() => this.initialTrim(null)} onEnd={() => this.initialTrim()} ref={(ref) => { this.initialPad = ref }} classNamepenColor='black' canvasProps={{className: 'initialCanvas', id: 'initial_canvas'}} />
          : null }
          <SignatureCanvas onBegin={() => this.trim(null)} onEnd={() => this.trim()} ref={(ref) => { this.sigPad = ref }} classNamepenColor='black' canvasProps={{className: 'signatureCanvas'}} />
          { order.loa_signatures.length === this.state.index+1 && this.state.signatureUrl !== null ?
            <div>
              <p className="text-center p-3" onClick={this.clear}><b>Clear</b></p>
              <button className="btn btn-primary btn-lg btn-block" onClick={this.onNext}>Next</button>
            </div>
          : null }
          <button className="col-6 mt-4 btn btn-block mx-auto btn-outline-dark" onClick={this.goBack}><b>Back</b></button>
        </div> : null}
      </Layout>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getAuthorizations, showError, updateLoaSignature, updateSSN, updateInitials, updateVerificationType }, dispatch)
}

function mapStateToProps(state) {
  return {
    user: state.user,
    order: state.order,
    shopper: state.shopper
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loa)
