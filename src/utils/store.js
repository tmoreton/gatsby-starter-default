import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
// import rootReducer from '../reducers/root'
import interceptor from './interceptor'

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig)

interceptor()

export default () => {
  const store = createStore(persistedReducer, applyMiddleware(thunk, logger))
  const persistor = persistStore(store)
  return { store, persistor }
}
