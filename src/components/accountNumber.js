import React from 'react'

const AccountNumber = ({order, addAccountNumber, updateConfirmAccountNumber, checkAccountNumber}) => (

  <div className={order.isPartial && 'd-none'}>
    <div className="mb-3">
      <label forhtml="accountNumber">{order.account_num_synonym}</label>
      <input
        name="account_number"
        type={order.is_valid ? 'Password' : 'Text'}
        autocomplete="new-password"
        onChange={e => addAccountNumber(e.target.value)}
        value={order.account_number}
        className={order.is_valid ? "form-control is-valid" : "form-control is-invalid"}
        id="accountNumber"
        placeholder={order.account_validation ? order.account_validation.account_number_example : null}
      />
      <div className="feedback"><small>For most accurate pricing, enter account number</small></div>
    </div>
    { order.account_number &&
      <div>
        <label forhtml="confirmAccountNumber">{"Confirm " + order.account_num_synonym}</label>
        <input
          onChange={e => updateConfirmAccountNumber(e.target.value)}
          value={order.confirm_account_number}
          className={checkAccountNumber ? "form-control is-valid" : "form-control is-invalid"}
          id="confirmAccountNumber"
        />
      </div>
    }
  </div>
)

export default AccountNumber
