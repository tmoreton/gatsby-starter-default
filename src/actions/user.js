import axios from 'axios'
import { navigate } from "gatsby"
import * as Sentry from '@sentry/browser'
import isRetail from '../utils/isRetail'

export const updateAgentId = (input) => {
  return { type: 'GET_AGENT_ID', payload: input }
}

export const updateEmail = (input) => {
  return { type: 'UPDATE_USER_EMAIL', payload: input }
}

export const getGarconToken = (accessToken) => {
  return async(dispatch, getState) => {
    const { user } = getState()
    try {
      const garconToken = await axios.post(`${process.env.GATSBY_GARCON_API}/tokens/sales`, {agent_id: user.agent_id})
      dispatch({type: 'GET_TOKEN', payload: garconToken.data.token})
      dispatch(getUser())
    } catch (e) {
      Sentry.captureException(`Error getting access token: ${e}`)
      dispatch({ type: 'SHOW_ERROR', payload: "Error getting access token" })
    }
  }
}

export const getUser = () => {
  return async(dispatch, getState) => {
    const { user } = getState()
    try {
      const response = await axios.get(`${process.env.GATSBY_GARCON_API}/sales/app/users?agent_id=${user.agent_id}`)
      dispatch({type: 'LOGGED_IN', payload: true })
      dispatch({type: 'GET_USER', payload: response.data })
      if(isRetail(response.data.channel_code)){
        navigate("/clock-in")
      } else {
        navigate("/address")
      }
    } catch(e) {
      Sentry.captureException(`Error getting user info: ${e}`)
      dispatch({ type: 'SHOW_ERROR', payload: "Error getting user info" })
    }
  }
}

export const checkUser = () => {
  return async(dispatch, getState) => {
    const { user } = getState()
    const response = await axios.get(`${process.env.GATSBY_GARCON_API}/sales/app/users?agent_id=${user.agent_id}`)
    dispatch({type: 'GET_USER', payload: response.data })
    if(response.data.status !== 'Active'){
      dispatch(logout())
      dispatch({ type: 'SHOW_ERROR', payload: "Agent ID Deactivated" })
      return false
    } else {
      return true
    }
  }
}

export const getAgentDashboard = () => {
  return async(dispatch, getState) => {
    try {
      const { user, dashboard } = getState()
      const response = await axios.get(`${process.env.GATSBY_GARCON_API}/sales/dashboard/agent/${user.agent_id}?from_dt=${dashboard.fromDate}&to_dt=${dashboard.toDate}`)
      dispatch({ type: 'GET_DASHBOARD', payload: response.data })
      const arr = []
      response.data.reverse().forEach(x => {
        let index = arr.findIndex(y => y.order_dt == x.order_dt)
        if(index >= 0){
          arr[index] = {order_dt: arr[index].order_dt, count: arr[index].count += 1}
        } else {
          arr.push({order_dt: x.order_dt, count: 1})
        }
      })
      dispatch({ type: 'GET_GRAPH', payload: arr.reverse() })
    } catch (e) {
      Sentry.captureException(`Error getting agent dashboard orders: ${e}`)
    }
  }
}

export const updateFromDate = (input) => {
  return { type: 'UPDATE_FROM_DATE', payload: input }
}

export const updateToDate = (input) => {
  return { type: 'UPDATE_TO_DATE', payload: input }
}

export const logout = () => {
  return (dispatch) => {
    dispatch({type: 'CLEAR_USER', payload: null})
    dispatch({type: 'CLEAR_OFFER', payload: null})
    dispatch({type: 'CLEAR_OFFERS', payload: null})
    dispatch({type: 'CLEAR_ORDER', payload: null})
    dispatch({type: 'CLEAR_TOKEN', payload: null})
    dispatch({type: 'CLEAR_SHOPPER', payload: null})
    dispatch({type: 'CLEAR_STATUS', payload: null})
    dispatch({type: 'CLEAR_TERMS', payload: null})
    dispatch({type: 'CLEAR_DASHBOARD', payload: null})
    dispatch({type: 'CLEAR_SALES_PERMISSION', payload: null})
    dispatch({type: 'CLEAR_EVENT', payload: null})
    navigate("/")
  }
}

export const clearData = () => {
  return (dispatch) => {
    dispatch({type: 'CLEAR_OFFER', payload: null})
    dispatch({type: 'CLEAR_OFFERS', payload: null})
    dispatch({type: 'CLEAR_ORDER', payload: null})
    dispatch({type: 'CLEAR_SHOPPER', payload: null})
    dispatch({type: 'CLEAR_STATUS', payload: null})
    dispatch({type: 'CLEAR_DASHBOARD', payload: null})
    dispatch({type: 'CLEAR_SALES_PERMISSION', payload: null})
  }
}

export const getLocations = () => {
  return async(dispatch) => {
    try {
      const response = await axios.get(`${process.env.GATSBY_GARCON_API}/offers/locations/sales_locations`)
      dispatch({ type: 'GET_LOCATIONS', payload: response.data })
    } catch (e) {
      Sentry.captureException(`Error getting sales locations: ${e}`)
      dispatch({ type: 'SHOW_ERROR', payload: "Error getting sales locations" })
    }
  }
}

export const updateLocationName = (value) => {
  return { type: 'UPDATE_LOCATION_NAME', payload: value }
}
export const updateLocationCode = (value) => {
  return { type: 'UPDATE_LOCATION_CODE', payload: value }
}
export const updateLocationTime = (value) => {
  return { type: 'UPDATE_LOCATION_TIME', payload: value }
}

export const recordEvent = (shift_event_code) => {
  return async(dispatch, getState) => {
    try {
      const { user, order, event } = getState()
      if(shift_event_code !== event.shift.shift_event_code){
        const params = {
          'shift_event_code': shift_event_code,
          'agent_id': user.agent_id,
          'submitted_by_user_id': user.user_id,
          'sales_location_code': event.location.sales_location_code,
          'latitude': order.latitude,
          'longitude': order.longitude
        }
        const response = await axios.post(`${process.env.GATSBY_GARCON_API}/sales/app/${user.agent_id}/event`, params)
        if(response.data){
          if(shift_event_code === 'CLOCK_OUT'){
            dispatch({ type: 'UPDATE_EVENT', payload: {} })
          } else {
            navigate('/address')
            dispatch({ type: 'UPDATE_EVENT', payload: response.data })
          }
        }
      } else {
        navigate('/address')
      }
    } catch (e) {
      Sentry.captureException(`Error getting sales locations: ${e}`)
      dispatch({ type: 'SHOW_ERROR', payload: `Error with ${shift_event_code} event` })
    }
  }
}