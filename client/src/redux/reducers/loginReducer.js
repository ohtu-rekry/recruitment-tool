import { handleActions } from 'redux-actions'
import * as actions from '../actions/actions'

const initialState = {
  loggedIn: null,
  tokenExpired: false
}

const reducer = handleActions(
  {
    [actions.loginSuccess]: (state, action) => ({
      ...state,
      loggedIn: action.payload
    }),
    [actions.logoutSuccess]: (state, action) => ({
      ...state,
      loggedIn: null,
      tokenExpired: action.payload
    }),
    [actions.emptyTokenExpired]: (state) => ({
      ...state,
      tokenExpired: false
    })
  },
  initialState
)

export default reducer