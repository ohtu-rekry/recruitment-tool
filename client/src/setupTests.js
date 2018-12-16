import React from 'react'
import { MemoryRouter }  from 'react-router-dom'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleWare from 'redux-saga'
import { reducers } from './redux/reducers/reducers'
import rootSaga from './redux/sagas/sagas'

configure({ adapter: new Adapter() })

let savedItems = {}

const localStorageMock = {
  setItem: (key, item) => {
    savedItems[key] = item
  },
  getItem: (key) => savedItems[key],
  clear: () => savedItems = {}
}

window.localStorage = localStorageMock

const sagaMiddleware = createSagaMiddleWare()

export const store = createStore(
  combineReducers(reducers),
  applyMiddleware(sagaMiddleware),
)

sagaMiddleware.run(rootSaga)

export const mock = new MockAdapter(axios)

export const getApp = component => (
  <Provider store={store}>
    <MemoryRouter>
      {component}
    </MemoryRouter>
  </Provider>
)

export const setWindowLocation = (location) => {
  Object.defineProperty(window.location, 'href', {
    writable: true,
    value: location
  })
}