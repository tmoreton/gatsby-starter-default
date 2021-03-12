import React from "react"
import createStore from './src/utils/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

export default ({ element }) => {
	const { store, persistor } = createStore()
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {element}
      </PersistGate>
    </Provider>
  )
}
