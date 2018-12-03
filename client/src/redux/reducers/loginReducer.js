import { handleActions } from 'redux-actions'
import * as actions from '../actions/actions'

const initialState = {
  loggedIn: null,
  loginError: null,
  logoutError: null,
  tokenExpired: false
}

const reducer = handleActions(
  {
    [actions.loginSuccess]: (state, action) => ({
      ...state,
      loggedIn: action.payload,
      loginError: null
    }),
    [actions.logoutSuccess]: (state, action) => ({
      ...state,
      loggedIn: null,
      tokenExpired: action.payload
    }),
    [actions.loginFailure]: (state, action) => ({
      ...state,
      loginError: action.payload
    }),
    [actions.logoutFailure]: (state, action) => ({
      ...state,
      logoutError: action.payload
    }),
    [actions.emptyTokenExpired]: (state) => ({
      ...state,
      tokenExpired: false
    })
  },
  initialState
)

export default reducer