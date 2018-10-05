import { handleActions } from 'redux-actions'
import * as actions from '../actions/actions'

const initialState = {
  loggedIn: false,
}

const reducer = handleActions(
  {
    [actions.loginSuccess]: (state, action) => ({
      ...state,
      loggedIn: true
    }),
  },
  initialState
)

export default reducer