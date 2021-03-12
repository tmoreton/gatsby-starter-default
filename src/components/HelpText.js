import React from "react"

const HelpText = ({ children }) => (
  <p style={{marginTop: -15, marginBottom: 0}}><small className="text-danger">{children}</small></p>
)

export default HelpText
