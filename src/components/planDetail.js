import React from 'react'

const PlanDetail = ({ offer, addOffer }) => (
  <div key={offer.offer_code}>
    <div className="card mb-3">
      { offer.plan_image_url ? <img className="card-img-top" src={offer.plan_image_url} alt={offer.plan_name}/> : null }
      <div className="card-body">
        <h4 className="card-title"><b>{offer.plan_name}</b></h4>
        <p>{offer.contract_type_code.toUpperCase()} <br/> {offer.duration_friendly}</p>
        <h3 className="pt-2 pb-3"><b>{offer.rate_friendly}</b></h3>
        <p>{offer.plan_description}</p>
        {
          offer.marketing_highlights.map(highlight => {
            return <div className="text-left py-1 px-2"><li>{highlight}</li></div>
          })
        }
        <p className="pt-2">Offer Code: <b>{offer.offer_code}</b></p>
        { addOffer ? <button className="btn btn-primary btn-lg mt-3 btn-block" onClick={() => addOffer(offer)} >Select</button> : null }
      </div>
    </div>
  </div>
)

export default PlanDetail
