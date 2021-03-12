import React from "react"
import PropTypes from "prop-types"

const Table = ({ data }) => (
  <table className="table table-striped">
    <thead>
      <tr>
      {
        data.length > 0 && Object.keys(data[0]).map((key) => {
          return <th key={key} colSpan="1"><small><b>{key.replace(/_+/g, " ").toUpperCase()}</b></small></th>
        })
      }
      </tr>
    </thead>
    <tbody>
      {
        data.map((order, key1) => {
          return (
            <tr key={key1}>
            {
              Object.keys(order).map((item, key2) => {
                return (
                  <td colSpan="1" key={key2}><small>{order[item]}</small></td>
                )
              })
            }
            </tr>
          )
        })
      }
    </tbody>
  </table>
)

export default Table
