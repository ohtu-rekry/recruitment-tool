import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'

import Routes from './components/routes/Routes'
import './assets/styles/app.css'

import postingReducer from './redux/reducers/postingReducer'
import jobPostingReducer from './redux/reducers/jobPostingReducer'
import rootSaga from './redux/sagas/sagas'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  combineReducers({ postingReducer, jobPostingReducer }),
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root')
)
