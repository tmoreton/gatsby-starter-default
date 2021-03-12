import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  updateLatitude,
  updateLongitude,
  updateFirstName,
  updateLastName,
  updateStreet,
  updateSuite,
  updateCity,
  updateZip,
  updateBillingStreet,
  updateBillingSuite,
  updateBillingCity,
  updateBillingState,
  updateBillingZip,
  updateMarketCode,
  updateAccountNumber,
  updateConfirmAccountNumber,
  isValid,
  updateRevenueClassCode,
  updateBusinessName,
  clearOffers,
  clearOffer,
  addMoveInDate,
  updatePartial,
} from '../actions/order'
import { clearData } from '../actions/user'
import Layout from '../components/layout'
import { navigate } from 'gatsby'
import { showError } from '../actions/error'
import isTeleSales from '../utils/isTeleSales'
import terms from '../utils/terms'
import AccountNumber from '../components/accountNumber'
import isRetail from '../utils/isRetail'
import isEmpty from '../utils/isEmpty'

class Address extends Component {
  state = {
    billingChecked: true,
    validated: true
  }

  componentDidMount = () => {
    if(!this.props.user.loggedIn){
      navigate('/')
    } else {
      this.props.clearOffers()
      this.props.clearOffer()
      this.getLocation()
      if(this.props.order.billing_street){
        this.setState({ billingChecked: false })
      }
      if(isRetail(this.props.user.channel_code) && isEmpty(this.props.event.shift)){
        navigate("/clock-in")
      }
    }
  }

  getLocation = () => {
    if(!this.props.order.latitude){
      navigator.geolocation.getCurrentPosition((position) => {
        this.props.updateLatitude(position.coords.latitude)
        this.props.updateLongitude(position.coords.longitude)
      })
    }
  }

  getOffers = (e) => {
    e.preventDefault()
    if(this.validated()) {
      navigate('/offers')
    } else {
      this.setState({validated: false})
    }
  }

  clear = (e) => {
    e.preventDefault()
    this.props.clearData()
    this.props.isValid(false)
  }

  addAccountNumber = (e) => {
    this.props.updateAccountNumber(e)
    var regexConst = new RegExp(this.props.order.account_validation.account_number_regexp)
    this.props.isValid(regexConst.test(e))
  }

  selectMarket = (e) => {
    this.props.updateMarketCode(e)
  }

  checkAccountNumber = () => {
    if(!this.props.order.isPartial && this.props.order.account_number === this.props.order.confirm_account_number) {
      return true
    } else {
      return false
    }
  }

  validated = () => {
    const { order, user } = this.props
    if(!order.street) {
      return false
    } else if(!order.city) {
      return false
    } else if(!order.state_code) {
      return false
    } else if(!order.zip) {
      return false
    } else if(!order.market_code) {
      return false
    } else if(order.account_number && !order.is_valid && !order.isPartial) {
      this.props.showError('Invalid Account Number')
      return false
    } else if(order.account_number && order.account_number !== order.confirm_account_number && !order.isPartial) {
      this.props.showError('Account Numbers do not match')
      return false
    } else if (order.isLoaRequired && !order.first_name || order.isLoaRequired && !order.last_name){
      this.props.showError('Please fill in all authorization fields')
      return false
    } else if (order.isPartial && !order.move_in_date && user.channel_code === 'CONCIERGE'){
      this.props.showError('Select Move in Date')
      return false
    }
    return true
  }

  render() {
    const { order, user, salesPermission } = this.props
    return (
      <Layout progress='15%'>
        <div className="col-md-7 mx-auto">
          <form className={!this.state.validated ? 'was-validated' : null}>
            <div className="row">
             <div className="col-md-4 mb-3">
                <label forhtml="zip">Zip</label>
                <input onChange={e => this.props.updateZip(e.target.value)} value={order.zip} type="text" className="form-control" id="zip" required/>
                <div className="invalid-feedback">Required</div>
                <small id="emailHelp" className="form-text text-muted">Zip can pre-populate City & State</small>
              </div>
              <div className="col-md-3 mb-3">
                <label forhtml="state">State</label>
                <input disabled value={order.state_code} type="text" className="form-control" id="state" required/>
                <div className="invalid-feedback">Required</div>
              </div>
              <div className="col-md-5 mb-3">
                <label forhtml="city">City</label>
                <input onChange={e => this.props.updateCity(e.target.value)} value={order.city} type="text" className="form-control" id="city" required/>
                <div className="invalid-feedback">Required</div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 mb-3">
                <label forhtml="address">Address</label>
                <input onChange={e => this.props.updateStreet(e.target.value)} value={order.street} type="text" className="form-control" id="address" required/>
                <div className="invalid-feedback">Required</div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-8 mb-3">
                <label forhtml="address2">Address 2 <span className="text-muted">(Optional)</span></label>
                <input onChange={e => this.props.updateSuite(e.target.value)} value={order.suite} type="text" className="form-control" id="address2" />
              </div>
              <div className="col-md-4 mb-3">
                <label forhtml="type">Type</label>
                <select onChange={e => this.props.updateRevenueClassCode(e.target.value)} value={order.revenue_class_code} className="custom-select d-block w-100" id="type">
                  <option value="RESI">Residential</option>
                  { user.channel_code !== 'D2D' && <option value="SMALL-COM">Business</option> }
                </select>
              </div>
            </div>

            { order.revenue_class_code === 'SMALL-COM' &&
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label forhtml="business">Business Name</label>
                  <input onChange={e => this.props.updateBusinessName(e.target.value)} value={order.business_name} type="text" className="form-control" id="business" required/>
                </div>
              </div>
            }

            <p><input type="checkbox" checked={this.state.billingChecked} onChange={() => this.setState({ billingChecked: !this.state.billingChecked })} className="mr-2"/>Same as Billing Address</p>

            <div className={!this.state.billingChecked ? '' : 'd-none'}>
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label forhtml="address">Billing Address</label>
                  <input onChange={e => this.props.updateBillingStreet(e.target.value)} value={order.billing_street} type="text" className="form-control" id="address" required/>
                  <div className="invalid-feedback">Required</div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 mb-3">
                  <label forhtml="address2">Billing Address 2 <span className="text-muted">(Optional)</span></label>
                  <input onChange={e => this.props.updateBillingSuite(e.target.value)} value={order.billing_suite} type="text" className="form-control" id="address2"/>
                </div>
              </div>

              <div className="row">
                <div className="col-md-5 mb-3">
                  <label forhtml="city">Billing City</label>
                  <input onChange={e => this.props.updateBillingCity(e.target.value)} value={order.billing_city} type="text" className="form-control" id="city" required/>
                  <div className="invalid-feedback">Required</div>
                </div>
                <div className="col-md-3 mb-3">
                  <label forhtml="state">Billing State</label>
                  <input onChange={e => this.props.updateBillingState(e.target.value)} value={order.billing_state_code} type="text" className="form-control" id="state" required/>
                  <div className="invalid-feedback">Required</div>
                </div>
                <div className="col-md-4 mb-3">
                  <label forhtml="zip">Billing Zip</label>
                  <input onChange={e => this.props.updateBillingZip(e.target.value)} value={order.billing_zip} type="text" className="form-control" id="zip" required/>
                  <div className="invalid-feedback">Required</div>
                </div>
              </div>
            </div>

            <hr className="mb-3"/>

            <div className={order.utilities.length >= 1 ? 'mb-3' : 'd-none mb-3'}>
              <label forhtml="state">Utility</label>
              <select onChange={e => this.selectMarket(e.target.value)} value={order.market_code} className="custom-select d-block w-100" id="state" required>
                <option value="" disabled selected="selected"></option>
              {
                order.utilities.map((utility, key) => {
                  if(utility.state_code == order.state_code){
                    return <option key={key} value={utility.market_code}>{utility.market_code + ' - ' + utility.market_name}</option>
                  }
                })
              }
              </select>
              <div className="invalid-feedback">Required</div>
            </div>

            <div className={!order.market_code && 'd-none'}>
              { order.isLoaRequired &&
                <div className="row bg-secondary text-white my-3 mx-1">
                  <p className="col-12 px-3 pt-3">By providing my account number and name and clicking Next, I confirm that I am an account holder and I authorize {order.market_code} to release and forward energy usage data, including without limitation rate class, load profile, kWh, kVA, and/or KW, and interval data (if available) and payment history for the account listed to Inspire ({order.license_number})</p>
                  <div className="col-md-6 mb-3">
                    <label forhtml="firstName">First Name</label>
                    <input onChange={e => this.props.updateFirstName(e.target.value)} value={order.first_name} type="text" className="form-control" id="firstName" required/>
                    <div className="invalid-feedback text-white">Required</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label forhtml="lastName">Last Name</label>
                    <input onChange={e => this.props.updateLastName(e.target.value)} value={order.last_name} type="text" className="form-control" id="lastName" required/>
                    <div className="invalid-feedback text-white">Required</div>
                  </div>
                </div>
              }
            </div>


            <div className={!order.market_code && 'd-none'}>
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
              { !order.latitude ?
                <button className="btn btn-outline-primary btn-lg mt-5 mb-5 btn-block" onClick={this.getLocation}>Enable Location to Continue</button>
                :
                <button className="btn btn-primary btn-lg mt-5 mb-5 btn-block" onClick={this.getOffers}>Check Offers</button>
              }
            </div>

            <button className="col-6 btn btn-block mx-auto btn-outline-dark" onClick={this.clear}><b>Clear</b></button>
          </form>
        </div>
      </Layout>
    )
  }
}

function mapStateToProps(state) {
  return {
    order: state.order,
    user: state.user,
    event: state.event,
    salesPermission : state.salesPermission
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateLatitude,
    updateLongitude,
    updateFirstName,
    updateLastName,
    updateStreet,
    updateSuite,
    updateCity,
    updateZip,
    updateBillingStreet,
    updateBillingSuite,
    updateBillingCity,
    updateBillingState,
    updateBillingZip,
    updateMarketCode,
    updateAccountNumber,
    updateConfirmAccountNumber,
    clearData,
    isValid,
    showError,
    updateRevenueClassCode,
    updateBusinessName,
    clearOffer,
    clearOffers,
    addMoveInDate,
    updatePartial,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Address)
