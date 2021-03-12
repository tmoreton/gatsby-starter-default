import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Layout from "../components/layout"
import { navigate } from "gatsby"
import {
  getTerms,
  clearStatus,
  followUp,
  setContactless,
  updateCanText,
  getAuthorizations
} from '../actions/order'
import { showError } from '../actions/error'
import isEmpty from '../utils/isEmpty'
import isTeleSales from '../utils/isTeleSales'

class Confirm extends Component {
  state = {
    contactlessType: 'Text'
  }

  componentDidMount = () => {
    if(!this.props.order.street){
      this.props.clearStatus()
      navigate('/')
    }
    if(this.props.order.street){
      this.props.getAuthorizations()
      this.props.getTerms()
    }
  }

  editAddress = () => navigate('/address')

  editVerification = () => navigate('/verification')

  editOffer = () => navigate('/offers')

  onNext = (e) => {
    const { user, order, salesPermission } = this.props
    e.preventDefault()
    if (order.contactless){
      this.followUp()
    } else if (isTeleSales(user.channel_code)){
      navigate('/order')
    } else if(order.terms && !salesPermission.loa_required) {
      navigate('/terms')
    } else {
      navigate('/loa')
    }
  }

  followUp = () => {
    if (this.props.order.can_text){
      this.props.followUp(this.state.contactlessType)
      navigate('/order')
    } else if (this.state.contactlessType == 'Email') {
      this.props.order.can_text === false
      this.props.followUp(this.state.contactlessType)
      navigate('/order')
    } else {
      this.props.showError("Must agree to terms")
    }
  }

  renderContactlessMethods = () => {
    const { order } = this.props
    if(!isTeleSales(this.props.user.channel_code)){
      return (
        <div>
          <div className="btn-group btn-block d-flex p-2" role="group">
            <button style={{flex: 1}} onClick={() => this.props.setContactless(false)} type="button" className={order.contactless ? 'btn btn-outline btn-sm' : 'btn btn-primary btn-sm'}>In Person</button>
            <button style={{flex: 1}} onClick={() => this.props.setContactless(true)} type="button" className={!order.contactless ? 'btn btn-outline btn-sm' : 'btn btn-primary btn-sm'}>Contactless</button>
          </div>
          {
            order.contactless &&
            <div className="p-2">
              <div className="btn-group btn-block d-flex" role="group">
                <button style={{flex: 1}} onClick={() => this.setState({ contactlessType: 'Text' })} type="button" className={this.state.contactlessType === 'Text' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}>Text</button>
                <button style={{flex: 1}} onClick={() => this.setState({ contactlessType: 'Email' })} type="button" className={this.state.contactlessType === 'Email' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}>Email</button>
              </div>

              {this.state.contactlessType === 'Text' &&
              <p className={this.state.contactlessType === 'Text' ? 'pt-3' : 'd-none pt-3'}><input type="checkbox"  checked={order.can_text} onChange={() => this.props.updateCanText(!order.can_text)} className="mr-2"/>
              <small>By checking this box and selecting Next, I agree to receive autodialed and/or pre-recorded service-related and promotional calls and texts from Inspire,
                which may vary in frequency, at the phone number provided above. Standard carrier charges may apply.
                I do not have to agree to receive calls or texts on my mobile phone to purchase Inspire’s products and services,
                and I can revoke my consent any time by calling 866-403-2620 or by replying STOP to any text message.</small></p>
              }

              </div>
          }
        </div>
      )
    }
  }

  render() {
    const { order, offer } = this.props
    return (
      <Layout progress='60%'>
        <div className="col-md-7 mx-auto">
          <div className="row">
            <div className="col-5">
              <b>Address</b>
              <p>{order.street}</p>
            </div>
            <div className="col-4">
              <b>Address 2</b>
              <p>{order.suite}</p>
            </div>
          </div>

          { order.business_name ?
            <div className="row">
              <div className="col-12">
                <b>Business Name</b>
                <p>{order.business_name}</p>
              </div>
            </div> : null
          }

          <div className="row">
            <div className="col-5">
              <b>City</b>
              <p>{order.city}</p>
            </div>
            <div className="col-4">
              <b>State</b>
              <p>{order.state_code}</p>
            </div>
            <div className="col-3">
              <b>Zip</b>
              <p>{order.zip}</p>
            </div>
          </div>

          <hr className="mb-3"/>

          <div className="row">
            <div className="col-5">
              <b>Billing Address</b>
              <p>{order.billing_street || order.street}</p>
            </div>
            <div className="col-4">
              <b>Billing Address 2</b>
              <p>{order.billing_suite || order.suite}</p>
            </div>
          </div>

          <div className="row">
            <div className="col-5">
              <b>Billing City</b>
              <p>{order.billing_city || order.city}</p>
            </div>
            <div className="col-4">
              <b>Billing State</b>
              <p>{order.billing_state_code || order.state_code}</p>
            </div>
            <div className="col-3">
              <b>Billing Zip</b>
              <p>{order.billing_zip || order.zip}</p>
            </div>
          </div>

          <hr className="mb-3"/>

          <div className="row">
            <div className="col-5">
              <b>Utility</b>
              <p>{offer.market_code + ' - ' + offer.market_name}</p>
            </div>
            <div className="col-7">
              <b>Account Number</b>
              <p>{order.account_number}</p>
            </div>
          </div>

          <button className="col-6 btn btn-block mt-3 mx-auto btn-outline-dark" onClick={this.editAddress}><b>Edit</b></button>

          <hr className="mb-3"/>

          <div className="row">
            <div className="col-6">
              <b>First Name</b>
              <p>{order.first_name}</p>
            </div>
            <div className="col-6">
              <b>Last Name</b>
              <p>{order.last_name}</p>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <b>Phone</b>
              <p>{order.primary_phone}</p>
            </div>
            <div className="col-6">
              <b>Email</b>
              <p>{order.email}</p>
            </div>
          </div>

          <div>
            { !isEmpty(order.contact_first_name) ?
              <div>
                <h5 className="pt-3 pb-1"><b>Authorized User</b></h5>
                <div className="row">
                  <div className="col-4">
                    <b>Relationship</b>
                    <p>{order.contact_relationship}</p>
                  </div>
                  <div className="col-4">
                    <b>Contact First Name</b>
                    <p>{order.contact_first_name}</p>
                  </div>
                  <div className="col-4">
                    <b>Contact Last Name</b>
                    <p>{order.contact_last_name}</p>
                  </div>
                </div>
              </div> : null
            }
            <div className="row">
              { !isEmpty(order.contact_phone) ?
                <div className="col-6">
                  <b>Contact Phone</b>
                  <p>{order.contact_phone}</p>
                </div> : null
              }
            </div>
          </div>

          <button className="col-6 btn btn-block mt-3 mx-auto btn-outline-dark" onClick={this.editVerification}><b>Edit</b></button>

          <hr className="mb-3"/>

          <div className="text-center row">
            <div className="text-center col-12">
              <h4>{offer.plan_name}</h4>
              <p>{offer.contract_type_code.toUpperCase()} <br/> {offer.duration_friendly}</p>
              <h3><b>{offer.rate_friendly}</b></h3>
              <p><b>{offer.plan_description}</b></p>
              {
                offer.marketing_highlights.map((highlight, i) => {
                  return <div key={i} className="py-1 px-2"><li>{highlight}</li></div>
                })
              }
            </div>
          </div>

          <button className="col-6 btn btn-block mt-3 mx-auto btn-outline-dark" onClick={this.editOffer}><b>Edit</b></button>
          <hr className="mb-4"/>

          {this.renderContactlessMethods()}

          <button className="btn btn-primary btn-lg mt-3 mb-3 btn-block" onClick={this.onNext}>Next</button>
        </div>
      </Layout>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getTerms,
    clearStatus,
    followUp,
    showError,
    setContactless,
    updateCanText,
    getAuthorizations
  }, dispatch)
}

function mapStateToProps(state) {
  return {
    order: state.order,
    offer: state.offer,
    user: state.user,
    salesPermission: state.salesPermission
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Confirm)
