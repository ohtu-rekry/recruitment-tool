import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'

import Routes from './components/routes/Routes'
import './assets/styles/app.css'

import reducer from './redux/reducers/reducer'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  combineReducers({ reducer }),
  applyMiddleware(sagaMiddleware)
)

//sagaMiddleware.run(sagas)

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root')
)
