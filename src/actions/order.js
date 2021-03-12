import axios from 'axios'
import isEmpty from "../utils/isEmpty"
import * as Sentry from '@sentry/browser'
import terms from '../utils/terms'
import isTeleSales from '../utils/isTeleSales'
import { checkUser } from './user'
import moment from 'moment'
import timezone from 'moment-timezone'

// Address Page
export const updateLatitude = (input) => {
  return { type: 'UPDATE_LATITUDE', payload: input }
}
export const updateLongitude = (input) => {
  return { type: 'UPDATE_LONGITUDE', payload: input }
}

export const updateFirstName = (input) => {
  return async(dispatch) => {
    dispatch({ type: 'UPDATE_FIRST_NAME', payload: input })
    dispatch({ type: 'UPDATE_SHOPPER_FIRST_NAME', payload: input })
  }
}

export const updateLastName = (input) => {
  return async(dispatch) => {
    dispatch({ type: 'UPDATE_LAST_NAME', payload: input })
    dispatch({ type: 'UPDATE_SHOPPER_LAST_NAME', payload: input })
  }
}

export const updateAccountNumber = (input) => {
  return async(dispatch) => {
    dispatch({ type: 'ADD_ACCOUNT_NUMBER', payload: input })
    dispatch({ type: 'ADD_SHOPPER_ACCOUNT_NUMBER', payload: input })
  }
}
export const updateConfirmAccountNumber = (input) => {
  return { type: 'ADD_CONFIRM_ACCOUNT_NUMBER', payload: input }
}

export const updateStreet = (input) => {
  return { type: 'UPDATE_STREET', payload: input }
}
export const updateSuite = (input) => {
  return { type: 'UPDATE_SUITE', payload: input }
}
export const updateCity = (input) => {
  return { type: 'UPDATE_CITY', payload: input }
}
export const updateBillingStreet = (input) => {
  return { type: 'UPDATE_BILLING_STREET', payload: input }
}
export const updateBillingSuite = (input) => {
  return { type: 'UPDATE_BILLING_SUITE', payload: input }
}
export const updateBillingCity = (input) => {
  return { type: 'UPDATE_BILLING_CITY', payload: input }
}
export const updateBillingState = (input) => {
  return { type: 'UPDATE_BILLING_STATE', payload: input }
}
export const updateBillingZip = (input) => {
  return { type: 'UPDATE_BILLING_ZIP', payload: input }
}
export const isValid = (input) => {
  return { type: 'IS_VALID', payload: input }
}
export const updateRevenueClassCode = (input) => {
  return { type: 'UPDATE_REVENUE_CLASS_CODE', payload: input }
}
export const updateBusinessName = (input) => {
  return { type: 'UPDATE_BUSINESS_NAME', payload: input }
}
export const updateOfferStatus = (status) => {
  return { type: 'UPDATE_OFFER_STATUS', payload: status }
}
export const addMoveInDate = (move_in_date) => {
  return { type: 'ADD_MOVE_IN_DATE', payload: move_in_date }
}
export const updateVerificationType = (type) => {
  return { type: 'UPDATE_VERIFICATION_TYPE', payload: type }
}
export const updatePartial = (bool) => {
  return { type: 'UPDATE_PARTIAL', payload: bool }
}
export const updateCanText = (bool) => {
  return { type: 'UPDATE_CAN_TEXT', payload: bool }
}
export const updateEmailDisclosure = (bool) => {
  return { type: 'UPDATE_EMAIL_DISCLOSURE', payload: bool }
}

export const updateZip = (zip_code) => {
  return async(dispatch, getState) => {
    const { user } = getState()
    try {
      dispatch({ type: 'UPDATE_ZIP', payload: zip_code })
      if(zip_code.length >= 5){
        const response = await axios.get(`${process.env.GATSBY_GARCON_API}/sales/app/team/markets?zip_code=${zip_code}&channel_code=${user.channel_code}&source_code=${user.source_code}&office_code=${user.office_code}`)
        const markets = response.data.markets
        const suggested_market = response.data.suggested_market
        dispatch({ type: 'ADD_MARKETS', payload: markets })
        if(markets <= 0){
          dispatch({ type: 'SHOW_ERROR', payload: response.data.error_message })
          dispatch({ type: 'UPDATE_ZIP', payload: '' })
          dispatch({ type: 'UPDATE_STATE', payload: '' })
          dispatch({ type: 'UPDATE_CITY', payload: '' })
          dispatch({ type: 'UPDATE_MARKET_CODE', payload:  '' })
          dispatch({ type: 'UPDATE_UTILITIES', payload: [] })
        } else {
          dispatch({ type: 'UPDATE_STATE', payload: suggested_market.state_code })
          dispatch({ type: 'UPDATE_CITY', payload: suggested_market.city })
          dispatch({ type: 'UPDATE_MARKET_CODE', payload:  suggested_market.market_code })
          dispatch({ type: 'UPDATE_UTILITIES', payload: response.data.markets })
          dispatch({ type: 'ADD_ACCOUNT_VALIDATION', payload: suggested_market.validation_rules })
          dispatch({ type: 'ACCOUNT_NUM_SYNONYM', payload: suggested_market.account_num_synonym })
          dispatch({ type: 'ADD_LOA_REQUIREMENT', payload: suggested_market.is_loa_required })
          dispatch({ type: 'ADD_LICENSE_NUMBER', payload: suggested_market.license_number })
          dispatch(getSalesPermission(suggested_market.state_code))
        }
      }
    } catch(e) {
      Sentry.captureException(`Error getting Markets: ${e}`)
    }
  }
}


// Get Market
export const updateMarketCode = (market_code) => {
  return async(dispatch, getState) => {
    const { order } = getState()
    try {
      const market = order.utilities.find(market => market.market_code == market_code)
      dispatch({ type: 'UPDATE_MARKET_CODE', payload: market_code })
      dispatch({ type: 'ADD_ACCOUNT_VALIDATION', payload: market.validation_rules })
      dispatch({ type: 'ACCOUNT_NUM_SYNONYM', payload: market.account_num_synonym })
      dispatch({ type: 'ADD_LOA_REQUIREMENT', payload: market.is_loa_required })
    } catch(e) {
      Sentry.captureException(`Error updating market code: ${e}`)
    }
  }
}

export const getSalesPermission = (state_code) => {
  return async(dispatch, getState) => {
    const { user } = getState()
    try {
      const response = await axios.get(`${process.env.GATSBY_GARCON_API}/sales/app/team/permissions?channel_code=${user.channel_code}&source_code=${user.source_code}&state_code=${state_code}&office_code=${user.office_code}`)
      if(!isEmpty(response.data)){
        dispatch({ type: 'ADD_SALES_PERMISSION', payload: response.data })
      } else {
        dispatch({ type: 'CLEAR_SALES_PERMISSION', payload: null})
      }
    } catch(e) {
      Sentry.captureException(`Error getting sales permission: ${e}`)
    }
  }
}

// Offers Page
export const addOffer = (input) => {
  return { type: 'ADD_OFFER', payload: input }
}
export const getOffers = () => {
  return async(dispatch, getState) => {
    const { user, order } = getState()
    try {
      const isActive = await dispatch(checkUser())
      if(isActive){
        dispatch(updateOfferStatus('Loading Offers'))
        const params = {
          'channel_code': user.channel_code || 'D2D',
          'user_id': user.user_id,
          'source_code': user.source_code,
          'revenue_class_code': order.revenue_class_code,
          'agent_id': user.agent_id,
          'original_agent_id': user.agent_id,
          'service_address_line_1': order.street,
          'service_address_line_2': order.suite,
          'service_city': order.city,
          'service_state': order.state_code,
          'service_zip_code': order.zip,
          'market_code': order.market_code,
          'account_number': order.account_number,
          'first_name': order.first_name,
          'last_name': order.last_name,
        }
        const response = await axios.post(`${process.env.GATSBY_GARCON_API}/sales/app/offers`, params)
        if(response.data.eligible_offers.length < 1){
          dispatch(updateOfferStatus(`Sorry We Couldn't Find Any Offers For This Address: \n \n ${order.street} ${order.suite} ${order.city} ${order.state_code} ${order.zip}`))
        } else {
          dispatch({type: 'GET_OFFERS', payload: response.data.eligible_offers.reverse()})
        }
        dispatch({type: 'GET_SHOPPER', payload: response.data.shopper})
      }
    } catch(e) {
      Sentry.captureException(`Sorry We Couldn't Find Any Offers For This Address: \n \n ${order.street} ${order.suite} ${order.city} ${order.state_code} ${order.zip} ${e}`)
      dispatch(updateOfferStatus(`Sorry We Couldn't Find Any Offers For This Address: \n \n ${order.street} ${order.suite} ${order.city} ${order.state_code} ${order.zip}`))
    }
  }
}

export const updateOfferCode = (input) => {
  return (dispatch) => {
    dispatch({type: 'UPDATE_OFFER', payload: input})
    dispatch({type: 'UPDATE_OFFER_ORDER', payload: input})
  }
}

export const updateTpvType = (input) => {
  return (dispatch) => {
    dispatch({type: 'TPV_TYPE', payload: input})
    dispatch({type: 'UPDATE_TPV_TYPE', payload: input})
    dispatch({type: 'SHOPPER_TPV_TYPE', payload: input})
  }
}

export const setContactless = (bool) => {
  return (dispatch) => {
    dispatch({type: 'UPDATE_CONTACTLESS', payload: bool})
    dispatch({type: 'SET_CONTACTLESS', payload: bool})
  }
}

export const updateOrderId = (order_id) => {
  return { type: 'UPDATE_ORDER_ID', payload: order_id }
}

// TPV Page
export const updateContactFirstName = (input) => {
  return { type: 'UPDATE_CONTACT_FIRST_NAME', payload: input }
}
export const updateContactLastName = (input) => {
  return { type: 'UPDATE_CONTACT_LAST_NAME', payload: input }
}
export const updateContactRelationship = (input) => {
  return { type: 'UPDATE_CONTACT_RELATIONSHIP', payload: input }
}
export const updateEmail = (input) => {
  return { type: 'UPDATE_EMAIL', payload: input }
}
export const updateSignature = (input) => {
  return { type: 'UPDATE_SIGNATURE', payload: input }
}
export const updateLoaSignature = (input) => {
  return { type: 'UPDATE_LOA_SIGNATURE', payload: input }
}
export const updateSSN = (input) => {
  return { type: 'UPDATE_SSN', payload: input }
}
export const updateInitials = (input) => {
  return { type: 'UPDATE_INITIALS', payload: input }
}


// Update Shopper
export const updateShopper = () => {
  return async(dispatch, getState) => {
    try {
      const { shopper, order } = getState()
      axios.post(`${process.env.GATSBY_GARCON_API}/sales/app/shopper`, shopper)
    } catch (e) {
      Sentry.captureException(`Error updating shopper: ${e}`)
    }
  }
}

// Terms Page
export const getTerms = () => {
  return async(dispatch, getState) => {
    try {
      const { offer } = getState()
      const response = await axios.get(`${process.env.GATSBY_GARCON_API}/sales/app/terms/${offer.offer_code}`)
      dispatch({type: 'GET_TERMS', payload: response.data})
    } catch (e) {
      Sentry.captureException(`Error getting terms: ${e}`)
    }
  }
}

export const getAuthorizations = () => {
  return async(dispatch, getState) => {
    try {
      const { shopper, order } = getState()
      const response = await axios.get(`${process.env.GATSBY_GARCON_API}/sales/app/authorizations/${shopper.shopper_guid}`)
      if (order.state_code === 'PA'){
        if (order.account_number == ""){
          const authorizations = response.data.filter((obj) => obj.file_name === "pa_letter_of_authorization_enrollment_verification" )
          dispatch({type: 'GET_LOA', payload: authorizations})
        } else {
          const authorizations = response.data.filter((obj) => obj.file_name === "pa_enrollment_verification" )
          dispatch({type: 'GET_LOA', payload: authorizations})
        }
      } else {
        dispatch({type: 'GET_LOA', payload: response.data})
      }
    } catch (e) {
      Sentry.captureException(`Error getting LOA: ${e}`)
      dispatch({ type: 'SHOW_ERROR', payload: "Error getting LOA" })
    }
  }
}

export const uploadAuthorizations = (order_id) => {
  return async(dispatch, getState) => {
    try {
      const { order, shopper, user } = getState()
      if(!isTeleSales(user.channel_code)){
        const params = {
          'order_id': order_id,
          'shopper_guid': shopper.shopper_guid,
          'signatures': order.loa_signatures,
          'initials': order.loa_initials,
        }
        axios.post(`${process.env.GATSBY_GARCON_API}/sales/app/authorizations/upload`, params)
      }
    } catch (e) {
      Sentry.captureException(`Error uploading terms: ${e}`)
    }
  }
}

export const uploadTerms = (order_id) => {
  return async(dispatch, getState) => {
    try {
      const { order, offer, user, shopper } = getState()
      const date = new Date()
      const contract_html = `<html><head><meta http-equiv=Content-Type content="text/html; charset=UTF-8"><style type="text/css">span.cls_002{font-family:Arial,serif;font-size:10.9px;color:rgb(0,0,0);font-weight:normal;font-style:normal;text-decoration: none}div.cls_002{font-family:Arial,serif;font-size:10.9px;color:rgb(0,0,0);font-weight:normal;font-style:normal;text-decoration: none}span.cls_003{font-family:Arial,serif;font-size:5.9px;color:rgb(0,0,0);font-weight:normal;font-style:normal;text-decoration: none}div.cls_003{font-family:Arial,serif;font-size:5.9px;color:rgb(0,0,0);font-weight:normal;font-style:normal;text-decoration: none}span.cls_004{font-family:Arial,serif;font-size:8.4px;color:rgb(0,0,0);font-weight:normal;font-style:normal;text-decoration: none}div.cls_004{font-family:Arial,serif;font-size:8.4px;color:rgb(0,0,0);font-weight:normal;font-style:normal;text-decoration: none}</style></head><body><div style="position:absolute;left:50%;margin-left:-306px;top:0px;width:612px;height:792px;border-style:outset;overflow:hidden"><div style="position:absolute;left:0px;top:0px"><img src="" width=612 height=792></div><div style="position:absolute;left:81.64px;top:84.86px;width: 300px;" class="cls_002"><span class="cls_002">Inspire Cross Sell Enrollment</span></div><div style="position:absolute;left:81.64px;top:105.98px" class="cls_003"><span class="cls_003">Inspire Energy | ${terms(order).code}</span></div><div style="position:absolute;left:81.64px;top:120.54px" class="cls_003"><span class="cls_003">Member Support: 1-866-403-2620 (Mon-Fri 9 A.M. - 6 P.M. ET)</span></div><div style="position:absolute;left:81.64px;top:135.10px" class="cls_003"><span class="cls_003">membersupport@helloinspire.com | </span><A HREF="http://www.helloinspire.com/">www.helloinspire.com</A> </div><div style="position:absolute;left:249.27px;top:190.42px" class="cls_002"><span class="cls_002">Customer Information</span></div><div style="position:absolute;left:81.64px;top:211.64px" class="cls_004"><span class="cls_004">Account Holder: ${order.first_name} ${order.last_name}</span></div><div style="position:absolute;left:307.32px;top:211.64px" class="cls_004"><span class="cls_004">Email Address: ${order.email}</span></div><div style="position:absolute;left:81.64px;top:227.24px" class="cls_004"><span class="cls_004">Authorized Signer (if applicable): ${shopper.contact_first_name} ${shopper.contact_last_name}</span></div><div style="position:absolute;left:307.32px;top:227.24px" class="cls_004"><span class="cls_004">Primary Phone: ${order.primary_phone}</span></div><div style="position:absolute;left:81.64px;top:242.84px" class="cls_004"><span class="cls_004">Business Name (if applicable):</span></div><div style="position:absolute;left:307.32px;top:242.84px" class="cls_004"><span class="cls_004">Alternate Phone: ${order.contact_phone || "n/a"}</span></div><div style="position:absolute;left:81.64px;top:258.44px" class="cls_004"><span class="cls_004">Meter Type: Residential</span></div><div style="position:absolute;left:307.32px;top:258.44px" class="cls_004"><span class="cls_004">Utility: ${offer.market_code}</span></div><div style="position:absolute;left:81.64px;top:274.04px" class="cls_004"><span class="cls_004">Service Address: ${order.street} ${order.city} ${order.state_code} ${order.zip}</span></div><div style="position:absolute;left:81.64px;top:283.40px" class="cls_004"><span class="cls_004">Utility Account Number: ${order.account_number}</span></div><div style="position:absolute;left:81.64px;top:295.88px" class="cls_004"><span class="cls_004">Billing Address: ${order.billing_street || order.street} ${order.billing_city || order.city} ${order.billing_state_code || order.state_code} ${order.billing_zip || order.zip}</span></div><div style="position:absolute;left:255.26px;top:340.18px;width: 250px;" class="cls_002"><span class="cls_002">Energy Plan Details</span></div><div style="position:absolute;left:81.64px;top:361.40px" class="cls_004"><span class="cls_004">Clean Energy Plan: ${offer.plan_name}</span></div><div style="position:absolute;left:81.64px;top:377.00px" class="cls_004"><span class="cls_004">Offer Code: ${offer.offer_code}</span></div><div style="position:absolute;left:81.64px;top:392.60px" class="cls_004"><span class="cls_004">Price: ${offer.rate_friendly}</span></div><div style="position:absolute;left:81.64px;top:408.20px" class="cls_004"><span class="cls_004">Type: ${offer.contract_type_code}</span></div><div style="position:absolute;left:81.64px;top:423.80px" class="cls_004"><span class="cls_004">Term: ${offer.duration_friendly}</span></div><div style="position:absolute;left:81.64px;top:439.40px" class="cls_004"><span class="cls_004">Early Cancellation Fee: ${offer.terms_vars.early_cancellation_fee_code}</span></div><div style="position:absolute;left:81.64px;top:455.20px" class="cls_004"><span class="cls_004">Enrollment Type: Full</span></div><div style="position:absolute;left:244.17px;top:486.82px" class="cls_002"><span class="cls_002">Customer Authorization</span></div><div style="position:absolute;left:81.64px;top:490px" class="cls_004"><span class="cls_004"><img style="width: 150px; height: auto;" src="${order.signature}"/></span></div><div style="position:absolute;left:311.94px;top:538.20px" class="cls_004"><span class="cls_004">${date}</span></div><div style="position:absolute;left:81.64px;top:566.28px" class="cls_004"><span class="cls_004">I agree I have read the Terms of Service and I have authorization to switch my supply service to Inspire. I consent to the</span></div><div style="position:absolute;left:81.64px;top:575.64px" class="cls_004"><span class="cls_004">sending and receipt of all required disclosures and notices in electronic rather than paper format, including the above</span></div><div style="position:absolute;left:81.64px;top:585.00px" class="cls_004"><span class="cls_004">Terms of Service. I understand that I have the right to withdraw this consent at any time.</span></div><div style="position:absolute;left:81.64px;top:602.68px" class="cls_004"><span class="cls_004">YOU MAY CANCEL THIS AGREEMENT AT ANY TIME BEFORE MIDNIGHT ON THE 3RD DAY AFTER RECEIVING</span></div><div style="position:absolute;left:81.64px;top:612.04px" class="cls_004"><span class="cls_004">THIS AGREEMENT, WITH NO PENALTIES OR CANCELLATION FEES.</span></div><div><div style="position:absolute;left:231.24px;top:655px" class="cls_002"><span class="cls_002">Sales Interaction Information</span></div><div style="position:absolute;left:81.64px;top:685px" class="cls_004"><span class="cls_004">Date Of Enrollment: ${date}</span></div><div style="position:absolute;left:81.64px;top:700px" class="cls_004"><span class="cls_004">Channel Code: ${user.channel_code}</span></div><div style="position:absolute;left:81.64px;top:715px" class="cls_004"><span class="cls_004">Agent ID: ${user.agent_id}</span></div><div style="position:absolute;left:81.64px;top:730px" class="cls_004"><span class="cls_004">Enrollment Type: Internal Sales Web App</span></div></div></body></html>`
      const params = {
        'order_id': order_id,
        'offer_code': offer.offer_code,
        'signature': order.signature || '',
        'contract_html': contract_html,
      }
      axios.post(`${process.env.GATSBY_GARCON_API}/sales/app/terms/upload`, params)
    } catch (e) {
      Sentry.captureException(`Error uploading terms: ${e}`)
    }
  }
}

export const getShopperOrders = () => {
  return async(dispatch, getState) => {
    try {
      const { shopper } = getState()
      const response = await axios.get(`${process.env.GATSBY_GARCON_API}/shoppers/${shopper.shopper_guid}/orders`)
      dispatch({type: 'GET_SHOPPER_ORDERS', payload: response.data})
    } catch (e) {
      Sentry.captureException(`Error getting : ${e}`)
    }
  }
}

// Verfication Page
export const saveOrder = () => {
  return async(dispatch, getState) => {
    try {
      const { order, shopper, user } = getState()
      const isActive = await dispatch(checkUser())
      const date = moment.utc().format()
      const local_time = moment.utc(date).local().format()
      if(isActive){
        const params = {
          'shopper_guid': shopper.shopper_guid,
          'prospect_guid': shopper.prospect_guid,
          'sold_by_user_id': user.agent_id,
          'agent_id': user.agent_id,
          'original_agent_id': user.agent_id,
          'source_code': user.source_code,
          'offer_code': order.offer_code,
          'market_code': order.market_code,
          'first_name': order.first_name,
          'last_name': order.last_name,
          'email': order.email,
          'primary_phone': order.primary_phone,
          'contact_phone_number': order.contact_phone || order.primary_phone,
          'channel_code': user.channel_code,
          'revenue_class_code': order.revenue_class_code,
          'service_address_line_1': order.street,
          'service_address_line_2': order.suite,
          'service_city': order.city,
          'service_state': order.state_code,
          'service_zip_code': order.zip,
          'billing_address_line_1': order.billing_street || order.street,
          'billing_address_line_2': order.billing_suite || order.suite,
          'billing_city': order.billing_city || order.city,
          'billing_state': order.billing_state_code || order.state_code,
          'billing_zip_code': order.billing_zip || order.zip,
          'account_number': order.account_number,
          'latitude': order.latitude,
          'longitude': order.longitude,
          'contact_first_name': shopper.contact_first_name || order.first_name,
          'contact_last_name': shopper.contact_last_name || order.last_name,
          'contact_relationship': order.contact_relationship,
          'user_agent': 'Internal Sales Web App',
          'tpv_type': order.tpv_type,
          'business_name': order.business_name || '',
          'last_four': order.last_four,
          'move_in_date': order.move_in_date,
          'verification_type': order.verification_type,
          'ack_can_text': order.can_text,
          'ack_email_disclosure': order.email_disclosure,
          'sale_dt': local_time,
          'order_timezone': timezone.tz.guess()
        }
        const response = await axios.post(`${process.env.GATSBY_GARCON_API}/sales/app/orders`, params)
        if(response.status === 200) {
          dispatch(updateStatus('SUCCESS'))
          if(!isEmpty(response.data)){
            dispatch(updateOrderId(response.data.order_id))
            dispatch(uploadTerms(response.data.order_id))
            dispatch(uploadAuthorizations(response.data.order_id))
          }
        }
      }
    } catch (e) {
      dispatch({ type: 'SHOW_ERROR', payload: "Error saving order" })
      Sentry.captureException(`Error saving order: ${e}`)
    }
  }
}

export const followUp = (type) => {
  return async(dispatch, getState) => {
    try {
      const { shopper } = getState()
      const params = {
        'id': shopper.prospect_guid,
        'type': type,
        'shopper_guid': shopper.shopper_guid,
        'short_key': shopper.short_key
      }
      axios.post(`${process.env.GATSBY_GARCON_API}/sales/app/follow_up`, params)
    } catch (e) {
      Sentry.captureException(`Error sending contactless link: ${e}`)
    }
  }
}

export const updatePhone = (input) => {
  return async(dispatch) => {
    try {
      dispatch({ type: 'UPDATE_PHONE', payload: input })
      dispatch(validatePhone(input))
      dispatch(validatePhoneOrder(input))
    } catch (e) {
      Sentry.captureException(`Error validating phone number: ${e}`)
    }
  }
}

export const updateContactPhone = (input) => {
  return async(dispatch) => {
    try {
      dispatch({ type: 'UPDATE_CONTACT_PHONE', payload: input })
      dispatch(validatePhone(input))
      dispatch(validatePhoneOrder(input))
    } catch (e) {
      Sentry.captureException(`Error validating phone number: ${e}`)
    }
  }
}

export const validatePhone = (input) => {
  return async(dispatch) => {
    try {
      if(input.replace(/\D/g,'').length === 10){
        const params = {
          'phone': input
        }
        const response = await axios.post(`${process.env.GATSBY_GARCON_API}/sales/app/validate_phone`, params)
        dispatch({ type: 'VALIDATE_PHONE', payload: response.data })
      }
    } catch (e) {
      Sentry.captureException(`Error validating phone number: ${e}`)
    }
  }
}

export const validatePhoneOrder = (input) => {
  return async(dispatch, getState) => {
    try {
      if(input.replace(/\D/g,'').length === 10){
        const { order } = getState()
        const params = {
          'phone': input,
          'first_name': order.first_name,
          'last_name': order.last_name
        }
        const response = await axios.post(`${process.env.GATSBY_GARCON_API}/sales/app/validate_phone_order`, params)
        dispatch({ type: 'VALIDATE_PHONE_ORDER', payload: response.data })
      }
    } catch (e) {
      Sentry.captureException(`Error validating phone number: ${e}`)
    }
  }
}

export const initializeTpv = () => {
  return async(dispatch, getState) => {
    try {
      const { data } = getState()
      const params = {
        'order_id': data.order_id
      }
      axios.post(`${process.env.GATSBY_GARCON_API}/sales/app/tpv`, params)
      dispatch({type: 'CLEAR_OFFER', payload: null})
      dispatch({type: 'CLEAR_OFFERS', payload: null})
      dispatch({type: 'CLEAR_ORDER', payload: null})
      dispatch({type: 'CLEAR_TERMS', payload: null})
      dispatch({type: 'CLEAR_DASHBOARD', payload: null})
    } catch (e) {
      Sentry.captureException(`Error initializing TPV: ${e}`)
    }
  }
}

export const clearStatus = () => {
  return { type: 'CLEAR_STATUS', payload: null }
}
export const updateStatus = (status) => {
  return { type: 'UPDATE_STATUS', payload: status }
}
// Clear
export const clearOffers = () => {
  return { type: 'CLEAR_OFFERS', payload: [] }
}
export const clearOffer = () => {
  return { type: 'CLEAR_OFFER', payload: {} }
}
export const clearShopper = () => {
  return { type: 'CLEAR_SHOPPER', payload: null }
}
export const clearTerms = () => {
  return { type: 'CLEAR_TERMS', payload: null }
}
export const clearOrderData = () => {
  return (dispatch) => {
    dispatch({type: 'CLEAR_OFFER', payload: null})
    dispatch({type: 'CLEAR_OFFERS', payload: null})
    dispatch({type: 'CLEAR_ORDER', payload: null})
    dispatch({type: 'CLEAR_TERMS', payload: null})
  }
}
