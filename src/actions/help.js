import axios from 'axios'
import * as Sentry from '@sentry/browser'

export const getEntry = (entry_id) => {
  return async(dispatch) => {
    try {
      const response = await axios.get(`${process.env.CONTENTFUL_URL}/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries/${entry_id}?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}`)
      dispatch({ type: 'GET_ENTRY', payload: response.data.fields })
    } catch (e) {
      Sentry.captureException(`Sorry, We Couldn't Get Entry`)
        dispatch({ type: 'SHOW_ERROR', payload: "Sorry, We Couldn't Get Entry" })
    }
  }
}

export const getCaseTypes = (case_type_code, category_name) => {
  return async(dispatch) => {
    try {
      const response = await axios.get(`${process.env.GATSBY_GARCON_API}/cases/case_type_categories/SALES_OPS/${case_type_code}`)
      const case_category = response.data.find(case_type => case_type.category_name == category_name)
      dispatch({ type: 'GET_CASE_TYPE', payload: case_category })
    } catch (e) {
      Sentry.captureException(`Error getting case types: ${e}`)
      dispatch({ type: 'SHOW_ERROR', payload: "Error getting case types" })
    }
  }
}

export const createCase = (params, case_type_code) => {
  return async(dispatch) => {
    try {
      const response = await axios.post(`${process.env.GATSBY_GARCON_API}/sales/app/cases/SALES_OPS/${case_type_code}`, params)
      if(response.data.error_message){
        dispatch({ type: 'SHOW_ERROR', payload: response.data.error_message })
      } else {
        return response.data
      }
    } catch(e) {
      Sentry.captureException(`Sorry We Couldn't Submit Case`)
      dispatch({ type: 'SHOW_ERROR', payload: "Sorry, We Couldn't Submit the Case" })
    }
  }
}

export const uploadFile = (data, file) => {
  return (dispatch) => {
    try {
      const params = {
        'file': file,
        'case_guid': data.case_guid,
        'user_id': data.user_id
      }
      axios.post(`${process.env.GATSBY_GARCON_API}/cases/${data.case_guid}/attach`, params)
    } catch(e) {
      Sentry.captureException(`Sorry We Couldn't Upload File`)
      dispatch({ type: 'SHOW_ERROR', payload: "Sorry, We Couldn't Upload the File" })
    }
  }
}

export const getTPVtypes = () => {
  return async(dispatch) => {
    try {
      const response = await axios.get(`${process.env.GATSBY_GARCON_API}/sales/tpv_types`)
      dispatch({ type: 'GET_VENDOR_TPV', payload: response.data })
    } catch (e) {
      Sentry.captureException(`Error getting TPV Types: ${e}`)
      dispatch({ type: 'SHOW_ERROR', payload: 'An error occured getting TPV Types.' })
    }
  }
}
