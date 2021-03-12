import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { Button } from '@helloinspire/melodic-react'
import { recordEvent, updateLocationTime } from '../actions/user'
import { navigate } from 'gatsby'
import Countdown from 'react-countdown'

const RetailModal = () => {
  const dispatch = useDispatch()
  const event = useSelector(state => state.event)
  const [show, setShow] = useState(false)
  const [onBreak, setBreak] = useState(null)

  useEffect(() => {
    switch(event.shift.shift_event_code) {
      case 'BREAK_START':
        setShow(true)
        setBreak(null)
        setBreak('END_BREAK')
        break
      default:
        setShow(false)
        setBreak(null)
        break
    }
  }, [])

  const startBreak = (time) => {
    if(time) {
      dispatch(recordEvent('BREAK_START'))
      setBreak('END_BREAK')
      dispatch(updateLocationTime(Date.now() + time))
    }
  }

  const clockOut = () => {
    dispatch(recordEvent('CLOCK_OUT'))
    setShow(false)
    setBreak(null)
    dispatch(updateLocationTime(null))
    navigate('/clock-in')
  }

  const endBreak = () => {
    dispatch(recordEvent('BREAK_END'))
    setShow(false)
    setBreak(null)
    dispatch(updateLocationTime(null))
  }

  const onHide = () => {
    if(event.shift.shift_event_code !== 'BREAK_START'){
      setShow(false)
      setBreak(null)
    }
  }

  const ShowBreak = () => {
    switch(onBreak) {
      case 'TAKE_BREAK':
        return (
          <Modal.Footer className="justify-content-center">
            <Button variant="outline-primary" onClick={() => startBreak(60000*15)}>
              15 Minutes
            </Button>
            <Button variant="outline-primary" onClick={() => startBreak(60000*30)}>
              30 Minutes
            </Button>
            <Button variant="outline-primary" onClick={() => startBreak(60000*60)}>
              60 Minutes
            </Button>
          </Modal.Footer>
        )
      case 'END_BREAK':
        return (
          <Modal.Footer className="justify-content-center">
            <Button variant="outline-primary" onClick={endBreak}>
              End Break
            </Button>
            <Button variant="outline-primary" onClick={clockOut}>
              Clock Out
            </Button>
          </Modal.Footer>
        )
      default:
        return (
          <Modal.Footer className="justify-content-center">
            <Button variant="outline-primary" onClick={() => setBreak('TAKE_BREAK')}>
              Take a Break
            </Button>
            <Button variant="outline-primary" onClick={clockOut}>
              Clock Out
            </Button>
          </Modal.Footer>
        )
    }
  }

  return (
    <>
      {
        event.location.location_name &&
        <Button variant="link text-white font-weight-bold" onClick={() => setShow(true)}>
          {event.location.location_name}
        </Button>
      }
      <Modal centered show={show} onHide={onHide}>
        <Modal.Header>
          <Modal.Title className="h6">Manage Shift - {event.location.location_name} - {event.location.time && <Countdown date={event.location.time} />}</Modal.Title>
        </Modal.Header>
        <ShowBreak/>
      </Modal>
    </>
  );
}

export default RetailModal
