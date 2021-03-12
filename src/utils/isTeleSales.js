export default (channel_code) => {
  return channel_code === 'IB_SALES' || channel_code === 'INSIDE_SALES' || channel_code === 'OBTM' || channel_code === 'DIGITAL_OPT_IN' || channel_code === 'LOCAL_DEALERS' || channel_code === 'CONCIERGE'
}