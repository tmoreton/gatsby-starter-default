import axios from 'axios'
import Base64 from 'base-64'

export default () => {
  const hash = Base64.encode(`${process.env.GATSBY_GARCON_API_USERNAME}:${process.env.GATSBY_GARCON_API_PASSWORD}`)
  const Basic = 'Basic ' + hash
  return axios.defaults.headers.common['Authorization'] = Basic
}
