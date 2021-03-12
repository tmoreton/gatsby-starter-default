import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  getOffers,
  addOffer,
  updateOfferCode,
  clearOffers,
} from '../actions/order'
import Layout from "../components/layout"
import { navigate } from "gatsby"
import PlanDetail from "../components/planDetail"
import BeatLoader from "react-spinners/BeatLoader"

class Offers extends Component {
  componentDidMount = () => {
    if(this.props.offers === null || this.props.offers.length <= 0) {
      this.props.getOffers()
    }
  }

  addOffer = (offer) => {
    this.props.updateOfferCode(offer.offer_code)
    this.props.addOffer(offer)
    navigate('/verification')
  }

  goBack = () => {
    this.props.clearOffers()
    navigate('/address')
  }

  render() {
    return (
      <Layout progress='30%'>
        <div className="col-md-6 mx-auto">
          {
            this.props.offers === null ?
              <div className="p-5 text-center">
                <BeatLoader
                  size={25}
                  color={"#e6168b"}
                  loading={true}
                />
                <h3 className="pt-2">{this.props.order.offer_status}</h3>
              </div>
            :
            this.props.offers.length > 0 ? this.props.offers.map(offer => {
              return <PlanDetail offer={offer} addOffer={this.addOffer} />
            }) : null
          }
        </div>
        <button className="col-6 btn btn-block mx-auto btn-outline-dark" onClick={() => this.goBack()}><b>Back</b></button>
      </Layout>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getOffers,
    addOffer,
    updateOfferCode,
    clearOffers,
  }, dispatch)
}

function mapStateToProps(state) {
  return {
    user: state.user,
    offers: state.offers,
    order: state.order
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Offers)
