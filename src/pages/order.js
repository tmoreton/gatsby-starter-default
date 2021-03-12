import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Confetti from 'react-confetti'
import BeatLoader from "react-spinners/BeatLoader"
import Layout from "../components/layout"
import SocketClient from '../utils/socketService'
import { navigate } from "gatsby"
import { clearData } from '../actions/user'
import {
  saveOrder,
  getShopperOrders,
  clearStatus,
  initializeTpv,
  clearOrderData,
} from '../actions/order'
import { showError } from '../actions/error'
import dino from "../images/dino.gif"
import minus from "../images/minus.svg"
import check from "../images/check.svg"
import cancel from "../images/cancel.svg"
import isEmpty from '../utils/isEmpty'

const Order = () => {
  const dispatch = useDispatch()
  const order = useSelector(state => state.order)
  const shopper = useSelector(state => state.shopper)
  const user = useSelector(state => state.user)
  const salesPermission = useSelector(state => state.salesPermission)
  const data = useSelector(state => state.data)

  const [disabled, setDisabled] = useState(false)
  const [tpvDisabled, setTpvDisabled] = useState(false)
  const [newOrder, setNewOrder] = useState({})
  const [tpvStatus, setTpvStatus] = useState('Pending')

  useEffect(() => {
    if (!shopper) navigate("/address")
    dispatch(getShopperOrders())
    listenForUpdates()
  }, [])

  useEffect(() => {
    checkForExistingOrders()
  }, [shopper])

  useEffect(() => {
    if(data.order_id){
      setNewOrder(data)
    }
  }, [data])

  const validated = () => {
    if(isEmpty(order.tpv_type)) {
      dispatch(showError('Must select TPV Type on Verification screen'))
      return false
    } else if(isEmpty(order.market_code)) {
      dispatch(showError('Must select Market on Address screen'))
      return false
    } else if(isEmpty(order.offer_code)) {
      dispatch(showError('Must select Offer on Offers screen'))
      return false
    }
    return true
  }

  const goHome = () => {
    navigate('/address')
    dispatch(clearData())
    dispatch(clearStatus())
  }

  const placeOrder = () => {
    if (!disabled && validated()) {
      setDisabled(true)
      dispatch(saveOrder())
      dispatch(clearOrderData())
    }
  }

  const clickTpv = () => {
    setTpvDisabled(true)
    dispatch(initializeTpv())
  }

  const checkForExistingOrders = () => {
    if (!shopper || !shopper.orders) return

    const order = shopper.orders[0]

    if (order) {
      setTpvStatus(mapTpvFromOrder(order))
      setNewOrder(order)
    }
  }

  const listenForUpdates = () => {
    if(shopper){
      const channel = SocketClient.subscribe(shopper.shopper_guid);
      channel.bind('order_created', (data) => assignOrderAndTpv(data));
      channel.bind('tpv_success', () => setTpvStatus('Good Sale'));
      channel.bind('tpv_failed', () => setTpvStatus('No Sale'))
    }
  }

  const assignOrderAndTpv = (order) => {
    setNewOrder(order)
    setTpvStatus(mapTpvFromOrder(order))
  }

  const mapTpvFromOrder = (order) => {
    let status = 'Pending'
    if (order.order_status_reason == 'VALIDATED') {
      status = 'Good Sale'
    } else if (['VALIDATION_FAILED', 'TPV_FAILED'].includes(order.order_status_reason)) {
      dispatch(clearData())
      status = 'No Sale'
    }

    return status
  }

  const goBack = () => navigate("/confirm")

  const setOrderIcon = () => {
    let icon
    if (newOrder.order_id) {
      icon = check
    } else {
      icon = minus
    }

    return icon
  }

  const setTpvIcon = () => {
    let icon
    if (tpvStatus.includes('Good')) {
      icon = check
    } else if (tpvStatus.includes('No')) {
      icon = cancel
    } else {
      icon = minus
    }

    return icon
  }

  const orderComplete = data.contactless ? (!!newOrder.order_id && tpvStatus.includes('Good')) : (!!newOrder.order_id && !tpvStatus.includes('No'))
  return (
    <Layout progress='100%'>
      <Confetti
        style={{
           position: 'fixed',
           display: orderComplete ? 'block' : 'none'
        }}
        width={2000}
        height={2000}
        numberOfPieces={100}
        run={orderComplete}
      />

      <div className="col-md-6 mx-auto mt-5">
        <div style={{ textAlign: 'left', position: 'relative' }}>
          <div className='card-header'>{order.first_name} {order.last_name}
            <h3>Order Status
              {orderComplete &&
                <div className='success'><img className="px-2 py-1" style={{ maxWidth: 300 }} src={dino} alt="Party Dino" /></div>
              }
            </h3>
          </div>

          <div className='list-group list-group-flush'>
            <div className='list-group-item'>
              <b style={{ marginRight: 5 }}>Order Created:</b>{newOrder.order_id ? 'Complete' : 'Pending'}
              <img style={{ maxWidth: 30, float: 'right' }} src={setOrderIcon()} />
            </div>
            <div className='list-group-item'>
              <b style={{ marginRight: 5 }}>TPV Status:</b>{tpvStatus}
              <img style={{ maxWidth: 30, float: 'right' }} src={setTpvIcon()} />
            </div>
          </div>
        </div>

        { data.tpv_type === 'Live' && newOrder.order_id &&
          <div className="text-center pt-5">
            <p>Please call the TPV vendor and be ready to provide the following information:</p>
            <p className='m-0'><b>TPV Vendor #:</b> {process.env.DXC_NUMBER}</p>
            <p className='m-0'><b>Agent ID:</b> {user.agent_id}</p>
            <p className='m-0'><b>Sale ID:</b> {newOrder.order_id}</p>
          </div>
        }

        { !data.contactless && !newOrder.order_id &&
          <div>
            <div className="p-4 text-center">
              <BeatLoader
                size={25}
                color={"#e6168b"}
                loading={disabled ? true : false}
              />
            </div>
            <button className="btn btn-primary btn-lg mb-5 btn-block" onClick={() => placeOrder()}>{disabled ? 'Processing Order' : 'Place Order'}</button>
            <button className="btn btn-secondary btn-lg mt-5 mb-5 btn-block" onClick={() => goBack()}>‹ Go Back</button>
          </div>
        }

        { newOrder.order_id && salesPermission.tpv_delay && data.tpv_type !== 'Live' &&
          <button disabled={tpvDisabled} className="btn btn-primary btn-lg btn-block mt-5" onClick={clickTpv}>Initialize TPV</button>
        }

        { newOrder.order_id &&
          <button className="btn btn-primary btn-lg btn-block mt-5" onClick={() => goHome()}>Start New Enrollment</button>
        }

        { data.contactless && !newOrder.order_id &&
          <button className="btn btn-primary btn-lg btn-block mt-5" onClick={() => goHome()}>Start New Enrollment</button>
        }
      </div>
    </Layout>
  )
}

export default Order
