import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'

import Routes from './components/routes/Routes'
import './assets/styles/app.css'

import errorReducer from './redux/reducers/errorReducer'
import reducer from './redux/reducers/reducer'
import rootSaga from './redux/sagas/sagas'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  combineReducers({ reducer, errorReducer }),
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root')
)
