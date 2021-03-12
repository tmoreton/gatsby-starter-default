import React from "react"
import PropTypes from "prop-types"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../node_modules/react-vis/dist/style.css'

const Chart = ({ data }) => (
  <ResponsiveContainer width='100%' aspect={3.0/1.0}>
    <LineChart
      data={data}
      style={{ margin: 'auto', marginLeft: -25 }}
    >
      <CartesianGrid strokeDasharray="5 5" />
      <XAxis dataKey="order_dt" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line name="Orders" type="monotone" dataKey="count" stroke="#4E79A7" activeDot={{ r: 10 }} dot={{ r: 5 }} strokeWidth="4" />
    </LineChart>
  </ResponsiveContainer>
)

export default Chart
