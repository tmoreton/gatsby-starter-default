import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  updateFirstName,
  updateLastName,
  updateEmail,
  updatePhone,
  updateContactFirstName,
  updateContactLastName,
  updateShopper,
  updateContactRelationship,
  updateContactPhone,
  updateTpvType,
  updatePartial,
  addMoveInDate,
  updateAccountNumber,
  updateConfirmAccountNumber,
  isValid,
  updateCanText,
  updateEmailDisclosure
} from '../actions/order'
import { showError } from '../actions/error'
import Layout from "../components/layout"
import isEmpty from "../utils/isEmpty"
import { navigate } from "gatsby"
import isTeleSales from '../utils/isTeleSales'
import AccountNumber from "../components/accountNumber"

const items = ['Spouse/Domestic Partner', 'Roommate', 'Tenant', 'Immediate Family', '', 'Landlord', 'Business Owner', 'Business Partner', 'Manager']
const numbers = ['8562876757', '5135058992', '8589979731', '8603243985', '2674555105', '2158055101', '2152088330', '6613177229', '6266640976', '7744523744', '5189375190', '9148198191', '8607051935', '6107399429', '7162383325', '4244203852', '7036153442']

class Verification extends Component {
  state = {
    tpv: true,
    tpvphone: true,
    checked: false,
    primary_phone: null,
    ivrChecked: false,
    loading: false,
    validated: true,
  }

  onNext = (e) => {
    e.preventDefault()
    if(this.validated()) {
      this.props.updateShopper()
      navigate('/confirm')
    } else {
      this.setState({validated: false})
    }
  }

  componentDidMount = () => {
    if(this.props.order.contact_first_name || this.props.order.contact_last_name || this.props.order.contact_relationship){
      this.setState({ tpv: !this.state.tpv })
    }
    if(this.props.order.contact_phone){
      this.setState({ tpvphone: !this.state.tpvphone })
    }
  }

  addAccountNumber = (e) => {
    this.props.updateAccountNumber(e)
    var regexConst = new RegExp(this.props.order.account_validation.account_number_regexp)
    this.props.isValid(regexConst.test(e))
  }

  checkAccountNumber = () => {
    if(!this.props.order.isPartial && this.props.order.account_number === this.props.order.confirm_account_number) {
      return true
    } else {
      return false
    }
  }

  validateEmail = (email) => {
    if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      return false
    }
    return true
  }

  goBack = (e) => {
    e.preventDefault()
    navigate('/offers')
  }

  validated = () => {
    const { order, user } = this.props
    if(isEmpty(order.first_name)) {
      return false
    }
    else if(isEmpty(order.last_name)) {
      return false
    }
    else if (!order.is_valid && !order.isPartial) {
      this.props.showError('Invalid Account Number')
      return false
    }
    else if(order.account_number && order.account_number !== order.confirm_account_number && !order.isPartial) {
      this.props.showError('Account Numbers do not match')
      return false
    }
    else if(isEmpty(order.primary_phone) || order.primary_phone.length < 10) {
      this.props.showError("Not a valid Phone Number")
      return false
    }
    else if(!isEmpty(user.phone) && order.primary_phone.replace(/\D/g,'') === user.phone.replace(/\D/g,'') && !numbers.includes(order.primary_phone.replace(/\D/g,''))) {
      this.props.showError("This phone number is registered elsewhere and cannot be used for customer TPV")
      return false
    }
    else if(order.contact_phone && order.contact_phone.length < 10) {
      this.props.showError("Not a valid Phone Number")
      return false
    }
    else if(isEmpty(order.email)) {
      this.props.showError("Must Enter Email")
      return false
    }
    else if(order.primary_phone === user.phone) {
      this.props.showError("Not a valid Phone Number")
      return false
    }
    else if(isEmpty(order.tpv_type)) {
      this.props.showError("Select TPV Type")
      return false
    }
    else if(order.tpv_type == 'Web' && !this.state.ivrChecked) {
      this.props.showError("Must agree to terms")
      return false
    }
    else if(!this.state.tpv && isEmpty(order.contact_relationship)) {
      this.props.showError("Must Enter Contact Relationship")
      return false
    }
    else if(!this.state.tpvphone && isEmpty(order.contact_phone)) {
      this.props.showError("Must Enter Contact Number")
      return false
    }
    else if(!this.state.tpv) {
      if(isEmpty(order.contact_first_name) || isEmpty(order.contact_last_name)){
        this.props.showError("Must Enter Contact Name")
        return false
      }
    }
    else if (!order.phone_validated && !numbers.includes(order.primary_phone.replace(/\D/g,''))){
      this.props.showError(order.phone_validation_error)
      return false
    }
    else if (!order.phone_validated_order && !numbers.includes(order.primary_phone.replace(/\D/g,''))){
      this.props.showError(order.phone_validation_error)
      return false
    }
    else if (this.validateEmail(order.email)){
      this.props.showError("Must Enter Valid Email")
      return false
    }
    else if (!order.email_disclosure){
      this.props.showError("Must agree to disclosure terms")
      return false
    }
    return true
  }

  handleTpvChange = () => {
    this.setState({ tpv: !this.state.tpv })
    this.props.updateContactFirstName('')
    this.props.updateContactLastName('')
    this.props.updateContactRelationship('')
  }
  handlePhoneChange = () => {
    this.setState({ tpvphone: !this.state.tpvphone })
    this.props.updateContactPhone('')
  }
  handleCheckboxChange = () => this.setState({ checked: !this.state.checked })
  handleIvrCheckChange = () => this.setState({ ivrChecked: !this.state.ivrChecked })

  render() {
    const { order, user, salesPermission } = this.props
    const { tpv, tpvphone } = this.state
    return (
      <Layout progress='45%'>
        <div className="col-md-7 mx-auto">
          <form className={!this.state.validated ? 'was-validated' : null}>
            <p><b>Customer Information</b></p>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label forhtml="firstName">First Name</label>
                <input onChange={e => this.props.updateFirstName(e.target.value)} value={order.first_name} type="text" className="form-control" id="firstName" required/>
                <div className="invalid-feedback">Required</div>
              </div>
              <div className="col-md-6 mb-3">
                <label forhtml="lastName">Last Name</label>
                <input onChange={e => this.props.updateLastName(e.target.value)} value={order.last_name} type="text" className="form-control" id="lastName" required/>
                <div className="invalid-feedback">Required</div>
              </div>
            </div>
            { order.state_code === 'DC' || order.state_code === 'MD' || order.state_code === 'DE' ?
              <p className="text-center"><small>Only the account holder is permitted to make service changes on this account.</small></p>
              :
              <div>
                <div className="mt-2 text-center d-flex justify-content-around">
                  <p><b>Is this person completing TPV?</b></p>
                  <label>{'Yes'}<input className='ml-2' type='radio' name='TPVYes' onChange={this.handleTpvChange} checked={this.state.tpv}/></label>
                  <label>{'No'}<input className='ml-2' type='radio' name='TPVNo' onChange={this.handleTpvChange} checked={!this.state.tpv}/></label>
                </div>
                <p className="text-center"><small>Authorized person must be over the age of 18, and either the account holder or account holder's spouse.</small></p>
              </div>
            }

            <div className={tpv ? 'd-none' : ''}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label forhtml="firstName">Contact First Name</label>
                  <input onChange={e => this.props.updateContactFirstName(e.target.value)} value={order.contact_first_name} type="text" className="form-control" id="firstName" required/>
                  <div className="invalid-feedback">Required</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label forhtml="lastName">Contact Last Name</label>
                  <input onChange={e => this.props.updateContactLastName(e.target.value)} value={order.contact_last_name} type="text" className="form-control" id="lastName" required/>
                  <div className="invalid-feedback">Required</div>
                </div>

                { order.revenue_class_code === 'SMALL-COM' ?
                  <div className="col-md-6 mb-3">
                    <label forhtml="relation">Relationship</label>
                    <select onChange={e => this.props.updateContactRelationship(e.target.value)} value={order.contact_relationship} className="custom-select d-block w-100" id="relation" required>
                      <option value="" disabled  selected="selected"></option>
                      <option value="Landlord">Landlord</option>
                      <option value="Business Owner">Business Owner</option>
                      <option value="Business Partner">Business Partner</option>
                      <option value="Manager">Manager</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="invalid-feedback">Required</div>
                  </div>
                  :
                  <div className="col-md-6 mb-3">
                    <label forhtml="relation">Relationship</label>
                    <select onChange={e => this.props.updateContactRelationship(e.target.value)} value={order.contact_relationship} className="custom-select d-block w-100" id="relation" required>
                      <option value="" disabled  selected="selected"></option>
                      <option value="Spouse/Domestic Partner">Spouse/Domestic Partner</option>
                      <option value="Roommate">Roommate</option>
                      <option value="Tenant">Tenant</option>
                      <option value="Immediate Family">Immediate Family</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="invalid-feedback">Required</div>
                  </div>
                }

                <div className="col-md-6 mb-3">
                  <div className={!items.includes(order.contact_relationship) ? 'd-block' : 'd-none'}>
                    <label>Other Relationship</label>
                    <input onChange={e => this.props.updateContactRelationship(e.target.value)} type="text" className="form-control" required/>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <hr className="mb-3"/>
              <AccountNumber order={order} addAccountNumber={this.addAccountNumber} updateConfirmAccountNumber={this.props.updateConfirmAccountNumber} checkAccountNumber={this.checkAccountNumber}/>

              { salesPermission.partial_enrollment_enabled &&
                <p><input type="checkbox" checked={order.isPartial} onChange={() => this.props.updatePartial(!order.isPartial)} className="mr-2"/>Customer Does Not Have Utility Account Number</p>
              }

              { user.channel_code === 'CONCIERGE' &&
                <div className={!order.isPartial && 'd-none'}>
                  <label className="pr-2">Move In Date: </label>
                  <input required type="date" name="move_in_date" value={order.move_in_date} onChange={e => this.props.addMoveInDate(e.target.value)}/>
                  <div className="invalid-feedback">Required</div>
                </div>
              }

              <br/>
              <a href={`https://www.helloinspire.com/bill_samples/${this.props.order.market_code}`} target="_blank" rel="noopener norefferer">Bill Example</a>
            </div>

            <hr className="mb-3 mt-3"/>

            <div className="mb-3">
              <label forhtml="phone">Phone</label>
              <input required onChange={e => this.props.updatePhone(e.target.value)} value={order.primary_phone} type="phone" className="form-control" id="phone" />
              <div className="invalid-feedback">Required</div>
            </div>

            <div className="mt-2 text-center d-flex justify-content-around">
              <p><b>Use this number for TPV Call?</b></p>
              <label>{'Yes'}<input className='ml-2' type='radio' name='Yes' onChange={this.handlePhoneChange} checked={this.state.tpvphone}/></label>
              <label>{'No'}<input className='ml-2' type='radio' name='No' onChange={this.handlePhoneChange} checked={!this.state.tpvphone}/></label>
            </div>

            <div className={tpvphone ? 'd-none' : ''}>
              <div className="mb-3">
                <label forhtml="phone">Contact Phone</label>
                <input required onChange={e => this.props.updateContactPhone(e.target.value)} value={this.props.order.contact_phone} type="phone" className="form-control" id="phone"/>
                <div className="invalid-feedback">Required</div>
              </div>
            </div>

            <div className="text-center d-flex justify-content-around p-3">
              <p><b>Preferred Contact Method:</b></p>
              {
                salesPermission.tpv_types && salesPermission.tpv_types.map(permission => {
                  return <label>{permission}<input className='ml-2' type='radio' name={permission} onChange={e => this.props.updateTpvType(permission)} checked={order.tpv_type === permission}/></label>
                })
              }
            </div>
            <div className={order.tpv_type === 'Web' ? 'd-block' : 'd-none'}>
              <p><input required type="checkbox" checked={this.state.ivrChecked} onChange={this.handleIvrCheckChange} className="mr-2"/><small>By checking this box and selecting Next, I agree to recieve a text message containing a link to the TPV mobile site. Standard carrier charges may apply.<div className="invalid-feedback">Required</div></small></p>
            </div>

            <hr className="mb-3"/>

            <div className="mb-3">
              <label forhtml="email">Email</label>
              <input required onChange={e => this.props.updateEmail(e.target.value)} value={order.email} type="email" className="form-control" id="email"/>
              <div className="invalid-feedback">Required</div>
            </div>

            <p><input checked={order.email_disclosure} onChange={() => this.props.updateEmailDisclosure(!order.email_disclosure)} type="checkbox" className="mr-2"/><small>By clicking this checkbox, I acknowledge that I have reviewed and agree to the <a href="https://www.inspirecleanenergy.com/policies/electronic-communications-disclosure/" target="_blank">Electronic Communications Disclosure</a>, <a href="https://www.inspirecleanenergy.com/policies/terms-of-use/" target="_blank">Terms of Use</a>, and the <a href="https://www.inspirecleanenergy.com/policies/privacy-policy/" target="_blank">Privacy Policy</a>.</small></p>
            <p><input checked={order.can_text} onChange={() => this.props.updateCanText(!order.can_text)} type="checkbox" className="mr-2"/><small>By checking this box and selecting Next, I agree to receive autodialed and/or pre-recorded service-related and promotional calls and texts from Inspire, which may vary in frequency, at the phone number provided above. Standard carrier charges may apply. I do not have to agree to receive calls or texts on my mobile phone to purchase Inspire’s products and services, and I can revoke my consent any time by calling 866-403-2620 or by replying STOP to any text message.</small></p>

            <button className="btn btn-primary btn-lg mt-5 mb-5 btn-block" onClick={this.onNext}>{this.state.loading ? 'Verifying Information...' : 'Next'}</button>
            <button className="col-6 btn btn-block mx-auto btn-outline-dark" onClick={this.goBack}><b>Back</b></button>
          </form>
        </div>
      </Layout>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateFirstName,
    updateLastName,
    updateEmail,
    updatePhone,
    updateContactFirstName,
    updateContactLastName,
    updateShopper,
    updateContactRelationship,
    updateContactPhone,
    updateTpvType,
    showError,
    updatePartial,
    addMoveInDate,
    updateAccountNumber,
    updateConfirmAccountNumber,
    isValid,
    updateCanText,
    updateEmailDisclosure
  }, dispatch)
}

function mapStateToProps(state) {
  return {
    user: state.user,
    order: state.order,
    salesPermission : state.salesPermission
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Verification)
