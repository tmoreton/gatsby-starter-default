import { combineReducers } from 'redux'
import moment from 'moment'

const DEFAULT_USER = {loggedIn: false, user_id: null, email: '', source_code: null, roles: [], loading: false, agent_id: null}
function user(state = DEFAULT_USER, action) {
  switch (action.type) {
  case 'GET_USER':
    return {...state, ...action.payload}
  case 'UPDATE_USER_EMAIL':
    return { ...state, email: action.payload }
  case 'GET_AGENT_ID':
    return { ...state, agent_id: action.payload }
  case 'LOGGED_IN':
    return {...state, loggedIn: action.payload}
  case 'CLEAR_USER':
    return DEFAULT_USER
  default:
    return state
  }
}

const DEFAULT_EVENT = {location: {location_name: '', sales_location_code: '', time: null}, shift: {}, locations: []}
function event(state = DEFAULT_EVENT, action) {
  switch (action.type) {
  case 'GET_LOCATIONS':
    return {...state, locations: action.payload}
  case 'UPDATE_EVENT':
    return {...state, shift: action.payload}
  case 'UPDATE_LOCATION_NAME':
    return { ...state, location: { ...state.location, location_name: action.payload } }
  case 'UPDATE_LOCATION_CODE':
    return { ...state, location: { ...state.location, sales_location_code: action.payload } }
  case 'UPDATE_LOCATION_TIME':
    return { ...state, location: { ...state.location, time: action.payload } }
  case 'CLEAR_EVENT':
    return DEFAULT_EVENT
  default:
    return state
  }
}

const cases = (state = {case_type_category_id: null, category_name: '', department_code: '', case_type_code: ''}, action) => {
  switch (action.type) {
    case 'GET_CASE_TYPE':
      return action.payload
    default:
      return state
  }
}

const entry = (state = {}, action) => {
  switch (action.type) {
    case 'GET_ENTRY':
      return action.payload
    default:
      return state
  }
}

const DEFAULT_ORDER = { license_number: '', terms: null, offer_code: null, email_disclosure: false, can_text: false, isLoaRequired: false, isPartial: false, account_num_synonym: 'Account Number', verification_type: '', move_in_date: null, contactless: false, phone_validated: false, phone_validation_error: '', loa_signatures: [], signature: '', loa: [], offer_status: 'Loading Offers...', utilities: [], tpv_response: {}, tpv_type: '', is_valid: false, first_name: '', last_name: '', street: '', suite: '', city: '', state_code: '', zip: '', billing_street: '', billing_city: '', billing_suite: '', billing_state_code: '', billing_zip: '', email: '', primary_phone: '', market_code: '', account_number: '', confirm_account_number: '', contact_relationship: '', revenue_class_code: 'RESI'}
const order = (state = DEFAULT_ORDER, action) => {
  switch (action.type) {
    case 'ADD_ADDRESS':
      return action.payload
    case 'CLEAR_ORDER':
      return DEFAULT_ORDER
    case 'UPDATE_ORDER_ID':
      return { ...state, order_id: action.payload }
    case 'UPDATE_OFFER_STATUS':
      return { ...state, offer_status: action.payload }
    case 'ADD_ACCOUNT_NUMBER':
      return { ...state, account_number: action.payload }
    case 'ADD_CONFIRM_ACCOUNT_NUMBER':
      return { ...state, confirm_account_number: action.payload }
    case 'UPDATE_STREET':
      return { ...state, street: action.payload }
    case 'UPDATE_SUITE':
      return { ...state, suite: action.payload }
    case 'UPDATE_CITY':
      return { ...state, city: action.payload }
    case 'UPDATE_STATE':
      return { ...state, state_code: action.payload }
    case 'UPDATE_ZIP':
      return { ...state, zip: action.payload }
    case 'UPDATE_BILLING_STREET':
      return { ...state, billing_street: action.payload }
    case 'UPDATE_BILLING_SUITE':
      return { ...state, billing_suite: action.payload }
    case 'UPDATE_BILLING_CITY':
      return { ...state, billing_city: action.payload }
    case 'UPDATE_BILLING_STATE':
      return { ...state, billing_state_code: action.payload }
    case 'UPDATE_BILLING_ZIP':
      return { ...state, billing_zip: action.payload }
    case 'UPDATE_FIRST_NAME':
      return { ...state, first_name: action.payload }
    case 'UPDATE_LAST_NAME':
      return { ...state, last_name: action.payload }
    case 'UPDATE_CONTACT_FIRST_NAME':
      return { ...state, contact_first_name: action.payload }
    case 'UPDATE_CONTACT_LAST_NAME':
      return { ...state, contact_last_name: action.payload }
    case 'UPDATE_CONTACT_RELATIONSHIP':
      return { ...state, contact_relationship: action.payload }
    case 'UPDATE_UTILITIES':
      return { ...state, utilities: action.payload }
    case 'UPDATE_MARKET_CODE':
      return { ...state, market_code: action.payload }
    case 'ADD_ACCOUNT_VALIDATION':
      return { ...state, account_validation: action.payload }
    case 'UPDATE_EMAIL':
      return { ...state, email: action.payload }
    case 'UPDATE_PHONE':
      return { ...state, primary_phone: action.payload }
    case 'UPDATE_CONTACT_PHONE':
      return { ...state, contact_phone: action.payload }
    case 'UPDATE_LATITUDE':
      return { ...state, latitude: action.payload }
    case 'UPDATE_LONGITUDE':
      return { ...state, longitude: action.payload }
    case 'UPDATE_CONTACTLESS':
      return { ...state, contactless: action.payload }
    case 'GET_TERMS':
      return { ...state, terms: action.payload }
    case 'GET_TERMS_URL':
      return { ...state, terms_url: action.payload }
    case 'CLEAR_TERMS':
      return { ...state, terms: action.payload }
    case 'UPDATE_SIGNATURE':
      return { ...state, signature: action.payload }
    case 'IS_VALID':
      return { ...state, is_valid: action.payload }
    case 'TPV_TYPE':
      return { ...state, tpv_type: action.payload }
    case 'GET_TPV_RESPONSE':
      return { ...state, tpv_response: action.payload }
    case 'UPDATE_REVENUE_CLASS_CODE':
      return { ...state, revenue_class_code: action.payload }
    case 'UPDATE_BUSINESS_NAME':
      return { ...state, business_name: action.payload }
    case 'GET_LOA':
      return { ...state, loa: action.payload }
    case 'UPDATE_SSN':
      return { ...state, last_four: action.payload }
    case 'UPDATE_INITIALS':
      return { ...state, loa_initials: action.payload }
    case 'UPDATE_LOA_SIGNATURE':
      return { ...state, loa_signatures: action.payload }
    case 'VALIDATE_PHONE':
      return { ...state, phone_validated: action.payload.validated,  phone_validation_error: action.payload.error_message}
    case 'VALIDATE_PHONE_ORDER':
      return { ...state, phone_validated_order: action.payload.validated,  phone_validation_error: action.payload.error_message}
    case 'ADD_MOVE_IN_DATE':
      return { ...state, move_in_date: action.payload }
    case 'UPDATE_VERIFICATION_TYPE':
      return { ...state, verification_type: action.payload }
    case 'ACCOUNT_NUM_SYNONYM':
      return { ...state, account_num_synonym: action.payload }
    case 'UPDATE_PARTIAL':
      return { ...state, isPartial: action.payload }
    case 'ADD_LOA_REQUIREMENT':
      return { ...state, isLoaRequired: action.payload }
    case 'UPDATE_CAN_TEXT':
      return { ...state, can_text: action.payload }
    case 'UPDATE_EMAIL_DISCLOSURE':
      return { ...state, email_disclosure: action.payload }
    case 'UPDATE_OFFER_ORDER':
      return { ...state, offer_code: action.payload }
    case 'ADD_LICENSE_NUMBER':
      return { ...state, license_number: action.payload }
    default:
      return state
  }
}

const offers = (state = null, action) => {
  switch (action.type) {
    case 'GET_OFFERS':
      return action.payload
    case 'CLEAR_OFFERS':
      return null
    default:
      return state
  }
}

const sources = (state = [], action) => {
  switch (action.type) {
    case 'GET_SOURCES':
      return action.payload
    default:
      return state
  }
}

const DEFAULT_PERMISSION = {partial_enrollment_enabled: false, tpv_types: ['Phone', 'Web'], tpv_delay: false, loa_required: true, sms_allowed: true}
const salesPermission = (state = DEFAULT_PERMISSION, action) => {
  switch (action.type) {
    case 'ADD_SALES_PERMISSION':
      return { ...state,
        tpv_delay: action.payload.tpv_delay,
        loa_required: action.payload.loa_required,
        sms_allowed: action.payload.sms_allowed,
        tpv_types: action.payload.tpv_types === undefined ? DEFAULT_PERMISSION.tpv_types : action.payload.tpv_types,
        partial_enrollment_enabled: action.payload.partial_enrollment_enabled
      }
    case 'CLEAR_SALES_PERMISSION':
      return DEFAULT_PERMISSION
    default:
      return state
  }
}

const DEFAULT_OFFER = {plan_name: '', contract_type_code: '', rate_friendly: '', offer_features: [], marketing_highlights: []}
const offer = (state = DEFAULT_OFFER, action) => {
  switch (action.type) {
    case 'ADD_OFFER':
      return action.payload
    case 'CLEAR_OFFER':
      return DEFAULT_OFFER
    default:
      return state
  }
}

const shopper = (state = {tpv_type: '', contact_first_name: '', contact_last_name: '', primary_phone: '', email: ''}, action) => {
  switch (action.type) {
    case 'GET_SHOPPER':
      return action.payload
    case 'UPDATE_SHOPPER_FIRST_NAME':
      return { ...state, first_name: action.payload }
    case 'UPDATE_SHOPPER_LAST_NAME':
      return { ...state, last_name: action.payload }
    case 'UPDATE_USER_EMAIL':
      return { ...state, email: action.payload }
    case 'UPDATE_CONTACT_FIRST_NAME':
      return { ...state, contact_first_name: action.payload }
    case 'UPDATE_CONTACT_LAST_NAME':
      return { ...state, contact_last_name: action.payload }
    case 'UPDATE_PHONE':
      return { ...state, primary_phone: action.payload }
    case 'UPDATE_CONTACT_PHONE':
      return { ...state, contact_phone_number: action.payload }
    case 'UPDATE_EMAIL':
      return { ...state, email: action.payload }
    case 'UPDATE_OFFER':
      return { ...state, offer_code: action.payload }
    case 'GET_SHOPPER_ORDERS':
      return { ...state, orders: action.payload}
    case 'ADD_SHOPPER_ACCOUNT_NUMBER':
      return { ...state, account_number: action.payload}
    case 'SHOPPER_TPV_TYPE':
      return { ...state, tpv_type: action.payload }
    case 'CLEAR_SHOPPER':
      return null
    default:
      return state
  }
}

const token = (state = null, action) => {
  switch (action.type) {
    case 'GET_TOKEN':
      return action.payload
    case 'CLEAR_TOKEN':
      return null
    default:
      return state
  }
}

const error = (state = null, action) => {
  switch (action.type) {
    case 'SHOW_ERROR':
      return action.payload
    default:
      return state
  }
}

const DEFAULT_DATA = {status: 'PENDING', order_id: null, tpv_type: '', contactless: false}
const data = (state = DEFAULT_DATA, action) => {
  switch (action.type) {
    case 'UPDATE_STATUS':
      return { ...state, status: action.payload }
    case 'UPDATE_ORDER_ID':
      return { ...state, order_id: action.payload }
    case 'UPDATE_TPV_TYPE':
      return { ...state, tpv_type: action.payload }
    case 'SET_CONTACTLESS':
      return { ...state, contactless: action.payload }
    case 'CLEAR_STATUS':
      return DEFAULT_DATA
    default:
      return state
  }
}

const DEFAULT_DASHBOARD = {data: [], graph: [], fromDate: moment().subtract(30, 'days').format('YYYY-MM-DD'), toDate: moment().format('YYYY-MM-DD')}
const dashboard = (state = DEFAULT_DASHBOARD, action) => {
  switch (action.type) {
    case 'GET_DASHBOARD':
      return { ...state, data: action.payload }
    case 'GET_GRAPH':
      return { ...state, graph: action.payload }
    case 'UPDATE_FROM_DATE':
      return { ...state, fromDate: action.payload }
    case 'UPDATE_TO_DATE':
      return { ...state, toDate: action.payload }
    case 'CLEAR_DASHBOARD':
      return DEFAULT_DASHBOARD
    default:
      return state
  }
}

export function vendorTPV(state = [], action) {
  switch(action.type) {
    case 'GET_VENDOR_TPV':
      return action.payload
    default:
      return state 
  }
}

const rootReducer = combineReducers({
  user,
  order,
  offers,
  offer,
  shopper,
  token,
  sources,
  error,
  data,
  dashboard,
  salesPermission,
  event,
  cases,
  vendorTPV,
  entry,
})

export default rootReducer
