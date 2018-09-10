import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'

import App from './components/App'
import reducer from './redux/reducers/reducer'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  combineReducers({ reducer }),
  applyMiddleware(sagaMiddleware)
)

//sagaMiddleware.run(sagas)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
