import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import jwt from 'jsonwebtoken'

import Routes from './components/routes/Routes'
import './assets/styles/app.css'

import { reducers } from './redux/reducers/reducers'
import rootSaga from './redux/sagas/sagas'

const sagaMiddleware = createSagaMiddleware()

const checkTokenExpirationMiddleware = store => next => action => {
  if (action.type !== 'LOGOUT') {

    const user = JSON.parse(window.localStorage.getItem('loggedUser'))
    const token = user && user.token

    if (token && jwt.decode(token).exp < Date.now() / 1000) {
      store.dispatch({
        type: 'LOGOUT',
        payload: true
      })
    }
  }
  next(action)
}

const store = createStore(
  combineReducers(reducers),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(sagaMiddleware, checkTokenExpirationMiddleware)
)

sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root')
)
